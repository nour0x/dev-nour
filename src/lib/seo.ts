import type { Metadata } from "next";
import slugify from "slugify";

export type LocalizedSeoInput = {
  titleAr: string;
  titleEn: string;
  summaryAr?: string;
  summaryEn?: string;
  brand?: string;
  kind: "project" | "service";
  slug?: string;
  metaTitleAr?: string | null;
  metaTitleEn?: string | null;
  metaDescriptionAr?: string | null;
  metaDescriptionEn?: string | null;
  ogTitleAr?: string | null;
  ogTitleEn?: string | null;
  keywordsAr?: string | null;
  keywordsEn?: string | null;
};

function truncate(text: string, max = 155) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trim()}…`;
}

export function makeSlug(input: string) {
  return (
    slugify(input, { lower: true, strict: true, trim: true }) ||
    `item-${Date.now()}`
  );
}

export function autoSeo(input: LocalizedSeoInput) {
  const brand = input.brand || "Dev Nour";
  const slug =
    input.slug?.trim() ||
    makeSlug(input.titleEn || input.titleAr);

  const metaTitleAr =
    input.metaTitleAr?.trim() ||
    `${input.titleAr} | ${brand}`;
  const metaTitleEn =
    input.metaTitleEn?.trim() ||
    `${input.titleEn} | ${brand}`;

  const metaDescriptionAr =
    input.metaDescriptionAr?.trim() ||
    truncate(
      input.summaryAr ||
        `${input.titleAr} — عمل من ${brand}. تطوير ويب، واجهات حديثة، وتجربة مستخدم قوية.`
    );
  const metaDescriptionEn =
    input.metaDescriptionEn?.trim() ||
    truncate(
      input.summaryEn ||
        `${input.titleEn} — work by ${brand}. Modern web development, interfaces, and UX.`
    );

  const ogTitleAr = input.ogTitleAr?.trim() || metaTitleAr;
  const ogTitleEn = input.ogTitleEn?.trim() || metaTitleEn;

  const keywordsAr =
    input.keywordsAr?.trim() ||
    [input.titleAr, brand, "نور محمد", input.kind === "service" ? "خدمات" : "مشاريع"].join(
      ", "
    );
  const keywordsEn =
    input.keywordsEn?.trim() ||
    [input.titleEn, brand, "Nour Mohamed", input.kind].join(", ");

  return {
    slug,
    metaTitleAr,
    metaTitleEn,
    metaDescriptionAr,
    metaDescriptionEn,
    ogTitleAr,
    ogTitleEn,
    keywordsAr,
    keywordsEn,
  };
}

export const MUDIRI = {
  site: "https://mudiridigi.com",
  shop: "https://mudiridigi.shop/",
  phone: "01552114232",
  whatsapp: "https://wa.me/201552114232",
  brand: "Mudiri Digi",
  brandAr: "موديري ديجي",
} as const;

export function siteUrl(path = "") {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(
    /\/$/,
    ""
  );
  if (!path) return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export type PageMetaInput = {
  locale: string;
  path: string;
  title: string;
  description: string;
  keywords?: string[];
  image?: string | null;
  type?: "website" | "article" | "profile";
};

export function buildPageMetadata({
  locale,
  path,
  title,
  description,
  keywords = [],
  image,
  type = "website",
}: PageMetaInput): Metadata {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const url = siteUrl(normalized);
  const bare = normalized.replace(/^\/(ar|en)/, "") || "/";
  const ogImage = image
    ? image.startsWith("http")
      ? image
      : siteUrl(image)
    : undefined;

  const baseKeywords =
    locale === "ar"
      ? [
          "نور محمد",
          "Dev Nour",
          "موديري ديجي",
          "تطوير ويب",
          "تطبيقات",
          "متاجر إلكترونية",
          "SEO",
          "GEO",
          "AEO",
        ]
      : [
          "Nour Mohamed",
          "Dev Nour",
          "Mudiri Digi",
          "web developer",
          "Flutter",
          "Next.js",
          "Laravel",
          "SEO",
          "GEO",
          "AEO",
        ];

  return {
    title,
    description,
    keywords: [...keywords, ...baseKeywords],
    alternates: {
      canonical: url,
      languages: {
        ar: siteUrl(`/ar${bare === "/" ? "" : bare}`),
        en: siteUrl(`/en${bare === "/" ? "" : bare}`),
        "x-default": siteUrl(`/en${bare === "/" ? "" : bare}`),
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Dev Nour",
      type: type === "article" ? "article" : "website",
      locale: locale === "ar" ? "ar_EG" : "en_US",
      images: ogImage ? [{ url: ogImage, alt: title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
      creator: "@nour0x",
    },
    robots: { index: true, follow: true },
  };
}
