import { Locale } from "@/app/i18n/config/settings";
import { Linkedin, Github, Mail, Twitter } from "lucide-react";

export const socialLinks = [
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Mail, href: "#", label: "Email" },
];

export const productLinks = [
  { key: "features", href: "#features" },
  { key: "pricing", href: "#pricing" },
  { key: "documentation", href: "#docs" },
];

export const companyLinks = [
  { key: "about", href: "#about" },
  { key: "blog", href: "#blog" },
  { key: "careers", href: "#careers" },
  { key: "contact", href: "#contact" },
];

export const navItems = [
  { key: "home", href: "/" },
  { key: "about", href: "#about" },
  { key: "contact", href: "#contact" },
];

export const localeLabels: Record<Locale, { name: string; flag: string }> = {
  vi: { name: "Tiếng Việt", flag: "🇻🇳" },
  en: { name: "English", flag: "🇺🇸" },
};
