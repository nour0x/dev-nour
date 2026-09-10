import { z } from "zod";
import { prisma } from "@/lib/db";
import { rateLimit } from "@/lib/security";
import { jsonError, jsonOk } from "@/lib/api";

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  subject: z.string().trim().max(200).optional().nullable(),
  message: z.string().trim().min(10).max(5000),
});

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "local";
  const limited = rateLimit(`contact:${ip}`, 5, 60_000);
  if (!limited.ok) {
    return jsonError(`Too many requests. Retry in ${limited.retryAfter}s`, 429);
  }

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return jsonError("Invalid input", 400);

  await prisma.contactMessage.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      subject: parsed.data.subject || null,
      message: parsed.data.message,
    },
  });

  return jsonOk({ ok: true });
}
