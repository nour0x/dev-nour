import { prisma } from "@/lib/db";

const defaultSettings = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://dev.mudiridigi.com",
  defaultMetaTitleAr: "Dev Nour — نور محمد",
  defaultMetaTitleEn: "Dev Nour — Nour Mohamed",
  defaultMetaDescAr:
    "بورتفوليو نور محمد — تطوير ويب، واجهات حديثة، ومنتجات رقمية.",
  defaultMetaDescEn:
    "Portfolio of Nour Mohamed — web development, modern interfaces, and digital products.",
  ogImageUrl: null as string | null,
  accentColor: "#ff2d55",
  googleVerificationMeta: null as string | null,
  googleVerificationFile: null as string | null,
  googleVerificationHtml: null as string | null,
};

async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

export async function getProfile() {
  const profile = await safe(() => prisma.profile.findFirst(), null);
  if (!profile) return null;
  return {
    ...profile,
    yearsExperience: profile.yearsExperience ?? 5,
  };
}

export async function getSettings() {
  return safe(
    async () => (await prisma.siteSetting.findFirst()) || defaultSettings,
    defaultSettings
  );
}

export async function getPublishedProjects(limit?: number) {
  return safe(
    () =>
      prisma.project.findMany({
        where: { published: true },
        orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
        take: limit,
      }),
    []
  );
}

export async function getPublishedServices(limit?: number) {
  return safe(
    () =>
      prisma.service.findMany({
        where: { published: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        take: limit,
      }),
    []
  );
}

export async function getPublishedExperience() {
  return safe(
    () =>
      prisma.experience.findMany({
        where: { published: true },
        orderBy: [{ sortOrder: "asc" }],
      }),
    []
  );
}

export async function getPublishedSkills() {
  return safe(
    () =>
      prisma.skill.findMany({
        where: { published: true },
        orderBy: [{ sortOrder: "asc" }],
      }),
    []
  );
}

export async function getSocialLinks() {
  return safe(
    () =>
      prisma.socialLink.findMany({
        where: { published: true },
        orderBy: [{ sortOrder: "asc" }],
      }),
    []
  );
}

export async function getSiteLinks() {
  return safe(
    () =>
      prisma.siteLink.findMany({
        where: { published: true },
        orderBy: [{ sortOrder: "asc" }],
      }),
    []
  );
}
