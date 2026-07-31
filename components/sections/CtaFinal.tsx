"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function CtaFinal() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="contact"
      className="relative overflow-hidden px-6 py-32 md:px-10"
      style={{ background: "linear-gradient(160deg, #0f0f0e 0%, #111110 50%, #1a0405 100%)" }}
    >
      {/* Precision grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          maskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 100%)",
        }}
        aria-hidden
      />
      {/* Red core glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[700px] animate-glow-pulse"
        style={{ background: "radial-gradient(ellipse, rgba(230,57,70,0.18) 0%, rgba(230,57,70,0.04) 50%, transparent 70%)", filter: "blur(50px)" }}
        aria-hidden
      />
      {/* Top edge line */}
      <div className="absolute left-0 right-0 top-0 h-[1px]" style={{ background: "linear-gradient(90deg, transparent, rgba(230,57,70,0.5) 30%, rgba(230,57,70,0.5) 70%, transparent)" }} />

      <div className="relative mx-auto max-w-[900px] text-center">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="mb-6 flex items-center justify-center gap-3"
        >
          <span className="h-px w-8 bg-[#E63946]" />
          <span className="font-body text-[11px] font-semibold uppercase tracking-[0.22em] text-[#E63946]">Get started</span>
          <span className="h-px w-8 bg-[#E63946]" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.08 }}
          className="mb-6 font-display font-extrabold leading-[1.02] tracking-[-3px] text-white"
          style={{ fontSize: "clamp(36px,5.5vw,72px)" }}
        >
          Ready to automate your print shop?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.16 }}
          className="mb-12 mx-auto max-w-[460px] font-body text-[16px] font-light leading-[1.75] text-[rgba(255,255,255,0.38)]"
        >
          Book a live demo and see how Snaprint S1 can work inside your shop — no commitment required.
        </motion.p>

        {/* CTA cluster */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.24 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="#"
            className="inline-flex items-center gap-2.5 rounded-[8px] bg-white px-9 py-4 font-display text-[14px] font-bold text-[#111110] transition-all duration-200 hover:bg-[#E63946] hover:text-white hover:-translate-y-px"
            style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.1), 0 8px 32px rgba(0,0,0,0.35)" }}
          >
            Book a Demo
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.3" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
          <a
            href="mailto:snaprints@sanskritilabs.in"
            className="inline-flex items-center gap-2 rounded-[8px] border border-[rgba(255,255,255,0.12)] px-7 py-4 font-body text-[14px] font-medium text-[rgba(255,255,255,0.55)] transition-all duration-200 hover:border-[rgba(255,255,255,0.3)] hover:text-white"
          >
            snaprints@sanskritilabs.in
          </a>
        </motion.div>

        {/* Trust strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-8 border-t border-[rgba(255,255,255,0.06)] pt-10"
        >
          {["No commitment required", "Bengaluru-based team", "7-day installation", "Works with your printer"].map((t) => (
            <div key={t} className="flex items-center gap-2 font-body text-[12px] text-[rgba(255,255,255,0.25)]">
              <span className="h-1 w-1 rounded-full bg-[#E63946]" />
              {t}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
