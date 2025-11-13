"use client";

import { motion } from "framer-motion";

type ErrorContentProps = {
  title: string;
  message: string;
};

export const ErrorContent = ({ title, message }: ErrorContentProps) => {
  return (
    <>
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="bg-linear-to-r from-red-600 to-amber-600 bg-clip-text text-4xl font-bold leading-[70px]! text-transparent sm:text-5xl">
          {title}
        </h1>
      </motion.div>

      <motion.div
        animate={{ width: "60%" }}
        className="mx-auto mb-8 mt-2 h-1 w-0 bg-linear-to-r from-red-600 to-amber-600"
        initial={{ width: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      />

      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <p className="mb-8 text-muted-foreground">
          {message.includes("\n")
            ? message.split("\n").map((line, i) => (
                <span key={i}>
                  {line}
                  {i < message.split("\n").length - 1 && <br />}
                </span>
              ))
            : message}
        </p>
      </motion.div>
    </>
  );
};
