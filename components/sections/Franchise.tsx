"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const features = [
  "Complete Snaprint S1 kiosk hardware",
  "Snaprint OS pre-installed and activated",
  "On-site installation in Bengaluru",
  "2000-sheet starter paper supply",
  "Owner dashboard + training session",
  "6 months software support included",
  "Snaprint shop branding kit",
];

const founderFeatures = [
  "All S1 standard features included",
  "₹30,000 cashback after 500 prints in month 1",
  "Priority on-ground Bengaluru support",
  "Featured on Snaprint network map",
  "Co-branded shop signage installation",
  "Direct line to the founding team",
];

const steps = [
  { n: "01", t: "Apply", d: "Fill the short form or message on WhatsApp. Tell us your shop location and daily print volume." },
  { n: "02", t: "Site visit", d: "Our Bengaluru team visits your shop. We verify space, power, and internet. Takes 30 minutes." },
  { n: "03", t: "Agreement", d: "Simple one-page agreement. No hidden clauses. You own the machine. We support the software." },
  { n: "04", t: "Go live", d: "Installation, setup, and training by our team. Your Snaprint kiosk is live within 7 days of payment." },
];

function Check({ dark }: { dark?: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="mt-[3px] flex-shrink-0">
      <circle cx="7" cy="7" r="7" fill={dark ? "rgba(255,255,255,0.1)" : "rgba(230,57,70,0.1)"} />
      <path d="M4 7l2 2 4-4" stroke={dark ? "#ffffff" : "#E63946"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Franchise() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="franchise" className="relative overflow-hidden bg-white px-6 py-28 md:px-10">
      <div className="relative mx-auto max-w-[1280px]">
        <motion.p
          ref={ref}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="mb-5 font-body text-[11px] font-semibold uppercase tracking-[0.2em] text-[#E63946]"
        >
          Franchise model
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.08 }}
          className="mb-5 max-w-[560px] font-display font-extrabold leading-[1.06] tracking-[-2px] text-[#111110]"
          style={{ fontSize: "clamp(28px,3.8vw,52px)" }}
        >
          One investment. Lifetime network.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.14 }}
          className="mb-16 max-w-[460px] font-body text-[16px] font-light leading-[1.78] text-[#6B6B66]"
        >
          No hidden fees. No per-print commission. ₹3 lakh all-in and you are
          part of India&apos;s fastest-growing print network.
        </motion.p>

        {/* Pricing cards */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14 grid grid-cols-1 gap-4 lg:grid-cols-2"
        >
          {/* Standard */}
          <div className="relative overflow-hidden rounded-2xl border border-[rgba(0,0,0,0.07)] bg-white p-10 shadow-[0_1px_4px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.04)] lg:p-12">
            <div className="absolute left-0 right-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[rgba(230,57,70,0.5)] to-transparent" />

            <div className="mb-5 inline-block rounded-full border border-[rgba(230,57,70,0.2)] bg-[rgba(230,57,70,0.06)] px-3 py-1 font-body text-[10px] font-semibold uppercase tracking-[0.1em] text-[#E63946]">
              Snaprint S1 · Standard
            </div>
            <div className="font-display text-[62px] font-extrabold leading-none tracking-[-3px] text-[#111110]">
              ₹<span className="text-[#E63946]">3</span>L
            </div>
            <div className="mb-9 mt-2 font-body text-[13px] font-light text-[#999994]">
              all-in · one-time · no hidden charges
            </div>
            <div className="mb-8 space-y-3.5">
              {features.map((f) => (
                <div key={f} className="flex items-start gap-2.5">
                  <Check />
                  <span className="font-body text-[13.5px] font-light leading-[1.6] text-[#555550]">{f}</span>
                </div>
              ))}
            </div>
            {/* ROI box */}
            <div className="rounded-xl border border-[rgba(230,57,70,0.12)] bg-[rgba(230,57,70,0.04)] p-6">
              <div className="mb-4 font-body text-[10px] font-semibold uppercase tracking-[0.14em] text-[#E63946]">
                Estimated monthly earning
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="font-display text-[22px] font-bold text-[#111110]">₹12,500</div>
                  <div className="font-body text-[11px] text-[#999994]">at 500 prints/day</div>
                </div>
                <div>
                  <div className="font-display text-[22px] font-bold text-[#111110]">₹25,000</div>
                  <div className="font-body text-[11px] text-[#999994]">at 1000 prints/day</div>
                </div>
              </div>
            </div>
          </div>

          {/* Founding partner — intentionally dark card for contrast */}
          <div
            className="relative overflow-hidden rounded-2xl p-10 lg:p-12"
            style={{
              background: "linear-gradient(135deg, #1a0406 0%, #0f0002 40%, #0A0A09 100%)",
              border: "1px solid rgba(230,57,70,0.2)",
              boxShadow: "0 8px 40px rgba(230,57,70,0.12), 0 1px 4px rgba(0,0,0,0.1)",
            }}
          >
            <div
              className="pointer-events-none absolute -right-20 -top-20 h-[300px] w-[300px] animate-glow-pulse rounded-full"
              style={{ background: "radial-gradient(ellipse, rgba(230,57,70,0.3) 0%, transparent 70%)" }}
              aria-hidden
            />
            <div className="absolute left-0 right-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#E63946] to-transparent" />

            <div className="relative">
              <div className="mb-2 font-body text-[11px] font-medium uppercase tracking-[0.14em] text-[rgba(230,57,70,0.6)]">
                Founding partner offer
              </div>
              <div className="font-display text-[62px] font-extrabold leading-none tracking-[-3px] text-white">
                First <span className="text-[#E63946]" style={{ textShadow: "0 0 30px rgba(230,57,70,0.7)" }}>10</span>
              </div>
              <div className="mb-9 mt-2 font-body text-[13px] font-light text-[rgba(255,255,255,0.35)]">
                founding partners · Bengaluru only
              </div>
              <div className="mb-9 space-y-3.5">
                {founderFeatures.map((f) => (
                  <div key={f} className="flex items-start gap-2.5">
                    <Check dark />
                    <span className="font-body text-[13.5px] font-light leading-[1.6] text-[rgba(255,255,255,0.6)]">{f}</span>
                  </div>
                ))}
              </div>
              <a
                href="https://wa.me/919999999999"
                className="flex w-full items-center justify-center gap-2 rounded-[8px] bg-[#E63946] py-4 font-display text-[14px] font-semibold text-white transition-all duration-200 hover:bg-[#C1121F] hover:-translate-y-0.5"
                style={{ boxShadow: "0 4px 20px rgba(230,57,70,0.45), 0 2px 6px rgba(230,57,70,0.25)" }}
              >
                Apply now on WhatsApp
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
              <p className="mt-3 text-center font-body text-[11px] font-light text-[rgba(255,255,255,0.25)]">
                Only 10 founding spots · Bengaluru
              </p>
            </div>
          </div>
        </motion.div>

        {/* Path to partnership */}
        <div className="mb-6 font-body text-[11px] font-semibold uppercase tracking-[0.2em] text-[#E63946]">
          Path to partnership
        </div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.38 }}
          className="grid grid-cols-1 overflow-hidden rounded-2xl border border-[rgba(0,0,0,0.07)] bg-white shadow-[0_1px_4px_rgba(0,0,0,0.04)] md:grid-cols-2 lg:grid-cols-4"
        >
          {steps.map((s, i) => (
            <div
              key={s.n}
              className={`group p-8 transition-colors duration-200 hover:bg-[#F8F7F4] ${
                i < 3 ? "border-b border-[rgba(0,0,0,0.06)] lg:border-b-0 lg:border-r lg:border-[rgba(0,0,0,0.06)]" : ""
              }`}
            >
              <div className="mb-4 font-display text-[42px] font-extrabold leading-none tracking-[-2px] text-[#111110]/[0.05] group-hover:text-[#111110]/[0.08] transition-colors">
                {s.n}
              </div>
              <div className="mb-2 font-display text-[15px] font-semibold text-[#111110]">{s.t}</div>
              <div className="font-body text-[13px] font-light leading-[1.65] text-[#6B6B66]">{s.d}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
