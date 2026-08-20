"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * No hard cuts between routes (DESIGN_SYSTEM.md §5). On each navigation a
 * charcoal panel drops to cover, then lifts away to reveal the new page — a
 * curtain wipe. Mounted from app/(marketing)/layout.tsx as a sibling of the
 * page (never an ancestor), so it can't create a containing block that would
 * break the fixed navbar / sticky elements. Skips the very first load (the
 * preloader owns that) and no-ops under reduced motion.
 */
export default function RouteTransition() {
  const pathname = usePathname();
  const first = useRef(true);
  const [count, setCount] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (reduced) return;
    setCount((c) => c + 1);
  }, [pathname, reduced]);

  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div
          key={count}
          className="pointer-events-none fixed inset-0 z-[95] bg-charcoal"
          initial={{ scaleY: 1, transformOrigin: "top" }}
          animate={{ scaleY: 0, transformOrigin: "bottom" }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          aria-hidden
        />
      )}
    </AnimatePresence>
  );
}
