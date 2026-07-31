import { Github, Zap, Shield, Rocket } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";
import { EXTERNAL_LINKS } from "@/core/constant/links";

export async function HeroSection() {
  const t = await getTranslations("landing.hero");

  const stats = [
    { icon: Zap, label: t("stats.fast"), value: "99%" },
    { icon: Shield, label: t("stats.secure"), value: "100%" },
    { icon: Rocket, label: t("stats.scalable"), value: "∞" },
    { icon: Github, label: t("stats.openSource"), value: "MIT" },
  ] as const;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-linear-to-br from-slate-50 via-purple-50 to-blue-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
      <div className="absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-soft-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-soft-pulse animation-delay-500" />
      </div>

      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"
        aria-hidden
      />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-5xl mx-auto text-center">
          <div className="mb-6 animate-fade-in-up">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-500/10 border border-purple-300 dark:border-purple-500/20 text-purple-700 dark:text-purple-300 text-sm font-medium backdrop-blur-sm">
              <Zap className="w-4 h-4" />
              {t("introducing")}
            </span>
          </div>

          <h1 className="animate-fade-in-up animation-delay-100 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-linear-to-r from-slate-900 via-purple-600 to-blue-600 dark:from-white dark:via-purple-200 dark:to-blue-200 bg-clip-text text-transparent leading-tight">
            {t("title")}
          </h1>

          <p className="animate-fade-in-up animation-delay-200 text-lg sm:text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            {t("description")}
          </p>

          <div className="animate-fade-in-up animation-delay-300 flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button
              size="lg"
              className="group relative overflow-hidden bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 px-8 py-6 text-lg font-semibold shadow-lg shadow-purple-500/50"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Rocket className="w-5 h-5" />
                {t("getStarted")}
              </span>
              <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="px-8 py-6 text-lg font-semibold border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50 backdrop-blur-sm"
            >
              <a
                href={EXTERNAL_LINKS.GITHUB_REPO}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="w-5 h-5 mr-2" />
                {t("github")}
              </a>
            </Button>
          </div>

          <div className="animate-fade-in-up animation-delay-400 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="p-6 rounded-2xl bg-white/50 dark:bg-slate-800/30 backdrop-blur-sm border border-slate-200 dark:border-slate-700/50 hover:border-purple-400 dark:hover:border-purple-500/50 transition-colors hover:scale-[1.03]"
              >
                <stat.icon className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-fade-in animation-delay-500"
        aria-hidden
      >
        <div className="w-6 h-10 border-2 border-slate-400 dark:border-slate-400 rounded-full flex justify-center animate-bounce-y">
          <div className="w-1.5 h-1.5 bg-slate-600 dark:bg-slate-400 rounded-full mt-2" />
        </div>
      </div>
    </section>
  );
}
