import { jsonOk, requireAdminApi } from "@/lib/api";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  const { searchParams } = new URL(request.url);
  const range = searchParams.get("range") || "7d";
  const days = range === "1d" ? 1 : range === "30d" ? 30 : 7;
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const [
    visitors,
    sessions,
    pageViews,
    clicks,
    topPages,
    topClicks,
    recentSessions,
    journeys,
  ] = await Promise.all([
    prisma.analyticsVisitor.count({ where: { lastSeen: { gte: since } } }),
    prisma.analyticsSession.count({ where: { startedAt: { gte: since } } }),
    prisma.analyticsPageView.count({ where: { enteredAt: { gte: since } } }),
    prisma.analyticsEvent.count({
      where: { createdAt: { gte: since }, type: "click" },
    }),
    prisma.analyticsPageView.groupBy({
      by: ["path"],
      where: { enteredAt: { gte: since } },
      _count: { path: true },
      _avg: { durationMs: true, activeMs: true, scrollMax: true },
      orderBy: { _count: { path: "desc" } },
      take: 12,
    }),
    prisma.analyticsEvent.groupBy({
      by: ["label", "target"],
      where: { createdAt: { gte: since }, type: "click" },
      _count: { _all: true },
      orderBy: { _count: { _all: "desc" } },
      take: 15,
    }),
    prisma.analyticsSession.findMany({
      where: { startedAt: { gte: since } },
      orderBy: { lastActiveAt: "desc" },
      take: 20,
      include: {
        visitor: { select: { visitorKey: true, device: true, language: true } },
        pageViews: {
          orderBy: { enteredAt: "asc" },
          select: {
            path: true,
            durationMs: true,
            activeMs: true,
            scrollMax: true,
            fromPath: true,
          },
        },
        events: {
          where: { type: { in: ["click", "navigate"] } },
          orderBy: { createdAt: "asc" },
          take: 40,
          select: {
            type: true,
            label: true,
            target: true,
            fromPath: true,
            toPath: true,
            path: true,
            createdAt: true,
          },
        },
      },
    }),
    prisma.analyticsEvent.findMany({
      where: { createdAt: { gte: since }, type: "navigate" },
      orderBy: { createdAt: "desc" },
      take: 40,
      select: { fromPath: true, toPath: true, createdAt: true },
    }),
  ]);

  const avgDuration = await prisma.analyticsSession.aggregate({
    where: { startedAt: { gte: since } },
    _avg: { durationMs: true, pageCount: true },
  });

  return jsonOk({
    range: days,
    kpis: {
      visitors,
      sessions,
      pageViews,
      clicks,
      avgSessionMs: Math.round(avgDuration._avg.durationMs || 0),
      avgPages: Number((avgDuration._avg.pageCount || 0).toFixed(2)),
    },
    topPages: topPages.map((p) => ({
      path: p.path,
      views: p._count.path,
      avgDurationMs: Math.round(p._avg.durationMs || 0),
      avgActiveMs: Math.round(p._avg.activeMs || 0),
      avgScroll: Math.round(p._avg.scrollMax || 0),
    })),
    topClicks: topClicks.map((c) => ({
      label: c.label || "(no label)",
      target: c.target || "",
      count: c._count._all,
    })),
    journeys: journeys.map((j) => ({
      from: j.fromPath,
      to: j.toPath,
      at: j.createdAt,
    })),
    sessions: recentSessions.map((s) => ({
      id: s.id,
      sessionKey: s.sessionKey,
      visitorKey: s.visitor.visitorKey,
      device: s.visitor.device,
      language: s.visitor.language,
      startedAt: s.startedAt,
      lastActiveAt: s.lastActiveAt,
      durationMs: s.durationMs,
      pageCount: s.pageCount,
      eventCount: s.eventCount,
      landingPath: s.landingPath,
      exitPath: s.exitPath,
      referrer: s.referrer,
      path: s.pageViews.map((pv) => ({
        path: pv.path,
        from: pv.fromPath,
        durationMs: pv.durationMs,
        activeMs: pv.activeMs,
        scrollMax: pv.scrollMax,
      })),
      actions: s.events,
    })),
  });
}
