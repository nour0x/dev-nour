import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { MUDIRI, siteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, services] = await Promise.all([
    prisma.project.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    }),
    prisma.service.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    }),
  ]);

  const staticPaths = [
    "",
    "/projects",
    "/services",
    "/experience",
    "/skills",
    "/about",
    "/contact",
    "/links",
  ];

  const locales = ["ar", "en"] as const;
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const path of staticPaths) {
      entries.push({
        url: siteUrl(`/${locale}${path}`),
        lastModified: new Date(),
        changeFrequency: path === "" ? "weekly" : "monthly",
        priority: path === "" ? 1 : 0.8,
      });
    }

    for (const project of projects) {
      entries.push({
        url: siteUrl(`/${locale}/projects/${project.slug}`),
        lastModified: project.updatedAt,
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }

    for (const service of services) {
      entries.push({
        url: siteUrl(`/${locale}/services/${service.slug}`),
        lastModified: service.updatedAt,
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }

  entries.push(
    {
      url: MUDIRI.site,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: MUDIRI.shop,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    }
  );

  return entries;
}
