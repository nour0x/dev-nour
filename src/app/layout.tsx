import type { Metadata } from "next";
import { Geist, Syne, IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const syne = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Dev Nour — Nour Mohamed",
    template: "%s | Dev Nour",
  },
  description:
    "Portfolio of Nour Mohamed, founder of Mudiri Digi — web, apps, stores, SEO & growth.",
  applicationName: "Dev Nour",
  authors: [{ name: "Nour Mohamed", url: "https://github.com/nour0x" }],
  creator: "Nour Mohamed",
  keywords: [
    "Dev Nour",
    "Nour Mohamed",
    "نور محمد",
    "Mudiri Digi",
    "موديري ديجي",
    "web developer Egypt",
    "Next.js",
    "Laravel",
    "Flutter",
    "SEO",
    "GEO",
    "AEO",
  ],
  openGraph: {
    type: "website",
    siteName: "Dev Nour",
    locale: "en_US",
    alternateLocale: ["ar_EG"],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@nour0x",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  icons: {
    icon: [{ url: "/icon", type: "image/png" }],
    apple: [{ url: "/apple-icon", type: "image/png" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      className={`${geist.variable} ${syne.variable} ${ibmPlexArabic.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
