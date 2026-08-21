"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import Snappy from "@/components/mascot/Snappy";

/**
 * A compact closing banner, not a full-viewport hero — the trust-building
 * work is already done by the sections above (Pricing); this is a single,
 * low-friction nudge before the Footer, not a second climax.
 */
export default function CtaFinal() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="contact" className="relative overflow-hidden bg-paper px-6 py-20 md:px-10">
      <div className="mx-auto max-w-[1280px]">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-2xl px-8 py-10 sm:px-12 sm:py-12"
          style={{ background: "linear-gradient(160deg, #0f0f0e 0%, #111110 55%, #1a0405 100%)" }}
        >
          {/* Precision grid, kept subtle */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
              backgroundSize: "36px 36px",
            }}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-16 -right-16 h-64 w-64 rounded-full animate-glow-pulse"
            style={{ background: "radial-gradient(ellipse, rgba(230,57,70,0.22) 0%, transparent 70%)", filter: "blur(30px)" }}
            aria-hidden
          />

          <div className="relative flex flex-col items-start gap-10 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-[520px]">
              <div className="mb-4 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#E63946] animate-glow-pulse" aria-hidden />
                <span className="font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50">
                  Now booking installations
                </span>
              </div>
              <h2 className="mb-3 font-display text-[26px] font-extrabold leading-[1.2] text-white sm:text-[30px]">
                Want a <span className="text-[#E63946]">self-service kiosk</span> for your campus, shop or workspace?
              </h2>
              <p className="mb-7 font-body text-[13.5px] font-light leading-[1.7] text-white/55">
                Host a Snaprint kiosk at your college, coaching centre, co-working space or business centre —
                installed and live within the hour.
              </p>
              <Link
                href="/book"
                data-magnetic="0.35"
                className="liquid-glass-red inline-flex items-center gap-2 rounded-full px-6 py-3.5 font-display text-[13.5px] font-semibold text-white transition-transform duration-[--d-hover] ease-hover hover:scale-[1.03]"
              >
                Request a Kiosk
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.3" viewBox="0 0 24 24">
                  <path d="M7 17L17 7M7 7h10v10" />
                </svg>
              </Link>
            </div>

            {/* Mascot, standing in for the reference's photo */}
            <div className="relative hidden shrink-0 self-end sm:block">
              <div
                className="pointer-events-none absolute inset-0 rounded-full"
                style={{ background: "radial-gradient(circle, rgba(230,57,70,0.35), transparent 70%)", filter: "blur(24px)" }}
                aria-hidden
              />
              <Snappy state="done" scale={150 / 150} decorative />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
