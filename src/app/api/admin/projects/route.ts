import { z } from "zod";
import { revalidatePath } from "next/cache";
import { jsonError, jsonOk, requireAdminApi } from "@/lib/api";
import { prisma } from "@/lib/db";
import { autoSeo } from "@/lib/seo";
import { serializeTags } from "@/lib/utils";

const schema = z.object({
  id: z.string().optional(),
  titleAr: z.string().min(1),
  titleEn: z.string().min(1),
  summaryAr: z.string().optional().default(""),
  summaryEn: z.string().optional().default(""),
  bodyAr: z.string().optional().default(""),
  bodyEn: z.string().optional().default(""),
  coverUrl: z.string().optional().nullable(),
  tags: z.array(z.string()).optional().default([]),
  githubUrl: z.string().optional().nullable(),
  demoUrl: z.string().optional().nullable(),
  featured: z.boolean().optional().default(false),
  published: z.boolean().optional().default(true),
  sortOrder: z.number().optional().default(0),
  slug: z.string().optional(),
  metaTitleAr: z.string().optional().nullable(),
  metaTitleEn: z.string().optional().nullable(),
  metaDescriptionAr: z.string().optional().nullable(),
  metaDescriptionEn: z.string().optional().nullable(),
  ogTitleAr: z.string().optional().nullable(),
  ogTitleEn: z.string().optional().nullable(),
  keywordsAr: z.string().optional().nullable(),
  keywordsEn: z.string().optional().nullable(),
});

function revalidate() {
  revalidatePath("/", "layout");
}

export async function GET() {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;
  const items = await prisma.project.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  return jsonOk(items);
}

export async function POST(request: Request) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return jsonError("Invalid project data", 400);

  const seo = autoSeo({
    kind: "project",
    titleAr: parsed.data.titleAr,
    titleEn: parsed.data.titleEn,
    summaryAr: parsed.data.summaryAr,
    summaryEn: parsed.data.summaryEn,
    slug: parsed.data.slug,
    metaTitleAr: parsed.data.metaTitleAr,
    metaTitleEn: parsed.data.metaTitleEn,
    metaDescriptionAr: parsed.data.metaDescriptionAr,
    metaDescriptionEn: parsed.data.metaDescriptionEn,
    ogTitleAr: parsed.data.ogTitleAr,
    ogTitleEn: parsed.data.ogTitleEn,
    keywordsAr: parsed.data.keywordsAr,
    keywordsEn: parsed.data.keywordsEn,
  });

  const data = {
    ...seo,
    titleAr: parsed.data.titleAr,
    titleEn: parsed.data.titleEn,
    summaryAr: parsed.data.summaryAr,
    summaryEn: parsed.data.summaryEn,
    bodyAr: parsed.data.bodyAr,
    bodyEn: parsed.data.bodyEn,
    coverUrl: parsed.data.coverUrl || null,
    tags: serializeTags(parsed.data.tags),
    githubUrl: parsed.data.githubUrl || null,
    demoUrl: parsed.data.demoUrl || null,
    featured: parsed.data.featured,
    published: parsed.data.published,
    sortOrder: parsed.data.sortOrder,
  };

  const item = parsed.data.id
    ? await prisma.project.update({ where: { id: parsed.data.id }, data })
    : await prisma.project.create({ data });

  revalidate();
  return jsonOk(item);
}

export async function DELETE(request: Request) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return jsonError("Missing id", 400);
  await prisma.project.delete({ where: { id } });
  revalidate();
  return jsonOk({ ok: true });
}
