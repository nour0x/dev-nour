import { prisma } from "@/lib/db";

export async function getProfile() {
  return prisma.profile.findFirst();
}

export async function getSettings() {
  return (
    (await prisma.siteSetting.findFirst()) || {
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
      defaultMetaTitleAr: "Dev Nour — نور محمد",
      defaultMetaTitleEn: "Dev Nour — Nour Mohamed",
      defaultMetaDescAr:
        "بورتفوليو نور محمد — تطوير ويب، واجهات حديثة، ومنتجات رقمية.",
      defaultMetaDescEn:
        "Portfolio of Nour Mohamed — web development, modern interfaces, and digital products.",
      ogImageUrl: null as string | null,
      accentColor: "#c8925a",
      googleVerificationMeta: null as string | null,
      googleVerificationFile: null as string | null,
      googleVerificationHtml: null as string | null,
    }
  );
}

export async function getPublishedProjects(limit?: number) {
  return prisma.project.findMany({
    where: { published: true },
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
    take: limit,
  });
}

export async function getPublishedServices(limit?: number) {
  return prisma.service.findMany({
    where: { published: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    take: limit,
  });
}

export async function getPublishedExperience() {
  return prisma.experience.findMany({
    where: { published: true },
    orderBy: [{ sortOrder: "asc" }],
  });
}

export async function getPublishedSkills() {
  return prisma.skill.findMany({
    where: { published: true },
    orderBy: [{ sortOrder: "asc" }],
  });
}

export async function getSocialLinks() {
  return prisma.socialLink.findMany({
    where: { published: true },
    orderBy: [{ sortOrder: "asc" }],
  });
}

export async function getSiteLinks() {
  return prisma.siteLink.findMany({
    where: { published: true },
    orderBy: [{ sortOrder: "asc" }],
  });
}
