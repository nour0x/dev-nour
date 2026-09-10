import type { Metadata } from "next";
import { Geist, Syne, IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-ibm-plex-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "Dev Nour",
  description: "Portfolio of Nour Mohamed",
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
