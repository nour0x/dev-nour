import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { getProfile, getSocialLinks, getSiteLinks } from "@/lib/content";
import { MUDIRI, buildPageMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/config";
import { Reveal } from "@/components/public/Reveal";
import { ProfilePhoto } from "@/components/public/ProfilePhoto";
import { ConsultCTA } from "@/components/public/ConsultCTA";
import { Link } from "@/i18n/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    path: `/${locale}/about`,
    title: locale === "ar" ? "من أنا — نور محمد | Dev Nour" : "About Nour Mohamed | Dev Nour",
    description:
      locale === "ar"
        ? "تعرف على نور محمد مؤسس موديري ديجي: تطوير ويب، تطبيقات، متاجر، SEO وGEO."
        : "Meet Nour Mohamed, founder of Mudiri Digi: web, apps, stores, SEO and GEO.",
    keywords:
      locale === "ar"
        ? ["من أنا", "مؤسس موديري ديجي", "مطور ويب مصر"]
        : ["about", "Mudiri Digi founder", "web developer Egypt"],
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;
  const t = await getTranslations("nav");
  const s = await getTranslations("sections");
  const hero = await getTranslations("hero");
  const profile = await getProfile();
  const social = await getSocialLinks();
  const links = await getSiteLinks();
  const name = (loc === "ar" ? profile?.nameAr : profile?.nameEn) || "Nour Mohamed";

  return (
    <>
      <div className="container-page py-20">
        <div className="grid items-start gap-12 lg:grid-cols-[280px_1fr]">
          <Reveal direction="right">
            <ProfilePhoto
              src={profile?.avatarUrl}
              name={name}
              alt={s("photoAlt")}
              size="xl"
            />
          </Reveal>
          <Reveal direction="left">
            <p className="eyebrow">{t("about")}</p>
            <h1 className="display mt-4 text-5xl font-bold sm:text-6xl">{name}</h1>
            <p className="mt-4 text-xl text-accent">
              {loc === "ar" ? profile?.titleAr : profile?.titleEn}
            </p>
            <p className="mt-8 max-w-3xl text-lg leading-9 text-fg-muted whitespace-pre-wrap">
              {loc === "ar" ? profile?.bioAr : profile?.bioEn}
            </p>

            <div className="surface mt-10 grid max-w-2xl gap-4 p-6 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-fg-muted">
                  {s("founderOf")}
                </p>
                <a
                  href={MUDIRI.site}
                  className="mt-2 inline-block text-lg text-accent hover:underline"
                  rel="noopener noreferrer"
                >
                  Mudiri Digi
                </a>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-fg-muted">
                  {s("company")}
                </p>
                <a
                  href={MUDIRI.shop}
                  className="mt-2 inline-block text-lg text-ink hover:underline"
                  rel="noopener noreferrer"
                >
                  mudiridigi.shop
                </a>
              </div>
              {profile?.email ? (
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-fg-muted">Email</p>
                  <a href={`mailto:${profile.email}`} className="mt-2 inline-block hover:text-accent">
                    {profile.email}
                  </a>
                </div>
              ) : null}
              {profile?.phone ? (
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-fg-muted">Phone</p>
                  <a href={`tel:${profile.phone}`} className="mt-2 inline-block hover:text-accent">
                    {profile.phone}
                  </a>
                </div>
              ) : null}
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/contact" className="btn btn-primary focus-ring">
                {hero("ctaPrimary")}
              </Link>
              <Link href="/projects" className="btn btn-ghost focus-ring">
                {hero("ctaSecondary")}
              </Link>
            </div>

            <h2 className="mt-12 text-lg font-semibold">{s("platformsTitle")}</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {[...social, ...links].map((item) => (
                <li key={item.id}>
                  <a
                    href={item.url}
                    className="focus-ring border border-border px-4 py-2 text-sm text-fg-muted transition hover:border-accent/40 hover:text-fg"
                    target={item.url.startsWith("http") ? "_blank" : undefined}
                    rel={item.url.startsWith("http") ? "noopener noreferrer" : undefined}
                  >
                    {loc === "ar" ? item.labelAr : item.labelEn}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
      <ConsultCTA />
    </>
  );
}
