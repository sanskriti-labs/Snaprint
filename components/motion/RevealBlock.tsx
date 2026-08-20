"use client";

import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import { gsap, registerGsap, EASE, DUR, prefersReducedMotion } from "@/lib/motion";

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

interface RevealBlockProps {
  children: ReactNode;
  className?: string;
  /** Vertical rise distance in px. */
  y?: number;
  delay?: number;
  start?: string;
}

/**
 * Scroll-triggered block reveal for media/cards (DESIGN_SYSTEM.md §5): a soft
 * clip-up + rise, synced to Lenis via ScrollTrigger. Opacity guards the flash
 * pre-JS; GSAP owns transform + clipPath. Reduced motion → visible, no motion.
 */
export default function RevealBlock({ children, className = "", y = 28, delay = 0, start = "top 88%" }: RevealBlockProps) {
  const ref = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    registerGsap();

    if (prefersReducedMotion()) {
      gsap.set(el, { opacity: 1, clearProps: "clipPath,transform" });
      return;
    }

    gsap.set(el, { opacity: 1, y, clipPath: "inset(0 0 100% 0)" });
    const tween = gsap.to(el, {
      y: 0,
      clipPath: "inset(0 0 0% 0)",
      duration: DUR.slow,
      ease: EASE.reveal,
      delay,
      scrollTrigger: { trigger: el, start, once: true },
    });
    return () => { tween.scrollTrigger?.kill(); tween.kill(); };
  }, [delay, start, y]);

  return (
    <div ref={ref} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}
