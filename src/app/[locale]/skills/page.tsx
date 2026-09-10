import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { getPublishedSkills } from "@/lib/content";
import { buildPageMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/config";
import { Reveal } from "@/components/public/Reveal";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    path: `/${locale}/skills`,
    title:
      locale === "ar"
        ? "المهارات والتقنيات | Dev Nour"
        : "Skills & Stack | Dev Nour",
    description:
      locale === "ar"
        ? "مهارات نور محمد: Laravel، Flutter، Next.js، SEO/GEO/AEO، وتحليلات."
        : "Skills of Nour Mohamed: Laravel, Flutter, Next.js, SEO/GEO/AEO, and analytics.",
    keywords:
      locale === "ar"
        ? ["مهارات", "Laravel", "Flutter", "Next.js", "SEO"]
        : ["skills", "Laravel", "Flutter", "Next.js", "SEO"],
  });
}

export default async function SkillsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;
  const t = await getTranslations("nav");
  const s = await getTranslations("sections");
  const skills = await getPublishedSkills();

  const groups = skills.reduce<Record<string, typeof skills>>((acc, skill) => {
    const key = loc === "ar" ? skill.categoryAr : skill.categoryEn;
    acc[key] = acc[key] || [];
    acc[key].push(skill);
    return acc;
  }, {});

  const orderHint = ["لغات", "Language", "أطر", "Framework", "منص", "Platform", "إعلان", "Ads", "Growth"];

  const ordered = Object.entries(groups).sort(([a], [b]) => {
    const ai = orderHint.findIndex((h) => a.includes(h));
    const bi = orderHint.findIndex((h) => b.includes(h));
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

  return (
    <div className="container-page py-20">
      <Reveal>
        <p className="eyebrow">{s("skills")}</p>
        <h1 className="display mt-4 text-5xl font-bold sm:text-7xl">{t("skills")}</h1>
        <p className="mt-5 max-w-2xl text-fg-muted">
          {loc === "ar"
            ? "لغات البرمجة، أطر العمل، ومستوى الإعلانات والنمو — من التنفيذ التقني إلى الإطلاق والتحويل."
            : "Programming languages, frameworks, and ads/growth proficiency — from engineering to launch and conversion."}
        </p>
      </Reveal>

      <div className="mt-16 space-y-16">
        {ordered.map(([category, list], gi) => (
          <Reveal key={category} delay={gi * 0.04}>
            <h2 className="display text-2xl font-bold text-accent sm:text-3xl">{category}</h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {list.map((skill) => (
                <div key={skill.id} className="border-b border-border pb-4">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <p className="font-medium">
                      {loc === "ar" ? skill.nameAr : skill.nameEn}
                    </p>
                    <span className="metric text-sm text-fg-muted">
                      {s("level")} {skill.level}%
                    </span>
                  </div>
                  <div className="h-[3px] overflow-hidden bg-bg-soft">
                    <div
                      className="h-full bg-accent"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
