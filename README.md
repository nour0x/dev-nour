# Dev Nour Portfolio

Bilingual (AR/EN) personal portfolio for **Nour Mohamed / Dev Nour** with a full admin panel, auto SEO, and Hostinger-ready Next.js deployment.

## Stack

- Next.js (App Router)
- Prisma + SQLite
- next-intl (auto locale detection)
- JWT admin auth (httpOnly cookie)
- Framer Motion + Tailwind CSS

## Quick start

```bash
npm install
cp .env.example .env
npm run db:setup
npm run dev
```

- Site: http://localhost:3000 (auto-redirects to `/ar` or `/en`)
- Admin: http://localhost:3000/admin/login

Default admin (from `.env`):

- Email: `admin@devnour.com`
- Password: `Admin@123456` (change in production)

## Admin features

- Projects, services/activities, experience, skills
- Social + link hub
- Contact inbox
- Profile + SEO defaults
- Media upload (`/public/uploads`)
- Auto SEO fields (slug, titles, descriptions, keywords) on save

## SEO / AI

- `/sitemap.xml`
- `/robots.txt` (allows major AI crawlers)
- `/llms.txt` and `/llms-full.txt`
- JSON-LD Person / WebSite / Organization
- hreflang for `ar` / `en` / `x-default`
- Locked Mudiri Digi credit in footer + schema `sameAs` + sitemap

## Hostinger deploy

1. Create a Node.js app / website that supports Next.js.
2. Connect Git: `https://github.com/nour0x/dev-nour` branch `main`.
3. Set environment variables from `.env.example` (use a strong `JWT_SECRET` and your live domain in `NEXT_PUBLIC_SITE_URL`).
4. Build command (already includes DB create):

```bash
npm ci && npm run build
```

5. After first successful build, seed content once:

```bash
npx tsx prisma/seed.ts
npx tsx prisma/seed-expand.ts
```

6. Start command: `npm start`
7. Persist `prisma/*.db` and `public/uploads` between deploys.

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Local development |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run db:setup` | Push schema + seed |
| `npm run db:seed` | Re-seed admin/content |

## Security notes

- Admin routes protected by middleware + JWT cookie
- Zod validation on APIs
- Rate limits on login, contact, uploads
- Security headers on responses
- Upload MIME/size whitelist
