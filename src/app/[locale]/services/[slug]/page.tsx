import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { siteUrl } from "@/lib/seo";
import type { Locale } from "@/i18n/config";
import { JsonLd } from "@/components/seo/JsonLd";
import { Reveal } from "@/components/public/Reveal";
import { Link } from "@/i18n/navigation";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const service = await prisma.service.findFirst({
    where: { slug, published: true },
  });
  if (!service) return {};
  const title =
    locale === "ar"
      ? service.metaTitleAr || service.titleAr
      : service.metaTitleEn || service.titleEn;
  const description =
    locale === "ar"
      ? service.metaDescriptionAr || service.summaryAr
      : service.metaDescriptionEn || service.summaryEn;

  return {
    title,
    description,
    keywords:
      locale === "ar"
        ? service.keywordsAr || undefined
        : service.keywordsEn || undefined,
    alternates: {
      canonical: siteUrl(`/${locale}/services/${slug}`),
      languages: {
        ar: siteUrl(`/ar/services/${slug}`),
        en: siteUrl(`/en/services/${slug}`),
        "x-default": siteUrl(`/en/services/${slug}`),
      },
    },
    openGraph: {
      title:
        locale === "ar"
          ? service.ogTitleAr || title
          : service.ogTitleEn || title,
      description,
      type: "website",
    },
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;
  const s = await getTranslations("sections");
  const service = await prisma.service.findFirst({
    where: { slug, published: true },
  });
  if (!service) notFound();

  const title = loc === "ar" ? service.titleAr : service.titleEn;
  const body = loc === "ar" ? service.bodyAr : service.bodyEn;

  return (
    <article className="container-page py-16">
      <Reveal>
        <p className="mb-3 text-sm uppercase tracking-[0.2em] text-accent">
          Service
        </p>
        <h1 className="display text-4xl font-bold sm:text-6xl">{title}</h1>
        <p className="mt-4 max-w-3xl text-lg text-fg-muted">
          {loc === "ar" ? service.summaryAr : service.summaryEn}
        </p>
        <div className="surface mt-8 grid max-w-xl grid-cols-3 gap-4 p-5">
          <div>
            <p className="text-sm text-fg-muted">{s("from")}</p>
            <p className="mt-1 text-xl font-semibold">
              {formatPrice(service.priceMin, service.currency, loc)}
            </p>
          </div>
          <div>
            <p className="text-sm text-fg-muted">{s("avgPrice")}</p>
            <p className="mt-1 text-xl font-semibold text-accent">
              {formatPrice(service.priceAvg, service.currency, loc)}
            </p>
          </div>
          <div>
            <p className="text-sm text-fg-muted">{s("to")}</p>
            <p className="mt-1 text-xl font-semibold">
              {formatPrice(service.priceMax, service.currency, loc)}
            </p>
          </div>
        </div>
        <Link href="/contact" className="btn btn-primary focus-ring mt-8">
          {s("contact")}
        </Link>
      </Reveal>
      <Reveal className="mt-12 max-w-3xl whitespace-pre-wrap text-base leading-8 text-fg-muted">
        {body}
      </Reveal>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: title,
          description: loc === "ar" ? service.summaryAr : service.summaryEn,
          url: siteUrl(`/${locale}/services/${slug}`),
          provider: {
            "@type": "Person",
            name: "Nour Mohamed",
            alternateName: "Dev Nour",
          },
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: service.currency,
            lowPrice: service.priceMin ?? undefined,
            highPrice: service.priceMax ?? undefined,
            offerCount: 1,
          },
        }}
      />
    </article>
  );
}
