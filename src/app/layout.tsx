import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getLocale } from "next-intl/server";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  // latin-ext covers Vietnamese diacritics used across the vi locale.
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: {
    default: "NextJS Boilerplate 2026",
    template: "%s | NextJS Boilerplate",
  },
  description:
    "Production-ready Next.js boilerplate with TypeScript, Tailwind CSS, next-intl, and Docker.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:4040",
  ),
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // The root layout sits above the [locale] segment, so it has no `params`.
  // next-intl resolves the active locale from the request instead.
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className="transition-colors duration-300"
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased transition-colors duration-300`}
      >
        {children}
      </body>
    </html>
  );
}
