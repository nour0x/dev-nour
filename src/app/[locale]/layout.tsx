import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { routing } from "@/i18n/navigation";
import { SiteHeader } from "@/components/public/SiteHeader";
import { SiteFooter } from "@/components/public/SiteFooter";
import { PageTransition } from "@/components/public/PageTransition";
import { ScrollProgress } from "@/components/public/Reveal";
import { ThemeProvider } from "@/components/public/ThemeProvider";
import { AnalyticsProvider } from "@/components/public/AnalyticsProvider";
import { JsonLd, buildPersonGraph } from "@/components/seo/JsonLd";
import { getProfile, getSocialLinks, getSettings } from "@/lib/content";
import type { Locale } from "@/i18n/config";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const google =
    "googleVerificationMeta" in settings
      ? settings.googleVerificationMeta || undefined
      : undefined;
  return {
    verification: google ? { google } : undefined,
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const messages = await getMessages();
  const profile = await getProfile();
  const social = await getSocialLinks();
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <div lang={locale} dir={dir} className="site-shell min-h-screen">
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.lang=${JSON.stringify(locale)};document.documentElement.dir=${JSON.stringify(dir)};`,
        }}
      />
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <NextIntlClientProvider messages={messages}>
        <ThemeProvider>
          <AnalyticsProvider>
            <ScrollProgress />
            <SiteHeader />
            <main id="main">
              <PageTransition>{children}</PageTransition>
            </main>
            <SiteFooter />
          </AnalyticsProvider>
        </ThemeProvider>
      </NextIntlClientProvider>
      <JsonLd
        data={buildPersonGraph({
          locale: locale as Locale,
          profile,
          socialUrls: social.map((s) => s.url),
        })}
      />
    </div>
  );
}
