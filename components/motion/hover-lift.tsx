"use client";

import { motion } from "framer-motion";

type HoverLiftProps = {
  children: React.ReactNode;
  className?: string;
};

/** Hover-lift used on every card component (quick-link, service, value, stat, testimonial). */
export function HoverLift({ children, className }: HoverLiftProps) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
