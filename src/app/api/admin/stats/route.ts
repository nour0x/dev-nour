import { revalidatePath } from "next/cache";
import { jsonError, jsonOk, requireAdminApi } from "@/lib/api";
import { prisma } from "@/lib/db";

export async function GET() {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  const [projects, services, messages, unread, skills, experience] =
    await Promise.all([
      prisma.project.count(),
      prisma.service.count(),
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { read: false } }),
      prisma.skill.count(),
      prisma.experience.count(),
    ]);

  return jsonOk({
    projects,
    services,
    messages,
    unread,
    skills,
    experience,
  });
}

export async function POST() {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;
  revalidatePath("/", "layout");
  return jsonOk({ revalidated: true });
}
