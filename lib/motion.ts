// Shared motion config — the single source of truth for GSAP-side easing and
// timing, mirroring the CSS tokens in globals.css / DESIGN_SYSTEM.md §4.
// Never hard-code an ease string or duration in a component; import from here.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

/** Register GSAP plugins exactly once (safe to call from any client component). */
export function registerGsap() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);
  if (process.env.NODE_ENV !== "production") {
    (window as unknown as { __gsap?: typeof gsap }).__gsap = gsap;
  }
  registered = true;
}

// GSAP named eases chosen to match the CSS cubic-beziers:
//   reveal ≈ expo.out · power ≈ power4.out · inout ≈ power3.inOut · hover ≈ power2.out
export const EASE = {
  reveal: "expo.out",
  power: "power4.out",
  inout: "power3.inOut",
  hover: "power2.out",
} as const;

export const DUR = {
  hover: 0.4,
  reveal: 0.6,
  slow: 0.9,
  hero: 1.2,
} as const;

export const STAGGER = 0.08;

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export { gsap, ScrollTrigger };
