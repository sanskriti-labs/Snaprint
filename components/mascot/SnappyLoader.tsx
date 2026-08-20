"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Snappy from "./Snappy";

const SESSION_KEY = "snappy-loader-seen";

export default function SnappyLoader() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Once per browser session — repeat visits and internal navigation don't
    // replay the loader, only the first paint of a fresh session.
    //
    // No cleanup is returned here on purpose. This component mounts once at
    // the root and never unmounts during normal use, but React Strict Mode
    // (enabled in next.config.mjs) still double-invokes effects in dev: a
    // cleanup that cancels the rAF loop would kill the first invocation's
    // timer, and the second invocation would then see SESSION_KEY already
    // set and bail out — leaving the full-screen overlay stuck forever. Since
    // the sessionStorage write already makes this idempotent, the dev-only
    // second invocation is a safe no-op instead.
    if (typeof window === "undefined") return;
    if (window.sessionStorage.getItem(SESSION_KEY)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.sessionStorage.setItem(SESSION_KEY, "1");
      return;
    }

    window.sessionStorage.setItem(SESSION_KEY, "1");
    setVisible(true);
    document.body.style.overflow = "hidden";

    const start = performance.now();
    const DURATION = 900;

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

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-charcoal"
          aria-hidden
        >
          {/* content fades a beat before the curtain lifts */}
          <motion.div exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }} className="flex flex-col items-center">
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
  );
}
