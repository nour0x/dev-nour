import { readFile } from "fs/promises";
import path from "path";
import { resolveUploadPath, safeUploadName } from "@/lib/uploads";

const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

export async function GET(
  _request: Request,
  context: { params: Promise<{ filename: string }> }
) {
  const { filename } = await context.params;
  const safe = safeUploadName(filename);
  if (!safe || safe !== filename.replace(/[/\\]/g, "")) {
    return new Response("Not found", { status: 404 });
  }

  const filePath = await resolveUploadPath(safe);
  if (!filePath) return new Response("Not found", { status: 404 });

  const buffer = await readFile(filePath);
  const ext = path.extname(safe).toLowerCase();
  return new Response(buffer, {
    headers: {
      "Content-Type": MIME[ext] || "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
