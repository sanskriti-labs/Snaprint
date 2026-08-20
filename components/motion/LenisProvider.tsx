"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, registerGsap, prefersReducedMotion } from "@/lib/motion";

/**
 * Smooth-scroll foundation (DESIGN_SYSTEM.md §5/§8). Lenis drives scroll and is
 * synced to GSAP's ticker so ScrollTrigger stays in lockstep. Tuned mid-weight —
 * not floaty, not stiff. Disabled entirely under reduced-motion (native scroll).
 *
 * Mounted from app/(marketing)/layout.tsx — scoped to marketing routes only,
 * not the root layout, so PSEO/blog/legal pages stay on native scroll.
 */
export default function LenisProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    registerGsap();

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo-out
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);
    const onTick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    // Positions computed before fonts/layout settle are wrong; refresh once
    // everything has loaded so scroll-triggered reveals fire at the right spot.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    const t = setTimeout(refresh, 600);

    return () => {
      window.removeEventListener("load", refresh);
      clearTimeout(t);
      gsap.ticker.remove(onTick);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
