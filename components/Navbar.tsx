"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const links = [
  { label: "How it works", href: "#how" },
  { label: "Features", href: "/features" },
  { label: "Results", href: "#testimonials" },
  { label: "Pricing", href: "/pricing" },
  { label: "Franchise", href: "/franchise" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/[0.96] backdrop-blur-xl shadow-[0_1px_0_rgba(0,0,0,0.07),0_4px_24px_rgba(0,0,0,0.05)]"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-[66px] max-w-[1280px] items-center justify-between px-6 md:px-10">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-0 no-underline select-none">
          <span className="font-display text-[21px] font-extrabold tracking-[-0.8px] text-[#E63946]">snap</span>
          <span className="font-display text-[21px] font-extrabold tracking-[-0.8px] text-[#111110]">rint</span>
          <span className="mb-[8px] ml-[2px] inline-block h-[6px] w-[6px] rounded-full bg-[#E63946]" />
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="group relative font-body text-[13.5px] font-medium text-[#6B6B66] transition-colors duration-150 hover:text-[#111110]"
              >
                {l.label}
                <span className="absolute -bottom-[2px] left-0 h-[1.5px] w-0 rounded-full bg-[#E63946] transition-all duration-250 group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>

        {/* Right: CTA */}
        <div className="flex items-center gap-3">
          <a
            href="mailto:snaprints@sanskritilabs.in"
            className="hidden items-center gap-1.5 font-body text-[13px] font-medium text-[#6B6B66] transition-colors hover:text-[#111110] md:flex"
          >
            snaprints@sanskritilabs.in
          </a>
          <a
            href="/book"
            className="hidden items-center gap-2 rounded-[8px] bg-[#111110] px-5 py-2.5 font-display text-[13px] font-semibold text-white transition-all duration-200 hover:bg-[#E63946] hover:-translate-y-0.5 md:flex"
            style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}
          >
            Book a Demo
          </a>

          {/* Mobile hamburger */}
          <button
            className="flex h-9 w-9 flex-col items-center justify-center gap-[5px] rounded-md md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span className={`h-[1.5px] w-5 rounded-full bg-[#111110] transition-all duration-200 ${mobileOpen ? "translate-y-[6.5px] rotate-45" : ""}`} />
            <span className={`h-[1.5px] w-5 rounded-full bg-[#111110] transition-all duration-200 ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`h-[1.5px] w-5 rounded-full bg-[#111110] transition-all duration-200 ${mobileOpen ? "-translate-y-[6.5px] -rotate-45" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <motion.div
        initial={false}
        animate={mobileOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden bg-white md:hidden border-t border-[rgba(0,0,0,0.07)]"
      >
        <div className="flex flex-col px-6 pb-5 pt-2">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="border-b border-[rgba(0,0,0,0.06)] py-3.5 font-body text-[15px] font-medium text-[#333330] hover:text-[#E63946] transition-colors"
            >
              {l.label}
            </a>
          ))}
          <a
            href="/book"
            onClick={() => setMobileOpen(false)}
            className="mt-4 flex items-center justify-center gap-2 rounded-[8px] bg-[#111110] py-3 font-display text-[14px] font-semibold text-white"
          >
            Book a Demo
          </a>
        </div>
      </motion.div>
    </motion.nav>
  );
}
