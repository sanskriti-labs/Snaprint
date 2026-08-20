"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Machine3D from "@/components/Machine3D";

function CountUp({ target, prefix = "", suffix = "", inView }: {
  target: number; prefix?: string; suffix?: string; inView: boolean;
}) {
  const [val, setVal] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    const start = performance.now();
    const dur = 1600;
    const raf = (t: number) => {
      const p = Math.min((t - start) / dur, 1);
      setVal(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [inView, target]);
  return <>{prefix}{val.toLocaleString("en-IN")}{suffix}</>;
}

export type NetworkStats = {
  /** Unique listed shops across every published area, deduped by placeId. */
  shops: number;
  /** Published area + college pages — one landing page per locality/campus. */
  locations: number;
  cities: number;
};

/**
 * Hero leads with consumer intent, keeps the franchise path one click away.
 *
 * Search Console (Aug 2026) showed ~3,000 impressions/quarter on "xerox shop
 * near me" and its variants against ~160 on the brand term, while the hero
 * spoke only to shop owners ("Your shop. Prints while you sleep."). The
 * mismatch is why those impressions converted at ~0.2%. The kiosk pitch is
 * still the business, so it keeps a dedicated CTA and the S1 render — it just
 * no longer occupies the headline that near-me searchers land on.
 */
export default function Hero({ network }: { network: NetworkStats }) {
  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true });

  return (
    <section className="relative min-h-svh overflow-hidden bg-white">
      {/* Dot grid — very faint, industrial */}
      <div className="pointer-events-none absolute inset-0 bg-dot-grid" aria-hidden />
      {/* Red warmth top-right */}
      <div
        className="pointer-events-none absolute right-0 top-0 h-[480px] w-[480px]"
        style={{ background: "radial-gradient(ellipse at top right, rgba(230,57,70,0.055) 0%, transparent 65%)" }}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent" aria-hidden />

      <div className="mx-auto grid max-w-[1280px] min-h-svh grid-cols-1 items-center gap-10 px-6 pt-[106px] pb-16 md:px-10 lg:grid-cols-[1fr_420px] lg:gap-10">

        {/* ── LEFT ── */}
        <div className="flex flex-col">

          {/* Eyebrow — Inter + uppercase tracking */}
          <motion.div
            initial={{ opacity: 0, x: -14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8 flex items-center gap-3"
          >
            <span className="h-px w-7 bg-[#E63946]" />
            <span className="font-body text-[11px] font-semibold uppercase tracking-[0.22em] text-[#E63946]">
              India&apos;s print network
            </span>
            <span className="h-px w-7 bg-[#E63946]" />
          </motion.div>

          {/* Headline — Space Grotesk display. Plain SSR text: this is the LCP element, no mount animation so it paints immediately. */}
          <h1
            className="mb-8 font-display font-extrabold leading-[0.97] tracking-[-3.5px]"
            style={{ fontSize: "clamp(54px, 6.8vw, 92px)" }}
          >
            <span className="block text-[#111110]">Print anything.</span>
            <span className="block text-[#E63946]">Near you.</span>
            <span className="block text-[#111110]">In minutes.</span>
          </h1>

          {/* Subheading — Inter body, editorial balance. Also part of LCP viewport, no fade-in. */}
          <p className="mb-3 max-w-[440px] font-body text-[17px] font-light leading-[1.78] text-[#6B6B66]">
            {network.shops.toLocaleString("en-IN")} listed xerox and print shops across{" "}
            {network.cities} cities — B&amp;W, colour, binding and scanning.
          </p>
          {/* Serif accent line — Instrument Serif italic for rhythm */}
          <p className="mb-10 max-w-[380px] font-serif italic text-[16px] leading-[1.7] text-[#999994]">
            No queue. No wait. Just scan, pay, collect.
          </p>

          {/* CTAs — consumer action first, kiosk/franchise path preserved beside it. */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.64 }}
            className="flex flex-wrap items-center gap-3"
          >
            <a
              href="/print-near"
              className="inline-flex items-center gap-2 rounded-[8px] bg-[#111110] px-8 py-4 font-display text-[14px] font-semibold text-white transition-all duration-200 hover:bg-[#E63946] hover:-translate-y-px"
              style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.16)" }}
            >
              Find shops near me
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
            <a
              href="/franchise"
              className="inline-flex items-center gap-2 rounded-[8px] border border-[rgba(0,0,0,0.1)] px-6 py-4 font-body text-[13.5px] font-medium text-[#555550] transition-all duration-150 hover:border-[rgba(0,0,0,0.2)] hover:text-[#111110]"
            >
              Own a shop? Get a kiosk
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </motion.div>

          {/* Stats strip — directory scale first (what a near-me searcher is
              judging), then the two kiosk specs worth leading with. */}
          <motion.div
            ref={statsRef}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.76 }}
            className="mt-14 flex flex-wrap items-end gap-10 border-t border-[rgba(0,0,0,0.07)] pt-10"
          >
            <div>
              <div className="font-display text-[32px] font-extrabold leading-none tracking-[-1.5px] text-[#111110]">
                <CountUp target={network.shops} inView={statsInView} />
              </div>
              <div className="mt-1.5 font-body text-[11px] text-[#AAAAAA]">listed shops</div>
            </div>
            <div>
              <div className="font-display text-[32px] font-extrabold leading-none tracking-[-1.5px] text-[#111110]">
                <CountUp target={network.locations} inView={statsInView} />
              </div>
              <div className="mt-1.5 font-body text-[11px] text-[#AAAAAA]">areas &amp; campuses</div>
            </div>
            <div>
              <div className="font-display text-[32px] font-extrabold leading-none tracking-[-1.5px] text-[#111110]">
                <CountUp target={network.cities} inView={statsInView} />
              </div>
              <div className="mt-1.5 font-body text-[11px] text-[#AAAAAA]">cities</div>
            </div>
            <div>
              <div className="font-display text-[32px] font-extrabold leading-none tracking-[-1.5px] text-[#111110]">24/7</div>
              <div className="mt-1.5 font-body text-[11px] text-[#AAAAAA]">unmanned kiosks</div>
            </div>
          </motion.div>
        </div>

        {/* ── RIGHT: MACHINE ── */}
        <motion.div
          initial={{ opacity: 0, y: 44, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center justify-center"
        >
          <Machine3D />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="mt-5 flex items-center gap-2 rounded-full border border-[rgba(0,0,0,0.08)] bg-[#F8F7F4] px-4 py-1.5"
          >
            <div className="h-1.5 w-1.5 animate-blink rounded-full bg-[#E63946]" />
            <span className="font-body text-[11px] font-medium tracking-widest uppercase text-[#AAAAAA]">Snaprint S1 · Drag to explore</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 1.6, repeat: Infinity }}
          className="h-8 w-5 rounded-full border border-[rgba(0,0,0,0.12)] flex items-start justify-center p-1.5"
        >
          <div className="h-2 w-0.5 rounded-full bg-[#E63946]" />
        </motion.div>
      </motion.div>
    </section>
  );
}
