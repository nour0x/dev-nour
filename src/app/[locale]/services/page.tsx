import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getPublishedServices } from "@/lib/content";
import { formatPrice } from "@/lib/utils";
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
    path: `/${locale}/services`,
    title:
      locale === "ar"
        ? "خدمات تطوير ويب ومتاجر | Dev Nour"
        : "Web, Apps & Store Services | Dev Nour",
    description:
      locale === "ar"
        ? "خدمات نور محمد: تطبيقات، متاجر، CRM/ERP، Easy Orders، Shopify، WordPress، SEO وإعلانات."
        : "Services by Nour Mohamed: apps, stores, CRM/ERP, Easy Orders, Shopify, WordPress, SEO and ads.",
    keywords:
      locale === "ar"
        ? ["خدمات", "Easy Orders", "Shopify", "CRM", "ERP"]
        : ["services", "Easy Orders", "Shopify", "CRM", "ERP"],
  });
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;
  const t = await getTranslations("nav");
  const s = await getTranslations("sections");
  const services = await getPublishedServices();

  return (
    <>
      <div className="container-page py-20">
        <Reveal>
          <p className="eyebrow">{s("services")}</p>
          <h1 className="display mt-4 text-5xl font-bold sm:text-7xl">{t("services")}</h1>
          <p className="mt-5 max-w-2xl text-fg-muted">
            {loc === "ar"
              ? "من التطبيق للمتجر لنظام الإدارة — بما فيها Easy Orders وShopify وWordPress."
              : "From apps to stores to admin systems — including Easy Orders, Shopify, and WordPress."}
          </p>
        </Reveal>
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {services.length === 0 ? (
            <p className="text-fg-muted">{s("empty")}</p>
          ) : (
            services.map((service, i) => (
              <Reveal key={service.id} delay={i * 0.04} direction="up">
                <Link
                  href={`/services/${service.slug}`}
                  className="surface focus-ring block h-full p-6 transition hover:border-accent/40"
                >
                  <h2 className="text-2xl font-semibold">
                    {loc === "ar" ? service.titleAr : service.titleEn}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-fg-muted">
                    {loc === "ar" ? service.summaryAr : service.summaryEn}
                  </p>
                  <div className="mt-6 grid grid-cols-3 gap-3 text-sm">
                    <div>
                      <p className="text-fg-muted">{s("from")}</p>
                      <p className="font-semibold">
                        {formatPrice(service.priceMin, service.currency, loc)}
                      </p>
                    </div>
                    <div>
                      <p className="text-fg-muted">{s("avgPrice")}</p>
                      <p className="font-semibold text-accent">
                        {formatPrice(service.priceAvg, service.currency, loc)}
                      </p>
                    </div>
                    <div>
                      <p className="text-fg-muted">{s("to")}</p>
                      <p className="font-semibold">
                        {formatPrice(service.priceMax, service.currency, loc)}
                      </p>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))
          )}
        </div>
      </div>
      <ConsultCTA />
    </>
  );
}
