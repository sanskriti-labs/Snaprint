"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const testimonials = [
  {
    initials: "RK",
    name: "Ramesh Kumar",
    role: "Shop owner near BMSCE, Bengaluru",
    quote: "Students used to walk past my shop to the machine down the road. Now they upload from hostel and collect from my counter. My evening hours are my busiest.",
  },
  {
    initials: "SP",
    name: "Suresh Patil",
    role: "3-branch shop owner, Jayanagar",
    quote: "I was worried about technology but the setup was easy. The dashboard shows me every order in real time. I feel like I'm running a proper business now.",
  },
  {
    initials: "MA",
    name: "Mohammed Asif",
    role: "Xerox shop near PES University",
    quote: "What I like most — it works with my existing Canon printer. I didn't change anything. Snaprint just added remote orders on top of what I already had.",
  },
];

function Stars() {
  return (
    <div className="mb-5 flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="13" height="13" viewBox="0 0 14 14" fill="#E63946">
          <polygon points="7,0.5 8.8,5 13.5,5 9.8,8 11.2,13 7,10 2.8,13 4.2,8 0.5,5 5.2,5" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="testimonials" className="relative overflow-hidden bg-[#F8F7F4] px-6 py-28 md:px-10 bg-dot-grid">
      <div className="relative mx-auto max-w-[1280px]">
        <motion.p
          ref={ref}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="mb-5 font-body text-[11px] font-semibold uppercase tracking-[0.2em] text-[#E63946]"
        >
          What shop owners say
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.08 }}
          className="mb-5 max-w-[560px] font-display font-extrabold leading-[1.06] tracking-[-2px] text-[#111110]"
          style={{ fontSize: "clamp(28px,3.8vw,52px)" }}
        >
          Real shops. Real results.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.14 }}
          className="mb-16 max-w-[460px] font-body text-[16px] font-light leading-[1.78] text-[#6B6B66]"
        >
          From BMSCE to PES University — xerox shop owners in Bengaluru are already seeing the difference.
        </motion.p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="group light-card relative overflow-hidden rounded-2xl p-8"
            >
              {/* Large ghost quote */}
              <div
                className="pointer-events-none absolute -right-2 -top-4 font-display text-[120px] font-bold leading-none text-[#111110]/[0.04] select-none transition-opacity duration-300 group-hover:text-[#E63946]/[0.06]"
                aria-hidden
              >
                &ldquo;
              </div>
              {/* Top glow line on hover */}
              <div className="absolute left-0 right-0 top-0 h-[2px] w-0 rounded-t-2xl bg-[#E63946] transition-all duration-500 group-hover:w-full" />

              <div className="relative">
                <Stars />
                <p className="mb-7 font-body text-[14.5px] font-light italic leading-[1.78] text-[#555550]">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-[38px] w-[38px] flex-shrink-0 items-center justify-center rounded-full font-display text-[12px] font-bold text-[#E63946]"
                    style={{
                      background: "rgba(230,57,70,0.08)",
                      border: "1px solid rgba(230,57,70,0.2)",
                    }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <div className="font-display text-[13.5px] font-semibold text-[#111110]">{t.name}</div>
                    <div className="font-body text-[11px] text-[#999994]">{t.role}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust metric bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="mt-14 flex flex-wrap items-center justify-center gap-10 border-t border-[rgba(0,0,0,0.06)] pt-12"
        >
          {[["500+", "daily prints possible"], ["60s", "scan to print"], ["7 days", "to go live"], ["0%", "per-print commission"]].map(([val, lbl]) => (
            <div key={lbl} className="text-center">
              <div className="font-display text-[26px] font-extrabold tracking-tight text-[#111110]">{val}</div>
              <div className="font-body text-[11px] text-[#999994]">{lbl}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
