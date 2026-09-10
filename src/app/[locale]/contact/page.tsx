import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { getProfile, getSocialLinks } from "@/lib/content";
import { siteUrl } from "@/lib/seo";
import type { Locale } from "@/i18n/config";
import { Reveal } from "@/components/public/Reveal";
import { ProfilePhoto } from "@/components/public/ProfilePhoto";
import { ContactForm } from "@/components/public/ContactForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "ar" ? "تواصل | Dev Nour" : "Contact | Dev Nour",
    alternates: {
      canonical: siteUrl(`/${locale}/contact`),
      languages: {
        ar: siteUrl("/ar/contact"),
        en: siteUrl("/en/contact"),
        "x-default": siteUrl("/en/contact"),
      },
    },
  };
}

export default async function ContactPage({
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
  const social = await getSocialLinks();
  const name = (loc === "ar" ? profile?.nameAr : profile?.nameEn) || "Nour Mohamed";

  return (
    <div className="container-page py-20">
      <div className="grid gap-12 lg:grid-cols-[240px_1fr]">
        <Reveal direction="right" className="hidden lg:block">
          <ProfilePhoto
            src={profile?.avatarUrl}
            name={name}
            alt={s("photoAlt")}
            size="lg"
          />
        </Reveal>
        <div>
          <Reveal>
            <p className="eyebrow">{s("consult")}</p>
            <h1 className="display mt-4 text-5xl font-bold sm:text-6xl">{t("contact")}</h1>
            <p className="mt-4 max-w-2xl text-lg text-fg-muted">{s("consultHint")}</p>
            <p className="mt-3 max-w-2xl text-fg-muted">{s("contact")}</p>
            {profile?.email ? (
              <p className="mt-4">
                <a
                  href={`mailto:${profile.email}`}
                  className="focus-ring text-accent hover:underline"
                >
                  {profile.email}
                </a>
              </p>
            ) : null}
            <ul className="mt-6 flex flex-wrap gap-2">
              {social.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.url}
                    className="focus-ring border border-border px-4 py-2 text-sm hover:border-accent/40"
                    target={item.url.startsWith("http") ? "_blank" : undefined}
                    rel={item.url.startsWith("http") ? "noopener noreferrer" : undefined}
                  >
                    {loc === "ar" ? item.labelAr : item.labelEn}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
