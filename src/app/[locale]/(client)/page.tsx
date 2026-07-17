import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { locales, type Locale } from "@/app/i18n/config/settings";

import { CTASection } from "./_components/cta-section";
import { FeaturesSection } from "./_components/features-section";
import { FooterSection } from "./_components/footer-section";
import { Header } from "./_components/header";
import { HeroSection } from "./_components/hero-section";
import { TechStackSection } from "./_components/tech-stack-section";

interface LandingPageProps {
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LandingPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "landing",
  });

  const title = t("meta.title");
  const description = t("meta.description");

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}`])),
    },
    openGraph: {
      title,
      description,
      locale,
      type: "website",
    },
  };
}

export default async function LandingPage({ params }: LandingPageProps) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <HeroSection />
        <FeaturesSection />
        <TechStackSection />
        <CTASection />
        <FooterSection />
      </main>
    </>
  );
}
