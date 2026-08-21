"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import Snappy from "@/components/mascot/Snappy";

// Client-side nav (no full page reload) — needed so root-layout-level
// singletons like SnappyLoader/CookieConsent don't remount and replay on
// every internal navigation the way they did with plain <a> tags.
const MotionLink = motion(Link);

// hash-only anchors (e.g. "#how") only work while already on "/" — on any
// other route (like /franchisebrochure) clicking them just rewrites the
// current URL's hash and goes nowhere. href is always home-page-relative so
// the links work from anywhere; hash is kept separately for the in-page
// active-section tracking below.
const links = [
  { label: "Workflow", href: "/#how", hash: "#how" },
  { label: "The Tech", href: "/#why", hash: "#why" },
  { label: "Pricing", href: "/#pricing", hash: "#pricing" },
  { label: "Impact", href: "/impact", hash: "" },
];

/**
 * Liquid-glass floating pill nav. The glass surface stays a fixed light,
 * neutral tint (rgba white + blur/saturate) regardless of what's scrolling
 * behind it — that's what makes it read as "glass" rather than a themed bar
 * that swaps color schemes, and it's why nav text can stay one fixed dark
 * ink color instead of the old light/dark-on-scroll toggle.
 */
export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState<string>("");

  // Hash links (Workflow/The Tech) are active by scroll position on the
  // homepage; real pages (Pricing/Impact) have no hash, so they're active
  // whenever the current route matches them instead.
  const isLinkActive = (l: (typeof links)[number]) => (l.hash ? active === l.hash : pathname === l.href);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Active-section tracking — a soft red pill follows whichever section is
  // currently in the "focus band" of the viewport.
  useEffect(() => {
    const sections = links
      .filter((l) => l.hash)
      .map((l) => document.querySelector(l.hash))
      .filter((el): el is Element => el !== null);
    if (!sections.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  return (
    <>
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-3 sm:pt-3.5"
      >
        {/* Sized down ~30% from the original pill across the board — padding,
            logo, link and CTA type, all scaled together so it still reads as
            one coherent (just smaller) object rather than mismatched parts. */}
        <nav
          aria-label="Primary"
          className={`neu-raised pointer-events-auto relative flex w-full items-center justify-between gap-1 rounded-full transition-[max-width,padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            scrolled ? "max-w-[490px] px-2 py-1.5" : "max-w-[630px] px-2.5 py-1.5"
          }`}
        >
          {/* Logo */}
          <Link href="/" aria-label="Snaprint" className="group flex shrink-0 items-center gap-1.5 pl-1 no-underline select-none">
            <span className="-my-1 shrink-0 overflow-hidden transition-transform duration-300 group-hover:-translate-y-0.5">
              <Snappy state="idle" scale={20 / 150} decorative idleBeat={false} />
            </span>
            <span className="font-body text-[12px] font-extrabold tracking-[-0.4px]">
              <span className="text-red">snap</span>
              <span className="text-charcoal">rint</span>
            </span>
          </Link>

          {/* Center links — active section is marked by text color only, no
              background pill (a filled shape behind the link read as a UI
              glitch rather than an intentional state). */}
          <ul className="hidden items-center gap-0.5 md:flex">
            {links.map((l) => {
              const isActive = isLinkActive(l);
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={isActive ? "true" : undefined}
                    className={`block rounded-full px-2.5 py-1.5 font-body text-[10px] font-medium tracking-[-0.05px] transition-colors duration-200 ${
                      isActive ? "text-red" : "text-graphite hover:bg-black/[0.04] hover:text-charcoal"
                    }`}
                  >
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* CTA — no data-magnetic here: the magnetic cursor system sets its
              own inline transform on mousemove, which would silently fight a
              Tailwind hover:-translate-y transform on the same element (inline
              style always wins over a class — see Hero.tsx kiosk placement for
              the same failure mode). Plain hover lift + shadow instead. */}
          <Link
            href="/book"
            className="group hidden shrink-0 items-center gap-1 rounded-full bg-red py-1.5 pl-3 pr-2 font-display text-[10px] font-semibold text-white shadow-[0_4px_14px_rgba(230,57,70,0.32)] transition-all duration-[--d-hover] ease-hover hover:-translate-y-px hover:bg-red-deep hover:shadow-[0_7px_20px_rgba(230,57,70,0.42)] md:flex"
          >
            Register Kiosk
            <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24" className="transition-transform duration-[--d-hover] ease-hover group-hover:translate-x-0.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>

          {/* Mobile hamburger — kept at a real tap-target size even though the
              pill around it shrank, so it stays comfortably touchable */}
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-black/[0.05] md:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            <span className="flex flex-col items-center gap-[4px]">
              <span className="h-[1.5px] w-4 rounded-full bg-charcoal" />
              <span className="h-[1.5px] w-4 rounded-full bg-charcoal" />
            </span>
          </button>
        </nav>
      </motion.div>

      {/* Mobile — full glass overlay, not a shrunk desktop nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] bg-charcoal/40 backdrop-blur-sm md:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: -16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -10 }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="neu-raised-lg mx-4 mt-4 overflow-hidden rounded-[28px]"
            >
              <div className="flex items-center justify-between px-4 py-3.5">
                <span className="font-body text-[18px] font-extrabold tracking-[-0.6px]">
                  <span className="text-red">snap</span>
                  <span className="text-charcoal">rint</span>
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-charcoal/60 transition-colors hover:bg-black/[0.05]"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              </div>

              <div className="flex flex-col gap-1 px-2 pb-2">
                {links.map((l, i) => (
                  <MotionLink
                    key={l.href}
                    href={l.href}
                    onClick={() => setMobileOpen(false)}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + i * 0.05, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className={`rounded-2xl px-4 py-4 font-body text-[16px] font-medium transition-colors ${
                      isLinkActive(l) ? "bg-red/[0.08] text-red" : "text-charcoal hover:bg-black/[0.04]"
                    }`}
                  >
                    {l.label}
                  </MotionLink>
                ))}
              </div>

              <MotionLink
                href="/book"
                onClick={() => setMobileOpen(false)}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.35 }}
                className="mx-2 mb-2 flex items-center justify-center gap-2 rounded-2xl bg-red py-4 font-display text-[15px] font-semibold text-white shadow-[0_10px_26px_rgba(230,57,70,0.35)]"
              >
                Register Kiosk
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </MotionLink>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
