"use client";

import { motion, useReducedMotion } from "motion/react";
import { type ReactNode } from "react";

type SectionWrapperProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

const baseTransition = {
  duration: 0.6,
  ease: [0.25, 0.8, 0.25, 1],
};

export function SectionWrapper({
  children,
  className = "",
  delay = 0,
}: SectionWrapperProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <section className={className}>{children}</section>;
  }

  return (
    <motion.section
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-80px" }}
      transition={{
        duration: 0.6,
        ease: "easeOut",
        delay,
      }}
    >
      {children}
    </motion.section>
  );
}
