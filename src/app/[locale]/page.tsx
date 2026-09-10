import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/public/Reveal";
import { ProfilePhoto } from "@/components/public/ProfilePhoto";
import { ConsultCTA } from "@/components/public/ConsultCTA";
import {
  getProfile,
  getPublishedProjects,
  getPublishedServices,
  getPublishedSkills,
  getPublishedExperience,
  getSettings,
  getSocialLinks,
  getSiteLinks,
} from "@/lib/content";
import { formatPrice, parseTags } from "@/lib/utils";
import type { Locale } from "@/i18n/config";
import { MUDIRI, buildPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const settings = await getSettings();
  const profile = await getProfile();
  const title =
    locale === "ar" ? settings.defaultMetaTitleAr : settings.defaultMetaTitleEn;
  const description =
    locale === "ar" ? settings.defaultMetaDescAr : settings.defaultMetaDescEn;

  return buildPageMetadata({
    locale,
    path: `/${locale}`,
    title: title || t("homeTitle"),
    description: description || t("homeDesc"),
    keywords:
      locale === "ar"
        ? ["استشارة مجانية", "Easy Orders", "Shopify", "Flutter", "Laravel"]
        : ["free consult", "Easy Orders", "Shopify", "Flutter", "Laravel"],
    image: settings.ogImageUrl || profile?.avatarUrl,
    type: "profile",
  });
}

