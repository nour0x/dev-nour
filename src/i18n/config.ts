export const locales = ["ar", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function pickLocaleFromHeader(header: string | null): Locale {
  if (!header) return defaultLocale;
  const preferred = header
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { tag: tag.toLowerCase(), q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);

  for (const item of preferred) {
    if (item.tag.startsWith("ar")) return "ar";
    if (item.tag.startsWith("en")) return "en";
  }
  return defaultLocale;
}
