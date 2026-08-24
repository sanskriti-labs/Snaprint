"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import RevealText from "@/components/motion/RevealText";

// ─── Sourced from the 2026 Kiosk Ownership brochure — figures below are
// illustrative estimates from that document, not guarantees. Do not invent
// numbers here; if a figure isn't in the brochure, it doesn't belong here.

type Tier = {
  key: string;
  name: string;
  tagline: string;
  price: string;
  popular?: boolean;
  bullets: string[];
  bestFor: string[];
};

const tiers: Tier[] = [
  {
    key: "s1",
    name: "S1",
    tagline: "The smart way in.",
    price: "84,999",
    bullets: [
      "Colour & black-and-white printing",
      "Up to 250 A4 sheets capacity",
      "Reliable, everyday print quality",
      "Zero setup cost, full ownership",
    ],
    bestFor: ["Shopkeepers & stationery stores", "Coaching centres & tuition classes", "Low–medium footfall locations", "Budget-first buyers"],
  },
  {
    key: "s1-pro",
    name: "S1 Pro",
    tagline: "Built for the daily rush.",
    price: "1,39,999",
    bullets: [
      "Higher-speed colour & B/W printing",
      "Up to 550 A4 sheets capacity",
      "Sharper, more consistent print quality",
      "Zero setup cost, full ownership",
    ],
    bestFor: ["College & university campuses", "Co-working & business centres", "Medium–high footfall locations", "Faster, higher-volume printing needs"],
  },
  {
    key: "s1-pro-max",
    name: "S1 Pro Max",
    tagline: "Engineered for volume that never stops.",
    price: "2,99,999",
    popular: true,
    bullets: [
      "Enterprise-grade print engine",
      "Up to 1,830 A4 sheets* capacity",
      "High-quality, professional-grade prints",
      "Zero setup cost, full ownership",
    ],
    bestFor: ["High-footfall malls & commercial hubs", "Multi-kiosk operators", "Continuous, high-volume printing", "Maximum uptime requirements"],
  },
];

function Check({ dark }: { dark?: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="mt-[3px] flex-shrink-0">
      <circle cx="7" cy="7" r="7" fill={dark ? "rgba(255,255,255,0.1)" : "rgba(230,57,70,0.1)"} />
      <path d="M4 7l2 2 4-4" stroke={dark ? "#ffffff" : "#E63946"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Pricing() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    animate: inView ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section id="pricing" className="relative overflow-hidden bg-white px-6 py-16 md:px-10 md:py-28">
      <div className="relative mx-auto max-w-[1280px]">
        <motion.p
          ref={ref}
          {...fadeUp(0)}
          className="mb-5 font-body text-[11px] font-semibold uppercase tracking-[0.2em] text-[#E63946]"
        >
          Three models
        </motion.p>
        <RevealText
          as="h2"
          split="word"
          className="mb-5 block max-w-[620px] font-display text-display-lg font-extrabold text-[#111110]"
        >
          Pick by footfall, volume and budget.
        </RevealText>
        <motion.p {...fadeUp(0.1)} className="mb-5 max-w-[480px] font-body text-[16px] font-light leading-[1.78] text-[#6B6B66]">
          Same self-service kiosk, same software, same ownership terms, sized to how busy your location gets. You own it outright, from day one.
        </motion.p>
        <motion.p {...fadeUp(0.12)} className="mb-16 font-body text-[12px] font-semibold uppercase tracking-[0.1em] text-[#111110]">
          No annual fees · No software subscription · One-time purchase
        </motion.p>

        {/* Tier cards */}
        <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {tiers.map((t, i) => (
            <motion.div
              key={t.key}
              {...fadeUp(0.14 + i * 0.08)}
              whileHover={{ y: -6, transition: { type: "spring", stiffness: 300, damping: 22 } }}
              className={`group relative flex flex-col overflow-hidden rounded-2xl p-5 transition-shadow duration-300 sm:p-6 md:p-8 ${
                t.popular
                  ? "border border-[rgba(230,57,70,0.3)] hover:shadow-[0_16px_50px_rgba(230,57,70,0.22)]"
                  : "border border-[rgba(0,0,0,0.07)] bg-white shadow-[0_1px_4px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.04)] hover:border-[rgba(230,57,70,0.2)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.1)]"
              }`}
              style={
                t.popular
                  ? { background: "linear-gradient(135deg, #1a0406 0%, #0f0002 40%, #0A0A09 100%)", boxShadow: "0 8px 40px rgba(230,57,70,0.14)" }
                  : {}
              }
            >
              {/* Red glow — appears on hover, popular card only */}
              {t.popular && (
                <div
                  className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#E63946] opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-20"
                  aria-hidden
                />
              )}
              {t.popular && (
                <span className="absolute right-6 top-6 rounded-full bg-[#E63946] px-3 py-1 font-body text-[10px] font-semibold uppercase tracking-[0.1em] text-white">
                  Most popular
                </span>
              )}
              <div className={`mb-4 font-body text-[11px] font-semibold uppercase tracking-[0.14em] ${t.popular ? "text-[rgba(230,57,70,0.75)]" : "text-[#E63946]"}`}>
                Snaprint {t.name}
              </div>
              <h3 className={`mb-2 font-display text-[22px] font-bold leading-[1.15] ${t.popular ? "text-white" : "text-[#111110]"}`}>
                {t.tagline}
              </h3>
              <div className={`mb-8 font-mono tabular-nums text-[40px] font-extrabold leading-none tracking-[-1px] ${t.popular ? "text-white" : "text-[#111110]"}`}>
                <span className="align-top text-[22px]">₹</span>
                {t.price}
              </div>
              <div className="mb-8 flex-1 space-y-3">
                {t.bullets.map((b) => (
                  <div key={b} className="flex items-start gap-2.5">
                    <Check dark={t.popular} />
                    <span className={`font-body text-[13.5px] font-light leading-[1.6] ${t.popular ? "text-white/70" : "text-[#555550]"}`}>{b}</span>
                  </div>
                ))}
              </div>
              <div className={`mb-5 border-t pt-5 ${t.popular ? "border-white/10" : "border-[rgba(0,0,0,0.06)]"}`}>
                <div className={`mb-2 font-body text-[10px] font-semibold uppercase tracking-[0.12em] ${t.popular ? "text-white/40" : "text-[#AAAAAA]"}`}>
                  Best for
                </div>
                <ul className="space-y-1">
                  {t.bestFor.map((f) => (
                    <li key={f} className={`font-body text-[12.5px] leading-[1.5] ${t.popular ? "text-white/60" : "text-[#777770]"}`}>
                      → {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div className={`font-body text-[11px] ${t.popular ? "text-white/35" : "text-[#AAAAAA]"}`}>
                Installation · Software · 1-Year Warranty
              </div>
            </motion.div>
          ))}
        </div>
        <p className="font-body text-[11px] text-[#AAAAAA]">*With optional additional paper trays. Prices shown exclude GST.</p>
      </div>
    </section>
  );
}
