/**
 * Expand seed content without rewriting projects.
 * Run: npx tsx prisma/seed-expand.ts
 */
import { PrismaClient } from "@prisma/client";
import { autoSeo } from "../src/lib/seo";

const prisma = new PrismaClient();

async function main() {
  await prisma.siteLink.deleteMany();
  await prisma.socialLink.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.service.deleteMany();

  const profile = await prisma.profile.findFirst();
  if (profile) {
    await prisma.profile.update({
      where: { id: profile.id },
      data: {
        titleAr: "مؤسس موديري ديجي · Full-Stack · منتجات ومتاجر",
        titleEn: "Founder of Mudiri Digi · Full-Stack · Products & Stores",
        bioAr:
          "أبني وأطلق منتجات رقمية جاهزة للسوق: تطبيقات أندرويد وويب وiOS، متاجر إلكترونية، منتجات رقمية، أنظمة إدارية، CRM وERP. أسّست موديري ديجي كشركتي، وكمان بخصص Easy Orders وShopify وWordPress وصفحات هبوط تحويل عالية — مع SEO وإعلانات من أول يوم.",
        bioEn:
          "I design and ship market-ready digital products: Android, web, and iOS apps, e-commerce, digital goods, admin systems, CRM, and ERP. I founded Mudiri Digi as my company, and I also customize Easy Orders, Shopify, WordPress, and high-converting landings — with SEO and ads from day one.",
        yearsExperience: 5,
        // Set age + avatar in Admin → Settings
      },
    });
  }

  const services = [
    ["تطبيقات أندرويد", "Android Apps", "تطبيقات أندرويد جاهزة للمتجر مع إشعارات وتأمين.", "Launch-ready Android apps with push and hardening.", 800, 2000, 4500],
    ["تطبيقات ويب و iOS", "Web & iOS Apps", "تجارب ويب سريعة وتطبيقات iOS على نفس الـ API.", "Fast web apps and iOS clients on a shared API.", 1000, 2500, 5500],
    ["مواقع ويب احترافية", "Professional Websites", "مواقع ثنائية اللغة سريعة ومحسّنة للفهرسة.", "Bilingual, fast sites built for indexing.", 400, 1200, 3000],
    ["متاجر إلكترونية", "E-commerce Stores", "متجر كامل: كتالوج، دفع، أدمن، SEO، وبيكسلز.", "Full store: catalog, payments, admin, SEO, pixels.", 900, 2500, 6000],
    ["منتجات رقمية", "Digital Products", "بيع ملفات/برامج مع دفع وتحميل فوري آمن.", "Sell files/software with secure instant download.", 700, 1800, 4000],
    ["أنظمة إدارية", "Admin Systems", "لوحات صلاحيات، تقارير، وسير عمل يومي.", "Permissioned dashboards, reports, and ops workflows.", 1000, 2800, 7000],
    ["أنظمة CRM", "CRM Systems", "عملاء، متابعات، وصفقات من لوحة واحدة.", "Customers, follow-ups, and deals in one panel.", 1200, 3200, 8000],
    ["أنظمة ERP", "ERP Systems", "مخزون، مبيعات، مشتريات، وتقارير مترابطة.", "Inventory, sales, purchasing, and linked reports.", 2500, 7000, 18000],
    ["تخصيص Easy Orders", "Easy Orders Customization", "تخصيص المتجر وبناء تجربة بيع أوضح.", "Customize the store and sharpen the selling experience.", 150, 450, 1200],
    ["صفحات هبوط Easy Orders", "Easy Orders Landing Pages", "هبوط موبايل يركز على الطلب والتحويل.", "Mobile landings focused on orders and conversion.", 80, 250, 700],
    ["تخصيص Shopify", "Shopify Customization", "ثيمات، أقسام، تكاملات، وتحسين الشراء.", "Themes, sections, integrations, checkout UX.", 200, 700, 2500],
    ["WordPress / WooCommerce", "WordPress / WooCommerce", "مواقع ومتاجر مرتبة وسريعة وسهلة الإدارة.", "Clean, fast sites and stores that stay easy to manage.", 200, 650, 2200],
    ["منصات ومarkt بليس", "Platforms & Marketplaces", "أنظمة متعددة القنوات (ويب + موبايل).", "Multi-channel platforms (web + mobile).", 2500, 6000, 15000],
    ["SEO · GEO · إعلانات", "SEO · GEO · Ads Setup", "فهرسة، schema، بيكسلز، وتهيئة حملات.", "Indexing, schema, pixels, and campaign setup.", 300, 900, 2500],
  ] as const;

  for (const [i, [titleAr, titleEn, summaryAr, summaryEn, priceMin, priceAvg, priceMax]] of services.entries()) {
    const seo = autoSeo({ kind: "service", titleAr, titleEn, summaryAr, summaryEn });
    await prisma.service.create({
      data: {
        ...seo,
        titleAr,
        titleEn,
        summaryAr,
        summaryEn,
        bodyAr: `${summaryAr}\n\nتقدر تبدأ باستشارة مجانية قصيرة نحدد فيها النطاق والتكلفة.`,
        bodyEn: `${summaryEn}\n\nStart with a short free consult to lock scope and budget.`,
        priceMin,
        priceAvg,
        priceMax,
        currency: "USD",
        sortOrder: i + 1,
      },
    });
  }

  await prisma.experience.createMany({
    data: [
      {
        companyAr: "موديري ديجي",
        companyEn: "Mudiri Digi",
        roleAr: "مؤسس ومطور رئيسي",
        roleEn: "Founder & Lead Developer",
        descriptionAr:
          "أسّست شركتي وبنيت منتجاتها: المتجر الرقمي، مويدير، صفحات هبوط ويندوز، وتطبيقات Flutter — من الفكرة للإطلاق والنمو.",
        descriptionEn:
          "Founded my company and built its products: digital store, Moydeer, Windows landings, and Flutter apps — from idea to launch and growth.",
        locationAr: "مصر · عن بُعد",
        locationEn: "Egypt · Remote",
        startDate: "2022",
        current: true,
        sortOrder: 1,
      },
      {
        companyAr: "طلبيات",
        companyEn: "Talabyaat",
        roleAr: "Architect & Full-Stack Lead",
        roleEn: "Architect & Full-Stack Lead",
        descriptionAr:
          "قدت منصة B2B متعددة القنوات: Laravel + 3 تطبيقات Flutter + محفظة وعمولات وKYC وReal-time.",
        descriptionEn:
          "Led a multi-channel B2B platform: Laravel + 3 Flutter apps + wallet, commissions, KYC, and real-time.",
        locationAr: "مصر",
        locationEn: "Egypt",
        startDate: "2024",
        current: true,
        sortOrder: 2,
      },
      {
        companyAr: "عملاء موديري ديجي",
        companyEn: "Mudiri Digi Clients",
        roleAr: "تسليم متاجر وتخصيص منصات",
        roleEn: "Store delivery & platform customization",
        descriptionAr:
          "متاجر إنتاج مثل Mixy Mart، وتخصيص Easy Orders / Shopify / WordPress مع SEO وبيكسلز.",
        descriptionEn:
          "Live stores like Mixy Mart, plus Easy Orders / Shopify / WordPress customization with SEO and pixels.",
        locationAr: "عن بُعد",
        locationEn: "Remote",
        startDate: "2023",
        current: true,
        sortOrder: 3,
      },
      {
        companyAr: "عمل حر",
        companyEn: "Freelance",
        roleAr: "مطور ويب وموبايل",
        roleEn: "Web & Mobile Developer",
        descriptionAr: "مواقع ولوحات وأنظمة لعملاء محليين — سرعة، أمان، وتحويل.",
        descriptionEn: "Sites, panels, and systems for local clients — speed, security, conversion.",
        locationAr: "عن بُعد",
        locationEn: "Remote",
        startDate: "2020",
        endDate: "2022",
        current: false,
        sortOrder: 4,
      },
    ],
  });

  const skills = [
    ["PHP", "PHP", "لغات البرمجة", "Languages", 95],
    ["Dart", "Dart", "لغات البرمجة", "Languages", 90],
    ["TypeScript", "TypeScript", "لغات البرمجة", "Languages", 88],
    ["JavaScript", "JavaScript", "لغات البرمجة", "Languages", 90],
    ["SQL", "SQL", "لغات البرمجة", "Languages", 88],
    ["HTML / CSS", "HTML / CSS", "لغات البرمجة", "Languages", 92],
    ["Python", "Python", "لغات البرمجة", "Languages", 70],
    ["Laravel", "Laravel", "أطر وتقنيات", "Frameworks", 96],
    ["Flutter (Android / iOS)", "Flutter (Android / iOS)", "أطر وتقنيات", "Frameworks", 90],
    ["Next.js", "Next.js", "أطر وتقنيات", "Frameworks", 86],
    ["React", "React", "أطر وتقنيات", "Frameworks", 84],
    ["Livewire", "Livewire", "أطر وتقنيات", "Frameworks", 85],
    ["Tailwind CSS", "Tailwind CSS", "أطر وتقنيات", "Frameworks", 92],
    ["REST APIs / Sanctum", "REST APIs / Sanctum", "أطر وتقنيات", "Frameworks", 92],
    ["Firebase / FCM", "Firebase / FCM", "أطر وتقنيات", "Frameworks", 85],
    ["DDD / Modular Architecture", "DDD / Modular Architecture", "أطر وتقنيات", "Frameworks", 90],
    ["Easy Orders", "Easy Orders", "منصات وتخصيص", "Platforms", 92],
    ["Shopify", "Shopify", "منصات وتخصيص", "Platforms", 80],
    ["WordPress / WooCommerce", "WordPress / WooCommerce", "منصات وتخصيص", "Platforms", 85],
    ["صفحات هبوط تحويلية", "Conversion landings", "منصات وتخصيص", "Platforms", 90],
    ["Hostinger / VPS", "Hostinger / VPS", "منصات وتخصيص", "Platforms", 88],
    ["Meta Ads", "Meta Ads", "إعلانات ونمو", "Ads & Growth", 88],
    ["Google Ads", "Google Ads", "إعلانات ونمو", "Ads & Growth", 82],
    ["TikTok Ads", "TikTok Ads", "إعلانات ونمو", "Ads & Growth", 80],
    ["Snapchat Ads", "Snapchat Ads", "إعلانات ونمو", "Ads & Growth", 75],
    ["Google Merchant", "Google Merchant", "إعلانات ونمو", "Ads & Growth", 90],
    ["SEO / GEO / AEO", "SEO / GEO / AEO", "إعلانات ونمو", "Ads & Growth", 94],
    ["Pixels · GA4 · GTM", "Pixels · GA4 · GTM", "إعلانات ونمو", "Ads & Growth", 90],
    ["Agentic SEO (AEO)", "Agentic SEO (AEO)", "فهرسة وذكاء", "Indexing & AI", 92],
    ["llms.txt · AI crawlers", "llms.txt · AI crawlers", "فهرسة وذكاء", "Indexing & AI", 90],
    ["JSON-LD / Schema.org", "JSON-LD / Schema.org", "فهرسة وذكاء", "Indexing & AI", 93],
    ["Core Web Vitals", "Core Web Vitals", "فهرسة وذكاء", "Indexing & AI", 88],
    ["next-intl i18n", "next-intl i18n", "فهرسة وذكاء", "Indexing & AI", 90],
    ["Prisma + SQLite", "Prisma + SQLite", "فهرسة وذكاء", "Indexing & AI", 88],
    ["First-party analytics", "First-party analytics", "فهرسة وذكاء", "Indexing & AI", 86],
    ["Lighthouse / CWV tuning", "Lighthouse / CWV tuning", "فهرسة وذكاء", "Indexing & AI", 85],
  ] as const;

  await prisma.skill.createMany({
    data: skills.map(([nameAr, nameEn, categoryAr, categoryEn, level], i) => ({
      nameAr,
      nameEn,
      categoryAr,
      categoryEn,
      level,
      sortOrder: i + 1,
    })),
  });

  await prisma.socialLink.createMany({
    data: [
      { platform: "github", labelAr: "GitHub", labelEn: "GitHub", url: "https://github.com/nour0x", sortOrder: 1 },
      { platform: "email", labelAr: "البريد", labelEn: "Email", url: "mailto:dev.nour.m@gmail.com", sortOrder: 2 },
      { platform: "whatsapp", labelAr: "واتساب", labelEn: "WhatsApp", url: "https://wa.me/201552114232", sortOrder: 3 },
      { platform: "mudiri", labelAr: "موديري ديجي", labelEn: "Mudiri Digi", url: "https://mudiridigi.com", sortOrder: 4 },
      { platform: "shop", labelAr: "متجر موديري", labelEn: "Mudiri Shop", url: "https://mudiridigi.shop", sortOrder: 5 },
      { platform: "linkedin", labelAr: "لينكدإن", labelEn: "LinkedIn", url: "https://www.linkedin.com/", sortOrder: 6 },
      { platform: "facebook", labelAr: "فيسبوك", labelEn: "Facebook", url: "https://www.facebook.com/", sortOrder: 7 },
      { platform: "instagram", labelAr: "إنستجرام", labelEn: "Instagram", url: "https://www.instagram.com/", sortOrder: 8 },
      { platform: "x", labelAr: "إكس", labelEn: "X", url: "https://x.com/", sortOrder: 9 },
      { platform: "youtube", labelAr: "يوتيوب", labelEn: "YouTube", url: "https://www.youtube.com/", sortOrder: 10 },
      { platform: "tiktok", labelAr: "تيك توك", labelEn: "TikTok", url: "https://www.tiktok.com/", sortOrder: 11 },
      { platform: "fiverr", labelAr: "Fiverr", labelEn: "Fiverr", url: "https://www.fiverr.com/", sortOrder: 12 },
      { platform: "upwork", labelAr: "Upwork", labelEn: "Upwork", url: "https://www.upwork.com/", sortOrder: 13 },
      { platform: "mostaql", labelAr: "مستقل", labelEn: "Mostaql", url: "https://mostaql.com/", sortOrder: 14 },
      { platform: "khamsat", labelAr: "خمسات", labelEn: "Khamsat", url: "https://khamsat.com/", sortOrder: 15 },
    ],
  });

  await prisma.siteLink.createMany({
    data: [
      { labelAr: "طلبيات", labelEn: "Talabyaat", url: "https://www.talabyaat.com", category: "work", sortOrder: 1 },
      { labelAr: "Mixy Mart", labelEn: "Mixy Mart", url: "https://mixy-mart.com", category: "work", sortOrder: 2 },
      { labelAr: "موديري ديجي", labelEn: "Mudiri Digi", url: "https://mudiridigi.com", category: "company", sortOrder: 3 },
      { labelAr: "متجر موديري", labelEn: "Mudiri Shop", url: "https://mudiridigi.shop", category: "company", sortOrder: 4 },
      { labelAr: "مديري السنترال", labelEn: "Central POS", url: "https://mudiridigi.shop/central", category: "work", sortOrder: 5 },
      { labelAr: "Case Study طلبيات", labelEn: "Talabyaat Case Study", url: "https://github.com/nour0x/talabyaat-case-study", category: "dev", sortOrder: 6 },
      { labelAr: "GitHub", labelEn: "GitHub", url: "https://github.com/nour0x", category: "dev", sortOrder: 7 },
      { labelAr: "أعمالي", labelEn: "My work", url: "/projects", category: "work", sortOrder: 8 },
      { labelAr: "استشارة مجانية", labelEn: "Free consultation", url: "/contact", category: "cta", sortOrder: 9 },
    ],
  });

  console.log("Expanded content seeded.");
  console.log("Add your photo: Admin → Settings → upload avatar (or set Avatar URL).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
