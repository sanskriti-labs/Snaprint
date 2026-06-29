"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Machine3D from "@/components/Machine3D";

// Bento cards — benefit-driven, not spec sheets
const bentoCards = [
  {
    size: "wide",
    label: "Universal",
    heading: "Works with your existing printer.",
    body: "Canon, HP, Epson, Brother — any brand. No forced hardware change. Your shop, your equipment.",
    accent: false,
  },
  {
    size: "tall",
    label: "Security",
    heading: "Files deleted after every print.",
    body: "End-to-end encrypted. Auto-deleted on completion. No document is ever stored.",
    accent: false,
  },
  {
    size: "normal",
    label: "Uptime",
    heading: "Earns while you sleep.",
    body: "Orders queue automatically. Your kiosk keeps printing — with or without you present.",
    accent: true,
  },
  {
    size: "normal",
    label: "Visibility",
    heading: "Every order on your phone.",
    body: "Live dashboard. Revenue, print counts, ink and paper status — always in your pocket.",
    accent: false,
  },
  {
    size: "wide",
    label: "Speed",
    heading: "Scan. Pay. Collect. Under 60 seconds.",
    body: "No app download. No USB. No queue. Students point a camera at a QR and walk away with prints.",
    accent: false,
  },
];

function BentoCard({ card, index, inView }: { card: typeof bentoCards[0]; index: number; inView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: 0.1 + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative overflow-hidden rounded-2xl p-8 transition-all duration-300 ${
        card.accent
          ? "bg-[#E63946]"
          : "bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] hover:bg-[rgba(255,255,255,0.07)] hover:border-[rgba(255,255,255,0.12)]"
      } ${
        card.size === "wide" ? "md:col-span-2" : card.size === "tall" ? "md:row-span-2" : ""
      }`}
    >
      {/* Label */}
      <div className={`mb-4 inline-block rounded-full px-2.5 py-1 font-body text-[10px] font-semibold uppercase tracking-[0.16em] ${
        card.accent ? "bg-white/15 text-white/80" : "bg-[rgba(230,57,70,0.12)] text-[#E63946]"
      }`}>
        {card.label}
      </div>
      <h3 className={`mb-3 font-display text-[20px] font-bold leading-[1.2] tracking-[-0.5px] ${card.accent ? "text-white" : "text-white"}`}>
        {card.heading}
      </h3>
      <p className={`font-body text-[13.5px] font-light leading-[1.7] ${card.accent ? "text-white/70" : "text-[rgba(255,255,255,0.45)]"}`}>
        {card.body}
      </p>

      {/* Accent glow on red card */}
      {card.accent && (
        <div className="pointer-events-none absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" aria-hidden />
      )}
    </motion.div>
  );
}

export default function MachineSpecs() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="machine" className="relative overflow-hidden bg-[#0D0D0C] px-6 py-28 md:px-10 bg-dot-grid-dark">
      {/* Ambient red glow behind machine */}
      <div
        className="pointer-events-none absolute left-[22%] top-1/2 -translate-y-1/2 h-[600px] w-[500px]"
        style={{ background: "radial-gradient(ellipse, rgba(230,57,70,0.1) 0%, transparent 65%)", filter: "blur(40px)" }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-[1280px]">

        {/* Section header */}
        <motion.p
          ref={ref}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="mb-5 font-body text-[11px] font-semibold uppercase tracking-[0.22em] text-[#E63946]"
        >
          The hardware
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.08 }}
          className="mb-5 max-w-[500px] font-display font-extrabold leading-[1.04] tracking-[-2.5px] text-white"
          style={{ fontSize: "clamp(30px,4vw,56px)" }}
        >
          The Snaprint S1. Engineered to run itself.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.14 }}
          className="mb-20 max-w-[440px] font-body text-[16px] font-light leading-[1.75] text-[rgba(255,255,255,0.42)]"
        >
          Built for India&apos;s shop environment. Connects to any printer. Managed from your phone.
        </motion.p>

        {/* Machine + Bento layout */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[420px_1fr] lg:gap-16 items-start">

          {/* Machine viewer — left column, sticky */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="lg:sticky lg:top-28 flex flex-col items-center"
          >
            <Machine3D />
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              {[["4G + WiFi", "dual connectivity"], ["23″ Display", "Android tablet"], ["2000 sheets", "paper capacity"]].map(([v, l]) => (
                <div key={l} className="text-center">
                  <div className="font-display text-[14px] font-bold text-white">{v}</div>
                  <div className="font-body text-[10px] text-[rgba(255,255,255,0.3)]">{l}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Bento grid — right column */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {bentoCards.map((card, i) => (
              <BentoCard key={card.label} card={card} index={i} inView={inView} />
            ))}
          </div>
        </div>

        {/* Bottom CTA bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-16 flex flex-col items-center justify-between gap-6 rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.03)] px-8 py-7 sm:flex-row"
        >
          <p className="font-body text-[15px] font-light text-[rgba(255,255,255,0.5)] max-w-[420px]">
            Want to see the S1 in action? Request a demo and we&apos;ll bring it to your shop.
          </p>
          <a
            href="#contact"
            className="flex-shrink-0 inline-flex items-center gap-2 rounded-[8px] bg-white px-7 py-3.5 font-display text-[13.5px] font-semibold text-[#111110] transition-all duration-200 hover:bg-[#E63946] hover:text-white hover:-translate-y-px"
          >
            Request a Demo
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
