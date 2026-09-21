"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/motion";

// ─── CO-FOUNDER CRITIQUE ───────────────────────────────────────────
// Old: 3×2 identical icon cards + disconnected comparison table.
// Problems: no visual hierarchy, all cards same weight, icons are decorative
// noise not signal, "glass cards" on light bg look like Bootstrap defaults.
// Fix: asymmetric bento where CARD SIZE = FEATURE IMPORTANCE.
// Flagship feature gets 2× space. Every card has one bold claim, not a list.
// Comparison table is folded into the grid as a "vs" card  --  not a separate
// afterthought. Result: editorial rhythm, not SaaS template.
// ──────────────────────────────────────────────────────────────────

// ₹2/page B&W  --  the same rate already published in AppShowcase.tsx  --  so the
// live-ticking revenue figure below stays consistent with real site pricing.
const PER_PAGE_RUPEES = 2;

/** A number that odometer-rolls (slides up, fades) whenever its value changes. */
function RollingNumber({ value, className }: { value: string; className?: string }) {
  return (
    <span className="relative inline-block overflow-hidden">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className={`inline-block ${className ?? ""}`}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/** Simulates a live dashboard  --  print count ticks up on a random cadence, revenue
 * is derived from it rather than being a separate fake number. Skipped under
 * reduced motion, where the mock just shows a fixed snapshot. */
function useLiveDashboard() {
  const [prints, setPrints] = useState(247);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout>;
    const tick = () => {
      if (cancelled) return;
      setPrints((p) => p + 1 + Math.floor(Math.random() * 3));
      timeoutId = setTimeout(tick, 1800 + Math.random() * 2200);
    };
    timeoutId = setTimeout(tick, 1800 + Math.random() * 2200);
    return () => { cancelled = true; clearTimeout(timeoutId); };
  }, []);
  return { prints, revenue: prints * PER_PAGE_RUPEES };
}

