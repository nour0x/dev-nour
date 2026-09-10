import { z } from "zod";
import {
  createSessionToken,
  setAuthCookie,
  verifyPassword,
} from "@/lib/auth";
import { prisma } from "@/lib/db";
import { rateLimit } from "@/lib/security";
import { jsonError, jsonOk } from "@/lib/api";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "local";
  const limited = rateLimit(`login:${ip}`, 8, 60_000);
  if (!limited.ok) {
    return jsonError(`Too many attempts. Retry in ${limited.retryAfter}s`, 429);
  }

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return jsonError("Invalid credentials", 400);

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email.trim().toLowerCase() },
  });
  if (!user) return jsonError("Invalid credentials", 401);

  const valid = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!valid) return jsonError("Invalid credentials", 401);

  const token = await createSessionToken(user.id, user.email);
  await setAuthCookie(token);
  return jsonOk({ ok: true, user: { id: user.id, email: user.email, name: user.name } });
}
