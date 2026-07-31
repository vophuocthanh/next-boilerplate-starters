import { getTranslations } from "next-intl/server";

import { companyLinks, productLinks, socialLinks } from "./helpers";

export async function FooterSection() {
  const t = await getTranslations("landing.footer");

  return (
    <footer className="bg-white dark:bg-black border-t border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div className="lg:col-span-1">
            <h3 className="text-xl font-bold bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
              NextJS Boilerplate
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
              {t("description")}
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-slate-900 dark:text-white font-semibold mb-4">
              {t("product")}
            </h4>
            <ul className="space-y-2">
              {productLinks.map((link) => (
                <li key={link.key}>
                  <a
                    href={link.href}
                    className="text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 text-sm transition-colors"
                  >
                    {t(link.key)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-slate-900 dark:text-white font-semibold mb-4">
              {t("company")}
            </h4>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.key}>
                  <a
                    href={link.href}
                    className="text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 text-sm transition-colors"
                  >
                    {t(link.key)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-slate-900 dark:text-white font-semibold mb-4">
              {t("legal")}
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#terms"
                  className="text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 text-sm transition-colors"
                >
                  {t("termsOfService")}
                </a>
              </li>
              <li>
                <a
                  href="#privacy"
                  className="text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 text-sm transition-colors"
                >
                  {t("privacyPolicy")}
                </a>
              </li>
              <li>
                <a
                  href="#cookies"
                  className="text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 text-sm transition-colors"
                >
                  {t("cookiePolicy")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 text-center">
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            © {new Date().getFullYear()} NextJS Boilerplate. {t("copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}
