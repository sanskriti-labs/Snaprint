"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import Machine3D, { type Machine3DHandle } from "@/components/Machine3D";
import Snappy from "@/components/mascot/Snappy";
import RevealText from "@/components/motion/RevealText";
import { gsap, registerGsap, prefersReducedMotion } from "@/lib/motion";

/**
 * Minimal, light, centered hero. Badge + a small one-line headline + two CTAs
 * sit in normal flow up top; the product is the scroll story. At rest only
 * the top half of the kiosk is visible (cropped by the pinned panel's bottom
 * edge) at a smaller scale — small → medium → full as the pinned section
 * scrolls past, then it settles at rest, fully visible, and stays directly
 * draggable (single-dot touch rotation, see Machine3D.tsx). No dark cinematic
 * staging, no huge display type — the reveal is the only spectacle here.
 */
export default function Hero() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const kioskWrapRef = useRef<HTMLDivElement>(null);
  const textColRef = useRef<HTMLDivElement>(null);
  const machineRef = useRef<Machine3DHandle>(null);

  const [snappyState, setSnappyState] = useState<"idle" | "print-cycle">("idle");
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [glowing, setGlowing] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setSnappyState(window.scrollY > window.innerHeight * 2 ? "print-cycle" : "idle");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The mascot only starts nudging toward the franchise info once the
  // visitor has actually picked up and dragged the kiosk — it shouldn't
  // compete with discovering that the product itself is interactive. Once
  // unlocked, it pulses on a fixed cadence: visible 5s, hidden 3s, repeat.
  // Skipped under reduced motion, matching every other flourish in this file.
  useEffect(() => {
    if (!hasInteracted || prefersReducedMotion()) return;
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout>;
    const cycle = (visible: boolean) => {
      if (cancelled) return;
      setShowBubble(visible);
      timeoutId = setTimeout(() => cycle(!visible), visible ? 5000 : 3000);
    };
    cycle(true);
    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [hasInteracted]);

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    const pin = pinRef.current;
    const kiosk = kioskWrapRef.current;
    if (!wrapper || !pin || !kiosk) return;

    if (prefersReducedMotion()) {
      // Stable, minimal-movement presentation: skip the pin distance and just
      // show the kiosk fully, at rest.
      wrapper.style.height = "auto";
      gsap.set(kiosk, { opacity: 1, scale: 1, yPercent: 0 });
      return;
    }

    registerGsap();
    // Straight-on, not angled — the hero reveal shows the kiosk facing the
    // viewer dead-on the whole time; any 3D angling only happens once the
    // user takes over via drag.
    const rot = { y: 0, x: 0 };

    const ctx = gsap.context(() => {
      // Rest state: small, cropped by the panel's bottom edge — "half kiosk"
      gsap.set(kiosk, { opacity: 0, scale: 0.5, yPercent: 12 });
      gsap.to(kiosk, { opacity: 1, duration: 0.8, delay: 0.3, ease: "power2.out" });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: wrapper,
          start: "top top",
          end: "bottom bottom",
          pin,
          scrub: 1,
        },
        onUpdate: () => machineRef.current?.setExternalRotation(rot.y, rot.x),
      });

      // small → close-up → normal: rise into view steadily over the whole
      // scroll range, but the zoom punches in past the resting scale at the
      // midpoint, then eases back out to settle — a camera move, not just a
      // linear grow.
      tl.to(kiosk, { yPercent: 0, duration: 1 }, 0);
      tl.to(kiosk, { scale: 1.4, duration: 0.5, ease: "power2.out" }, 0);
      tl.to(kiosk, { scale: 1.08, duration: 0.5, ease: "power2.inOut" }, 0.5);

      // The copy above gets out of the way early — fully hidden by a third of
      // the way through the scroll, well before the kiosk finishes climbing
      // into view, so it never lingers behind/beside the product.
      if (textColRef.current) {
        tl.to(textColRef.current, { opacity: 0, yPercent: -12, duration: 0.32 }, 0);
        tl.set(textColRef.current, { pointerEvents: "none" }, 0.32);
      }
    }, wrapper);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapperRef} className="relative" style={{ height: "220vh" }}>
      <div ref={pinRef} className="relative h-screen w-full overflow-hidden bg-paper">
        {/* Hero backdrop — the illustrated pastel scene, with a soft white wash
            over the top where the badge/headline/CTAs sit so they stay legible
            without flattening the artwork lower down. */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <Image src="/hero-bg.png" alt="" fill priority className="object-cover object-[65%_40%]" />
          <div
            className="absolute inset-x-0 top-0 h-[60%]"
            style={{ background: "linear-gradient(180deg,rgba(255,255,255,.72) 0%,rgba(255,255,255,.42) 38%,rgba(255,255,255,0) 100%)" }}
          />
        </div>

        <div ref={textColRef} className="relative z-10 mx-auto flex max-w-grid flex-col items-center px-gutter pt-[92px] text-center sm:pt-[100px]">
          {/* Badge — liquid glass */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="liquid-glass mb-5 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5"
          >
            <span className="text-[11px] text-red">★</span>
            <span className="font-body text-caption font-semibold uppercase tracking-wide text-red">
              India&apos;s print network
            </span>
          </motion.div>

          {/* Headline — small, one line, no supporting paragraph below it */}
          <h1 className="mb-8 max-w-[560px] font-display text-heading font-bold leading-[1.15] text-charcoal">
            <RevealText split="word" trigger="load" delay={0.1}>
              Your shop.
            </RevealText>{" "}
            <RevealText split="word" trigger="load" delay={0.2} className="text-red">
              Prints while
            </RevealText>{" "}
            <RevealText split="word" trigger="load" delay={0.3}>
              you sleep.
            </RevealText>
          </h1>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="mb-10 flex flex-wrap items-center justify-center gap-3"
          >
            <a
              href="/find-snaprint"
              data-magnetic="0.35"
              className="liquid-glass-red group inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-display text-[14px] font-semibold text-white transition-transform duration-[--d-hover] ease-hover hover:scale-[1.03]"
            >
              Find Snaprint
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" className="transition-transform duration-[--d-hover] ease-hover group-hover:translate-x-1">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
            <a
              href="#how"
              className="liquid-glass inline-flex items-center gap-2 rounded-full px-6 py-3.5 font-body text-[14px] font-medium text-charcoal transition-transform duration-[--d-hover] ease-hover hover:scale-[1.03]"
            >
              See how it works
            </a>
          </motion.div>
        </div>

        {/* Product — starts small and cropped by the panel's bottom edge
            (half visible), grows and rises into full view as the pinned
            section scrolls past, then stays put and directly draggable.
            Anchored via plain `absolute bottom-0` layout (not flex/margin
            tricks) so its position is a fixed, predictable reference point
            for the GSAP crop/grow transform to work from. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center">
          <div ref={kioskWrapRef} className="pointer-events-auto relative" style={{ transformOrigin: "50% 50%" }}>
            <div onPointerUp={() => setHasInteracted(true)}>
              <Machine3D ref={machineRef} interactive scale={0.78} />
            </div>
            <div className="absolute -right-8 bottom-8 hidden sm:block">
              <a
                href="/franchise/brochure"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="See Snaprint franchise model"
                className="group relative block"
                onClick={() => {
                  setShowBubble(false);
                  setGlowing(true);
                  window.setTimeout(() => setGlowing(false), 650);
                }}
              >
                <AnimatePresence>
                  {showBubble && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.9 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="liquid-glass pointer-events-none absolute bottom-full left-1/2 mb-3 -translate-x-1/2 whitespace-nowrap rounded-2xl px-3.5 py-2"
                      aria-hidden
                    >
                      <span className="font-body text-[12px] font-medium text-charcoal">
                        See franchise model
                      </span>
                      <span className="absolute -bottom-1 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 bg-white/80" />
                    </motion.div>
                  )}
                </AnimatePresence>
                <motion.span
                  className="pointer-events-none absolute inset-0 rounded-full"
                  animate={{ opacity: glowing ? 1 : 0, scale: glowing ? 1.4 : 1 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  style={{ background: "radial-gradient(circle, rgba(230,57,70,0.6), transparent 70%)", filter: "blur(10px)" }}
                  aria-hidden
                />
                <Snappy state={snappyState} scale={56 / 150} decorative eyeTrack />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
