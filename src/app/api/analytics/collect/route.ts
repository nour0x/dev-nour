import { z } from "zod";
import { prisma } from "@/lib/db";
import { jsonError, jsonOk } from "@/lib/api";
import { rateLimit } from "@/lib/security";

const batchSchema = z.object({
  visitorKey: z.string().min(8).max(120),
  sessionKey: z.string().min(8).max(120),
  userAgent: z.string().max(500).optional(),
  language: z.string().max(32).optional(),
  device: z.string().max(32).optional(),
  referrer: z.string().max(500).optional().nullable(),
  utmSource: z.string().max(120).optional().nullable(),
  utmMedium: z.string().max(120).optional().nullable(),
  utmCampaign: z.string().max(120).optional().nullable(),
  events: z
    .array(
      z.object({
        clientEventId: z.string().min(8).max(80),
        type: z.enum([
          "page_enter",
          "page_leave",
          "heartbeat",
          "click",
          "navigate",
          "engage",
        ]),
        path: z.string().max(500).optional(),
        title: z.string().max(300).optional(),
        fromPath: z.string().max(500).optional().nullable(),
        toPath: z.string().max(500).optional().nullable(),
        label: z.string().max(300).optional().nullable(),
        target: z.string().max(500).optional().nullable(),
        durationMs: z.number().int().min(0).max(86_400_000).optional(),
        activeMs: z.number().int().min(0).max(86_400_000).optional(),
        scrollMax: z.number().int().min(0).max(100).optional(),
        meta: z.record(z.string(), z.unknown()).optional(),
        viewKey: z.string().max(120).optional(),
        ts: z.number().optional(),
      })
    )
    .min(1)
    .max(40),
});

function deviceFromUa(ua?: string) {
  if (!ua) return "unknown";
  if (/mobile|android|iphone|ipad/i.test(ua)) return "mobile";
  if (/tablet/i.test(ua)) return "tablet";
  return "desktop";
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "local";
  const limited = rateLimit(`analytics:${ip}`, 120, 60_000);
  if (!limited.ok) return jsonError("Too many analytics events", 429);

  const body = await request.json().catch(() => null);
  const parsed = batchSchema.safeParse(body);
  if (!parsed.success) return jsonError("Invalid analytics payload", 400);

  const data = parsed.data;
  const now = new Date();

  const visitor = await prisma.analyticsVisitor.upsert({
    where: { visitorKey: data.visitorKey },
    create: {
      visitorKey: data.visitorKey,
      userAgent: data.userAgent || null,
      language: data.language || null,
      device: data.device || deviceFromUa(data.userAgent),
      firstSeen: now,
      lastSeen: now,
    },
    update: {
      lastSeen: now,
      userAgent: data.userAgent || undefined,
      language: data.language || undefined,
      device: data.device || deviceFromUa(data.userAgent),
    },
  });

  let session = await prisma.analyticsSession.findUnique({
    where: { sessionKey: data.sessionKey },
  });

  if (!session) {
    session = await prisma.analyticsSession.create({
      data: {
        sessionKey: data.sessionKey,
        visitorId: visitor.id,
        startedAt: now,
        lastActiveAt: now,
        landingPath: data.events.find((e) => e.path)?.path || null,
        referrer: data.referrer || null,
        utmSource: data.utmSource || null,
        utmMedium: data.utmMedium || null,
        utmCampaign: data.utmCampaign || null,
      },
    });
  } else {
    session = await prisma.analyticsSession.update({
      where: { id: session.id },
      data: { lastActiveAt: now },
    });
  }

  let accepted = 0;
  let duplicates = 0;

  for (const event of data.events) {
    if (event.type === "page_enter" && event.viewKey && event.path) {
      try {
        await prisma.analyticsPageView.create({
          data: {
            viewKey: event.viewKey,
            sessionId: session.id,
            visitorId: visitor.id,
            path: event.path,
            title: event.title || null,
            fromPath: event.fromPath || null,
            enteredAt: now,
          },
        });
        await prisma.analyticsSession.update({
          where: { id: session.id },
          data: {
            pageCount: { increment: 1 },
            exitPath: event.path,
            lastActiveAt: now,
          },
        });
        accepted += 1;
      } catch {
        duplicates += 1;
      }
      continue;
    }

    if (event.type === "heartbeat" && event.viewKey) {
      const view = await prisma.analyticsPageView.findUnique({
        where: { viewKey: event.viewKey },
      });
      if (view) {
        await prisma.analyticsPageView.update({
          where: { id: view.id },
          data: {
            durationMs: Math.max(view.durationMs, event.durationMs || 0),
            activeMs: Math.max(view.activeMs, event.activeMs || 0),
            scrollMax: Math.max(view.scrollMax, event.scrollMax || 0),
          },
        });
        const total = await prisma.analyticsPageView.aggregate({
          where: { sessionId: session.id },
          _sum: { durationMs: true },
        });
        await prisma.analyticsSession.update({
          where: { id: session.id },
          data: {
            durationMs: total._sum.durationMs || 0,
            lastActiveAt: now,
          },
        });
        accepted += 1;
      }
      continue;
    }

    if (event.type === "page_leave" && event.viewKey) {
      const view = await prisma.analyticsPageView.findUnique({
        where: { viewKey: event.viewKey },
      });
      if (view) {
        await prisma.analyticsPageView.update({
          where: { id: view.id },
          data: {
            leftAt: now,
            durationMs: Math.max(view.durationMs, event.durationMs || 0),
            activeMs: Math.max(view.activeMs, event.activeMs || 0),
            scrollMax: Math.max(view.scrollMax, event.scrollMax || 0),
          },
        });
        accepted += 1;
      }
      continue;
    }

    try {
      await prisma.analyticsEvent.create({
        data: {
          clientEventId: event.clientEventId,
          sessionId: session.id,
          visitorId: visitor.id,
          type: event.type,
          path: event.path || null,
          fromPath: event.fromPath || null,
          toPath: event.toPath || null,
          label: event.label || null,
          target: event.target || null,
          meta: JSON.stringify(event.meta || {}),
        },
      });
      await prisma.analyticsSession.update({
        where: { id: session.id },
        data: {
          eventCount: { increment: 1 },
          lastActiveAt: now,
          exitPath: event.toPath || event.path || undefined,
        },
      });
      accepted += 1;
    } catch {
      duplicates += 1;
    }
  }

  return jsonOk({ accepted, duplicates });
}
