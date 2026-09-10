import { z } from "zod";
import { revalidatePath } from "next/cache";
import { jsonError, jsonOk, requireAdminApi } from "@/lib/api";
import { prisma } from "@/lib/db";

const schema = z.object({
  id: z.string().optional(),
  platform: z.string().min(1),
  labelAr: z.string().min(1),
  labelEn: z.string().min(1),
  url: z.string().url(),
  icon: z.string().optional().nullable(),
  sortOrder: z.number().optional().default(0),
  published: z.boolean().optional().default(true),
});

export async function GET() {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;
  return jsonOk(
    await prisma.socialLink.findMany({ orderBy: [{ sortOrder: "asc" }] })
  );
}

export async function POST(request: Request) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return jsonError("Invalid social link", 400);
  const { id, ...rest } = { ...parsed.data, icon: parsed.data.icon || null };
  const item = id
    ? await prisma.socialLink.update({ where: { id }, data: rest })
    : await prisma.socialLink.create({ data: rest });
  revalidatePath("/", "layout");
  return jsonOk(item);
}

export async function DELETE(request: Request) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return jsonError("Missing id", 400);
  await prisma.socialLink.delete({ where: { id } });
  revalidatePath("/", "layout");
  return jsonOk({ ok: true });
}
