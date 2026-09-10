import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { getSiteLinks, getSocialLinks, getProfile } from "@/lib/content";
import { siteUrl, MUDIRI } from "@/lib/seo";
import type { Locale } from "@/i18n/config";
import { Reveal } from "@/components/public/Reveal";
import { ProfilePhoto } from "@/components/public/ProfilePhoto";
import { ConsultCTA } from "@/components/public/ConsultCTA";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "ar" ? "روابطي | Dev Nour" : "Links | Dev Nour",
    alternates: {
      canonical: siteUrl(`/${locale}/links`),
      languages: {
        ar: siteUrl("/ar/links"),
        en: siteUrl("/en/links"),
        "x-default": siteUrl("/en/links"),
      },
    },
  };
}

export default async function LinksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;
  const t = await getTranslations("nav");
  const s = await getTranslations("sections");
  const profile = await getProfile();
  const links = await getSiteLinks();
  const social = await getSocialLinks();
  const name = (loc === "ar" ? profile?.nameAr : profile?.nameEn) || "Nour Mohamed";

  const all = [
    ...links.map((l) => ({
      id: l.id,
      label: loc === "ar" ? l.labelAr : l.labelEn,
      url: l.url.startsWith("/")
        ? siteUrl(`/${locale}${l.url === "/" ? "" : l.url}`)
        : l.url,
    })),
    ...social.map((l) => ({
      id: `s-${l.id}`,
      label: loc === "ar" ? l.labelAr : l.labelEn,
      url: l.url,
    })),
  ];

  // Deduplicate by URL
  const seen = new Set<string>();
  const unique = all.filter((item) => {
    if (seen.has(item.url)) return false;
    seen.add(item.url);
    return true;
  });

  return (
    <>
      <div className="container-page py-20">
        <Reveal className="mx-auto max-w-lg text-center">
          <div className="mb-6 flex justify-center">
            <ProfilePhoto
              src={profile?.avatarUrl}
              name={name}
              alt={s("photoAlt")}
              size="md"
            />
          </div>
          <h1 className="display text-4xl font-bold sm:text-5xl">{t("links")}</h1>
          <p className="mt-3 text-fg-muted">
            {profile?.brandName || "Dev Nour"} · {s("mySites")}
          </p>
        </Reveal>
        <ul className="mx-auto mt-10 flex max-w-lg flex-col gap-3">
          {unique.map((item, i) => (
            <Reveal key={item.id} delay={i * 0.03} direction="up">
              <li>
                <a
                  href={item.url}
                  className="surface focus-ring flex min-h-14 items-center justify-center px-4 text-center font-medium transition hover:border-accent/40"
                  target={item.url.startsWith("http") || item.url.startsWith("mailto") ? "_blank" : undefined}
                  rel={item.url.startsWith("http") ? "noopener noreferrer" : undefined}
                >
                  {item.label}
                </a>
              </li>
            </Reveal>
          ))}
          <Reveal delay={0.2}>
            <li className="pt-2 text-center text-xs text-fg-muted">
              <a href={MUDIRI.site} className="hover:text-accent" rel="noopener noreferrer">
                mudiridigi.com
              </a>
              {" · "}
              <a href={MUDIRI.shop} className="hover:text-accent" rel="noopener noreferrer">
                mudiridigi.shop
              </a>
            </li>
          </Reveal>
        </ul>
      </div>
      <ConsultCTA />
    </>
  );
}
