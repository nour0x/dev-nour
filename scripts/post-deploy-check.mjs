/**
 * Hostinger post-deploy checklist runner (print + optional local checks).
 * Usage: node scripts/post-deploy-check.mjs
 */
const site = (process.env.NEXT_PUBLIC_SITE_URL || "https://dev.mudiridigi.com").replace(
  /\/$/,
  ""
);

const checks = [
  `${site}/ar`,
  `${site}/en`,
  `${site}/sitemap.xml`,
  `${site}/robots.txt`,
  `${site}/llms.txt`,
  `${site}/llms-full.txt`,
  `${site}/icon`,
  `${site}/manifest.webmanifest`,
  `${site}/admin/login`,
];

console.log("=== Dev Nour post-deploy checklist ===\n");
console.log("Env required on Hostinger:");
console.log('  DATABASE_URL="file:/home/u194449289/domains/dev.mudiridigi.com/data/prod.db"');
console.log('  UPLOAD_DIR="/home/u194449289/domains/dev.mudiridigi.com/data/uploads"');
console.log(`  NEXT_PUBLIC_SITE_URL="${site}"`);
console.log("  JWT_SECRET=<long random>");
console.log("  ADMIN_EMAIL / ADMIN_PASSWORD (seed only)\n");

console.log("SSH once:");
console.log("  mkdir -p ~/domains/dev.mudiridigi.com/data/uploads");
console.log("  cd ~/domains/dev.mudiridigi.com/hbuilds/last-source");
console.log("  export DATABASE_URL=...");
console.log("  npx prisma db push");
console.log("  npx tsx prisma/seed-skills.ts   # safe upsert");
console.log("  node scripts/backup.mjs\n");

console.log("URLs to verify:");
for (const u of checks) console.log("  -", u);

console.log("\nAdmin:");
console.log("  1) Settings → upload avatar, set age + yearsExperience");
console.log("  2) siteUrl =", site);
console.log("  3) Google verification meta/file");
console.log("  4) GSC → submit sitemap.xml");
console.log("  5) PageSpeed Insights Desktop + Mobile → record scores");
