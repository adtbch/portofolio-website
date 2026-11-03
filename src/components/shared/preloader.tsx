"use client";

import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

export function Preloader() {
  const shouldReduceMotion = useReducedMotion();
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 50) {
          clearInterval(interval);
          return 100;
        }
        return prev + 15;
      });
    }, 100);

    const handleLoad = () => {
      setProgress(100);
    };

    if (document.readyState === "complete") {
      setProgress(100);
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => {
      clearInterval(interval);
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  useEffect(() => {
    if (progress >= 50) {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  if (shouldReduceMotion) {
    return null;
  }

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="preloader"
          initial={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0.9 }}
          transition={{
            duration: 0.8,
            ease: [0.76, 0, 0.24, 1],
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-zinc-950 text-zinc-100 px-4"
          aria-live="polite"
          aria-label="Memuat portofolio Adit"
        >
          {/* Distinct high-contrast background overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-zinc-900 via-zinc-950 to-zinc-900 pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center gap-5 max-w-md w-full text-center">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="font-mono text-lg sm:text-xl font-semibold tracking-wide text-zinc-100"
            >
              Memuat portofolio Adit...
            </motion.p>

            {/* Progress bar */}
            <div className="w-52 sm:w-64 h-1.5 bg-zinc-800 rounded-full overflow-hidden relative">
              <motion.div
                className="absolute top-0 left-0 bottom-0 bg-accent shadow-[0_0_12px_rgba(var(--accent),0.6)]"
                initial={{ width: "0%" }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              />
            </div>

            <div className="font-mono text-xs text-zinc-400 tracking-wider">
              {Math.min(progress, 100)}%
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
