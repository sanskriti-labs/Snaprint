"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Snappy from "./Snappy";

export default function SnappyScrollTop() {
  const [show, setShow] = useState(false);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 900);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => {
    setClicked(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => setClicked(false), 1400);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          onClick={handleClick}
          initial={{ opacity: 0, scale: 0.7, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 12 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full border border-[rgba(0,0,0,0.08)] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.12)] transition-transform hover:-translate-y-0.5"
          aria-label="Back to top"
        >
          <div className="pointer-events-none scale-[0.34] origin-center">
            <Snappy state={clicked ? "done" : "idle"} decorative idleBeat={false} />
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
