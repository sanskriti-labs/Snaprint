"use client";

import { useState } from "react";
import RevealText from "@/components/motion/RevealText";
import Snappy from "@/components/mascot/Snappy";

// ── Token data (mirrors DESIGN_SYSTEM.md) ─────────────────────────────
const palette = [
  { name: "charcoal", hex: "#0e0e0d", role: "dark sections / display type", dark: true },
  { name: "ink", hex: "#1a1a18", role: "raised dark surfaces", dark: true },
  { name: "edge", hex: "#2f2f2c", role: "hairline borders (dark)", dark: true },
  { name: "graphite", hex: "#3a3a37", role: "muted dark UI", dark: true },
  { name: "slate", hex: "#8a8a84", role: "secondary text", dark: true },
  { name: "mist", hex: "#c9c9c4", role: "dividers / disabled", dark: false },
  { name: "cloud", hex: "#e8e8e4", role: "light borders / hover", dark: false },
  { name: "paper", hex: "#f5f5f3", role: "primary light bg", dark: false },
  { name: "red", hex: "#e63946", role: "THE accent — sparingly", dark: true },
  { name: "red-deep", hex: "#c1121f", role: "red hover / pressed", dark: true },
];

const typeSpecimens = [
  { token: "display-2xl", cls: "text-display-2xl", label: "clamp(3.25rem, 8.5vw, 8.5rem)", sample: "Snap." },
  { token: "display-xl", cls: "text-display-xl", label: "clamp(2.5rem, 5.5vw, 5.5rem)", sample: "Scan." },
  { token: "display-lg", cls: "text-display-lg", label: "clamp(2rem, 3.8vw, 3.5rem)", sample: "Print in 60 seconds." },
  { token: "heading", cls: "text-heading", label: "clamp(1.4rem, 2.2vw, 2rem)", sample: "Works with any printer." },
  { token: "body-lg", cls: "text-body-lg font-body font-light", label: "1.125rem / 1.75", sample: "Snaprint turns your xerox shop into a 24/7 remote printing hub." },
  { token: "caption", cls: "text-caption font-body font-semibold uppercase", label: "0.6875rem · 0.22em", sample: "India's print network" },
];

const easings = [
  { token: "--e-reveal", curve: "cubic-bezier(0.16, 1, 0.3, 1)", gsap: "expo.out", use: "content reveals (default)" },
  { token: "--e-power", curve: "cubic-bezier(0.22, 1, 0.36, 1)", gsap: "power4.out", use: "hero / large moves" },
  { token: "--e-inout", curve: "cubic-bezier(0.65, 0, 0.35, 1)", gsap: "power3.inOut", use: "pins / scrubbed" },
  { token: "--e-hover", curve: "cubic-bezier(0.4, 0, 0.2, 1)", gsap: "power2.out", use: "hover / micro" },
];

const durations = [
  { token: "--d-hover", value: "0.4s", use: "hover + micro" },
  { token: "--d-reveal", value: "0.6s", use: "standard reveal" },
  { token: "--d-slow", value: "0.9s", use: "large reveal" },
  { token: "--d-hero", value: "1.2s", use: "hero / preloader" },
];

// Mascot tiers. Native Snappy box is 150px wide → scale = tierPx / 150.
const mascotTiers = [
  { tier: "XS", px: 24, note: "inline · simplified in prod" },
  { tier: "SM", px: 32, note: "nav · footer · simplified in prod" },
  { tier: "MD", px: 64, note: "accents · loaders · toasts" },
  { tier: "LG", px: 120, note: "one supporting moment / section" },
  { tier: "XL", px: 240, note: "the one hero / signature per page" },
];

const spacingScale = [4, 8, 12, 16, 24, 32, 48, 64, 96, 128];

function SectionLabel({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <div className="mb-10 flex items-baseline gap-4">
      <span className="font-display text-[13px] font-bold text-red">{n}</span>
      <h2 className="font-display text-heading font-bold tracking-tight text-charcoal">{children}</h2>
    </div>
  );
}

