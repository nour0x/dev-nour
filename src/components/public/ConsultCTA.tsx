import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

export async function ConsultCTA() {
  const s = await getTranslations("sections");
  const t = await getTranslations("hero");

  return (
    <section className="container-page py-14 sm:py-20">
      <div className="surface-accent relative overflow-hidden p-7 sm:p-12">
        <p className="eyebrow">{s("consult")}</p>
        <h2 className="display mt-4 max-w-3xl text-3xl font-bold sm:text-5xl">
          {s("contact")}
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-fg-muted sm:text-base">
          {s("consultHint")}
        </p>
        <div className="btn-row mt-8">
          <Link
            href="/contact"
            className="btn btn-primary focus-ring"
            data-track="cta-consult"
          >
            {t("ctaPrimary")}
          </Link>
          <Link
            href="/projects"
            className="btn btn-ghost focus-ring"
            data-track="cta-work"
          >
            {t("ctaSecondary")}
          </Link>
          <Link
            href="/services"
            className="btn btn-ink focus-ring"
            data-track="cta-services"
          >
            {t("ctaServices")}
          </Link>
        </div>
      </div>
    </section>
  );
}
