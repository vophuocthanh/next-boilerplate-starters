"use client";

import { motion } from "framer-motion";

type ErrorIdProps = {
  digest?: string;
};

export const ErrorId = ({ digest }: ErrorIdProps) => {
  if (!digest) return null;

  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="text-xs text-muted-foreground"
      initial={{ opacity: 0 }}
      transition={{ delay: 1 }}
    >
      <code className="rounded bg-muted p-1 font-mono">Error ID: {digest}</code>
    </motion.div>
  );
};
