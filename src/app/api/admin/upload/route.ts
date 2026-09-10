import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { jsonError, jsonOk, requireAdminApi } from "@/lib/api";
import { rateLimit } from "@/lib/security";
import { getUploadsDir, mediaUrl } from "@/lib/uploads";

const IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);
const HTML_TYPES = new Set(["text/html", "application/octet-stream"]);
const MAX_IMAGE = 5 * 1024 * 1024;
const MAX_HTML = 200 * 1024;

export async function POST(request: Request) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "local";
  const limited = rateLimit(`upload:${ip}`, 30, 60_000);
  if (!limited.ok) return jsonError("Too many uploads", 429);

  const form = await request.formData();
  const file = form.get("file");
  const kind = String(form.get("kind") || "image");
  if (!(file instanceof File)) return jsonError("Missing file", 400);

  if (kind === "google-verification") {
    const name = file.name.toLowerCase();
    if (!name.startsWith("google") || !name.endsWith(".html")) {
      return jsonError("File must be googleXXXX.html", 400);
    }
    if (file.size > MAX_HTML) return jsonError("Verification file too large", 400);
    const safeName = name.replace(/[^a-z0-9._-]/g, "");
    const dir = path.join(process.cwd(), "public");
    await mkdir(dir, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(dir, safeName), buffer);
    return jsonOk({
      url: `/${safeName}`,
      filename: safeName,
      html: buffer.toString("utf8"),
    });
  }

  if (!IMAGE_TYPES.has(file.type)) return jsonError("Only image files are allowed", 400);
  if (file.size > MAX_IMAGE) return jsonError("File too large (max 5MB)", 400);

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const safeExt = ["jpg", "jpeg", "png", "webp", "gif"].includes(ext) ? ext : "jpg";
  const name = `${Date.now()}-${Math.random().toString(36).slice(2)}.${safeExt}`;
  const dir = getUploadsDir();
  await mkdir(dir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, name), buffer);

  if (process.env.UPLOAD_DIR) {
    try {
      const publicDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(publicDir, { recursive: true });
      await writeFile(path.join(publicDir, name), buffer);
    } catch {
      /* ignore */
    }
  }

  return jsonOk({ url: mediaUrl(name), filename: name });
}
