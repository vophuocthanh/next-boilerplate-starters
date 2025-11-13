"use client";

import { motion } from "framer-motion";

export const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          x: [0, -20, 0],
          y: [0, -20, 0],
        }}
        className="absolute left-1/4 top-1/3 size-40 rounded-full bg-red-500/10"
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          x: [0, 20, 0],
          y: [0, 20, 0],
        }}
        className="absolute right-1/4 top-2/3 size-32 rounded-full bg-amber-500/10"
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 30, 0],
          y: [0, -10, 0],
        }}
        className="absolute bottom-1/4 left-1/3 size-36 rounded-full bg-red-800/10"
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};
