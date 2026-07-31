import { Linkedin, Github, Mail, Twitter } from "lucide-react";

import { EXTERNAL_LINKS } from "@/core/constant/links";

export const socialLinks = [
  { icon: Github, href: EXTERNAL_LINKS.GITHUB_REPO, label: "GitHub" },
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
