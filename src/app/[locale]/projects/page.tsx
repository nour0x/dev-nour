import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getPublishedProjects } from "@/lib/content";
import { parseTags } from "@/lib/utils";
import { buildPageMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/config";
import { Reveal } from "@/components/public/Reveal";
import { ConsultCTA } from "@/components/public/ConsultCTA";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    path: `/${locale}/projects`,
    title: locale === "ar" ? "الأعمال والمشاريع | Dev Nour" : "Work & Case Studies | Dev Nour",
    description:
      locale === "ar"
        ? "مشاريع ودراسات حالة لنور محمد: متاجر، أنظمة، وتطبيقات جاهزة للسوق."
        : "Projects and case studies by Nour Mohamed: stores, systems, and market-ready apps.",
    keywords:
      locale === "ar"
        ? ["مشاريع", "دراسة حالة", "متاجر", "تطبيقات"]
        : ["portfolio", "case studies", "ecommerce", "apps"],
  });
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;
  const t = await getTranslations("nav");
  const s = await getTranslations("sections");
  const projects = await getPublishedProjects();

  return (
    <>
      <div className="container-page py-20">
        <Reveal>
          <p className="eyebrow">{s("caseStudy")}</p>
          <h1 className="display mt-4 text-5xl font-bold sm:text-7xl">{t("projects")}</h1>
          <p className="mt-5 max-w-2xl text-fg-muted">
            {loc === "ar"
              ? "شوف شغل حقيقي اتعمل واتنشر: طلبيات، مويدير، موديري ديجي ستور، وعملاء على الإنتاج."
              : "Real shipped work: Talabyaat, Moydeer, Mudiri Digi Store, and live client launches."}
          </p>
        </Reveal>

        <div className="mt-14">
          {projects.length === 0 ? (
            <p className="text-fg-muted">{s("empty")}</p>
          ) : (
            projects.map((project, i) => (
              <Reveal key={project.id} delay={i * 0.05} direction={i % 2 ? "left" : "up"}>
                <Link
                  href={`/projects/${project.slug}`}
                  className="work-row focus-ring group grid md:grid-cols-[5rem_1.4fr_1fr]"
                >
                  <span className="metric text-sm text-fg-muted">0{i + 1}</span>
                  <div>
                    <h2 className="text-3xl font-semibold transition group-hover:text-accent">
                      {loc === "ar" ? project.titleAr : project.titleEn}
                    </h2>
                    <p className="mt-4 max-w-2xl text-sm leading-7 text-fg-muted">
                      {loc === "ar" ? project.summaryAr : project.summaryEn}
                    </p>
                  </div>
                  <div className="flex flex-wrap content-start gap-2 md:justify-end">
                    {parseTags(project.tags).map((tag) => (
                      <span
                        key={tag}
                        className="border border-border px-2.5 py-1 text-xs text-fg-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </Link>
              </Reveal>
            ))
          )}
        </div>
      </div>
      <ConsultCTA />
    </>
  );
}