function byCategory(
  skills: Awaited<ReturnType<typeof getPublishedSkills>>,
  loc: Locale,
  needles: string[]
) {
  return skills.filter((sk) => {
    const cat = (loc === "ar" ? sk.categoryAr : sk.categoryEn).toLowerCase();
    return needles.some((n) => cat.includes(n.toLowerCase()));
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;
  const t = await getTranslations("hero");
  const s = await getTranslations("sections");
  const profile = await getProfile();
  const projects = await getPublishedProjects(4);
  const services = await getPublishedServices(8);
  const skills = await getPublishedSkills();
  const experience = await getPublishedExperience();
  const social = await getSocialLinks();
  const links = await getSiteLinks();

  const name = (loc === "ar" ? profile?.nameAr : profile?.nameEn) || "Nour Mohamed";
  const title = loc === "ar" ? profile?.titleAr : profile?.titleEn;
  const bio = loc === "ar" ? profile?.bioAr : profile?.bioEn;

  const languages = byCategory(skills, loc, ["لغات", "language"]);
  const frameworks = byCategory(skills, loc, ["أطر", "framework", "تقني"]);
  const platforms = byCategory(skills, loc, ["منص", "platform", "تخصيص"]);
  const ads = byCategory(skills, loc, ["إعلان", "ads", "growth"]);
  const indexing = byCategory(skills, loc, ["فهرس", "index", "ذكاء", "ai", "seo", "geo"]);
  const heroSkills = skills.slice(0, 8);
  const years = profile?.yearsExperience ?? 5;
  const age = profile?.age;

  return (
    <>
      <section className="container-page hero-stage flex min-h-[calc(100svh-4.25rem)] flex-col justify-center pb-8">
        <p className="eyebrow mx-auto md:mx-0">{t("kicker")}</p>
        <h1 className="display mx-auto mt-4 max-w-5xl text-center text-[clamp(2.4rem,9vw,5.8rem)] font-extrabold text-fg md:mx-0 md:text-start">
          <span className="text-accent">{(profile?.brandName || "Dev Nour").split(" ")[0]}</span>
          {(profile?.brandName || "Dev Nour").includes(" ")
            ? ` ${(profile?.brandName || "Dev Nour").split(" ").slice(1).join(" ")}`
            : ""}
        </h1>

        <div className="hero-intro mt-8 sm:mt-10">
          <ProfilePhoto
            src={profile?.avatarUrl}
            name={name}
            alt={s("photoAlt")}
            size="lg"
          />
          <div className="hero-copy">
            <p className="text-2xl font-semibold sm:text-4xl">{name}</p>
            <p className="mt-2 text-base font-medium text-ink sm:text-xl">{title}</p>
            <div className="hero-stats mt-5" aria-label={t("statsLabel")}>
              {age ? (
                <div className="hero-stat">
                  <strong>{age}</strong>
                  <span>{t("age")}</span>
                </div>
              ) : null}
              <div className="hero-stat">
                <strong>{years}+</strong>
                <span>{t("experienceYears")}</span>
              </div>
              <div className="hero-stat">
                <strong>{skills.length}</strong>
                <span>{t("skillsCount")}</span>
              </div>
              <div className="hero-stat">
                <strong>{Math.max(projects.length, 1)}+</strong>
                <span>{t("projectsCount")}</span>
              </div>
            </div>
            {heroSkills.length ? (
              <ul className="hero-chips mt-5" aria-label={s("skills")}>
                {heroSkills.map((sk) => (
                  <li key={sk.id} className="hero-chip">
                    {loc === "ar" ? sk.nameAr : sk.nameEn}
                  </li>
                ))}
              </ul>
            ) : null}
            <p className="mt-5 text-sm leading-7 text-fg-muted sm:text-base sm:leading-8">
              {bio}
            </p>
            <div className="surface mt-5 p-3.5 text-start text-sm leading-7 text-fg-muted sm:inline-block sm:p-4">
              {s("founderOf")}{" "}
              <a
                href={MUDIRI.site}
                className="font-semibold text-accent hover:underline"
                rel="noopener noreferrer"
                data-track="hero-mudiri"
              >
                Mudiri Digi
              </a>
              {" · "}
              <a
                href={MUDIRI.shop}
                className="font-semibold text-ink hover:underline"
                rel="noopener noreferrer"
                data-track="hero-shop"
              >
                mudiridigi.shop
              </a>
            </div>
            <div className="btn-row mt-7">
              <Link href="/contact" className="btn btn-primary focus-ring" data-track="hero-consult">
                {t("ctaPrimary")}
              </Link>
              <Link href="/projects" className="btn btn-ghost focus-ring" data-track="hero-work">
                {t("ctaSecondary")}
              </Link>
              <Link href="/services" className="btn btn-ink focus-ring" data-track="hero-services">
                {t("ctaServices")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <Reveal className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">{s("caseStudy")}</p>
            <h2 className="display mt-3 text-4xl font-bold sm:text-5xl">{s("featured")}</h2>
          </div>
          <Link href="/projects" className="text-sm text-accent hover:underline">
            {s("viewAll")}
          </Link>
        </Reveal>
        <div>
          {projects.map((project, i) => (
            <Reveal key={project.id} delay={i * 0.05} direction={i % 2 ? "left" : "up"}>
              <Link
                href={`/projects/${project.slug}`}
                className="work-row focus-ring group grid md:grid-cols-[0.18fr_1.4fr_0.9fr]"
                data-track={`home-project-${project.slug}`}
              >
                <span className="metric text-sm text-fg-muted">0{i + 1}</span>
                <div>
                  <h3 className="text-2xl font-semibold transition group-hover:text-accent sm:text-3xl">
                    {loc === "ar" ? project.titleAr : project.titleEn}
                  </h3>
                  <p className="mt-3 max-w-xl text-sm leading-7 text-fg-muted">
                    {loc === "ar" ? project.summaryAr : project.summaryEn}
                  </p>
                </div>
                <div className="flex flex-wrap content-start gap-2 md:justify-end">
                  {parseTags(project.tags).slice(0, 4).map((tag) => (
                    <span key={tag} className="border border-border px-2.5 py-1 text-xs text-fg-muted">
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-page py-16">
        <Reveal>
          <p className="eyebrow">{s("experience")}</p>
          <h2 className="display mt-3 text-4xl font-bold sm:text-5xl">{s("experience")}</h2>
        </Reveal>
        <ol className="mt-10">
          {experience.slice(0, 4).map((item, i) => (
            <Reveal key={item.id} delay={i * 0.04} direction="up">
              <li className="work-row grid gap-3 md:grid-cols-[8.5rem_1fr]">
                <p className="text-sm text-accent">
                  {item.startDate} — {item.current ? s("present") : item.endDate}
                </p>
                <div>
                  <h3 className="text-xl font-semibold">
                    {loc === "ar" ? item.roleAr : item.roleEn}
                  </h3>
                  <p className="mt-1 text-fg-muted">
                    {loc === "ar" ? item.companyAr : item.companyEn}
                  </p>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-fg-muted">
                    {loc === "ar" ? item.descriptionAr : item.descriptionEn}
                  </p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="container-page py-16">
        <Reveal className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">{s("services")}</p>
            <h2 className="display mt-3 text-4xl font-bold sm:text-5xl">{s("services")}</h2>
          </div>
          <Link href="/services" className="text-sm text-accent hover:underline">
            {s("viewAll")}
          </Link>
        </Reveal>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, i) => (
            <Reveal key={service.id} delay={i * 0.04} direction="scale">
              <Link
                href={`/services/${service.slug}`}
                className="service-tile focus-ring"
                data-track={`home-service-${service.slug}`}
              >
                <h3 className="text-lg font-semibold">
                  {loc === "ar" ? service.titleAr : service.titleEn}
                </h3>
                <p className="mt-3 text-sm leading-6 text-fg-muted">
                  {loc === "ar" ? service.summaryAr : service.summaryEn}
                </p>
                <p className="mt-5 text-xs uppercase tracking-[0.16em] text-fg-muted">
                  {s("avgPrice")}
                </p>
                <p className="mt-1 text-xl font-semibold text-accent">
                  {formatPrice(service.priceAvg, service.currency, loc)}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-page py-16">
        <Reveal>
          <p className="eyebrow">{s("skills")}</p>
          <h2 className="display mt-3 text-4xl font-bold sm:text-5xl">{s("skills")}</h2>
        </Reveal>
        <div className="mt-10 grid gap-12 lg:grid-cols-2">
          <SkillGroup title={s("languages")} items={languages} loc={loc} levelLabel={s("level")} />
          <SkillGroup title={s("frameworks")} items={frameworks} loc={loc} levelLabel={s("level")} />
          <SkillGroup title={s("platforms")} items={platforms} loc={loc} levelLabel={s("level")} />
          <SkillGroup title={s("ads")} items={ads} loc={loc} levelLabel={s("level")} />
          <SkillGroup title={s("indexing")} items={indexing} loc={loc} levelLabel={s("level")} />
        </div>
        <div className="mt-8">
          <Link href="/skills" className="text-sm text-accent hover:underline">
            {s("viewAll")}
          </Link>
        </div>
      </section>

      <section className="container-page py-16">
        <Reveal>
          <p className="eyebrow">{s("platformsTitle")}</p>
          <h2 className="display mt-3 text-3xl font-bold sm:text-4xl">{s("mySites")}</h2>
        </Reveal>
        <ul className="mt-8 flex flex-wrap gap-2">
          {[...social, ...links.slice(0, 8)].map((item, i) => {
            const label =
              "labelEn" in item
                ? loc === "ar"
                  ? item.labelAr
                  : item.labelEn
                : "";
            return (
              <Reveal key={"id" in item ? item.id : i} delay={i * 0.03}>
                <li>
                  <a
                    href={item.url}
                    className="focus-ring inline-flex border border-border px-4 py-2.5 text-sm text-fg-muted transition hover:border-accent/45 hover:text-fg"
                    target={item.url.startsWith("http") ? "_blank" : undefined}
                    rel={item.url.startsWith("http") ? "noopener noreferrer" : undefined}
                  >
                    {label}
                  </a>
                </li>
              </Reveal>
            );
          })}
        </ul>
      </section>

      <ConsultCTA />

      <div className="mobile-cta-bar md:hidden">
        <Link href="/contact" className="btn btn-primary focus-ring !min-h-11 !text-sm" data-track="mobile-bar-consult">
          {t("ctaPrimary")}
        </Link>
        <Link href="/projects" className="btn btn-ghost focus-ring !min-h-11 !text-sm" data-track="mobile-bar-work">
          {t("ctaSecondary")}
        </Link>
      </div>
    </>
  );
}

function SkillGroup({
  title,
  items,
  loc,
  levelLabel,
}: {
  title: string;
  items: Awaited<ReturnType<typeof getPublishedSkills>>;
  loc: Locale;
  levelLabel: string;
}) {
  if (!items.length) return null;
  return (
    <Reveal>
      <h3 className="mb-5 text-lg font-semibold text-accent">{title}</h3>
      <div className="space-y-4">
        {items.slice(0, 7).map((skill) => (
          <div key={skill.id}>
            <div className="mb-2 flex items-center justify-between gap-3">
              <p className="font-medium">
                {loc === "ar" ? skill.nameAr : skill.nameEn}
              </p>
              <span className="text-xs text-fg-muted">
                {levelLabel} {skill.level}%
              </span>
            </div>
            <div className="h-[3px] overflow-hidden bg-bg-soft">
              <div className="h-full bg-accent" style={{ width: `${skill.level}%` }} />
            </div>
          </div>
        ))}
      </div>
    </Reveal>
  );
}
