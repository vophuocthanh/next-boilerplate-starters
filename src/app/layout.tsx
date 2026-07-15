import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getLocale } from "next-intl/server";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NextJS Boilerplate 2025",
  description: "NextJS Boilerplate 2025",
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
