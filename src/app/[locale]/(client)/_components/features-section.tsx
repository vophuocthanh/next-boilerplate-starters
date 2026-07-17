import {
  Zap,
  Globe,
  Code,
  Palette,
  Shield,
  Link as LinkIcon,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

const iconMap = {
  performance: Zap,
  multilingual: Globe,
  typescript: Code,
  tailwind: Palette,
  quality: Shield,
  api: LinkIcon,
} as const;

const featureKeys = [
  "performance",
  "multilingual",
  "typescript",
  "tailwind",
  "quality",
  "api",
] as const;

export async function FeaturesSection() {
  const t = await getTranslations("landing.features");

  return (
    <section
      id="features"
      className="py-20 bg-white dark:bg-slate-900 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-linear-to-b from-white via-purple-50/50 to-blue-50 dark:from-slate-900 dark:via-purple-900/10 dark:to-slate-900" />
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-purple-400/50 dark:via-purple-500/50 to-transparent" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-linear-to-r from-slate-900 to-purple-600 dark:from-white dark:to-purple-200 bg-clip-text text-transparent">
            {t("title")}
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureKeys.map((featureKey, index) => {
            const Icon = iconMap[featureKey];
            const delayClass =
              index % 3 === 1
                ? "animation-delay-100"
                : index % 3 === 2
                  ? "animation-delay-200"
                  : "";

            return (
              <div
                key={featureKey}
                className={`group relative p-8 rounded-2xl bg-slate-50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700/50 hover:border-purple-400 dark:hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-1 animate-fade-in-up ${delayClass}`}
              >
                <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-purple-500/0 to-blue-500/0 group-hover:from-purple-500/10 group-hover:to-blue-500/10 transition-all duration-300" />

                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-linear-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 mb-6 group-hover:scale-110 transition-transform">
                    <Icon className="w-7 h-7 text-purple-400" />
                  </div>

                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                    {t(`items.${featureKey}.title`)}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {t(`items.${featureKey}.description`)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
