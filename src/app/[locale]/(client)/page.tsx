"use client";

import { CTASection } from "./_components/cta-section";
import { FeaturesSection } from "./_components/features-section";
import { FooterSection } from "./_components/footer-section";
import { Header } from "./_components/header";
import { HeroSection } from "./_components/hero-section";
import { TechStackSection } from "./_components/tech-stack-section";

export default function LandingPage() {
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