export default function StyleGuide() {
  const [replayKey, setReplayKey] = useState(0);

  return (
      <main className="bg-paper text-charcoal">
        {/* ══ SAMPLE SECTION — the crafted taste of the language ══ */}
        <section className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-charcoal px-gutter py-section">
          {/* dark dot grid */}
          <div
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "32px 32px" }}
            aria-hidden
          />
          {/* red floor glow */}
          <div
            className="pointer-events-none absolute -bottom-40 left-1/2 h-[560px] w-[860px] -translate-x-1/2"
            style={{ background: "radial-gradient(ellipse at 50% 100%, rgba(230,57,70,0.16), transparent 62%)", filter: "blur(30px)" }}
            aria-hidden
          />

          <div className="relative mx-auto grid w-full max-w-grid grid-cols-1 items-center gap-16 lg:grid-cols-[1fr_auto]">
            <div>
              <div className="mb-9 flex items-center gap-3">
                <span className="h-px w-8 bg-red" />
                <span className="font-body text-caption font-semibold uppercase text-red">
                  Snaprint · Design System v1
                </span>
              </div>

              <h1 className="font-display font-bold text-paper">
                <RevealText as="span" split="line" trigger="load" className="block text-display-2xl">
                  {"Snap.\nScan."}
                </RevealText>
                <RevealText as="span" split="line" trigger="load" delay={0.12} className="block text-display-2xl text-red">
                  {"Print."}
                </RevealText>
              </h1>

              <p className="mt-10 max-w-measure-lg font-body text-body-lg font-light text-mist">
                <RevealText split="word" trigger="load" delay={0.4}>
                  One coherent motion language. Big, confident type. Red used once per section. Nothing placed by guesswork.
                </RevealText>
              </p>
            </div>

            {/* Snappy leads this experience moment at LG (product absent). */}
            <div className="flex items-center justify-center lg:justify-end">
              <Snappy state="print-cycle" scale={120 / 150} decorative label="Snappy, print cycle" />
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2">
            <span className="font-body text-caption uppercase text-slate">scroll</span>
            <span className="h-8 w-px animate-pulse bg-gradient-to-b from-red to-transparent" />
          </div>
        </section>

        {/* ══ THE LIVING GUIDE ══ */}
        <div className="mx-auto max-w-grid px-gutter py-section">
          <p className="mb-2 font-body text-caption font-semibold uppercase tracking-[0.22em] text-slate">The system</p>
          <p className="mb-24 max-w-measure-lg font-display text-display-lg font-bold tracking-tight text-charcoal">
            Every token that ships. If it isn&apos;t here, it doesn&apos;t go in.
          </p>

          {/* 1 · COLOR */}
          <section className="mb-28">
            <SectionLabel n="01">Color</SectionLabel>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {palette.map((c) => (
                <div key={c.name} className="overflow-hidden rounded-xl border border-cloud">
                  <div className="h-24" style={{ background: c.hex }} />
                  <div className="bg-white px-3 py-3">
                    <div className="font-display text-[13px] font-bold text-charcoal">{c.name}</div>
                    <div className="font-body text-[11px] uppercase tracking-wide text-slate">{c.hex}</div>
                    <div className="mt-1 font-body text-[11px] leading-snug text-slate">{c.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 2 · TYPE */}
          <section className="mb-28">
            <SectionLabel n="02">Type scale — Space Grotesk, pushed</SectionLabel>
            <div className="flex flex-col divide-y divide-cloud border-y border-cloud">
              {typeSpecimens.map((t) => (
                <div key={t.token} className="flex flex-col gap-2 py-7 lg:flex-row lg:items-baseline lg:gap-10">
                  <div className="w-40 shrink-0">
                    <div className="font-display text-[13px] font-bold text-red">{t.token}</div>
                    <div className="font-body text-[11px] text-slate">{t.label}</div>
                  </div>
                  <div className={`font-display font-bold text-charcoal ${t.cls}`}>{t.sample}</div>
                </div>
              ))}
            </div>
          </section>

          {/* 3 · MOTION */}
          <section className="mb-28">
            <SectionLabel n="03">Motion language</SectionLabel>
            <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
              <div>
                <div className="mb-4 font-body text-caption font-semibold uppercase text-slate">Easings</div>
                <div className="flex flex-col divide-y divide-cloud border-y border-cloud">
                  {easings.map((e) => (
                    <div key={e.token} className="py-4">
                      <div className="flex items-baseline justify-between">
                        <span className="font-display text-[14px] font-bold text-charcoal">{e.token}</span>
                        <span className="font-body text-[12px] text-red">{e.gsap}</span>
                      </div>
                      <div className="font-body text-[11px] text-slate">{e.curve} · {e.use}</div>
                    </div>
                  ))}
                </div>
                <div className="mb-4 mt-8 font-body text-caption font-semibold uppercase text-slate">Durations</div>
                <div className="flex flex-wrap gap-2">
                  {durations.map((d) => (
                    <span key={d.token} className="rounded-full border border-cloud bg-white px-3 py-1.5 font-body text-[12px] text-charcoal">
                      <span className="font-semibold">{d.value}</span> <span className="text-slate">{d.token} · {d.use}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Live reveal demo */}
              <div className="rounded-2xl border border-cloud bg-charcoal p-8">
                <div className="mb-5 flex items-center justify-between">
                  <span className="font-body text-caption font-semibold uppercase text-slate">Masked reveal — live</span>
                  <button
                    onClick={() => setReplayKey((k) => k + 1)}
                    className="rounded-full bg-red px-4 py-1.5 font-body text-[12px] font-semibold text-white transition-transform duration-[--d-hover] ease-hover hover:-translate-y-0.5"
                  >
                    Replay
                  </button>
                </div>
                <div key={replayKey}>
                  <RevealText as="p" split="word" trigger="load" className="font-display text-[28px] font-bold leading-tight text-paper">
                    Lines and words rise from a mask — never a plain fade.
                  </RevealText>
                </div>
                <p className="mt-6 font-body text-[12px] leading-relaxed text-slate">
                  overflow-hidden mask · inner rises from 110% · expo.out · 0.08s stagger · synced to Lenis via ScrollTrigger.
                </p>
              </div>
            </div>
          </section>

          {/* 4 · MASCOT TIERS — baseline ruler; mascot row + matching label row so nothing overlaps */}
          <section className="mb-28">
            <SectionLabel n="04">Snappy — fixed size tiers</SectionLabel>
            <div className="overflow-x-auto rounded-2xl border border-cloud bg-white">
              <div className="flex min-w-max items-end gap-10 px-10 pt-12" style={{ height: 340 }}>
                {mascotTiers.map((m) => (
                  <div key={m.tier} className="flex justify-center" style={{ width: Math.max(m.px + 40, 150) }}>
                    <Snappy state="idle" scale={m.px / 150} decorative idleBeat={false} />
                  </div>
                ))}
              </div>
              <div className="flex min-w-max gap-10 border-t border-cloud px-10 pb-8 pt-5">
                {mascotTiers.map((m) => (
                  <div key={m.tier} className="text-center" style={{ width: Math.max(m.px + 40, 150) }}>
                    <div className="font-display text-[15px] font-bold text-charcoal">
                      {m.tier} <span className="text-red">· {m.px}px</span>
                    </div>
                    <div className="mx-auto max-w-[150px] font-body text-[11px] leading-snug text-slate">{m.note}</div>
                  </div>
                ))}
              </div>
            </div>
            <p className="mt-4 font-body text-[12px] text-slate">
              Exactly one XL per page · never two same-tier in a viewport · below 40px swap to the simplified asset · safe-area ≥ 25% of height.
            </p>
          </section>

          {/* 5 · SPACING */}
          <section>
            <SectionLabel n="05">Spacing — 4px base</SectionLabel>
            <div className="flex flex-wrap items-end gap-4">
              {spacingScale.map((s) => (
                <div key={s} className="flex flex-col items-center gap-2">
                  <div className="w-8 bg-red/80" style={{ height: s }} />
                  <span className="font-body text-[11px] text-slate">{s}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
  );
}
