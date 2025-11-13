"use client";

import { motion, Variants } from "framer-motion";
import {
  FileCode,
  Code,
  Palette,
  Database,
  Settings,
  Package,
  Server,
  Container,
} from "lucide-react";

const techStack = [
  { name: "Next.js 15", icon: FileCode, color: "from-black to-gray-800" },
  { name: "TypeScript", icon: Code, color: "from-blue-600 to-blue-800" },
  { name: "TailwindCSS", icon: Palette, color: "from-cyan-500 to-blue-600" },
  { name: "TanStack Query", icon: Database, color: "from-red-500 to-pink-600" },
  { name: "Zustand", icon: Package, color: "from-purple-500 to-purple-700" },
  { name: "Axios", icon: Server, color: "from-indigo-500 to-indigo-700" },
  { name: "ESLint", icon: Settings, color: "from-yellow-500 to-orange-600" },
  { name: "Docker", icon: Container, color: "from-orange-500 to-red-600" },
];

export const TechStackSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.4,
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <section className="py-20 bg-linear-to-br from-slate-50 to-white dark:from-slate-900 dark:to-black relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-linear-to-r from-slate-900 to-purple-600 dark:from-white dark:to-purple-200 bg-clip-text text-transparent">
            Built with Modern Tech Stack
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Powered by industry-leading tools and frameworks
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto"
        >
          {techStack.map((tech) => (
            <motion.div
              key={tech.name}
              variants={itemVariants as Variants}
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="group relative"
            >
              <div className="relative p-6 rounded-2xl bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700/50 hover:border-purple-400 dark:hover:border-purple-500/50 transition-all duration-300 h-full flex flex-col items-center justify-center shadow-sm dark:shadow-none">
                <div
                  className={`w-16 h-16 rounded-xl bg-linear-to-br ${tech.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}
                >
                  <tech.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white text-center">
                  {tech.name}
                </h3>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
