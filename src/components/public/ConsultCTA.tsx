import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/public/Reveal";

export async function ConsultCTA() {
  const s = await getTranslations("sections");
  const t = await getTranslations("hero");

  return (
    <Reveal className="container-page py-20">
      <div className="surface relative overflow-hidden p-8 sm:p-12">
        <div className="pointer-events-none absolute -end-16 -top-16 h-48 w-48 rounded-full bg-accent/15 blur-3xl" />
        <p className="eyebrow">{s("consult")}</p>
        <h2 className="display mt-4 max-w-3xl text-3xl font-bold sm:text-5xl">
          {s("contact")}
        </h2>
        <p className="mt-4 max-w-2xl text-fg-muted">{s("consultHint")}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/contact" className="btn btn-primary focus-ring">
            {t("ctaPrimary")}
          </Link>
          <Link href="/projects" className="btn btn-ghost focus-ring">
            {t("ctaSecondary")}
          </Link>
        </div>
      </div>
    </Reveal>
  );
}
