"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";

const STORAGE_KEY = "snaprint-cookie-consent"; // localStorage  --  the permanent choice, once made
const SHOWN_KEY = "snaprint-cookie-banner-shown"; // sessionStorage  --  have we already offered it this session
const DELAY_MS = 11000; // ~1.3s max loader time + 10s on the hero, per spec

type Consent = "accepted" | "declined";

/**
 * Gates Google Analytics + Vercel Analytics behind an actual choice  --  not a
 * decorative banner. Nothing tracking-related loads until the visitor picks
 * Accept or Decline; the choice persists in localStorage so it's remembered
 * across visits, not just the current tab session. Vercel Speed Insights is
 * left ungated  --  it reports anonymous performance timing, not analytics.
 *
 * Home page only  --  not every page. Shows once per session, 10s after the
 * hero settles (not on page load): SHOWN_KEY (session-scoped) prevents it
 * re-triggering if you navigate around before deciding; STORAGE_KEY
 * (persistent) prevents it ever asking again once you've actually chosen.
 * If the 10s elapse while you've navigated off "/", it just doesn't show
 * this session rather than popping up on whatever page you're on.
 */
export default function CookieConsent() {
  const pathname = usePathname();
  const [consent, setConsent] = useState<Consent | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Consent | null;
    if (stored === "accepted" || stored === "declined") {
      setConsent(stored);
      return;
    }
    if (window.sessionStorage.getItem(SHOWN_KEY)) return; // already offered this session

    const timer = setTimeout(() => {
      window.sessionStorage.setItem(SHOWN_KEY, "1");
      setShowBanner(true);
    }, DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const choose = (value: Consent) => {
    window.localStorage.setItem(STORAGE_KEY, value);
    setConsent(value);
    setShowBanner(false);
  };

  const isHomePage = pathname === "/";

  return (
    <>
      {consent === "accepted" && (
        <>
          <GoogleAnalytics gaId="G-76GFPGCHWQ" />
          <Analytics />
        </>
      )}

      <AnimatePresence>
        {showBanner && isHomePage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            role="region"
            aria-label="Cookie consent"
            className="fixed inset-x-4 bottom-4 z-[90] mx-auto max-w-[480px] rounded-2xl border border-[rgba(0,0,0,0.08)] bg-white p-5 shadow-[0_12px_40px_rgba(0,0,0,0.14)] sm:inset-x-auto sm:right-6 sm:bottom-6"
          >
            <p className="mb-1.5 font-display text-[14px] font-bold text-[#111110]">Cookies, kept honest</p>
            <p className="mb-4 font-body text-[12.5px] font-light leading-[1.6] text-[#6B6B66]">
              We use minimal performance cookies to optimize your viewing experience. Nothing intrusive, just pure
              motion.
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => choose("accepted")}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#E63946] px-5 py-2.5 font-display text-[12.5px] font-semibold text-white transition-colors hover:bg-red-deep"
              >
                Accept
              </button>
              <button
                type="button"
                onClick={() => choose("declined")}
                className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(0,0,0,0.1)] px-5 py-2.5 font-body text-[12.5px] font-medium text-[#555550] transition-colors hover:border-[rgba(0,0,0,0.2)] hover:text-[#111110]"
              >
                Decline
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
