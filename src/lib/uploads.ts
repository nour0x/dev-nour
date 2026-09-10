import { access } from "fs/promises";
import path from "path";

export function getUploadsDir() {
  const custom = process.env.UPLOAD_DIR?.trim();
  if (custom) return custom;
  return path.join(process.cwd(), "public", "uploads");
}

export function safeUploadName(name: string) {
  return path.basename(name).replace(/[^a-zA-Z0-9._-]/g, "");
}

export async function resolveUploadPath(filename: string) {
  const safe = safeUploadName(filename);
  if (!safe) return null;

  const candidates = [
    path.join(getUploadsDir(), safe),
    path.join(process.cwd(), "public", "uploads", safe),
  ];

  for (const candidate of candidates) {
    try {
      await access(candidate);
      return candidate;
    } catch {
      /* try next */
    }
  }
  return null;
}

export function mediaUrl(filename: string) {
  return `/api/media/${safeUploadName(filename)}`;
}
