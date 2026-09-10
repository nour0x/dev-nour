/**
 * Non-destructive upsert of Indexing / AI / stack skills.
 * Safe on production — never deletes.
 * Run: npx tsx prisma/seed-skills.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SKILLS = [
  ["Agentic SEO (AEO)", "Agentic SEO (AEO)", "فهرسة وذكاء", "Indexing & AI", 92, 200],
  ["llms.txt · AI crawlers", "llms.txt · AI crawlers", "فهرسة وذكاء", "Indexing & AI", 90, 201],
  ["JSON-LD / Schema.org", "JSON-LD / Schema.org", "فهرسة وذكاء", "Indexing & AI", 93, 202],
  ["Core Web Vitals", "Core Web Vitals", "فهرسة وذكاء", "Indexing & AI", 88, 203],
  ["next-intl i18n", "next-intl i18n", "فهرسة وذكاء", "Indexing & AI", 90, 204],
  ["Prisma + SQLite", "Prisma + SQLite", "فهرسة وذكاء", "Indexing & AI", 88, 205],
  ["First-party analytics", "First-party analytics", "فهرسة وذكاء", "Indexing & AI", 86, 206],
  ["Lighthouse / CWV tuning", "Lighthouse / CWV tuning", "فهرسة وذكاء", "Indexing & AI", 85, 207],
  ["SEO / GEO / AEO", "SEO / GEO / AEO", "إعلانات ونمو", "Ads & Growth", 94, 160],
  ["Pixels · GA4 · GTM", "Pixels · GA4 · GTM", "إعلانات ونمو", "Ads & Growth", 90, 161],
] as const;

async function main() {
  for (const [nameAr, nameEn, categoryAr, categoryEn, level, sortOrder] of SKILLS) {
    const existing = await prisma.skill.findFirst({ where: { nameEn } });
    if (existing) {
      await prisma.skill.update({
        where: { id: existing.id },
        data: { nameAr, categoryAr, categoryEn, level, sortOrder, published: true },
      });
      console.log("updated:", nameEn);
    } else {
      await prisma.skill.create({
        data: { nameAr, nameEn, categoryAr, categoryEn, level, sortOrder, published: true },
      });
      console.log("created:", nameEn);
    }
  }

  const profile = await prisma.profile.findFirst();
  if (profile) {
    await prisma.profile.update({
      where: { id: profile.id },
      data: {
        yearsExperience: profile.yearsExperience || 5,
      },
    });
  }

  const settings = await prisma.siteSetting.findFirst();
  if (settings) {
    const patch: { accentColor?: string; siteUrl?: string } = {};
    if (!settings.accentColor || settings.accentColor === "#14b8a6" || settings.accentColor === "#c8925a") {
      patch.accentColor = "#ff2d55";
    }
    const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
    if (
      envUrl &&
      !envUrl.includes("localhost") &&
      (!settings.siteUrl || settings.siteUrl.includes("localhost"))
    ) {
      patch.siteUrl = envUrl;
    }
    if (Object.keys(patch).length) {
      await prisma.siteSetting.update({ where: { id: settings.id }, data: patch });
      console.log("settings patched:", patch);
    }
  }

  console.log("Non-destructive skills seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
