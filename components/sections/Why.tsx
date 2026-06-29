"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

// ─── CO-FOUNDER CRITIQUE ───────────────────────────────────────────
// Old: 3×2 identical icon cards + disconnected comparison table.
// Problems: no visual hierarchy, all cards same weight, icons are decorative
// noise not signal, "glass cards" on light bg look like Bootstrap defaults.
// Fix: asymmetric bento where CARD SIZE = FEATURE IMPORTANCE.
// Flagship feature gets 2× space. Every card has one bold claim, not a list.
// Comparison table is folded into the grid as a "vs" card — not a separate
// afterthought. Result: editorial rhythm, not SaaS template.
// ──────────────────────────────────────────────────────────────────

export default function Why() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 28 },
    animate: inView ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
  });

  return (
    <section id="why" className="relative overflow-hidden bg-[#F8F7F4] px-6 py-28 md:px-10">

      {/* ── SECTION HEADER ── */}
      <div className="relative mx-auto max-w-[1280px]">
        <motion.p
          ref={ref}
          {...fadeUp(0)}
          className="mb-5 font-body text-[11px] font-semibold uppercase tracking-[0.22em] text-[#E63946]"
        >
          Why Snaprint
        </motion.p>

        <div className="mb-16 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <motion.h2
            {...fadeUp(0.07)}
            className="max-w-[540px] font-display font-extrabold leading-[1.04] tracking-[-2.5px] text-[#111110]"
            style={{ fontSize: "clamp(30px, 4vw, 54px)" }}
          >
            Built for shop owners.{" "}
            <span className="font-serif italic font-normal text-[#999994]">
              not against them.
            </span>
          </motion.h2>
          <motion.p
            {...fadeUp(0.14)}
            className="max-w-[300px] font-body text-[14px] font-light leading-[1.75] text-[#6B6B66] lg:text-right"
          >
            Every feature was designed with one question: does this make the shop owner more money with less effort?
          </motion.p>
        </div>

        {/* ── BENTO GRID ── */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-[auto_auto]">

          {/* ① FLAGSHIP — Universal Compatibility (spans 2 cols) */}
          <motion.div
            {...fadeUp(0.1)}
            className="group relative overflow-hidden rounded-2xl bg-[#111110] p-10 lg:col-span-2"
          >
            {/* Precision grid texture */}
            <div
              className="pointer-events-none absolute inset-0 opacity-40"
              style={{
                backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
              aria-hidden
            />
            {/* Red glow — appears on hover */}
            <div
              className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#E63946] opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-10"
              aria-hidden
            />

            <div className="relative flex h-full flex-col justify-between gap-10 lg:flex-row lg:items-end">
              <div className="flex-1">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[rgba(230,57,70,0.25)] bg-[rgba(230,57,70,0.1)] px-3 py-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#E63946]" />
                  <span className="font-body text-[10px] font-semibold uppercase tracking-[0.18em] text-[#E63946]">Universal</span>
                </div>
                <h3 className="mb-4 font-display text-[38px] font-extrabold leading-[1.0] tracking-[-2px] text-white lg:text-[46px]">
                  Any printer.<br />Zero lock-in.
                </h3>
                <p className="max-w-[380px] font-body text-[14px] font-light leading-[1.75] text-[rgba(255,255,255,0.45)]">
                  Snaprint OS connects to Canon, HP, Epson, Brother — without replacing a single cable. Your existing hardware earns more, today.
                </p>
              </div>
              {/* Printer brand strip */}
              <div className="flex flex-col gap-2 lg:items-end">
                {["Canon", "HP", "Epson", "Brother"].map((brand, i) => (
                  <div
                    key={brand}
                    className="flex items-center gap-3 rounded-lg border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.04)] px-4 py-2.5 transition-colors duration-200 group-hover:border-[rgba(255,255,255,0.12)]"
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-[#E63946]" />
                    <span className="font-display text-[13px] font-semibold text-white">{brand}</span>
                    <span className="font-body text-[10px] text-[rgba(255,255,255,0.3)]">✓ Compatible</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ② REVENUE — Tall card, right column rows 1+2 */}
          <motion.div
            {...fadeUp(0.16)}
            className="group relative overflow-hidden rounded-2xl bg-[#E63946] p-10 lg:row-span-2"
          >
            <div className="pointer-events-none absolute -bottom-12 -right-12 h-48 w-48 rounded-full bg-white/10 blur-2xl" aria-hidden />
            <div className="relative flex h-full flex-col justify-between">
              <div>
                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1">
                  <span className="font-body text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">Revenue</span>
                </div>
                {/* Large editorial number */}
                <div className="mb-2 font-display text-[88px] font-extrabold leading-none tracking-[-5px] text-white">
                  90
                  <span className="text-[48px]">%</span>
                </div>
                <p className="mb-6 font-body text-[13px] font-light leading-[1.6] text-white/70">
                  of every rupee printed goes to you. Small monthly platform fee. No per-print commission, ever.
                </p>
              </div>
              <div className="space-y-3">
                {["Zero per-print cut", "Transparent fee structure", "You own the machine"].map((f) => (
                  <div key={f} className="flex items-center gap-2.5">
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                      <circle cx="6.5" cy="6.5" r="6.5" fill="rgba(255,255,255,0.2)" />
                      <path d="M3.5 6.5l2 2 4-4" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="font-body text-[12.5px] text-white/75">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ③ SECURITY */}
          <motion.div
            {...fadeUp(0.2)}
            className="group relative overflow-hidden rounded-2xl border border-[rgba(0,0,0,0.07)] bg-white p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.04)] transition-all duration-300 hover:border-[rgba(0,0,0,0.12)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:-translate-y-1"
          >
            {/* Animated lock icon */}
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-[rgba(0,0,0,0.07)] bg-[#F8F7F4] transition-colors duration-300 group-hover:border-[rgba(230,57,70,0.2)] group-hover:bg-[rgba(230,57,70,0.05)]">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-[#E63946] transition-transform duration-300 group-hover:scale-110" strokeWidth="1.8">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <h3 className="mb-2.5 font-display text-[20px] font-bold leading-[1.15] tracking-[-0.5px] text-[#111110]">
              Files deleted<br />after every print.
            </h3>
            <p className="font-body text-[13px] font-light leading-[1.7] text-[#6B6B66]">
              End-to-end encrypted in transit. Auto-deleted on completion. No document ever stored.
            </p>
          </motion.div>

          {/* ④ DASHBOARD */}
          <motion.div
            {...fadeUp(0.26)}
            className="group relative overflow-hidden rounded-2xl border border-[rgba(0,0,0,0.07)] bg-white p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.04)] transition-all duration-300 hover:border-[rgba(0,0,0,0.12)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:-translate-y-1"
          >
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-[rgba(0,0,0,0.07)] bg-[#F8F7F4] transition-colors duration-300 group-hover:border-[rgba(230,57,70,0.2)] group-hover:bg-[rgba(230,57,70,0.05)]">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-[#E63946] transition-transform duration-300 group-hover:scale-110" strokeWidth="1.8">
                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
              </svg>
            </div>
            <h3 className="mb-2.5 font-display text-[20px] font-bold leading-[1.15] tracking-[-0.5px] text-[#111110]">
              Your shop.<br />One screen.
            </h3>
            <p className="font-body text-[13px] font-light leading-[1.7] text-[#6B6B66]">
              Revenue, print counts, ink and paper levels — live on your phone. No step-out required.
            </p>
            {/* Mini dashboard mock */}
            <div className="mt-6 space-y-2 rounded-xl border border-[rgba(0,0,0,0.06)] bg-[#F8F7F4] p-4">
              {[["Today's prints", "247"], ["Revenue", "₹ —"], ["Paper left", "68%"]].map(([l, v]) => (
                <div key={l} className="flex items-center justify-between">
                  <span className="font-body text-[11px] text-[#999994]">{l}</span>
                  <span className="font-display text-[12px] font-semibold text-[#111110]">{v}</span>
                </div>
              ))}
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[rgba(0,0,0,0.06)]">
                <div className="h-full w-[68%] rounded-full bg-[#E63946] transition-all duration-700 group-hover:w-[72%]" />
              </div>
            </div>
          </motion.div>

          {/* ⑤ VS CARD — replaces disconnected comparison table */}
          <motion.div
            {...fadeUp(0.32)}
            className="relative overflow-hidden rounded-2xl border border-[rgba(0,0,0,0.07)] bg-white p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)] md:col-span-2 lg:col-span-3"
          >
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-display text-[18px] font-bold tracking-[-0.5px] text-[#111110]">
                Snaprint vs other kiosks
              </h3>
              <span className="rounded-full border border-[rgba(230,57,70,0.2)] bg-[rgba(230,57,70,0.05)] px-3 py-1 font-body text-[10px] font-semibold uppercase tracking-[0.16em] text-[#E63946]">
                At a glance
              </span>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Works with your printer", them: "Forces own hardware", us: "Any brand — zero change" },
                { label: "Investment model",         them: "High cost + hidden fees", us: "Transparent, one-time" },
                { label: "Revenue share",            them: "Per-print commission",  us: "You keep 90%" },
                { label: "Local support",            them: "Remote call centre",    us: "Bengaluru team on-site" },
              ].map((row) => (
                <div key={row.label} className="rounded-xl border border-[rgba(0,0,0,0.06)] overflow-hidden">
                  <div className="border-b border-[rgba(0,0,0,0.06)] bg-[#F8F7F4] px-4 py-2.5">
                    <span className="font-body text-[10px] font-semibold uppercase tracking-[0.12em] text-[#AAAAAA]">{row.label}</span>
                  </div>
                  <div className="px-4 py-3">
                    <div className="mb-2 flex items-start gap-2">
                      <span className="mt-0.5 text-[#CCCCCC]">✗</span>
                      <span className="font-body text-[12.5px] text-[#BBBBBB]">{row.them}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="mt-0.5 text-[#E63946]">✓</span>
                      <span className="font-body text-[12.5px] font-semibold text-[#111110]">{row.us}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ⑥ SPEED + LOCAL SUPPORT — two small cards */}
          <motion.div
            {...fadeUp(0.37)}
            className="group relative overflow-hidden rounded-2xl border border-[rgba(0,0,0,0.07)] bg-[#111110] p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1"
          >
            <div className="mb-4 font-display text-[64px] font-extrabold leading-none tracking-[-4px] text-white">
              60<span className="text-[#E63946] text-[40px]">s</span>
            </div>
            <h3 className="mb-2 font-display text-[17px] font-bold text-white">Scan to print in hand.</h3>
            <p className="font-body text-[13px] font-light leading-[1.65] text-[rgba(255,255,255,0.4)]">
              No app. No USB. No queue. Just a QR and a phone.
            </p>
          </motion.div>

          <motion.div
            {...fadeUp(0.42)}
            className="group relative overflow-hidden rounded-2xl border border-[rgba(0,0,0,0.07)] bg-white p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.04)] transition-all duration-300 hover:border-[rgba(0,0,0,0.12)] hover:-translate-y-1"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-[rgba(0,0,0,0.07)] bg-[#F8F7F4] transition-colors duration-300 group-hover:border-[rgba(230,57,70,0.2)] group-hover:bg-[rgba(230,57,70,0.05)]">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-[#E63946]" strokeWidth="1.8">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <h3 className="mb-2 font-display text-[17px] font-bold text-[#111110]">Bengaluru. On-site.</h3>
            <p className="font-body text-[13px] font-light leading-[1.65] text-[#6B6B66]">
              Real support, real people, real door. Not a call centre.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
