import { MUDIRI, siteUrl } from "@/lib/seo";
import type { Locale } from "@/i18n/config";

type JsonLdArgs = {
  locale: Locale;
  profile: {
    brandName: string;
    nameAr: string;
    nameEn: string;
    titleAr: string;
    titleEn: string;
    bioAr: string;
    bioEn: string;
    email?: string | null;
    githubUrl?: string | null;
  } | null;
  path?: string;
  socialUrls?: string[];
};

export function buildPersonGraph({ locale, profile, path = "", socialUrls = [] }: JsonLdArgs) {
  const name = locale === "ar" ? profile?.nameAr || "نور محمد" : profile?.nameEn || "Nour Mohamed";
  const jobTitle =
    locale === "ar"
      ? profile?.titleAr || "مؤسس موديري ديجي"
      : profile?.titleEn || "Founder of Mudiri Digi";
  const description =
    locale === "ar" ? profile?.bioAr || "" : profile?.bioEn || "";
  const brand = profile?.brandName || "Dev Nour";
  const url = siteUrl(path || `/${locale}`);

  const sameAs = [
    ...socialUrls,
    profile?.githubUrl,
    MUDIRI.site,
    MUDIRI.shop,
  ].filter(Boolean) as string[];

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl()}/#website`,
        url: siteUrl(),
        name: brand,
        inLanguage: [locale === "ar" ? "ar" : "en"],
        sameAs: [MUDIRI.site, MUDIRI.shop],
        publisher: { "@id": `${siteUrl()}/#person` },
      },
      {
        "@type": "Person",
        "@id": `${siteUrl()}/#person`,
        name,
        alternateName: ["Dev Nour", "نور محمد", "Nour Mohamed"],
        jobTitle,
        description,
        url,
        email: profile?.email || undefined,
        sameAs,
        worksFor: { "@id": `${siteUrl()}/#mudiri` },
        affiliation: { "@id": `${siteUrl()}/#mudiri` },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl()}/#mudiri`,
        name: "Mudiri Digi",
        alternateName: "موديري ديجي",
        url: MUDIRI.site,
        sameAs: [MUDIRI.site, MUDIRI.shop],
        founder: { "@id": `${siteUrl()}/#person` },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl()}/#org`,
        name: brand,
        url: siteUrl(),
        sameAs: [MUDIRI.site, MUDIRI.shop],
        founder: { "@id": `${siteUrl()}/#person` },
      },
    ],
  };
}

export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
