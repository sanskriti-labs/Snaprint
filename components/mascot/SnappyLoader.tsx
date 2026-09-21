"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Snappy from "./Snappy";

const SESSION_KEY = "snappy-loader-seen";

export default function SnappyLoader() {
  // Homepage-only intro: it's staged around the hero's 3D kiosk model, so it
  // has no business appearing on other routes. The brochure CTA in Hero.tsx
  // opens in a new tab via target="_blank" rel="noopener"  --  `noopener` cuts
  // the browsing-context link sessionStorage normally rides on, so that new
  // tab used to see a blank session and treat itself as "first visit,"
  // replaying the loader on the brochure page instead of the homepage.
  // Gating on pathname fixes this regardless of tab/session-storage quirks.
  const pathname = usePathname();
  const isHome = pathname === "/";

  // Defaults to visible (on the homepage only) so the very first paint
  // (server-rendered HTML, before any JS runs) already shows the cover  -- 
  // sessionStorage can't be read during SSR, so starting at `false` here
  // meant the raw page was genuinely visible for however long hydration
  // took, before this ever flipped true.
  const [visible, setVisible] = useState(isHome);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  // True for the "already seen this session" / reduced-motion paths, where
  // hiding should be instant. Without this, AnimatePresence still plays the
  // full 0.9s exit slide-up even though setVisible(false) fires immediately  -- 
  // the overlay (frozen at 0%, since the tick loop never ran) would sit on
  // screen for that whole 0.9s before sliding away, reading as "stuck".
  const [instant, setInstant] = useState(false);
  const startedRef = useRef(false);

  useLayoutEffect(() => {
    // Once per browser session  --  repeat visits and internal navigation don't
    // replay the loader, only the first paint of a fresh session.
    // useLayoutEffect (not useEffect) so the hide-immediately path below
    // resolves before the browser's next paint, not after it.
    //
    // React Strict Mode (enabled in next.config.mjs) double-invokes this
    // effect in dev. Since sessionStorage is external mutable state, the
    // second invocation used to see SESSION_KEY already set (written by the
    // first) and immediately call setVisible(false) mid-animation  --  the
    // progress bar would freeze at whatever % it reached before that second
    // invocation ran, instead of completing. startedRef guards against this:
    // it's local to this component instance, so the second Strict Mode
    // invocation (same instance) sees it's already running and no-ops,
    // while sessionStorage still correctly gates repeat *sessions*.
    if (typeof window === "undefined") return;
    if (!isHome) return;
    if (startedRef.current) return;
    startedRef.current = true;

    if (window.sessionStorage.getItem(SESSION_KEY)) {
      setInstant(true);
      setVisible(false);
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.sessionStorage.setItem(SESSION_KEY, "1");
      setInstant(true);
      setVisible(false);
      return;
    }

    window.sessionStorage.setItem(SESSION_KEY, "1");
    document.body.style.overflow = "hidden";

    const start = performance.now();
    // Long enough to cover the homepage's actual first paint (hero + 3D
    // kiosk model) instead of a fixed short timer that lifts before those
    // are ready  --  at 900ms the curtain used to open onto an unfinished,
    // still-shifting layout ("chaos") rather than the settled homepage.
    // 2900ms here + the 420ms ready-hold + the 900ms exit slide below adds
    // up to ~4.2s total on-screen time.
    const DURATION = 2900;

    const tick = (now: number) => {
      const p = Math.min((now - start) / DURATION, 1);
      setProgress(Math.round(p * 100));
      if (p < 1) {
        requestAnimationFrame(tick);
      } else {
        setReady(true);
        setTimeout(() => {
          setVisible(false);
          document.body.style.overflow = "";
        }, 420);
      }
    };
    requestAnimationFrame(tick);
  }, []);

  // Wrapped in an id'd div so the blocking inline script in app/layout.tsx
  // (which runs before React hydrates) can hide this via a plain CSS rule
  // when sessionStorage already has SESSION_KEY. Without that, the server
  // always renders this overlay frozen at 0% (SSR can't read sessionStorage),
  // and on every repeat page load the real page sits behind it, visible at
  // 0%, until hydration finishes  --  in dev that can take seconds, reading as
  // "the progress bar is stuck at 0".
  return (
    <div id="snappy-loader-root">
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: instant ? 0 : 0.9, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-charcoal"
          aria-hidden
        >
          {/* content fades a beat before the curtain lifts */}
          <motion.div exit={{ opacity: 0, y: -12 }} transition={{ duration: instant ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }} className="flex flex-col items-center">
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            >
              <Snappy state={ready ? "done" : "print-cycle"} scale={1.1} decorative />
            </motion.div>
            <div className="mt-8 flex items-center gap-3">
              <div className="h-[2px] w-[140px] overflow-hidden rounded-full bg-white/10">
                <div className="h-full bg-red" style={{ width: `${progress}%` }} />
              </div>
              <span className="font-display text-[12px] font-semibold tabular-nums text-white/40">
                {progress}%
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </div>
  );
}
