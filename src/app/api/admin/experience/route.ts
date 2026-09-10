import { z } from "zod";
import { revalidatePath } from "next/cache";
import { jsonError, jsonOk, requireAdminApi } from "@/lib/api";
import { prisma } from "@/lib/db";

const schema = z.object({
  id: z.string().optional(),
  companyAr: z.string().min(1),
  companyEn: z.string().min(1),
  roleAr: z.string().min(1),
  roleEn: z.string().min(1),
  descriptionAr: z.string().optional().default(""),
  descriptionEn: z.string().optional().default(""),
  locationAr: z.string().optional().nullable(),
  locationEn: z.string().optional().nullable(),
  startDate: z.string().min(1),
  endDate: z.string().optional().nullable(),
  current: z.boolean().optional().default(false),
  sortOrder: z.number().optional().default(0),
  published: z.boolean().optional().default(true),
});

export async function GET() {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;
  return jsonOk(
    await prisma.experience.findMany({ orderBy: [{ sortOrder: "asc" }] })
  );
}

export async function POST(request: Request) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return jsonError("Invalid experience data", 400);
  const data = {
    ...parsed.data,
    locationAr: parsed.data.locationAr || null,
    locationEn: parsed.data.locationEn || null,
    endDate: parsed.data.endDate || null,
  };
  const { id, ...rest } = data;
  const item = id
    ? await prisma.experience.update({ where: { id }, data: rest })
    : await prisma.experience.create({ data: rest });
  revalidatePath("/", "layout");
  return jsonOk(item);
}

export async function DELETE(request: Request) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return jsonError("Missing id", 400);
  await prisma.experience.delete({ where: { id } });
  revalidatePath("/", "layout");
  return jsonOk({ ok: true });
}
