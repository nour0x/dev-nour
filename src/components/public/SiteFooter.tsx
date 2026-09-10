import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { MUDIRI } from "@/lib/seo";

export async function SiteFooter() {
  const t = await getTranslations("footer");
  const hero = await getTranslations("hero");
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-border sm:mt-28">
      <div className="container-page py-12 sm:py-14">
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <p className="display text-3xl font-bold text-accent">Dev Nour</p>
            <p className="mt-4 max-w-md text-sm leading-7 text-fg-muted">{t("line")}</p>
            <div className="btn-row mt-6">
              <Link href="/contact" className="btn btn-primary focus-ring" data-track="footer-consult">
                {hero("ctaPrimary")}
              </Link>
              <Link href="/projects" className="btn btn-ghost focus-ring" data-track="footer-work">
                {hero("ctaSecondary")}
              </Link>
            </div>
          </div>
          <div>
            <p className="eyebrow mb-4">{t("mudiri")}</p>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href={MUDIRI.site}
                  className="focus-ring text-fg-muted transition hover:text-accent"
                  rel="noopener noreferrer"
                  data-track="footer-mudiri"
                >
                  {MUDIRI.site.replace("https://", "")}
                </a>
              </li>
              <li>
                <a
                  href={MUDIRI.shop}
                  className="focus-ring text-fg-muted transition hover:text-accent"
                  rel="noopener noreferrer"
                  data-track="footer-shop"
                >
                  {t("shop")} — mudiridigi.shop
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-4">{hero("ctaServices")}</p>
            <ul className="space-y-2 text-sm text-fg-muted">
              <li>
                <Link href="/services" className="hover:text-accent" data-track="footer-services">
                  {hero("ctaServices")}
                </Link>
              </li>
              <li>
                <Link href="/links" className="hover:text-accent" data-track="footer-links">
                  Links
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-accent" data-track="footer-about">
                  About
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="rule my-8" />
        <p className="text-xs text-fg-muted">
          © {year} Dev Nour · Nour Mohamed. {t("rights")}.
        </p>
      </div>
    </footer>
  );
}
