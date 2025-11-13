"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { companyLinks, productLinks, socialLinks } from "./helpers";

export const FooterSection = () => {
  const t = useTranslations("landing.footer");

  return (
    <footer className="bg-white dark:bg-black border-t border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-bold bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
              NextJS Boilerplate
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
              {t("description")}
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-slate-900 dark:text-white font-semibold mb-4">
              {t("product")}
            </h4>
            <ul className="space-y-2">
              {productLinks.map((link) => (
                <li key={link.key}>
                  <Link
                    href={link.href}
                    className="text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 text-sm transition-colors"
                  >
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t("company")}</h4>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.key}>
                  <Link
                    href={link.href}
                    className="text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 text-sm transition-colors"
                  >
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-slate-900 dark:text-white font-semibold mb-4">
              Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#terms"
                  className="text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 text-sm transition-colors"
                >
                  {t("termsOfService")}
                </Link>
              </li>
              <li>
                <Link
                  href="#privacy"
                  className="text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 text-sm transition-colors"
                >
                  {t("privacyPolicy")}
                </Link>
              </li>
              <li>
                <Link
                  href="#cookies"
                  className="text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 text-sm transition-colors"
                >
                  {t("cookiePolicy")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 text-center">
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            © {new Date().getFullYear()} NextJS Boilerplate. {t("copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
};
