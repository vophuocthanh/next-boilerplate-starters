"use client";

import { motion } from "framer-motion";

export const AnimatedErrorLines = () => (
  <div className="absolute -right-8 top-0 -z-10">
    {[...Array(5)].map((_, i) => (
      <motion.div
        key={i}
        animate={{
          opacity: [0.2, 0.5, 0.2],
          height: ["20%", "60%", "20%"],
        }}
        className="absolute w-px bg-red-500/30"
        initial={{
          left: i * 8,
          height: "30%",
          opacity: 0.2,
        }}
        transition={{
          duration: 2.5,
          delay: i * 0.2,
          repeat: Infinity,
          repeatDelay: i * 0.1,
        }}
      />
    ))}
  </div>
);

export const AnimatedParticles = () => (
  <div className="absolute inset-0 -z-20">
    {[...Array(10)].map((_, i) => (
      <motion.div
        key={i}
        animate={{
          y: ["0%", "100%"],
          opacity: [0, 1, 0],
        }}
        className="absolute size-1 rounded-full bg-red-500/30"
        initial={{
          x: `${Math.random() * 100}%`,
          y: "0%",
          opacity: 0,
        }}
        transition={{
          duration: 3 + Math.random() * 2,
          repeat: Infinity,
          ease: "linear",
          delay: Math.random() * 2,
        }}
      />
    ))}
  </div>
);
