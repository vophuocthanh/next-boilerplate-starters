"use client";

import { motion } from "framer-motion";
import { Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFoundApp() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="relative mx-auto w-full max-w-xl">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              x: [0, -20, 0],
              y: [0, -20, 0],
            }}
            className="absolute left-1/4 top-1/3 size-40 rounded-full bg-primary/10"
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
            className="absolute right-1/4 top-2/3 size-32 rounded-full bg-blue-500/10"
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
            className="absolute bottom-1/4 left-1/3 size-36 rounded-full bg-purple-500/10"
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        <div className="relative z-10">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-9xl font-bold text-transparent">
              404
            </h1>
          </motion.div>

          <motion.div
            animate={{ width: 96 }}
            className="mx-auto mb-8 mt-2 h-1 w-24 bg-linear-to-r from-blue-600 to-purple-600"
            initial={{ width: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />

          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="mb-2 text-2xl font-semibold">Trang không tồn tại</h2>
            <p className="mb-8 text-muted-foreground">
              Rất tiếc, chúng tôi không thể tìm thấy trang bạn đang tìm kiếm.
            </p>
          </motion.div>

          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button asChild className="gap-2 rounded-full px-6" size="lg">
              <Link href="/">
                <Home className="size-5" />
                <span>Quay về trang chủ</span>
              </Link>
            </Button>
          </motion.div>
        </div>

        <motion.div
          animate={{ opacity: 1, rotate: 0 }}
          className="absolute -bottom-16 -left-16 -z-10 text-primary/5"
          initial={{ opacity: 0, rotate: -20 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <svg
            fill="currentColor"
            height="120"
            strokeWidth="0"
            viewBox="0 0 24 24"
            width="120"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M19.14,8.27L14.31,3.43L12.17,5.57,15,8.43,12.35,11.12,12,10.8,8.45,7.25a.667.667,0,0,0-.9,0L6.14,8.67a.667.667,0,0,0,0,.9l.34.34L5.1,11.29a1.32,1.32,0,0,0,0,1.87l.62.62L4.33,15.17a.65.65,0,0,0,0,.9l.91.91.57.57a.67.67,0,0,0,.9,0l1.38-1.38.62.62a1.32,1.32,0,0,0,1.87,0l1.38-1.38.34.34a.67.67,0,0,0,.9,0l1.42-1.42a.67.67,0,0,0,0-.9L11.2,12l.43-.43L14.93,9l2.81,2.8,2.14-2.14-2.14-2.14v.03A6.675,6.675,0,0,1,17,12,7,7,0,1,1,10,5a6.675,6.675,0,0,1,4.7-.77l.17-2.14A8.989,8.989,0,0,0,10,1,9,9,0,1,0,19,10a8.989,8.989,0,0,0-1.07-4.9l.21.17Z" />
          </svg>
        </motion.div>

        {/* Animated dots */}
        <div className="absolute -bottom-8 right-8 -z-10">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                opacity: [0, 1, 0],
                y: [i * 10, i * 10 - 20, i * 10],
              }}
              className="absolute size-2 rounded-full bg-primary/20"
              initial={{
                x: i * 10,
                y: i * 10,
                opacity: 0,
              }}
              transition={{
                duration: 2,
                delay: i * 0.2,
                repeat: Infinity,
                repeatDelay: 1,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
