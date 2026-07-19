"use client";

import { motion } from "framer-motion";

type FadeInProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  y?: number;
} & Omit<React.ComponentProps<typeof motion.div>, "children" | "className" | "style" | "initial" | "whileInView" | "viewport" | "transition">;

/** Fade + slide-up on scroll into view. Used on every major section per the site's animation system. */
export function FadeIn({
  children,
  className,
  style,
  delay = 0,
  y = 16,
  ...rest
}: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
      style={style}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
