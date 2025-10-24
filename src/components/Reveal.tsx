"use client";

import { PropsWithChildren, useRef } from "react";
import { motion, Variants, useInView, useReducedMotion } from "framer-motion";

type RevealProps = PropsWithChildren<{
  as?: keyof JSX.IntrinsicElements;          // "h2" | "p" | "div" | ...
  preset?: "fadeUp" | "slideLeft" | "slideRight" | "zoom";
  delay?: number;
  className?: string;
}>;

const presets: Record<NonNullable<RevealProps["preset"]>, Variants> = {
  fadeUp:    { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } },
  slideLeft: { hidden: { opacity: 0, x: 28 }, visible: { opacity: 1, x: 0 } },
  slideRight:{ hidden: { opacity: 0, x:-28 }, visible: { opacity: 1, x: 0 } },
  zoom:      { hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } },
};

export function Reveal({
  as: Tag = "div",
  preset = "fadeUp",
  delay = 0,
  className,
  children,
}: RevealProps) {
  const Comp = motion[Tag as "div"];
  const ref = useRef<HTMLElement | null>(null);
  const prefersReduced = useReducedMotion();

  // Lebih sensitif & robust
  const inView = useInView(ref, {
    once: true,
    amount: 0.12,
    margin: "-120px 0px -120px 0px",
  });

  return (
    <Comp
      ref={ref as any}
      className={`reveal ${className || ""}`}      // <-- class untuk fallback CSS
      data-visible={inView ? "true" : "false"}     // <-- penanda fallback
      style={{ willChange: "transform, opacity" }}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={presets[preset]}
      transition={{ duration: prefersReduced ? 0 : 0.6, ease: "easeOut", delay }}
    >
      {children}
    </Comp>
  );
}

/** Untuk list/grid: aktifkan stagger + penanda fallback */
export function RevealStagger({
  className,
  children,
  delay = 0,
}: PropsWithChildren<{ className?: string; delay?: number }>) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, {
    once: true,
    amount: 0.1,
    margin: "-120px 0px -120px 0px",
  });

  return (
    <motion.div
      ref={ref}
      className={`reveal ${className || ""}`}
      data-visible={inView ? "true" : "false"}
      style={{ willChange: "transform, opacity" }}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={{ hidden: {}, visible: {} }}
      transition={{ staggerChildren: 0.08, delayChildren: delay }}
    >
      {children}
    </motion.div>
  );
}
