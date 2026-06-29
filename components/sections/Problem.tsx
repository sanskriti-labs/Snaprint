"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const problems = [
  {
    num: "01",
    title: "Students go to the machine next door",
    desc: "Self-service kiosks placed near colleges pull students who don't want to wait — even when your shop is just 50 metres away.",
  },
  {
    num: "02",
    title: "Remote orders you never capture",
    desc: "Students already WhatsApp files to shops saying \"print 2 copies.\" This revenue is real — it's just untracked, unpaid, and slipping away.",
  },
  {
    num: "03",
    title: "Peak hour chaos loses you customers",
    desc: "Exam season, assignment deadlines — queues pile up and customers leave. The machine down the road is quietly printing for 40 of them.",
  },
  {
    num: "04",
    title: "Snaprint fixes all three.",
    desc: "One kiosk inside your shop. Students upload from anywhere, pay via UPI, and collect from your counter. You run it. We automate it.",
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
      {/* Ghost number */}
      <div
        className={`pointer-events-none absolute -right-4 -top-6 font-display text-[120px] font-bold leading-none select-none ${
          highlight ? "text-white/[0.12]" : "text-[#111110]/[0.04]"
        }`}
        aria-hidden
      >
        {num}
      </div>

      {/* Top red line for non-highlight on hover */}
      {!highlight && (
        <div
          className="absolute left-0 right-0 top-0 h-[2px] w-0 rounded-t-2xl bg-[#E63946] transition-all duration-500 group-hover:w-full"
          aria-hidden
        />
      )}

      <div className="relative">
        <div className={`mb-3 font-body text-[10px] font-semibold uppercase tracking-[0.18em] ${
          highlight ? "text-white/60" : "text-[#E63946]"
        }`}>
          {highlight ? "The solution" : `Problem ${num}`}
        </div>
        <div className={`mb-3 font-display text-[18px] font-bold leading-[1.2] ${
          highlight ? "text-white" : "text-[#111110]"
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
    <section id="problem" className="relative overflow-hidden bg-[#F8F7F4] px-6 py-28 md:px-10 bg-dot-grid">
      <div className="relative mx-auto max-w-[1280px]">
        <motion.p
          ref={ref}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="mb-5 font-body text-[11px] font-semibold uppercase tracking-[0.2em] text-[#E63946]"
        >
          The real problem
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.08 }}
          className="mb-5 max-w-[560px] font-display font-extrabold leading-[1.06] tracking-[-2px] text-[#111110]"
          style={{ fontSize: "clamp(28px,3.8vw,52px)" }}
        >
          Kiosks placed near your shop are stealing your students.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.14 }}
          className="mb-16 max-w-[460px] font-body text-[16px] font-light leading-[1.78] text-[#6B6B66]"
        >
          Other automated kiosks work against you. Snaprint works for you — turning your existing shop into the smarter choice.
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
