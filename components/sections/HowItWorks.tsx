"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ScanLine, Upload, CreditCard, PackageOpen } from "lucide-react";

const steps = [
  {
    tag: "01", icon: ScanLine, title: "Scan the QR",
    desc: "Walk up to the Snaprint kiosk. Point your phone at the QR on screen. No app needed — works with any camera.",
    detail: "Works on Android & iOS",
  },
  {
    tag: "02", icon: Upload, title: "Upload your file",
    desc: "PDF, Word, image — any format. Choose pages, single or double-sided, colour or B&W.",
    detail: "PDF · DOCX · JPG · PNG",
  },
  {
    tag: "03", icon: CreditCard, title: "Pay via UPI",
    desc: "GPay, PhonePe, Paytm — any UPI app. Instant confirmation. Your file is encrypted and auto-deleted after printing.",
    detail: "E2E encrypted · Auto-deleted",
  },
  {
    tag: "04", icon: PackageOpen, title: "Collect your print",
    desc: "Walk to the output tray. Print is ready. Total time: under 60 seconds from scan to paper in hand.",
    detail: "Under 60 seconds",
  },
];

function Step({ step, index, total }: { step: typeof steps[0]; index: number; total: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const Icon = step.icon;
  const isLast = index === total - 1;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -24 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex gap-6"
    >
      {/* Left: number + connector */}
      <div className="flex flex-col items-center">
        <div
          className="relative flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-[rgba(230,57,70,0.25)] bg-[rgba(230,57,70,0.06)] transition-all duration-300"
          style={inView ? { boxShadow: "0 0 0 4px rgba(230,57,70,0.06)" } : {}}
        >
          <span className="font-display text-[13px] font-bold text-[#E63946]">{step.tag}</span>
          {inView && (
            <motion.div
              initial={{ scale: 1, opacity: 0.4 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ duration: 1.5, delay: index * 0.1 + 0.3, repeat: Infinity, repeatDelay: 2.5 }}
              className="absolute inset-0 rounded-full bg-[#E63946]"
            />
          )}
        </div>
        {!isLast && (
          <div className="relative mt-2 flex-1 w-[1px] overflow-hidden" style={{ minHeight: 60 }}>
            <div className="absolute inset-0 bg-[rgba(0,0,0,0.08)]" />
            <motion.div
              initial={{ height: "0%" }}
              animate={inView ? { height: "100%" } : {}}
              transition={{ duration: 0.8, delay: index * 0.1 + 0.4 }}
              className="absolute top-0 left-0 right-0 bg-gradient-to-b from-[#E63946] to-transparent"
            />
          </div>
        )}
      </div>

      {/* Right: content */}
      <div className="pb-10 flex-1">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-[rgba(230,57,70,0.15)] bg-[rgba(230,57,70,0.05)]">
            <Icon size={18} className="text-[#E63946]" strokeWidth={1.8} />
          </div>
          <span className="rounded-full border border-[rgba(0,0,0,0.08)] bg-[#F8F7F4] px-3 py-1 font-body text-[10px] font-medium tracking-wide text-[#6B6B66]">
            {step.detail}
          </span>
        </div>
        <h3 className="mb-2.5 font-display text-[19px] font-bold text-[#111110]">{step.title}</h3>
        <p className="max-w-[400px] font-body text-[14px] font-light leading-[1.72] text-[#6B6B66]">{step.desc}</p>
      </div>
    </motion.div>
  );
}

export default function HowItWorks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="how" className="relative overflow-hidden bg-white px-6 py-28 md:px-10">
      {/* Subtle left-side warm tint */}
      <div
        className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 h-[500px] w-[300px]"
        style={{ background: "radial-gradient(ellipse at left, rgba(230,57,70,0.04) 0%, transparent 70%)" }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-[1280px]">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_1fr] lg:gap-24">

          {/* Left: sticky heading */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <motion.p
              ref={ref}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              className="mb-5 font-body text-[11px] font-semibold uppercase tracking-[0.2em] text-[#E63946]"
            >
              How it works
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.08 }}
              className="mb-6 font-display font-extrabold leading-[1.06] tracking-[-2px] text-[#111110]"
              style={{ fontSize: "clamp(28px,3.8vw,52px)" }}
            >
              Print in your hand in 60 seconds.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.14 }}
              className="mb-10 max-w-[380px] font-body text-[16px] font-light leading-[1.78] text-[#6B6B66]"
            >
              No app download. No USB drive. No queue. Just a phone and a QR code — designed for India.
            </motion.p>

            {/* 60s badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-4 rounded-2xl border border-[rgba(230,57,70,0.2)] bg-[rgba(230,57,70,0.04)] px-6 py-5"
            >
              <div className="font-display text-[40px] font-extrabold leading-none text-[#E63946]">60s</div>
              <div>
                <div className="font-body text-[13px] font-semibold text-[#111110]">scan to print</div>
                <div className="font-body text-[11px] text-[#999994]">average time in hand</div>
              </div>
            </motion.div>
          </div>

          {/* Right: steps */}
          <div className="pt-2">
            {steps.map((s, i) => (
              <Step key={s.tag} step={s} index={i} total={steps.length} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
