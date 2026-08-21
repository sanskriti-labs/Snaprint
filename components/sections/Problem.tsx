"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import RevealText from "@/components/motion/RevealText";

const problems = [
  {
    num: "01",
    title: "A five-minute errand takes twenty",
    desc: "People already expect to scan, pay and walk away, for food, for transit, for almost everything. Printing is still stuck behind a counter and a queue.",
  },
  {
    num: "02",
    title: "It only works when someone's behind the counter",
    desc: "A shut shop, a break between classes, an after-hours request: printing that depends on staff being present is printing that's unavailable half the time.",
  },
  {
    num: "03",
    title: "Peak demand always outruns a counter",
    desc: "Exam season, deadline week, a busy lobby: request volume spikes far past what one person handling one job at a time can keep up with.",
  },
  {
    num: "04",
    title: "Snaprint fixes all three.",
    desc: "A self-service kiosk wherever people already are, a hallway, a co-working floor, a business centre lobby. Scan, upload, pay, collect. Runs unattended, all day.",
    highlight: true,
  },
];

function Card({ num, title, desc, highlight, index }: {
  num: string; title: string; desc: string; highlight?: boolean; index: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: index * 0.09, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative overflow-hidden rounded-2xl p-10 transition-all duration-300 ${
        highlight
          ? "bg-[#E63946]"
          : "light-card cursor-default"
      }`}
      style={highlight ? {
        boxShadow: "0 8px 32px rgba(230,57,70,0.3), 0 2px 8px rgba(230,57,70,0.2)"
      } : {}}
    >
      {/* Top red line for non-highlight on hover */}
      {!highlight && (
        <div
          className="absolute left-0 right-0 top-0 h-[2px] w-0 rounded-t-2xl bg-[#E63946] transition-all duration-500 group-hover:w-full"
          aria-hidden
        />
      )}

      <div className="relative">
        <div className={`mb-4 font-body text-[11px] font-semibold uppercase tracking-[0.18em] ${
          highlight ? "text-white/60" : "text-red"
        }`}>
          {highlight ? "The solution" : `Problem ${num}`}
        </div>
        <div className={`mb-3 font-display text-[18px] font-bold leading-[1.2] ${
          highlight ? "text-white" : "text-charcoal"
        }`}>
          {title}
        </div>
        <div className={`font-body text-[14px] font-light leading-[1.72] ${
          highlight ? "text-white/70" : "text-[#6B6B66]"
        }`}>
          {desc}
        </div>
      </div>
    </motion.div>
  );
}

export default function Problem() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="problem" className="relative overflow-hidden bg-paper px-6 py-24 md:px-10 bg-dot-grid">
      <div className="relative mx-auto max-w-[1280px]">
        <motion.p
          ref={ref}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="mb-5 font-body text-[11px] font-semibold uppercase tracking-[0.2em] text-[#E63946]"
        >
          The opportunity
        </motion.p>
        <RevealText
          as="h2"
          split="word"
          className="mb-5 block max-w-[560px] font-display text-display-lg font-extrabold text-charcoal"
        >
          The queue is the problem. Not the printing.
        </RevealText>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.14 }}
          className="mb-16 max-w-[460px] font-body text-[16px] font-light leading-[1.78] text-[#6B6B66]"
        >
          For the person who owns the machine, that shift is the opportunity: a printing business that doesn&apos;t need a till, a rota, or someone standing next to it all day.
        </motion.p>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {problems.map((p, i) => (
            <Card key={p.num} {...p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
