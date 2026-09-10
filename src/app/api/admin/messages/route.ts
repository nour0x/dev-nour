import { jsonError, jsonOk, requireAdminApi } from "@/lib/api";
import { prisma } from "@/lib/db";

export async function GET() {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;
  return jsonOk(
    await prisma.contactMessage.findMany({
      orderBy: [{ createdAt: "desc" }],
    })
  );
}

export async function POST(request: Request) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;
  const body = await request.json().catch(() => null);
  if (!body?.id) return jsonError("Missing id", 400);
  const item = await prisma.contactMessage.update({
    where: { id: body.id },
    data: { read: Boolean(body.read ?? true) },
  });
  return jsonOk(item);
}

export async function DELETE(request: Request) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return jsonError("Missing id", 400);
  await prisma.contactMessage.delete({ where: { id } });
  return jsonOk({ ok: true });
}
