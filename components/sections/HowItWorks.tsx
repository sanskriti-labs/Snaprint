"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import RevealText from "@/components/motion/RevealText";

type StepType = "scan" | "upload" | "choose" | "pay" | "grab";

const steps = [
  {
    tag: "01", type: "scan" as StepType, title: "Scan the QR",
    desc: "Scan the QR code on the kiosk screen with any phone camera. No app needed.",
    detail: "Android & iOS",
  },
  {
    tag: "02", type: "upload" as StepType, title: "Upload your file",
    desc: "Send documents straight from your phone, or from a cloud drive, any format.",
    detail: "PDF · DOCX · JPG",
  },
  {
    tag: "03", type: "choose" as StepType, title: "Choose settings",
    desc: "Pick paper size, number of copies, and colour or black-and-white.",
    detail: "Priced before you pay",
  },
  {
    tag: "04", type: "pay" as StepType, title: "Pay and confirm",
    desc: "Pay on the kiosk (UPI, card, or cash), then confirm to start printing instantly.",
    detail: "E2E encrypted",
  },
  {
    tag: "05", type: "grab" as StepType, title: "Collect your print",
    desc: "Walk to the output tray. Scan to paper in hand, under 60 seconds.",
    detail: "Under 60 seconds",
  },
];

/** Small looping illustration per step  --  replaces a static icon with motion that hints at the action. */
function StepIllustration({ type }: { type: StepType }) {
  if (type === "scan") {
    return (
      <div className="relative h-[18px] w-[18px]" aria-hidden>
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-[1.5px]">
          {[0, 1, 1, 0, 1, 0, 1, 0, 1].map((on, i) => (
            <div key={i} className={`rounded-[1px] ${on ? "bg-[#E63946]" : "bg-transparent"}`} />
          ))}
        </div>
        <div
          className="absolute left-0 right-0 h-[2px] rounded-full bg-[#E63946]"
          style={{ boxShadow: "0 0 6px rgba(230,57,70,0.8)", animation: "stepScanSweep 2.6s ease-in-out infinite" }}
        />
      </div>
    );
  }
  if (type === "upload") {
    return (
      <div className="relative h-[18px] w-[18px]" aria-hidden>
        <div className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-[#E63946] opacity-40" />
        <div
          className="absolute left-1/2 bottom-[4px] -translate-x-1/2"
          style={{ animation: "stepUploadArrow 2s ease-in-out infinite" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E63946" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </div>
      </div>
    );
  }
  if (type === "choose") {
    return (
      <div className="relative h-[18px] w-[18px]" aria-hidden>
        <div className="absolute left-0 top-[2px] h-[14px] w-[10px] rounded-[1.5px] border border-[#E63946] opacity-30" />
        <div
          className="absolute left-0 top-[2px] h-[14px] w-[10px] rounded-[1.5px] bg-[#E63946]"
          style={{ animation: "stepChooseSlide 2.4s ease-in-out infinite" }}
        />
      </div>
    );
  }
  if (type === "pay") {
    return (
      <div className="relative flex h-[18px] w-[18px] items-center justify-center" aria-hidden>
        {[0, 0.7].map((delay) => (
          <span
            key={delay}
            className="absolute h-[14px] w-[14px] rounded-full border border-[#E63946]"
            style={{ animation: `stepPayPing 2.1s ease-out ${delay}s infinite` }}
          />
        ))}
        <span className="relative h-[7px] w-[7px] rounded-full bg-[#E63946]" />
      </div>
    );
  }
  // grab
  return (
    <div className="relative h-[18px] w-[18px] overflow-hidden" aria-hidden>
      <div className="absolute left-0 right-0 top-[2px] h-[2px] rounded-full bg-[#E63946] opacity-50" />
      <div
        className="absolute left-[2px] right-[2px] top-0 h-[13px] rounded-b-[3px] bg-[#E63946]"
        style={{ animation: "stepGrabSlide 2.4s cubic-bezier(0.34,1.2,0.4,1) infinite" }}
      />
    </div>
  );
}

function Step({ step, index }: { step: typeof steps[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex flex-col"
    >
      {/* Number, sits on the shared connector line  --  solid backing so the line reads as
          passing behind it rather than through a translucent tint. */}
      <div className="relative z-10 mb-5 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-[rgba(230,57,70,0.25)] bg-[#FBEAEA]">
        <span className="font-display text-[13px] font-bold text-[#E63946]">{step.tag}</span>
      </div>

      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[10px] border border-[rgba(230,57,70,0.15)] bg-[rgba(230,57,70,0.05)]">
          <StepIllustration type={step.type} />
        </div>
        <span className="rounded-full border border-[rgba(0,0,0,0.08)] bg-[#F8F7F4] px-2.5 py-1 font-body text-[10px] font-medium tracking-wide text-[#6B6B66]">
          {step.detail}
        </span>
      </div>
      <h3 className="mb-2 font-display text-[17px] font-bold text-[#111110]">{step.title}</h3>
      <p className="font-body text-[13px] font-light leading-[1.65] text-[#6B6B66]">{step.desc}</p>
    </motion.div>
  );
}

export default function HowItWorks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="how" className="relative overflow-hidden bg-paper px-6 py-16 md:px-10 md:py-24">
      {/* Subtle left-side warm tint */}
      <div
        className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 h-[500px] w-[300px]"
        style={{ background: "radial-gradient(ellipse at left, rgba(230,57,70,0.04) 0%, transparent 70%)" }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-[1280px]">
        {/* Header  --  left-aligned, full width, so the row of steps below can still run edge
            to edge instead of sharing a two-column split that left a sticky sidebar idle
            once the step list ran shorter or taller than it. */}
        <div className="mb-16 max-w-[640px]">
          <motion.p
            ref={ref}
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="mb-5 font-body text-[11px] font-semibold uppercase tracking-[0.2em] text-[#E63946]"
          >
            How it works
          </motion.p>
          <RevealText
            as="h2"
            split="word"
            className="mb-6 block font-display text-display-lg font-extrabold text-charcoal"
          >
            Print in your hand in 60 seconds.
          </RevealText>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.14 }}
            className="max-w-[440px] font-body text-[16px] font-light leading-[1.78] text-[#6B6B66]"
          >
            No app download. No USB drive. No queue. Just a phone and a QR code, designed for India.
          </motion.p>
        </div>

        {/* Horizontal stepper  --  one row on desktop, wraps to 2 then 1 column as it narrows */}
        <div className="relative">
          <div
            className="pointer-events-none absolute left-6 right-6 top-6 hidden h-px bg-[rgba(0,0,0,0.08)] lg:block"
            aria-hidden
          />
          <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-5 lg:gap-x-6">
            {steps.map((s, i) => (
              <Step key={s.tag} step={s} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
