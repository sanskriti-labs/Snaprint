"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger, registerGsap, prefersReducedMotion } from "@/lib/motion";
import { isMarketingRoute } from "@/lib/marketing-routes";

/**
 * Smooth-scroll foundation (DESIGN_SYSTEM.md §5/§8). Lenis drives scroll and is
 * synced to GSAP's ticker so ScrollTrigger stays in lockstep. Tuned mid-weight  -- 
 * not floaty, not stiff. Disabled entirely under reduced-motion (native scroll).
 *
 * Mounted once at the true root (app/layout.tsx)  --  not per route group  --  so
 * crossing into/out of marketing routes toggles Lenis on/off via this effect
 * re-running on pathname change, instead of fully unmounting/remounting this
 * provider (and everything below it) on every such navigation. That teardown
 * was costing ~1.9s per crossing; this effect's own create/destroy is cheap.
 */
export default function LenisProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const active = isMarketingRoute(pathname);

  useEffect(() => {
    if (!active || prefersReducedMotion()) return;
    registerGsap();

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo-out
      smoothWheel: true,
      // Touch was left as native passthrough, which fires scroll updates too
      // sparsely/inconsistently during an active finger-drag for ScrollTrigger's
      // pinned hero animation to track  --  it visibly stalls mid-scroll on real
      // phones despite the same math working fine on desktop. Routing touch
      // through Lenis's own RAF-driven loop (already wired to ScrollTrigger.update
      // below) gives it the same steady update cadence wheel scroll already has.
      syncTouch: true,
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
  }, [active]);

  return <>{children}</>;
}
