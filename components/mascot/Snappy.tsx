"use client";

import { useEffect, useRef } from "react";

export type SnappyState = "idle" | "printing" | "print-cycle" | "done" | "asleep";

interface SnappyProps {
  state: SnappyState;
  /** Scale relative to native 150×180px. Below ~0.27 (40px) the limbs stop reading. */
  scale?: number;
  className?: string;
  /** Purely decorative instance (icon next to real content) → aria-hidden. */
  decorative?: boolean;
  /** Override the default "Snaprint mascot, {state}" aria-label. */
  label?: string;
  /** Cursor-proximity eye tracking — hero only, auto-disabled on touch + reduced motion. */
  eyeTrack?: boolean;
  /** Occasional idle "alive" beat (blink/tilt) on top of the base loop. Default true for idle & print-cycle. */
  idleBeat?: boolean;
}

const C = {
  charcoal: "#0e0e0d",
  edge: "#2f2f2c",
  limb: "#3a3a37",
  red: "#e63946",
  paper: "#f5f5f3",
  ink: "#c9c9c4",
};

const NATIVE_W = 150;
const NATIVE_H = 180;

export default function Snappy({
  state,
  scale = 1,
  className = "",
  decorative = false,
  label,
  eyeTrack = false,
  idleBeat,
}: SnappyProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const eyeLRef = useRef<HTMLDivElement>(null);
  const eyeRRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  const hasRoundEyes = state === "idle" || state === "printing" || state === "print-cycle";
  const beatEnabled = idleBeat ?? (state === "idle" || state === "print-cycle");

  // Cursor-proximity eye tracking — direct DOM mutation, no re-renders.
  useEffect(() => {
    if (!eyeTrack || !hasRoundEyes) return;
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const onMove = (e: MouseEvent) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const root = rootRef.current;
        if (!root) return;
        const rect = root.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height * 0.42;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.hypot(dx, dy) || 1;
        const max = 2.6;
        const ox = (dx / dist) * Math.min(max, dist / 40);
        const oy = (dy / dist) * Math.min(max, dist / 40);
        const t = `translate(${ox.toFixed(1)}px, ${oy.toFixed(1)}px)`;
        if (eyeLRef.current) eyeLRef.current.style.transform = t;
        if (eyeRRef.current) eyeRRef.current.style.transform = t;
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [eyeTrack, hasRoundEyes]);

  // Idle personality — an occasional small head-tilt beat every 8-12s.
  useEffect(() => {
    if (!beatEnabled) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timeout: ReturnType<typeof setTimeout>;
    const schedule = () => {
      const delay = 8000 + Math.random() * 4000;
      timeout = setTimeout(() => {
        bodyRef.current?.classList.add("snappy-tilt");
        setTimeout(() => bodyRef.current?.classList.remove("snappy-tilt"), 650);
        schedule();
      }, delay);
    };
    schedule();
    return () => clearTimeout(timeout);
  }, [beatEnabled]);

  const outerAnim =
    state === "asleep" ? "mSnooze 2.6s ease-in-out infinite"
    : state === "idle" || state === "print-cycle" ? "mBreathe 3.4s ease-in-out infinite"
    : "none";

  const w = NATIVE_W * scale;
  const h = NATIVE_H * scale;

  return (
    <div
      ref={rootRef}
      className={className}
      style={{ width: w, height: h, position: "relative", overflow: "visible" }}
      role={decorative ? undefined : "img"}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : label ?? `Snaprint mascot, ${state.replace("-", " ")}`}
    >
      {/* Scale lives on its own wrapper so it composes with — instead of being
          overridden by — the breathe/snooze animation's transform on .snappy. */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: NATIVE_W,
          height: NATIVE_H,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
      <div
        ref={bodyRef}
        className="snappy"
        style={{
          position: "absolute",
          inset: 0,
          width: NATIVE_W,
          height: NATIVE_H,
          animation: outerAnim,
        }}
      >
        {/* ── Zzz (asleep only) ── */}
        {state === "asleep" && (
          <>
            <span
              style={{
                position: "absolute", left: 104, top: 22, font: "800 18px var(--font-baloo), sans-serif",
                color: C.red, animation: "mZzz 2.6s ease-out infinite",
              }}
            >
              z
            </span>
            <span
              style={{
                position: "absolute", left: 104, top: 22, font: "800 18px var(--font-baloo), sans-serif",
                color: C.red, animation: "mZzz 2.6s ease-out 0.8s infinite",
              }}
            >
              z
            </span>
          </>
        )}

        {/* ── Chassis (identical across every state) ── */}
        <div style={{ position: "absolute", left: 15, top: 0, width: 120, height: 152, background: C.charcoal, borderRadius: 26, boxShadow: `inset 0 1px 0 rgba(255,255,255,.14), 0 0 0 1.5px ${C.edge}` }} />
        <div style={{ position: "absolute", left: 15, top: 0, width: 120, height: 22, background: C.red, borderRadius: "26px 26px 0 0" }} />
        <div style={{ position: "absolute", left: 29, top: 36, width: 92, height: 62, background: C.paper, borderRadius: 12 }} />

        {/* ── Face ── */}
        {state === "idle" && (
          <>
            <div ref={eyeLRef} style={{ position: "absolute", left: 48, top: 58, width: 13, height: 15, background: C.charcoal, borderRadius: 7, animation: "mBlink 4.2s ease-in-out infinite" }} />
            <div ref={eyeRRef} style={{ position: "absolute", left: 89, top: 58, width: 13, height: 15, background: C.charcoal, borderRadius: 7, animation: "mBlink 4.2s ease-in-out infinite" }} />
            <div style={{ position: "absolute", left: 33, top: 64, width: 11, height: 6, background: C.red, borderRadius: 4, opacity: 0.55 }} />
            <div style={{ position: "absolute", left: 106, top: 64, width: 11, height: 6, background: C.red, borderRadius: 4, opacity: 0.55 }} />
            <div style={{ position: "absolute", left: 60, top: 80, width: 30, height: 9, borderBottom: `4px solid ${C.charcoal}`, borderRadius: "0 0 12px 12px" }} />
            <div style={{ position: "absolute", left: 45, top: 106, width: 61, height: 7, background: C.charcoal, borderRadius: 4, overflow: "hidden", boxShadow: "inset 0 0 0 1px #2a2a28" }} />
          </>
        )}

        {state === "printing" && (
          <>
            <div style={{ position: "absolute", left: 48, top: 58, width: 13, height: 15, background: C.charcoal, borderRadius: 7 }} />
            <div style={{ position: "absolute", left: 89, top: 58, width: 13, height: 15, background: C.charcoal, borderRadius: 7 }} />
            <div style={{ position: "absolute", left: 33, top: 64, width: 11, height: 6, background: C.red, borderRadius: 4, opacity: 0.55 }} />
            <div style={{ position: "absolute", left: 106, top: 64, width: 11, height: 6, background: C.red, borderRadius: 4, opacity: 0.55 }} />
            <div style={{ position: "absolute", left: 60, top: 80, width: 30, height: 9, borderBottom: `4px solid ${C.charcoal}`, borderRadius: "0 0 12px 12px" }} />
            <div style={{ position: "absolute", left: 45, top: 106, width: 61, height: 7, background: C.charcoal, borderRadius: 4, overflow: "hidden", boxShadow: "inset 0 0 0 1px #2a2a28" }}>
              <div style={{ width: "40%", height: "100%", background: C.red, borderRadius: 4, animation: "mLed 1s ease-in-out infinite" }} />
            </div>
            <div style={{ position: "absolute", left: 45, top: 114, width: 61, height: 32, overflow: "hidden", zIndex: 2 }}>
              {[0, 1.1].map((delay) => (
                <div key={delay} style={{ position: "absolute", left: 0, top: 0, width: 61, height: 32, background: C.paper, borderRadius: "0 0 3px 3px", boxShadow: "0 5px 12px -4px rgba(0,0,0,.65)", animation: `mFeedLoop 2.2s linear ${delay}s infinite` }}>
                  <div style={{ position: "absolute", left: 9, top: 7, width: 43, height: 3, background: C.ink, borderRadius: 2 }} />
                  <div style={{ position: "absolute", left: 9, top: 14, width: 30, height: 3, background: C.ink, borderRadius: 2 }} />
                  <div style={{ position: "absolute", left: 9, top: 21, width: 38, height: 3, background: C.ink, borderRadius: 2 }} />
                  <div style={{ position: "absolute", left: 9, top: 26, width: 18, height: 4, background: C.red, borderRadius: 2 }} />
                </div>
              ))}
            </div>
          </>
        )}

        {state === "print-cycle" && (
          <>
            <div ref={eyeLRef} style={{ position: "absolute", left: 48, top: 58, width: 13, height: 15, background: C.charcoal, borderRadius: 7, animation: "mBlink 4.2s ease-in-out infinite" }} />
            <div ref={eyeRRef} style={{ position: "absolute", left: 89, top: 58, width: 13, height: 15, background: C.charcoal, borderRadius: 7, animation: "mBlink 4.2s ease-in-out infinite" }} />
            <div style={{ position: "absolute", left: 33, top: 64, width: 11, height: 6, background: C.red, borderRadius: 4, opacity: 0.55 }} />
            <div style={{ position: "absolute", left: 106, top: 64, width: 11, height: 6, background: C.red, borderRadius: 4, opacity: 0.55 }} />
            <div style={{ position: "absolute", left: 60, top: 80, width: 30, height: 9, borderBottom: `4px solid ${C.charcoal}`, borderRadius: "0 0 12px 12px" }} />
            <div style={{ position: "absolute", left: 45, top: 106, width: 61, height: 7, background: C.charcoal, borderRadius: 4, overflow: "hidden", boxShadow: "inset 0 0 0 1px #2a2a28" }}>
              <div style={{ width: "100%", height: "100%", background: C.red, borderRadius: 4, transformOrigin: "0 50%", animation: "mProg2 4.2s linear infinite" }} />
            </div>
            <div style={{ position: "absolute", left: 45, top: 114, width: 61, height: 32, overflow: "hidden", zIndex: 2 }}>
              <div style={{ position: "absolute", left: 0, top: 0, width: 61, height: 32, background: C.paper, borderRadius: "0 0 3px 3px", boxShadow: "0 5px 12px -4px rgba(0,0,0,.65)", animation: "mSheet2 4.2s linear infinite" }}>
                <div style={{ position: "absolute", left: 9, top: 7, width: 43, height: 3, background: C.ink, borderRadius: 2 }} />
                <div style={{ position: "absolute", left: 9, top: 14, width: 30, height: 3, background: C.ink, borderRadius: 2 }} />
                <div style={{ position: "absolute", left: 9, top: 21, width: 38, height: 3, background: C.ink, borderRadius: 2 }} />
                <div style={{ position: "absolute", left: 9, top: 26, width: 18, height: 4, background: C.red, borderRadius: 2 }} />
              </div>
            </div>
          </>
        )}

        {state === "done" && (
          <>
            <div style={{ position: "absolute", left: 46, top: 56, width: 16, height: 9, borderTop: `4px solid ${C.charcoal}`, borderRadius: "10px 10px 0 0" }} />
            <div style={{ position: "absolute", left: 88, top: 56, width: 16, height: 9, borderTop: `4px solid ${C.charcoal}`, borderRadius: "10px 10px 0 0" }} />
            <div style={{ position: "absolute", left: 58, top: 74, width: 34, height: 16, background: C.charcoal, borderRadius: "0 0 18px 18px" }} />
            <div style={{ position: "absolute", left: 33, top: 64, width: 11, height: 6, background: C.red, borderRadius: 4, opacity: 0.55 }} />
            <div style={{ position: "absolute", left: 106, top: 64, width: 11, height: 6, background: C.red, borderRadius: 4, opacity: 0.55 }} />
            <div style={{ position: "absolute", left: 45, top: 106, width: 61, height: 7, background: C.charcoal, borderRadius: 4, overflow: "hidden", boxShadow: "inset 0 0 0 1px #2a2a28" }}>
              <div style={{ width: "100%", height: "100%", background: C.red, borderRadius: 4 }} />
            </div>
            <div style={{ position: "absolute", left: 45, top: 114, width: 61, height: 32, background: C.paper, borderRadius: "0 0 3px 3px", boxShadow: "0 5px 12px -4px rgba(0,0,0,.65)", zIndex: 2, transformOrigin: "50% 0", animation: "mPop .6s cubic-bezier(.34,1.5,.4,1) infinite alternate" }}>
              <div style={{ position: "absolute", left: 9, top: 7, width: 43, height: 3, background: C.ink, borderRadius: 2 }} />
              <div style={{ position: "absolute", left: 9, top: 14, width: 30, height: 3, background: C.ink, borderRadius: 2 }} />
              <div style={{ position: "absolute", left: 9, top: 21, width: 38, height: 3, background: C.ink, borderRadius: 2 }} />
              <div style={{ position: "absolute", left: 9, top: 26, width: 18, height: 4, background: C.red, borderRadius: 2 }} />
            </div>
          </>
        )}

        {state === "asleep" && (
          <>
            <div style={{ position: "absolute", left: 48, top: 66, width: 15, height: 4, background: "#5a5a55", borderRadius: 3 }} />
            <div style={{ position: "absolute", left: 87, top: 66, width: 15, height: 4, background: "#5a5a55", borderRadius: 3 }} />
            <div style={{ position: "absolute", left: 45, top: 106, width: 61, height: 7, background: C.charcoal, borderRadius: 4, overflow: "hidden", boxShadow: "inset 0 0 0 1px #2a2a28" }}>
              <div style={{ width: "18%", height: "100%", background: C.red, borderRadius: 4, animation: "mLed 3s ease-in-out infinite" }} />
            </div>
          </>
        )}

        {/* ── Arms, legs, feet — identical across every state ── */}
        <div style={{ position: "absolute", left: 0, top: 62, width: 22, height: 9, background: C.limb, borderRadius: 6, transformOrigin: "100% 50%", transform: "rotate(-14deg)" }} />
        <div style={{ position: "absolute", right: 0, top: 62, width: 22, height: 9, background: C.limb, borderRadius: 6, transformOrigin: "0 50%", transform: "rotate(14deg)" }} />
        <div style={{ position: "absolute", left: 44, top: 148, width: 14, height: 24, background: C.limb, borderRadius: "0 0 7px 7px" }} />
        <div style={{ position: "absolute", left: 92, top: 148, width: 14, height: 24, background: C.limb, borderRadius: "0 0 7px 7px" }} />
        <div style={{ position: "absolute", left: 38, top: 168, width: 26, height: 10, background: C.red, borderRadius: 6 }} />
        <div style={{ position: "absolute", left: 86, top: 168, width: 26, height: 10, background: C.red, borderRadius: 6 }} />
      </div>
      </div>
    </div>
  );
}
