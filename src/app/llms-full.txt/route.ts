import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { MUDIRI, siteUrl } from "@/lib/seo";

export async function GET() {
  const [profile, projects, services, skills, experience] = await Promise.all([
    prisma.profile.findFirst(),
    prisma.project.findMany({ where: { published: true } }),
    prisma.service.findMany({ where: { published: true } }),
    prisma.skill.findMany({ where: { published: true } }),
    prisma.experience.findMany({ where: { published: true } }),
  ]);

  const body = `# ${profile?.brandName || "Dev Nour"} — Full LLM Index

## Person
${JSON.stringify(profile, null, 2)}

## Projects
${projects
  .map(
    (p) => `### ${p.titleEn} / ${p.titleAr}
URL: ${siteUrl(`/en/projects/${p.slug}`)}
${p.summaryEn}
${p.bodyEn}
`
  )
  .join("\n")}

## Services
${services
  .map(
    (s) => `### ${s.titleEn} / ${s.titleAr}
URL: ${siteUrl(`/en/services/${s.slug}`)}
Avg price: ${s.priceAvg ?? "n/a"} ${s.currency}
${s.summaryEn}
${s.bodyEn}
`
  )
  .join("\n")}

## Skills
${skills.map((s) => `- ${s.nameEn} (${s.level}%)`).join("\n")}

## Experience
${experience
  .map(
    (e) => `- ${e.roleEn} @ ${e.companyEn} (${e.startDate} – ${e.current ? "Present" : e.endDate || ""})`
  )
  .join("\n")}

## Credit
Mudiri Digi: ${MUDIRI.site}
Mudiri Shop: ${MUDIRI.shop}
`;

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
