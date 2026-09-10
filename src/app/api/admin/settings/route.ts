import { z } from "zod";
import { revalidatePath } from "next/cache";
import { jsonError, jsonOk, requireAdminApi } from "@/lib/api";
import { prisma } from "@/lib/db";

const profileSchema = z.object({
  brandName: z.string().min(1),
  nameAr: z.string().min(1),
  nameEn: z.string().min(1),
  titleAr: z.string().min(1),
  titleEn: z.string().min(1),
  bioAr: z.string().optional().default(""),
  bioEn: z.string().optional().default(""),
  avatarUrl: z.string().optional().nullable(),
  locationAr: z.string().optional().nullable(),
  locationEn: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  githubUrl: z.string().optional().nullable(),
  resumeUrl: z.string().optional().nullable(),
  age: z.coerce.number().int().min(16).max(80).optional().nullable(),
  yearsExperience: z.coerce.number().int().min(0).max(40).optional().default(5),
});

const settingsSchema = z.object({
  siteUrl: z.string().url(),
  defaultMetaTitleAr: z.string().min(1),
  defaultMetaTitleEn: z.string().min(1),
  defaultMetaDescAr: z.string().min(1),
  defaultMetaDescEn: z.string().min(1),
  ogImageUrl: z.string().optional().nullable(),
    accentColor: z.string().optional().default("#ff2d55"),
  googleVerificationMeta: z.string().optional().nullable(),
  googleVerificationFile: z.string().optional().nullable(),
  googleVerificationHtml: z.string().optional().nullable(),
});

export async function GET() {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;
  const [profile, settings] = await Promise.all([
    prisma.profile.findFirst(),
    prisma.siteSetting.findFirst(),
  ]);
  return jsonOk({ profile, settings });
}

export async function POST(request: Request) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;
  const body = await request.json().catch(() => null);
  if (!body?.type) return jsonError("Missing type", 400);

  if (body.type === "profile") {
    const parsed = profileSchema.safeParse(body.data);
    if (!parsed.success) return jsonError("Invalid profile", 400);
    const existing = await prisma.profile.findFirst();
    const profile = existing
      ? await prisma.profile.update({ where: { id: existing.id }, data: parsed.data })
      : await prisma.profile.create({ data: parsed.data });
    revalidatePath("/", "layout");
    return jsonOk(profile);
  }

  if (body.type === "settings") {
    const parsed = settingsSchema.safeParse(body.data);
    if (!parsed.success) return jsonError("Invalid settings", 400);
    const existing = await prisma.siteSetting.findFirst();
    const settings = existing
      ? await prisma.siteSetting.update({
          where: { id: existing.id },
          data: parsed.data,
        })
      : await prisma.siteSetting.create({ data: parsed.data });
    revalidatePath("/", "layout");
    return jsonOk(settings);
  }

  return jsonError("Unknown type", 400);
}
