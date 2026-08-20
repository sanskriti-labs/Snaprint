"use client";

import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";
import RevealText from "@/components/motion/RevealText";

// ── The customer print-app flow from the design mockup (Snaprint Mockups 1e).
// Six screens: Connect → Add files → Settings → Pay → Printing → Collect.
// Static showcase (not a working app). Per-page prices are illustrative — each
// operator sets their own and keeps 100% of it.

function Phone({ step, of, back, children }: { step: number; of: number; back?: string; children: ReactNode }) {
  return (
    <div className="relative flex h-[620px] w-[286px] shrink-0 snap-center flex-col overflow-hidden rounded-[30px] bg-charcoal text-paper shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)] ring-1 ring-white/5">
      {/* status bar */}
      <div className="flex items-center justify-between px-6 pt-4 text-[11px] font-semibold">
        <span>9:41</span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-[7px] w-[13px] rounded-[2px] border border-mist" />
          <span className="inline-block h-[7px] w-[16px] rounded-[2px] bg-mist" />
        </span>
      </div>
      {/* nav row */}
      <div className="flex items-center justify-between px-6 pt-4 text-[11px] text-slate">
        <span>{back ? `← ${back}` : " "}</span>
        <span className="font-semibold text-mist">Step {step} of {of}</span>
      </div>
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
}

const chip = "rounded-[10px] border border-edge bg-ink px-3 py-2.5 text-center text-[11px] font-semibold";
const chipActive = "rounded-[10px] bg-paper px-3 py-2.5 text-center text-[11px] font-bold text-charcoal";

function KioskGlyph({ done = false }: { done?: boolean }) {
  return (
    <div className="relative mx-auto h-[140px] w-[112px]">
      <div className="absolute inset-0 rounded-[16px] bg-edge ring-1 ring-graphite" />
      <div className="absolute inset-x-0 top-0 h-[30px] rounded-t-[16px] bg-red" />
      <div className="absolute inset-x-4 top-11 flex h-[44px] items-center justify-center gap-4 rounded-lg bg-paper">
        <span className="h-2 w-[7px] rounded-[3px] bg-charcoal" />
        <span className="h-2 w-[7px] rounded-[3px] bg-charcoal" />
        <span className="absolute bottom-3 h-3 w-6 rounded-b-[14px] border-b-[3px] border-charcoal" />
      </div>
      <div className="absolute inset-x-6 top-[100px] h-[7px] overflow-hidden rounded bg-charcoal">
        <div className="h-full bg-red" style={{ width: done ? "100%" : "62%" }} />
      </div>
      <div
        className="absolute left-1/2 h-9 w-14 -translate-x-1/2 rounded-[2px] bg-paper shadow-[0_8px_18px_rgba(0,0,0,0.55)]"
        style={{ top: done ? 116 : 122, transform: `translateX(-50%) rotate(${done ? -3 : 0}deg)` }}
      />
    </div>
  );
}

const screens: { step: number; back?: string; node: ReactNode }[] = [
  {
    step: 1,
    node: (
      <div className="flex h-full flex-col px-6">
        <div className="mt-2 inline-flex w-fit items-center gap-2 rounded-full border border-edge bg-ink px-3 py-1.5 text-[10px] font-semibold tracking-wider text-mist">
          <span className="h-1.5 w-1.5 rounded-full bg-red" /> KIOSK ONLINE
        </div>
        <div className="mt-4 font-display text-[34px] font-extrabold leading-[1.02] tracking-tight">Connect to<br />this S1.</div>
        <div className="mt-3 text-[13px] leading-relaxed text-mist">Sri Sai Xerox · Koramangala 4th Block<br />Kiosk ID S1-BLR-0412</div>
        <div className="mt-5 h-[210px] rounded-[16px] bg-gradient-to-br from-ink to-charcoal ring-1 ring-white/5" />
        <div className="mt-auto pb-7">
          <div className="rounded-[14px] bg-red py-4 text-center text-[15px] font-bold text-white">Start printing</div>
          <div className="mt-3 text-center text-[12px] text-slate">Scan a different kiosk</div>
        </div>
      </div>
    ),
  },
  {
    step: 1, back: "Kiosk",
    node: (
      <div className="flex h-full flex-col px-6">
        <div className="mt-3 font-display text-[28px] font-extrabold tracking-tight">Add your files</div>
        <div className="mt-4 flex gap-2">
          {["Files", "Drive", "Camera"].map((t) => <div key={t} className={`${chip} flex-1`}>{t}</div>)}
        </div>
        <div className="mt-4 flex flex-col gap-2.5">
          {[["Thesis_final_v4.pdf", "4 pages · A4"], ["ID_proof.jpg", "1 page · colour"], ["Lab_notes.pdf", "3 pages · A4"]].map(([name, meta]) => (
            <div key={name} className="flex items-center gap-3 rounded-[14px] border border-[#232320] bg-[#151513] p-2.5">
              <div className="h-[52px] w-[40px] rounded bg-[#242421]" />
              <div className="flex-1">
                <div className="text-[13px] font-semibold">{name}</div>
                <div className="mt-0.5 text-[11px] text-slate">{meta}</div>
              </div>
              <span className="text-[16px] text-slate">×</span>
            </div>
          ))}
        </div>
        <div className="mt-3 rounded-[14px] border border-dashed border-graphite p-4 text-center text-[12px] text-slate">Drop more files here</div>
        <div className="mt-auto flex items-center gap-3 pb-7">
          <div className="flex-1">
            <div className="text-[11px] text-slate">3 files</div>
            <div className="text-[15px] font-bold">8 pages</div>
          </div>
          <div className="rounded-[14px] bg-red px-7 py-3.5 text-[14px] font-bold text-white">Continue</div>
        </div>
      </div>
    ),
  },
  {
    step: 2, back: "Files",
    node: (
      <div className="flex h-full flex-col px-6">
        <div className="mt-2 font-display text-[28px] font-extrabold tracking-tight">Print settings</div>
        <div className="mt-4 flex items-start gap-4">
          <div className="h-[120px] w-[92px] shrink-0 rounded-[10px] bg-[#242421]" />
          <div className="text-[12px] leading-relaxed text-mist">
            <div className="text-[13px] font-bold text-paper">8 pages queued</div>
            <div className="mt-1">B&amp;W A4 · ₹2/page</div>
            <div>Colour A4 · ₹9/page</div>
            <div className="mt-2 text-[11px] text-slate">Priced before you pay. No minimum.</div>
          </div>
        </div>
        <div className="mt-5 space-y-4">
          <div>
            <div className="mb-2 text-[10px] font-bold tracking-widest text-slate">PAPER SIZE</div>
            <div className="flex gap-2"><div className={`${chipActive} flex-1`}>A4</div><div className={`${chip} flex-1 text-mist`}>A3</div><div className={`${chip} flex-1 text-mist`}>4×6</div></div>
          </div>
          <div>
            <div className="mb-2 text-[10px] font-bold tracking-widest text-slate">COLOUR</div>
            <div className="flex gap-2"><div className={`${chipActive} flex-1`}>Black &amp; white</div><div className={`${chip} flex-1 text-mist`}>Colour</div></div>
          </div>
        </div>
        <div className="mt-auto flex items-center gap-3 pb-7">
          <div className="flex-1">
            <div className="text-[11px] text-slate">8 pages · double-sided</div>
            <div className="font-display text-[22px] font-extrabold tracking-tight">₹16</div>
          </div>
          <div className="rounded-[14px] bg-red px-8 py-3.5 text-[14px] font-bold text-white">Pay</div>
        </div>
      </div>
    ),
  },
  {
    step: 3, back: "Settings",
    node: (
      <div className="flex h-full flex-col px-6 text-center">
        <div className="mt-6 text-[11px] font-bold tracking-widest text-slate">TOTAL DUE</div>
        <div className="mt-2 font-display text-[70px] font-extrabold leading-none tracking-[-3px]">₹16</div>
        <div className="mt-2 text-[12px] text-slate">Charged only when the last page lands.</div>
        <div className="mt-6 space-y-2 text-left">
          <div className="mb-2 text-[10px] font-bold tracking-widest text-slate">PAY WITH</div>
          <div className="flex items-center gap-3 rounded-[14px] border-[1.5px] border-red bg-[#151513] px-4 py-3.5">
            <span className="h-5 w-5 rounded-full border-[5px] border-red" /><span className="text-[14px] font-semibold">UPI · any app</span>
          </div>
          <div className="flex items-center gap-3 rounded-[14px] border border-[#232320] bg-[#151513] px-4 py-3.5">
            <span className="h-5 w-5 rounded-full border-[1.5px] border-graphite" /><span className="text-[14px] text-mist">Card</span>
          </div>
        </div>
        <div className="mt-auto pb-7">
          <div className="rounded-[14px] bg-red py-4 text-[15px] font-bold text-white">Pay ₹16</div>
        </div>
      </div>
    ),
  },
  {
    step: 3, back: "Pay",
    node: (
      <div className="flex h-full flex-col px-6 text-center">
        <div className="mt-8"><KioskGlyph /></div>
        <div className="mt-8 font-display text-[30px] font-extrabold tracking-tight">Printing now</div>
        <div className="mt-2 text-[13px] text-mist">Sheet 5 of 8 · about 14 seconds left</div>
        <div className="mt-7 h-1.5 overflow-hidden rounded bg-[#232320]"><div className="h-full rounded bg-red" style={{ width: "62%" }} /></div>
        <div className="mt-2.5 flex justify-between text-[11px] text-slate"><span>62%</span><span>S1-BLR-0412</span></div>
        <div className="mt-6 flex items-center gap-3 rounded-[16px] border border-[#232320] bg-[#151513] p-4 text-left">
          <span className="h-2 w-2 shrink-0 rounded-full bg-red" />
          <div className="text-[12px] leading-snug text-mist">Stay near the kiosk. Prints are held for 90 seconds, then shredded.</div>
        </div>
        <div className="mt-auto pb-7 text-[12px] text-slate">Cancel remaining pages</div>
      </div>
    ),
  },
  {
    step: 3, back: "",
    node: (
      <div className="relative flex h-full flex-col px-6 text-center">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[260px]" style={{ background: "radial-gradient(70% 100% at 50% 0%, rgba(230,57,70,0.22), transparent 70%)" }} />
        <div className="relative mt-6"><KioskGlyph done /></div>
        <div className="relative mt-8 font-display text-[30px] font-extrabold leading-[1.05] tracking-tight">Collect your<br />prints</div>
        <div className="relative mt-2.5 text-[13px] leading-snug text-mist">8 pages are in the tray at the front of the kiosk.</div>
        <div className="relative mt-6 flex items-center justify-between rounded-[16px] border border-[#232320] bg-[#151513] p-4">
          <div className="text-left"><div className="text-[11px] text-slate">Paid · UPI</div><div className="mt-0.5 text-[14px] font-bold">₹16</div></div>
          <div className="text-[12px] font-semibold text-red">Receipt</div>
        </div>
        <div className="relative mt-auto pb-7">
          <div className="rounded-[14px] bg-paper py-4 text-[15px] font-bold text-charcoal">Print something else</div>
          <div className="mt-3 text-[12px] text-slate">Done · disconnect from kiosk</div>
        </div>
      </div>
    ),
  },
];

const labels = ["Connect", "Add files", "Settings", "Pay", "Printing", "Collect"];

export default function AppShowcase() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="app" className="relative overflow-hidden bg-[#141413] px-gutter py-section">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[900px] -translate-x-1/2" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(230,57,70,0.1), transparent 65%)" }} aria-hidden />
      <div className="relative mx-auto max-w-grid">
        <p ref={ref} className="mb-5 font-body text-caption font-semibold uppercase tracking-[0.22em] text-red">The customer app</p>
        <h2 className="mb-5 max-w-[640px] font-display text-display-lg font-bold text-paper">
          <RevealText split="word">The whole print, from their phone.</RevealText>
        </h2>
        <p className="mb-14 max-w-measure-lg font-body text-body-lg font-light text-slate">
          No app to install — the kiosk opens it in the browser. Connect, drop files, pay by UPI, walk away with paper.
        </p>

        {/* horizontal rail of the six screens */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="no-scrollbar -mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-3 md:mx-0 md:px-0"
        >
          {screens.map((s, i) => (
            <div key={i} className="flex flex-col items-center gap-4">
              <Phone step={s.step} of={3} back={s.back}>{s.node}</Phone>
              <span className="font-body text-[11px] font-semibold uppercase tracking-widest text-slate">
                <span className="text-red">{String(i + 1).padStart(2, "0")}</span> {labels[i]}
              </span>
            </div>
          ))}
        </motion.div>

        <p className="mt-8 font-body text-[12px] text-slate">
          Example pricing shown. Each operator sets their own per-page price — and keeps 100% of it.
        </p>
      </div>
    </section>
  );
}
