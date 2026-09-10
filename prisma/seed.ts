import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { autoSeo } from "../src/lib/seo";

const prisma = new PrismaClient();

async function main() {
  const email = (process.env.ADMIN_EMAIL || "admin@devnour.com").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "Admin@123456";
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash, name: "Dev Nour Admin" },
  });

  // Clear content for a clean professional seed (keep admin user)
  await prisma.contactMessage.deleteMany();
  await prisma.siteLink.deleteMany();
  await prisma.socialLink.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.service.deleteMany();
  await prisma.project.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.siteSetting.deleteMany();

  await prisma.profile.create({
    data: {
      brandName: "Dev Nour",
      nameAr: "نور محمد",
      nameEn: "Nour Mohamed",
      titleAr: "مؤسس موديري ديجي · مطور Full-Stack وبناء منتجات",
      titleEn: "Founder of Mudiri Digi · Full-Stack & Product Builder",
      bioAr:
        "أبني أنظمة رقمية جاهزة للإنتاج: منصات B2B، متاجر إلكترونية، تطبيقات Flutter، ولوحات إدارة معقدة. أسّست موديري ديجي كشركتي لتطوير المنتجات الرقمية، وأسلّم حلول كاملة من المعمارية إلى الإطلاق والنمو (SEO · إعلانات · Pixels).",
      bioEn:
        "I build production-ready digital systems: B2B platforms, e-commerce stores, Flutter apps, and complex admin panels. I founded Mudiri Digi as my company for digital products — delivering end-to-end from architecture to launch and growth (SEO · ads · pixels).",
      locationAr: "مصر · عن بُعد",
      locationEn: "Egypt · Remote",
      email: "dev.nour.m@gmail.com",
      phone: "+201552114232",
      githubUrl: "https://github.com/nour0x",
    },
  });

  await prisma.siteSetting.create({
    data: {
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
      defaultMetaTitleAr: "Dev Nour — نور محمد | مؤسس موديري ديجي",
      defaultMetaTitleEn: "Dev Nour — Nour Mohamed | Founder of Mudiri Digi",
      defaultMetaDescAr:
        "بورتفوليو نور محمد — مؤسس موديري ديجي. منصات B2B، متاجر رقمية، Flutter، Laravel، SEO وإعلانات.",
      defaultMetaDescEn:
        "Portfolio of Nour Mohamed — founder of Mudiri Digi. B2B platforms, digital stores, Flutter, Laravel, SEO and ads.",
    },
  });

  // —— Projects from Case Study ——
  const talabyaatSeo = autoSeo({
    kind: "project",
    titleAr: "طلبيات · Talabyaat",
    titleEn: "Talabyaat · B2B Marketplace",
    summaryAr:
      "منصة B2B كاملة تربط تجار الجملة والتجزئة — 4 قنوات ويب + 3 تطبيقات Flutter من باكند Laravel واحد.",
    summaryEn:
      "Full B2B marketplace connecting wholesale and retail — 4 web channels + 3 Flutter apps on one Laravel backend.",
    slug: "talabyaat",
  });

  const moydeerSeo = autoSeo({
    kind: "project",
    titleAr: "مويدير · Moydeer",
    titleEn: "Moydeer · Online Store Platform",
    summaryAr:
      "منتج متجر إلكتروني متكامل تبيعه موديري ديجي للعملاء — ويب · أدمن · تطبيق · 40+ موديول. عميل حي: Mixy Mart.",
    summaryEn:
      "Complete online-store product sold by Mudiri Digi — web · admin · app · 40+ modules. Live client: Mixy Mart.",
    slug: "moydeer",
  });

  const mudiriStoreSeo = autoSeo({
    kind: "project",
    titleAr: "موديري ديجي ستور",
    titleEn: "Mudiri Digi Store",
    summaryAr:
      "نظام تجارة رقمية حي: متجر Laravel modular + تطبيق Flutter + صفحات هبوط ويندوز (مديري السنترال) + Marketplace.",
    summaryEn:
      "Live digital commerce system: modular Laravel store + Flutter app + Windows landing (Central POS) + Marketplace.",
    slug: "mudiri-digi-store",
  });

  const mixySeo = autoSeo({
    kind: "project",
    titleAr: "Mixy Mart",
    titleEn: "Mixy Mart",
    summaryAr:
      "متجر إنتاج حي مبني على مويدير — كتالوج، دفع، SEO، Google Merchant، وتطبيق موبايل.",
    summaryEn:
      "Live production store built on Moydeer — catalog, payments, SEO, Google Merchant, and mobile app.",
    slug: "mixy-mart",
  });

  await prisma.project.createMany({
    data: [
      {
        ...talabyaatSeo,
        titleAr: "طلبيات · Talabyaat",
        titleEn: "Talabyaat · B2B Marketplace",
        summaryAr:
          "منصة B2B كاملة تربط تجار الجملة والتجزئة — 4 قنوات ويب + 3 تطبيقات Flutter من باكند Laravel واحد.",
        summaryEn:
          "Full B2B marketplace connecting wholesale and retail — 4 web channels + 3 Flutter apps on one Laravel backend.",
        bodyAr: `التحدي: التجارة بين الجملة والتجزئة غالباً عبر واتساب بدون تتبع أو محفظة أو KYC.

الحل: نظام متعدد القنوات —
• Public · Retail · Wholesale · Admin (ويب)
• 3 تطبيقات Flutter مستقلة (Retail · Wholesale · Admin)
• Domain-Driven Design بـ 14 Bounded Context
• Module Kernel لتشغيل/إيقاف الفيتشرز
• Real-time عبر Laravel Reverb · FCM · SSL Pinning

مقاييس: ~455 ملف PHP · ~267 ملف Dart · 71 migration · 111+ اختبار · Production-ready على talabyaat.com`,
        bodyEn: `Challenge: Local wholesale–retail trade often runs on unstructured WhatsApp — no tracking, wallet, or KYC.

Solution: Multi-channel system —
• Public · Retail · Wholesale · Admin (web)
• 3 independent Flutter apps (Retail · Wholesale · Admin)
• Domain-Driven Design with 14 bounded contexts
• Module kernel for feature flags
• Real-time via Laravel Reverb · FCM · SSL pinning

Metrics: ~455 PHP files · ~267 Dart files · 71 migrations · 111+ tests · Production-ready at talabyaat.com`,
        tags: JSON.stringify(["Laravel 13", "Flutter", "B2B", "Reverb", "DDD", "PHP 8.4"]),
        githubUrl: "https://github.com/nour0x/talabyaat-case-study",
        demoUrl: "https://www.talabyaat.com",
        featured: true,
        sortOrder: 1,
      },
      {
        ...moydeerSeo,
        titleAr: "مويدير · Moydeer",
        titleEn: "Moydeer · Online Store Platform",
        summaryAr:
          "منتج متجر إلكتروني متكامل تبيعه موديري ديجي — ويب · أدمن · Flutter · موديولات قابلة للتفعيل.",
        summaryEn:
          "Complete online-store product sold by Mudiri Digi — web · admin · Flutter · toggleable modules.",
        bodyAr: `مويدير منتج SaaS/White-label للمتاجر: يُخصّص لكل عميل (اسم · دومين · ألوان · تطبيق) ويُسلّم جاهزاً على Hostinger أو VPS.

يشمل: كتالوج · طلبات · EasyKash · شحن · كوبونات · SEO · Pixels (Meta/TikTok/Snap/GA) · Google Merchant · Chatbot · مخزون وربح · 9+ ثيمات.

عميل منشور: Mixy Mart (mixy-mart.com).`,
        bodyEn: `Moydeer is a white-label store product: customized per client (name · domain · colors · app) and delivered ready on Hostinger or VPS.

Includes: catalog · orders · EasyKash · shipping · coupons · SEO · pixels (Meta/TikTok/Snap/GA) · Google Merchant · chatbot · inventory & profit · 9+ themes.

Live client: Mixy Mart (mixy-mart.com).`,
        tags: JSON.stringify(["Laravel 12", "Livewire", "Flutter", "E-commerce", "Modules"]),
        demoUrl: "https://mixy-mart.com",
        featured: true,
        sortOrder: 2,
      },
      {
        ...mudiriStoreSeo,
        titleAr: "موديري ديجي ستور",
        titleEn: "Mudiri Digi Store",
        summaryAr:
          "متجر رقمي حي لشركتي: منتجات رقمية · Marketplace · تطبيق Flutter · صفحة مديري السنترال (Windows POS).",
        summaryEn:
          "Live digital store for my company: digital products · marketplace · Flutter app · Central POS (Windows) landing.",
        bodyAr: `نظام من 4 طبقات: Laravel Store (20 Module) · Flutter App · Central Landing · Sales Landing.

Marketplace بعمولات وسحوبات، دفع EasyKash مع تحميل فوري، ومتجر ثنائي اللغة. مديري السنترال: كاشير كامل لمحلات السنترال مع بيع وتحميل .exe بعد الدفع.`,
        bodyEn: `Four-layer system: Laravel Store (20 modules) · Flutter app · Central landing · Sales landing.

Marketplace with commissions/withdrawals, EasyKash instant download, bilingual storefront. Central POS: full cashier system for phone shops with .exe delivery after payment.`,
        tags: JSON.stringify(["Laravel 13", "Flutter", "Marketplace", "EasyKash", "Windows"]),
        demoUrl: "https://mudiridigi.shop",
        featured: true,
        sortOrder: 3,
      },
      {
        ...mixySeo,
        titleAr: "Mixy Mart",
        titleEn: "Mixy Mart",
        summaryAr: "متجر إنتاج حي على منصة مويدير — SEO، Merchant feed، أدمن كامل وتطبيق.",
        summaryEn: "Live production store on Moydeer — SEO, merchant feed, full admin and mobile app.",
        bodyAr:
          "إطلاق عميل حقيقي على mixy-mart.com بهويته الخاصة: كتالوج، سلة، دفع، لوحة /admin، API، وsitemap/feeds جاهزة للفهرسة والإعلانات.",
        bodyEn:
          "Real client launch at mixy-mart.com with custom identity: catalog, cart, payments, /admin, API, and sitemap/feeds ready for indexing and ads.",
        tags: JSON.stringify(["Client", "E-commerce", "SEO", "Production"]),
        demoUrl: "https://mixy-mart.com",
        featured: true,
        sortOrder: 4,
      },
    ],
  });

  // —— Services ——
  const services = [
    {
      titleAr: "منصات ومarkt بليس",
      titleEn: "Platforms & Marketplaces",
      summaryAr: "بناء أنظمة متعددة القنوات (ويب + موبايل) بمنطق دومين واضح.",
      summaryEn: "Multi-channel systems (web + mobile) with clear domain architecture.",
      priceMin: 2500,
      priceAvg: 6000,
      priceMax: 15000,
    },
    {
      titleAr: "متاجر إلكترونية جاهزة للإطلاق",
      titleEn: "Launch-ready E-commerce",
      summaryAr: "متجر + أدمن + تطبيق + SEO + بيكسلز + دفع محلي.",
      summaryEn: "Store + admin + app + SEO + pixels + local payments.",
      priceMin: 1200,
      priceAvg: 2800,
      priceMax: 6500,
    },
    {
      titleAr: "تطبيقات Flutter إنتاجية",
      titleEn: "Production Flutter Apps",
      summaryAr: "تطبيقات أندرويد/iOS مع FCM، تأمين، وربط API.",
      summaryEn: "Android/iOS apps with FCM, hardening, and API integration.",
      priceMin: 900,
      priceAvg: 2200,
      priceMax: 5000,
    },
    {
      titleAr: "SEO · GEO · إعلانات",
      titleEn: "SEO · GEO · Ads Setup",
      summaryAr: "فهرسة قوية، schema، pixels، وتهيئة حملات النمو.",
      summaryEn: "Strong indexing, schema, pixels, and growth campaign setup.",
      priceMin: 400,
      priceAvg: 900,
      priceMax: 2500,
    },
  ];

  for (const [i, svc] of services.entries()) {
    const seo = autoSeo({
      kind: "service",
      titleAr: svc.titleAr,
      titleEn: svc.titleEn,
      summaryAr: svc.summaryAr,
      summaryEn: svc.summaryEn,
    });
    await prisma.service.create({
      data: {
        ...seo,
        ...svc,
        bodyAr: svc.summaryAr,
        bodyEn: svc.summaryEn,
        currency: "USD",
        sortOrder: i + 1,
      },
    });
  }

  // —— Experience / Jobs ——
  await prisma.experience.createMany({
    data: [
      {
        companyAr: "موديري ديجي · Mudiri Digi",
        companyEn: "Mudiri Digi",
        roleAr: "مؤسس ومطور رئيسي",
        roleEn: "Founder & Lead Developer",
        descriptionAr:
          "تأسيس الشركة وبناء منتجاتها: متجر موديري ديجي، مويدير للعملاء، طلبيات B2B، صفحات هبوط ويندوز، وتطبيقات Flutter. إدارة التسليم، المعمارية، SEO، والإعلانات.",
        descriptionEn:
          "Founded the company and built its products: Mudiri Digi Store, Moydeer for clients, Talabyaat B2B, Windows landings, and Flutter apps. Owning delivery, architecture, SEO, and ads.",
        locationAr: "مصر · عن بُعد",
        locationEn: "Egypt · Remote",
        startDate: "2022",
        current: true,
        sortOrder: 1,
      },
      {
        companyAr: "طلبيات · Talabyaat",
        companyEn: "Talabyaat",
        roleAr: "Architect & Full-Stack Lead",
        roleEn: "Architect & Full-Stack Lead",
        descriptionAr:
          "قيادة تصميم وتنفيذ منصة B2B متعددة القنوات: Laravel Domain Services، 3 تطبيقات Flutter، محفظة، عمولات، KYC، Real-time، وخطوط إنتاج الإطلاق.",
        descriptionEn:
          "Led design and build of a multi-channel B2B platform: Laravel domain services, 3 Flutter apps, wallet, commissions, KYC, real-time, and release pipelines.",
        locationAr: "مصر",
        locationEn: "Egypt",
        startDate: "2024",
        endDate: "2026",
        current: true,
        sortOrder: 2,
      },
      {
        companyAr: "عملاء موديري ديجي (متاجر)",
        companyEn: "Mudiri Digi Clients (Stores)",
        roleAr: "تطوير وتسليم متاجر إنتاجية",
        roleEn: "Production Store Delivery",
        descriptionAr:
          "تخصيص وتسليم متاجر مويدير لعملاء مثل Mixy Mart: هوية، دومين، أدمن، تطبيق، SEO، Google Merchant، وبيكسلز الإعلانات.",
        descriptionEn:
          "Customized and shipped Moydeer stores for clients such as Mixy Mart: identity, domain, admin, app, SEO, Google Merchant, and ad pixels.",
        locationAr: "عن بُعد",
        locationEn: "Remote",
        startDate: "2023",
        current: true,
        sortOrder: 3,
      },
      {
        companyAr: "عمل حر · Digital Products",
        companyEn: "Freelance · Digital Products",
        roleAr: "مطور ويب وموبايل",
        roleEn: "Web & Mobile Developer",
        descriptionAr:
          "بناء مواقع ولوحات تحكم وتطبيقات لعملاء محليين، مع تركيز على الأداء، الأمان، والتحويل.",
        descriptionEn:
          "Built websites, admin panels, and apps for local clients — focused on performance, security, and conversion.",
        locationAr: "عن بُعد",
        locationEn: "Remote",
        startDate: "2020",
        endDate: "2022",
        current: false,
        sortOrder: 4,
      },
    ],
  });

  // —— Skills: languages, frameworks, ads ——
  const skills: Array<{
    nameAr: string;
    nameEn: string;
    categoryAr: string;
    categoryEn: string;
    level: number;
    sortOrder: number;
  }> = [
    // Languages
    { nameAr: "PHP", nameEn: "PHP", categoryAr: "لغات البرمجة", categoryEn: "Languages", level: 95, sortOrder: 1 },
    { nameAr: "Dart", nameEn: "Dart", categoryAr: "لغات البرمجة", categoryEn: "Languages", level: 90, sortOrder: 2 },
    { nameAr: "TypeScript", nameEn: "TypeScript", categoryAr: "لغات البرمجة", categoryEn: "Languages", level: 88, sortOrder: 3 },
    { nameAr: "JavaScript", nameEn: "JavaScript", categoryAr: "لغات البرمجة", categoryEn: "Languages", level: 90, sortOrder: 4 },
    { nameAr: "SQL", nameEn: "SQL", categoryAr: "لغات البرمجة", categoryEn: "Languages", level: 88, sortOrder: 5 },
    { nameAr: "HTML / CSS", nameEn: "HTML / CSS", categoryAr: "لغات البرمجة", categoryEn: "Languages", level: 92, sortOrder: 6 },
    { nameAr: "Python", nameEn: "Python", categoryAr: "لغات البرمجة", categoryEn: "Languages", level: 70, sortOrder: 7 },
    // Frameworks / Stack
    { nameAr: "Laravel", nameEn: "Laravel", categoryAr: "أطر العمل", categoryEn: "Frameworks", level: 96, sortOrder: 10 },
    { nameAr: "Flutter", nameEn: "Flutter", categoryAr: "أطر العمل", categoryEn: "Frameworks", level: 90, sortOrder: 11 },
    { nameAr: "Next.js", nameEn: "Next.js", categoryAr: "أطر العمل", categoryEn: "Frameworks", level: 86, sortOrder: 12 },
    { nameAr: "Livewire", nameEn: "Livewire", categoryAr: "أطر العمل", categoryEn: "Frameworks", level: 85, sortOrder: 13 },
    { nameAr: "Tailwind CSS", nameEn: "Tailwind CSS", categoryAr: "أطر العمل", categoryEn: "Frameworks", level: 92, sortOrder: 14 },
    { nameAr: "Prisma / Eloquent", nameEn: "Prisma / Eloquent", categoryAr: "أطر العمل", categoryEn: "Frameworks", level: 88, sortOrder: 15 },
    { nameAr: "Domain-Driven Design", nameEn: "Domain-Driven Design", categoryAr: "أطر العمل", categoryEn: "Frameworks", level: 90, sortOrder: 16 },
    // Ads & Growth
    { nameAr: "Meta Ads (Facebook/Instagram)", nameEn: "Meta Ads (Facebook/Instagram)", categoryAr: "إعلانات ونمو", categoryEn: "Ads & Growth", level: 88, sortOrder: 20 },
    { nameAr: "Google Ads", nameEn: "Google Ads", categoryAr: "إعلانات ونمو", categoryEn: "Ads & Growth", level: 82, sortOrder: 21 },
    { nameAr: "TikTok Ads", nameEn: "TikTok Ads", categoryAr: "إعلانات ونمو", categoryEn: "Ads & Growth", level: 80, sortOrder: 22 },
    { nameAr: "Snapchat Ads", nameEn: "Snapchat Ads", categoryAr: "إعلانات ونمو", categoryEn: "Ads & Growth", level: 75, sortOrder: 23 },
    { nameAr: "Google Merchant / Shopping", nameEn: "Google Merchant / Shopping", categoryAr: "إعلانات ونمو", categoryEn: "Ads & Growth", level: 90, sortOrder: 24 },
    { nameAr: "SEO / GEO / AEO", nameEn: "SEO / GEO / AEO", categoryAr: "إعلانات ونمو", categoryEn: "Ads & Growth", level: 94, sortOrder: 25 },
    { nameAr: "Pixels & Analytics (GA4/GTM)", nameEn: "Pixels & Analytics (GA4/GTM)", categoryAr: "إعلانات ونمو", categoryEn: "Ads & Growth", level: 90, sortOrder: 26 },
    { nameAr: "Conversion & Funnel Setup", nameEn: "Conversion & Funnel Setup", categoryAr: "إعلانات ونمو", categoryEn: "Ads & Growth", level: 86, sortOrder: 27 },
  ];

  await prisma.skill.createMany({ data: skills });

  await prisma.socialLink.createMany({
    data: [
      {
        platform: "github",
        labelAr: "GitHub",
        labelEn: "GitHub",
        url: "https://github.com/nour0x",
        icon: "github",
        sortOrder: 1,
      },
      {
        platform: "email",
        labelAr: "البريد",
        labelEn: "Email",
        url: "mailto:dev.nour.m@gmail.com",
        sortOrder: 2,
      },
      {
        platform: "whatsapp",
        labelAr: "واتساب",
        labelEn: "WhatsApp",
        url: "https://wa.me/201552114232",
        sortOrder: 3,
      },
      {
        platform: "mudiri",
        labelAr: "موديري ديجي",
        labelEn: "Mudiri Digi",
        url: "https://mudiridigi.com",
        sortOrder: 4,
      },
      {
        platform: "shop",
        labelAr: "متجر موديري",
        labelEn: "Mudiri Shop",
        url: "https://mudiridigi.shop",
        sortOrder: 5,
      },
    ],
  });

  await prisma.siteLink.createMany({
    data: [
      { labelAr: "طلبيات", labelEn: "Talabyaat", url: "https://www.talabyaat.com", category: "products", sortOrder: 1 },
      { labelAr: "Mixy Mart", labelEn: "Mixy Mart", url: "https://mixy-mart.com", category: "clients", sortOrder: 2 },
      { labelAr: "موديري ديجي", labelEn: "Mudiri Digi", url: "https://mudiridigi.com", category: "company", sortOrder: 3 },
      { labelAr: "متجر موديري", labelEn: "Mudiri Shop", url: "https://mudiridigi.shop", category: "company", sortOrder: 4 },
      { labelAr: "Case Study · طلبيات", labelEn: "Talabyaat Case Study", url: "https://github.com/nour0x/talabyaat-case-study", category: "dev", sortOrder: 5 },
      { labelAr: "GitHub", labelEn: "GitHub", url: "https://github.com/nour0x", category: "dev", sortOrder: 6 },
    ],
  });

  console.log("Professional seed complete.");
  console.log(`Admin: ${email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
