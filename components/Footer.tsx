"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Snappy, { type SnappyState } from "@/components/mascot/Snappy";

const legalLinks = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Refund policy", href: "/refund-policy" },
];

/** Click Snappy → it runs a tiny print cycle and slides out a paper slip. A discoverable, one-off easter egg — not repeated elsewhere on the site. */
function SnappySignature() {
  const [state, setState] = useState<SnappyState>("idle");
  const [slip, setSlip] = useState(false);
  const busyRef = useRef(false);

  const handleClick = () => {
    if (busyRef.current) return;
    busyRef.current = true;
    setState("printing");
    setTimeout(() => setSlip(true), 900);
    setTimeout(() => setState("done"), 1300);
    setTimeout(() => {
      setSlip(false);
      setState("idle");
      busyRef.current = false;
    }, 3600);
  };

  return (
    <div className="relative mb-4 flex items-center gap-1.5">
      <button
        type="button"
        onClick={handleClick}
        aria-label="Snappy — click for a surprise"
        className="cursor-pointer transition-transform hover:-translate-y-0.5"
      >
        {/* scale is a prop on Snappy (real resizing), not a CSS transform — a CSS
            scale() here would shrink it visually while leaving its full native
            layout box intact, throwing off alignment with the sibling columns. */}
        <Snappy state={state} scale={45 / 150} decorative idleBeat={state === "idle"} />
      </button>
      <div className="flex items-center gap-0">
        <span className="font-body text-[36px] font-extrabold tracking-[-1px] text-[#E63946]">snap</span>
        <span className="font-body text-[36px] font-extrabold tracking-[-1px] text-[#111110]">rint</span>
      </div>
      <AnimatePresence>
        {slip && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none absolute left-0 top-[calc(100%+4px)] rounded-[4px] border border-[rgba(0,0,0,0.08)] bg-white px-3 py-1.5 shadow-[0_4px_16px_rgba(0,0,0,0.1)]"
          >
            <span className="font-body text-[11px] font-semibold tracking-tight text-[#111110]">
              snap. scan. <span className="text-[#E63946]">print.</span>
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Footer() {
  const cols = [
    {
      title: "Product",
      links: [
        { label: "How it works", href: "#how" },
        { label: "Why Snaprint", href: "#why" },
        { label: "The S1 kiosk", href: "#machine" },
        { label: "Pricing", href: "/pricing" },
        { label: "Kiosk for business", href: "/kiosk" },
        { label: "Franchise", href: "/franchise" },
      ],
    },
    {
      title: "Locations",
      links: [
        { label: "Print shops by city", href: "/instant-print" },
        { label: "Print shops near you", href: "/print-near" },
        { label: "Blog", href: "/blog" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: "Book a Demo", href: "/book" },
        { label: "Request a Quote", href: "mailto:snaprints@sanskritilabs.in?subject=Quote Request" },
        { label: "snaprints@sanskritilabs.in", href: "mailto:snaprints@sanskritilabs.in" },
        { label: "Instagram", href: "https://www.instagram.com/snaprints.labs/" },
        { label: "r/Snaprint", href: "https://www.reddit.com/r/Snaprint/" },
      ],
    },
  ];

  return (
    <footer className="bg-[#F8F7F4] px-6 pb-10 pt-10 md:px-10">
      {/* Same soft, matte, borderless material as the navbar pill — a floating
          neumorphic panel rather than a flat bordered block. */}
      <div className="neu-raised-lg mx-auto max-w-[1280px] rounded-[32px] px-6 pb-8 pt-12 sm:px-10 md:px-14">

        {/* Top section */}
        <div className="mb-12 grid grid-cols-1 gap-12 border-b border-[rgba(0,0,0,0.06)] pb-12 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">

          {/* Brand block */}
          <div>
            <SnappySignature />
            <p className="mb-6 max-w-[220px] font-body text-[13px] leading-[1.75] text-[#777770]">
              Self-service print kiosks you own outright. Built by Sanskriti Labs, Bengaluru.
            </p>
            <a
              href="mailto:snaprints@sanskritilabs.in"
              data-magnetic="0.3"
              className="neu-raised inline-flex items-center gap-2 rounded-full px-4 py-2 font-body text-[12.5px] font-medium text-charcoal transition-colors hover:text-red"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              snaprints@sanskritilabs.in
            </a>
          </div>

          {/* Link columns */}
          {cols.map((col) => (
            <div key={col.title}>
              <div className="mb-4 font-body text-[11px] font-semibold uppercase tracking-[0.14em] text-[#AAAAAA]">
                {col.title}
              </div>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="font-body text-[13.5px] text-[#555550] transition-colors duration-150 hover:text-[#E63946]"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <span className="font-body text-[12.5px] text-[#AAAAAA]">
            © 2026 Snaprint · A{" "}
            <a
              href="https://sanskritilabs.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#AAAAAA] underline decoration-[rgba(0,0,0,0.15)] underline-offset-2 transition-colors hover:text-[#555550]"
            >
              Sanskriti Labs
            </a>{" "}
            product · Bengaluru, India
          </span>
          <div className="flex items-center gap-1">
            {legalLinks.map((l, i) => (
              <span key={l.label} className="flex items-center gap-1">
                {i > 0 && <span className="text-[#DDDDDD]">·</span>}
                <a href={l.href} className="font-body text-[12.5px] text-[#AAAAAA] transition-colors hover:text-[#555550]">{l.label}</a>
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
