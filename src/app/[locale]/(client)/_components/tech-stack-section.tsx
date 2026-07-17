import {
  FileCode,
  Code,
  Palette,
  Database,
  Settings,
  Server,
  Container,
  Globe,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

const techStack = [
  {
    name: "Next.js 16",
    icon: FileCode,
    color: "from-black to-gray-800",
  },
  {
    name: "TypeScript",
    icon: Code,
    color: "from-blue-600 to-blue-800",
  },
  {
    name: "TailwindCSS",
    icon: Palette,
    color: "from-cyan-500 to-blue-600",
  },
  {
    name: "TanStack Query",
    icon: Database,
    color: "from-red-500 to-pink-600",
  },
  {
    name: "next-intl",
    icon: Globe,
    color: "from-purple-500 to-purple-700",
  },
  {
    name: "Axios",
    icon: Server,
    color: "from-indigo-500 to-indigo-700",
  },
  {
    name: "ESLint",
    icon: Settings,
    color: "from-yellow-500 to-orange-600",
  },
  {
    name: "Docker",
    icon: Container,
    color: "from-orange-500 to-red-600",
  },
] as const;

export async function TechStackSection() {
  const t = await getTranslations("landing.tech");

  return (
    <section className="py-20 bg-linear-to-br from-slate-50 to-white dark:from-slate-900 dark:to-black relative overflow-hidden">
      <div className="absolute inset-0" aria-hidden>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-linear-to-r from-slate-900 to-purple-600 dark:from-white dark:to-purple-200 bg-clip-text text-transparent">
            {t("title")}
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {techStack.map((tech) => (
            <div key={tech.name} className="group relative animate-fade-in-up">
              <div className="relative p-6 rounded-2xl bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700/50 hover:border-purple-400 dark:hover:border-purple-500/50 transition-all duration-300 h-full flex flex-col items-center justify-center shadow-sm dark:shadow-none hover:scale-[1.04]">
                <div
                  className={`w-16 h-16 rounded-xl bg-linear-to-br ${tech.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}
                >
                  <tech.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white text-center">
                  {tech.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
