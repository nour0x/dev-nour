/**
 * Backup SQLite DB + uploads to ./backups/<timestamp>/
 * Usage: node scripts/backup.mjs
 * Env: DATABASE_URL, UPLOAD_DIR (optional)
 */
import { cpSync, existsSync, mkdirSync, copyFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

function resolveDbFile() {
  const url = process.env.DATABASE_URL || "file:./dev.db";
  const raw = url.replace(/^file:/, "");
  if (path.isAbsolute(raw)) return raw;
  // Prisma resolves relative SQLite paths from prisma/
  return path.resolve(root, "prisma", raw.replace(/^\.\//, ""));
}

function resolveUploads() {
  if (process.env.UPLOAD_DIR) return process.env.UPLOAD_DIR;
  return path.join(root, "public", "uploads");
}

const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const outDir = path.join(root, "backups", stamp);
mkdirSync(outDir, { recursive: true });

const dbFile = resolveDbFile();
if (existsSync(dbFile)) {
  copyFileSync(dbFile, path.join(outDir, path.basename(dbFile)));
  console.log("DB backed up:", dbFile);
} else {
  console.warn("DB not found:", dbFile);
}

const uploads = resolveUploads();
if (existsSync(uploads)) {
  cpSync(uploads, path.join(outDir, "uploads"), { recursive: true });
  console.log("Uploads backed up:", uploads);
} else {
  console.warn("Uploads dir not found:", uploads);
}

console.log("Backup complete →", outDir);
