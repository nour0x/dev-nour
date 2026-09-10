import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { getPublishedExperience } from "@/lib/content";
import { buildPageMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/config";
import { Reveal } from "@/components/public/Reveal";
import { ConsultCTA } from "@/components/public/ConsultCTA";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    path: `/${locale}/experience`,
    title:
      locale === "ar"
        ? "الخبرات المهنية | Dev Nour"
        : "Professional Experience | Dev Nour",
    description:
      locale === "ar"
        ? "مسار نور محمد كمؤسس موديري ديجي ومطور منتجات رقمية ومتاجر."
        : "Career path of Nour Mohamed as Mudiri Digi founder and product developer.",
    keywords:
      locale === "ar"
        ? ["خبرات", "مؤسس", "موديري ديجي"]
        : ["experience", "founder", "Mudiri Digi"],
  });
}

export default async function ExperiencePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;
  const t = await getTranslations("nav");
  const s = await getTranslations("sections");
  const items = await getPublishedExperience();

  return (
    <div className="container-page py-20">
      <Reveal>
        <p className="eyebrow">{s("experience")}</p>
        <h1 className="display mt-4 text-5xl font-bold sm:text-7xl">{t("experience")}</h1>
        <p className="mt-5 max-w-2xl text-fg-muted">
          {loc === "ar"
            ? "مسار من تأسيس موديري ديجي إلى قيادة منصات إنتاجية متعددة القنوات."
            : "From founding Mudiri Digi to leading multi-channel production platforms."}
        </p>
      </Reveal>

      <ol className="mt-14">
        {items.map((item, i) => (
          <Reveal key={item.id} delay={i * 0.05}>
            <li className="work-row grid gap-4 md:grid-cols-[9rem_1fr]">
              <p className="text-sm text-accent">
                {item.startDate} — {item.current ? s("present") : item.endDate || ""}
              </p>
              <div>
                <h2 className="text-2xl font-semibold sm:text-3xl">
                  {loc === "ar" ? item.roleAr : item.roleEn}
                </h2>
                <p className="mt-2 text-fg-muted">
                  {loc === "ar" ? item.companyAr : item.companyEn}
                  {(loc === "ar" ? item.locationAr : item.locationEn)
                    ? ` · ${loc === "ar" ? item.locationAr : item.locationEn}`
                    : ""}
                </p>
                <p className="mt-4 max-w-3xl leading-8 text-fg-muted">
                  {loc === "ar" ? item.descriptionAr : item.descriptionEn}
                </p>
              </div>
            </li>
          </Reveal>
        ))}
      </ol>

      <ConsultCTA />
    </div>
  );
}
