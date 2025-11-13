"use client";

import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

export const AnimatedErrorIcon = () => {
  return (
    <motion.div
      animate={{
        rotate: [0, -5, 5, -5, 0],
        scale: [1, 1.05, 1],
      }}
      className="mx-auto mb-6 flex justify-center"
      initial={{ scale: 0.8, opacity: 0 }}
      transition={{
        duration: 0.7,
        scale: { duration: 0.5 },
        opacity: { duration: 0.5 },
        rotate: {
          repeat: Infinity,
          repeatDelay: 5,
          duration: 0.5,
        },
      }}
      viewport={{ once: true }}
      whileInView={{ scale: 1, opacity: 1 }}
    >
      <div className="relative">
        <div className="absolute -inset-1 animate-pulse rounded-full bg-red-500/30 blur-lg" />
        <AlertTriangle className="relative size-24 text-red-500" />
      </div>
    </motion.div>
  );
};
