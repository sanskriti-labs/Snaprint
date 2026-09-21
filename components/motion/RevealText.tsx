"use client";

import { useEffect, useLayoutEffect, useRef, type ElementType } from "react";
import { gsap, registerGsap, EASE, DUR, STAGGER, prefersReducedMotion } from "@/lib/motion";

// useLayoutEffect on the client (sets the hidden start before paint → no flash),
// useEffect on the server (avoids the SSR warning).
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

interface RevealTextProps {
  children: string;
  /** Split unit. "word" reveals word-by-word (robust); "line" splits on explicit \n. */
  split?: "word" | "line";
  as?: ElementType;
  className?: string;
  /** Delay before the reveal begins, seconds. */
  delay?: number;
  /** "load" plays on mount (hero entrances); "scroll" plays when scrolled into view. */
  trigger?: "load" | "scroll";
  /** Start position for the ScrollTrigger (trigger="scroll" only). */
  start?: string;
}

/**
 * Masked reveal  --  the design system's default text entrance (DESIGN_SYSTEM.md §5).
 * Each unit sits in an overflow-hidden mask and rises from 110% with a staggered
 * expo.out, synced to scroll via ScrollTrigger. Never a plain opacity fade.
 * Reduced motion → renders the final state, no animation.
 */
export default function RevealText({
  children,
  split = "word",
  as: Tag = "span",
  className = "",
  delay = 0,
  trigger = "scroll",
  start = "top 85%",
}: RevealTextProps) {
  const rootRef = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const inners = root.querySelectorAll<HTMLElement>("[data-reveal-inner]");
    if (!inners.length) return;

    registerGsap();

    // opacity:1 clears the CSS FOUC guard; GSAP owns transform outright.
    if (prefersReducedMotion()) {
      gsap.set(inners, { yPercent: 0, opacity: 1 });
      return;
    }

    // Masked start set by GSAP itself (no CSS transform base to fight). Under
    // React Strict Mode the effect runs mount→cleanup→mount; kill() on cleanup
    // stops the tween without restoring hidden, and the second run re-sets the
    // 110% start then animates to 0  --  always settling visible.
    gsap.set(inners, { yPercent: 110, opacity: 1 });
    const tween = gsap.to(inners, {
      yPercent: 0,
      duration: DUR.slow,
      ease: EASE.reveal,
      stagger: STAGGER,
      delay,
      // "load": play on mount. "scroll": play when the element enters view.
      ...(trigger === "scroll"
        ? { scrollTrigger: { trigger: root, start, once: true } }
        : {}),
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [children, delay, start, trigger]);

  const units = split === "line" ? children.split("\n") : children.split(" ");
  const maskClass = split === "line" ? "reveal-line" : "reveal-word";

  return (
    <Tag ref={rootRef} className={className}>
      {units.map((unit, i) => (
        <span key={i} className={maskClass}>
          {/* Hidden start comes from the CSS class (.reveal-line/.reveal-word > span),
              NOT an inline style  --  an inline transform here would be re-applied by
              React on re-render and clobber GSAP's final revealed state. */}
          <span data-reveal-inner>
            {unit}
            {split === "word" && i < units.length - 1 ? " " : null}
          </span>
        </span>
      ))}
    </Tag>
  );
}
