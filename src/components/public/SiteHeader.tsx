"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/public/ThemeProvider";

const links = [
  "home",
  "projects",
  "services",
  "experience",
  "skills",
  "about",
  "contact",
  "links",
] as const;

const hrefMap: Record<(typeof links)[number], string> = {
  home: "/",
  projects: "/projects",
  services: "/services",
  experience: "/experience",
  skills: "/skills",
  about: "/about",
  contact: "/contact",
  links: "/links",
};

export function SiteHeader() {
  const t = useTranslations("nav");
  const brand = useTranslations();
  const pathname = usePathname();
  const locale = useLocale();
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const otherLocale = locale === "ar" ? "en" : "ar";

  return (
    <header className="site-header">
      <div className="container-page flex h-[4.1rem] items-center justify-between gap-2 sm:h-[4.25rem] sm:gap-3">
        <Link
          href="/"
          className="display focus-ring text-[1.2rem] font-bold tracking-tight text-accent sm:text-[1.35rem]"
          data-track="nav-brand"
        >
          {brand("brand")}
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary">
          {links.map((key) => {
            const href = hrefMap[key];
            const active = pathname === href || (href !== "/" && pathname.startsWith(href));
            return (
              <Link
                key={key}
                href={href}
                data-track={`nav-${key}`}
                className={cn(
                  "focus-ring rounded-sm px-2.5 py-2 text-[0.82rem] text-fg-muted transition hover:text-fg",
                  active && "bg-accent/10 font-semibold text-accent"
                )}
              >
                {t(key)}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            className="focus-ring inline-flex h-10 w-10 items-center justify-center border border-border"
            aria-label={theme === "dark" ? "Switch to light" : "Switch to dark"}
            data-track="theme-toggle"
            onClick={toggle}
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <Link
            href="/contact"
            data-track="header-consult"
            className="btn btn-primary focus-ring !min-h-10 !px-3 !py-2 text-xs sm:!px-4 sm:text-sm"
          >
            {locale === "ar" ? "استشارة" : "Consult"}
          </Link>
          <Link
            href={pathname || "/"}
            locale={otherLocale}
            className="focus-ring hidden border border-border px-3 py-2 text-sm text-fg-muted hover:text-fg sm:inline-flex"
            hrefLang={otherLocale}
            data-track="lang-switch"
          >
            {otherLocale === "ar" ? "عربي" : "EN"}
          </Link>
          <button
            type="button"
            className="focus-ring inline-flex h-11 w-11 items-center justify-center border border-border lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            data-track="mobile-menu-toggle"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open ? (
        <nav
          id="mobile-nav"
          className="border-t border-border bg-bg-elevated px-3 py-2 lg:hidden"
          aria-label="Mobile"
        >
          <ul className="flex flex-col">
            {links.map((key) => (
              <li key={key}>
                <Link
                  href={hrefMap[key]}
                  data-track={`mobile-nav-${key}`}
                  className="focus-ring block rounded-sm px-3 py-3.5 text-fg-muted hover:bg-accent/10 hover:text-accent"
                  onClick={() => setOpen(false)}
                >
                  {t(key)}
                </Link>
              </li>
            ))}
            <li className="px-2 pb-2 pt-1">
              <Link
                href={pathname || "/"}
                locale={otherLocale}
                data-track="mobile-lang-switch"
                className="btn btn-ghost btn-block focus-ring !min-h-11"
                onClick={() => setOpen(false)}
              >
                {otherLocale === "ar" ? "العربية" : "English"}
              </Link>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
