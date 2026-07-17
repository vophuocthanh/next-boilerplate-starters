import { Rocket, MessageCircle } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";

export async function CTASection() {
  const t = await getTranslations("landing.cta");

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-br from-purple-100 via-slate-50 to-blue-100 dark:from-purple-900 dark:via-slate-900 dark:to-blue-900" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
          <div className="relative p-12 rounded-3xl bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700/50 overflow-hidden shadow-lg dark:shadow-none">
            <div className="absolute inset-0 bg-linear-to-r from-purple-500/10 via-blue-500/10 to-purple-500/10" />

            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 bg-linear-to-r from-slate-900 via-purple-600 to-blue-600 dark:from-white dark:via-purple-200 dark:to-blue-200 bg-clip-text text-transparent">
                {t("title")}
              </h2>

              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto">
                {t("description")}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  size="lg"
                  className="group relative overflow-hidden bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 px-8 py-6 text-lg font-semibold shadow-lg shadow-purple-500/50"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <Rocket className="w-5 h-5" />
                    {t("createAccount")}
                  </span>
                  <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 py-6 text-lg font-semibold border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50 backdrop-blur-sm"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  {t("contactSupport")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