export default function Why() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { prints, revenue } = useLiveDashboard();

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 28 },
    animate: inView ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
  });

  return (
    <section id="why" className="relative overflow-hidden bg-[#F8F7F4] px-6 py-16 md:px-10 md:py-28">

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
            Built to work{" "}
            <span className="font-serif italic font-normal text-[#999994]">
              in your favour.
            </span>
          </motion.h2>
          <motion.p
            {...fadeUp(0.14)}
            className="max-w-[300px] font-body text-[14px] font-light leading-[1.75] text-[#6B6B66] lg:text-right"
          >
            Every feature was designed with one question: does this make the owner more money with less effort?
          </motion.p>
        </div>

        {/* ── BENTO GRID ── */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-[auto_auto]">

          {/* ① FLAGSHIP  --  Universal Compatibility (spans 2 cols) */}
          <motion.div
            {...fadeUp(0.1)}
            className="group relative overflow-hidden rounded-2xl bg-[#111110] p-6 sm:p-8 md:p-10 lg:col-span-2"
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
            {/* Red glow  --  appears on hover */}
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
                  Snaprint OS connects to your entire fleet -- regardless of manufacturer -- without replacing a single cable. Your existing hardware earns more, today.
                </p>
              </div>
              {/* Compatibility strip  --  alphabetical, all boxes the same width */}
              <div className="flex flex-col gap-2 lg:items-end">
                {["Legacy Fleets", "Enterprise Models", "All Major Standards", "Custom Hardware"].map((brand) => (
                  <div
                    key={brand}
                    className="flex w-[200px] items-center justify-between gap-3 rounded-lg border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.04)] px-4 py-2.5 transition-colors duration-200 group-hover:border-[rgba(255,255,255,0.12)]"
                  >
                    <span className="flex items-center gap-3">
                      <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#E63946]" />
                      <span className="font-display text-[13px] font-semibold text-white">{brand}</span>
                    </span>
                    <span className="font-body text-[10px] text-[rgba(255,255,255,0.3)]">✓ Compatible</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ② REVENUE  --  Tall card, right column rows 1+2 */}
          <motion.div
            {...fadeUp(0.16)}
            className="group relative overflow-hidden rounded-2xl bg-[#E63946] p-6 sm:p-8 md:p-10 lg:row-span-2"
          >
            <div className="pointer-events-none absolute -bottom-12 -right-12 h-48 w-48 rounded-full bg-white/10 blur-2xl" aria-hidden />
            <div className="relative flex h-full flex-col justify-between">
              <div>
                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1">
                  <span className="font-body text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">Revenue</span>
                </div>
                {/* Large editorial number */}
                <div className="mb-2 font-mono tabular-nums text-[56px] font-extrabold leading-none tracking-[-3px] text-white sm:text-[72px] sm:tracking-[-4px] md:text-[88px] md:tracking-[-5px]">
                  100
                  <span className="text-[32px] sm:text-[40px] md:text-[48px]">%</span>
                </div>
                <p className="mb-8 font-body text-[13px] font-light leading-[1.6] text-white/70">
                  of every rupee printed stays with you. No revenue share, no per-print cut, no monthly fees, ever. Buy it once, it&apos;s yours.
                </p>

                {/* Fills the gap between the headline number and the checklist below with
                    the core ownership pitch, branded as a 2×2 grid rather than a paragraph. */}
                <div className="mb-8 grid grid-cols-2 gap-2.5">
                  {[
                    { label: "One-time investment", detail: "No EMIs, no recurring buy-in" },
                    { label: "Remote monitoring", detail: "Run it from your phone" },
                    { label: "Pocket-friendly service", detail: "Low upkeep, no surprises" },
                    { label: "Full ownership", detail: "The machine is yours, outright" },
                  ].map((item) => (
                    <div key={item.label} className="rounded-xl bg-white/10 px-4 py-3.5">
                      <div className="font-display text-[13px] font-bold leading-tight text-white">{item.label}</div>
                      <div className="mt-1 font-body text-[10.5px] font-light leading-[1.5] text-white/60">{item.detail}</div>
                    </div>
                  ))}
                </div>

                {/* Return on investment  --  same illustrative payback figures published on the
                    franchise brochure page, kept consistent rather than restated differently. */}
                <div className="mb-8 overflow-hidden rounded-xl bg-white/10">
                  <div className="border-b border-white/10 px-4 py-2.5">
                    <span className="font-body text-[10px] font-semibold uppercase tracking-[0.16em] text-white/60">
                      Return on investment
                    </span>
                  </div>
                  <div className="divide-y divide-white/10">
                    {[
                      { model: "S1", volume: "500/day", months: "≈ 1.9 mo" },
                      { model: "S1 Pro", volume: "1,000/day", months: "≈ 1.5 mo" },
                      { model: "S1 Pro Max", volume: "2,000/day", months: "≈ 1.6 mo" },
                    ].map((r) => (
                      <div key={r.model} className="flex items-center justify-between px-4 py-2.5">
                        <div>
                          <div className="font-display text-[12.5px] font-bold text-white">{r.model}</div>
                          <div className="font-body text-[10px] text-white/50">at {r.volume}</div>
                        </div>
                        <div className="font-mono tabular-nums text-[16px] font-extrabold text-white">{r.months}</div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-white/10 px-4 py-2">
                    <span className="font-body text-[9.5px] font-light leading-[1.5] text-white/40">
                      Illustrative payback, 30 operating days/month
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                {["Zero per-print cut", "No ongoing fees", "You own the machine"].map((f) => (
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
            className="group relative overflow-hidden rounded-2xl border border-[rgba(0,0,0,0.07)] bg-white p-5 sm:p-6 md:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.04)] transition-all duration-300 hover:border-[rgba(0,0,0,0.12)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:-translate-y-1"
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
            <div className="mt-6 space-y-2.5">
              {[
                "AES-256 encryption, in transit and at rest",
                "TLS-secured uploads on every session",
                "No third-party data sharing, ever",
                "Lockable rear access, owner-serviced only",
              ].map((point) => (
                <div key={point} className="flex items-start gap-2.5 rounded-lg border border-[rgba(0,0,0,0.06)] bg-[#F8F7F4] px-3.5 py-2.5">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#E63946" strokeWidth="2.5" className="mt-0.5 flex-shrink-0">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  <span className="font-body text-[11.5px] font-medium leading-[1.4] text-[#555550]">{point}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ④ DASHBOARD */}
          <motion.div
            {...fadeUp(0.26)}
            className="group relative overflow-hidden rounded-2xl border border-[rgba(0,0,0,0.07)] bg-white p-5 sm:p-6 md:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.04)] transition-all duration-300 hover:border-[rgba(0,0,0,0.12)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:-translate-y-1"
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
              Revenue, print counts, ink and paper levels, live on your phone. No step-out required.
            </p>
            {/* Mini dashboard mock  --  a live terminal readout, not a static table.
                Prints ticks up on its own cadence; revenue is derived from it
                (prints × ₹2/page) rather than being a separate fake number. */}
            <div className="mt-6 overflow-hidden rounded-xl border border-[rgba(0,0,0,0.07)] bg-[#111110]">
              <div className="flex items-center gap-1.5 border-b border-white/10 bg-white/[0.03] px-3 py-2">
                <span className="h-2 w-2 rounded-full bg-[#FF5F57]" />
                <span className="h-2 w-2 rounded-full bg-[#FEBC2E]" />
                <span className="h-2 w-2 rounded-full bg-[#28C840]" />
                <span className="ml-2 font-mono text-[9px] tracking-wide text-white">dashboard  --  live</span>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between py-0.5 font-mono">
                  <span className="text-[11px] text-white">$ today.prints</span>
                  <RollingNumber value={String(prints)} className="text-[12px] font-semibold text-white" />
                </div>
                <div className="flex items-center justify-between py-0.5 font-mono">
                  <span className="text-[11px] text-white">$ revenue.today</span>
                  <RollingNumber value={`₹${revenue.toLocaleString("en-IN")}`} className="text-[12px] font-semibold text-white" />
                </div>
                <div className="flex items-center justify-between py-0.5 font-mono">
                  <span className="text-[11px] text-white">$ paper.level</span>
                  <span className="text-[12px] font-semibold text-white">68%</span>
                </div>
                <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[68%] rounded-full bg-[#E63946] transition-all duration-700 group-hover:w-[72%]" />
                </div>
                <div className="mt-2.5 flex items-center gap-1.5">
                  <span className="animate-blink inline-block h-3 w-[6px] bg-[#E63946]" />
                  <span className="font-mono text-[10px] text-white">awaiting next print job…</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ⑤ VS CARD  --  replaces disconnected comparison table */}
          <motion.div
            {...fadeUp(0.32)}
            className="relative overflow-hidden rounded-2xl border border-[rgba(0,0,0,0.07)] bg-white p-5 sm:p-6 md:col-span-2 md:p-8 lg:col-span-3"
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
                { label: "Works with your printer", them: "Forces own hardware", us: "Any brand, zero change" },
                { label: "Investment model",         them: "High cost + hidden fees", us: "Transparent, one-time" },
                { label: "Revenue share",            them: "Per-print commission",  us: "You keep 100%" },
                { label: "Maintenance",              them: "Mandatory AMC contracts", us: "No mandatory AMC, ever" },
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

          {/* ⑥ SPEED + LOCAL SUPPORT  --  two small cards */}
          <motion.div
            {...fadeUp(0.37)}
            className="group relative overflow-hidden rounded-2xl border border-[rgba(0,0,0,0.07)] bg-[#111110] p-5 sm:p-6 md:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1"
          >
            <div className="mb-4 font-mono tabular-nums text-[64px] font-extrabold leading-none tracking-[-4px] text-white">
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
