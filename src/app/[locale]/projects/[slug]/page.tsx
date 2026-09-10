import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { prisma } from "@/lib/db";
import { parseTags } from "@/lib/utils";
import { siteUrl } from "@/lib/seo";
import type { Locale } from "@/i18n/config";
import { JsonLd } from "@/components/seo/JsonLd";
import { Reveal } from "@/components/public/Reveal";
import { Link } from "@/i18n/navigation";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  let project = null;
  try {
    project = await prisma.project.findFirst({
      where: { slug, published: true },
    });
  } catch {
    return {};
  }
  if (!project) return {};
  const title =
    locale === "ar"
      ? project.metaTitleAr || project.titleAr
      : project.metaTitleEn || project.titleEn;
  const description =
    locale === "ar"
      ? project.metaDescriptionAr || project.summaryAr
      : project.metaDescriptionEn || project.summaryEn;

  return {
    title,
    description,
    keywords:
      locale === "ar"
        ? project.keywordsAr || undefined
        : project.keywordsEn || undefined,
    alternates: {
      canonical: siteUrl(`/${locale}/projects/${slug}`),
      languages: {
        ar: siteUrl(`/ar/projects/${slug}`),
        en: siteUrl(`/en/projects/${slug}`),
        "x-default": siteUrl(`/en/projects/${slug}`),
      },
    },
    openGraph: {
      title:
        locale === "ar"
          ? project.ogTitleAr || title
          : project.ogTitleEn || title,
      description,
      type: "article",
      images: project.coverUrl ? [project.coverUrl] : undefined,
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;
  const s = await getTranslations("sections");
  let project = null;
  try {
    project = await prisma.project.findFirst({
      where: { slug, published: true },
    });
  } catch {
    notFound();
  }
  if (!project) notFound();

  const title = loc === "ar" ? project.titleAr : project.titleEn;
  const body = loc === "ar" ? project.bodyAr : project.bodyEn;

  return (
    <article className="container-page py-20">
      <Reveal>
        <p className="eyebrow">{s("caseStudy")}</p>
        <h1 className="display mt-4 max-w-4xl text-5xl font-bold sm:text-7xl">{title}</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-fg-muted">
          {loc === "ar" ? project.summaryAr : project.summaryEn}
        </p>
        <div className="mt-8 flex flex-wrap gap-2">
          {parseTags(project.tags).map((tag) => (
            <span
              key={tag}
              className="border border-border px-3 py-1.5 text-sm text-fg-muted"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          {project.demoUrl ? (
            <a
              href={project.demoUrl}
              className="btn btn-primary focus-ring"
              target="_blank"
              rel="noopener noreferrer"
            >
              {s("live")}
            </a>
          ) : null}
          {project.githubUrl ? (
            <a
              href={project.githubUrl}
              className="btn btn-ghost focus-ring"
              target="_blank"
              rel="noopener noreferrer"
            >
              {s("source")}
            </a>
          ) : null}
          <Link href="/projects" className="btn btn-ghost focus-ring">
            ← {s("viewAll")}
          </Link>
        </div>
      </Reveal>

      <div className="rule my-14" />

      <Reveal className="max-w-3xl whitespace-pre-wrap text-base leading-9 text-fg-muted">
        {body}
      </Reveal>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: title,
          description: loc === "ar" ? project.summaryAr : project.summaryEn,
          url: siteUrl(`/${locale}/projects/${slug}`),
          inLanguage: loc,
          author: {
            "@type": "Person",
            name: "Nour Mohamed",
            alternateName: "Dev Nour",
          },
          creator: {
            "@type": "Organization",
            name: "Mudiri Digi",
            url: "https://mudiridigi.com",
          },
        }}
      />
    </article>
  );
}
