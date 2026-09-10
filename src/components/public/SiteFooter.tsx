import { getTranslations } from "next-intl/server";
import { MUDIRI } from "@/lib/seo";

export async function SiteFooter() {
  const t = await getTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="mt-28 border-t border-border">
      <div className="container-page py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="display text-3xl font-bold">Dev Nour</p>
            <p className="mt-4 max-w-md text-sm leading-7 text-fg-muted">
              {t("line")}
            </p>
          </div>
          <div className="md:justify-self-end">
            <p className="eyebrow mb-4">{t("mudiri")}</p>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href={MUDIRI.site}
                  className="focus-ring text-fg-muted transition hover:text-accent"
                  rel="noopener noreferrer"
                >
                  {MUDIRI.site.replace("https://", "")}
                </a>
              </li>
              <li>
                <a
                  href={MUDIRI.shop}
                  className="focus-ring text-fg-muted transition hover:text-accent"
                  rel="noopener noreferrer"
                >
                  {t("shop")} — mudiridigi.shop
                </a>
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
