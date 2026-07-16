"use client";
import { Variants } from "framer-motion";

/* ── Organic entrance variants ── */
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export const fadeInScale: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(3px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ── Card hover (3D tilt feel) ── */
export const cardHover = {
  whileHover: {
    y: -8,
    scale: 1.03,
    rotateZ: -0.4,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
  whileTap: { scale: 0.98 },
};

/* ── Floating node (continuous low-frequency bob) ── */
export const floatNode = (delay: number = 0) => ({
  animate: {
    y: [0, -10, -4, 0],
    rotate: [0, 0.5, -0.3, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut" as const,
      delay,
    },
  },
});
