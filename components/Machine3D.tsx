"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import Snappy from "@/components/mascot/Snappy";

// ─── INNER CORE  --  seals the hollow so no gap reveals emptiness ───
function Core() {
  const s: React.CSSProperties = { position: "absolute", background: "#1a1a18", borderRadius: 6 };
  return (
    <>
      <div style={{ ...s, width: 160, height: 450, left: 5, top: 5, transform: "translateZ(95px)" }} />
      <div style={{ ...s, width: 160, height: 450, left: 5, top: 5, transform: "rotateY(180deg) translateZ(95px)" }} />
      <div style={{ ...s, width: 190, height: 450, left: -10, top: 5, transform: "rotateY(-90deg) translateZ(80px)" }} />
      <div style={{ ...s, width: 190, height: 450, left: -10, top: 5, transform: "rotateY(90deg) translateZ(80px)" }} />
      <div style={{ ...s, width: 160, height: 190, left: 5, top: 135, transform: "rotateX(90deg) translateZ(225px)" }} />
      <div style={{ ...s, width: 160, height: 190, left: 5, top: 135, transform: "rotateX(-90deg) translateZ(225px)" }} />
    </>
  );
}

// ─── STEP ICON  --  mini illustrated device used 3x in the front-panel steps row ───
const STEPS: { fillPct: number; label: [string, string] }[] = [
  { fillPct: 0, label: ["scan the", "QR code"] },
  { fillPct: 55, label: ["upload &", "pay via UPI"] },
  { fillPct: 100, label: ["grab your", "prints"] },
];

function StepsRow() {
  return (
    <div style={{ position: "absolute", top: 172, left: 14, right: 8, display: "flex", gap: 5, zIndex: 5 }}>
      {STEPS.map((step, i) => (
        <div key={i} style={{ flex: 1, background: "#f5f5f5", padding: "6px 2px", textAlign: "center" }}>
          <div style={{ width: 15, height: 19, margin: "0 auto 3px", position: "relative" }}>
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(150deg,#232320,#111110)", borderRadius: 4 }} />
            <div style={{ position: "absolute", left: 0, top: 0, width: 15, height: 4.5, background: "linear-gradient(180deg,#ff5c68,#d0303d)", borderRadius: "4px 4px 0 0" }} />
            <div style={{ position: "absolute", left: 2, top: 6.5, width: 11, height: 7.5, background: "#f5f5f3", borderRadius: 2 }} />
            <div style={{ position: "absolute", left: 4, top: 8.5, width: 2, height: 3, background: "#0e0e0d", borderRadius: 1 }} />
            <div style={{ position: "absolute", left: 9, top: 8.5, width: 2, height: 3, background: "#0e0e0d", borderRadius: 1 }} />
            <div style={{ position: "absolute", left: 3.5, top: 15.5, width: 8, height: 2, background: "#0e0e0d", borderRadius: 1, overflow: "hidden" }}>
              {step.fillPct > 0 && (
                <div style={{ position: "absolute", left: 0, top: 0, width: `${step.fillPct}%`, height: "100%", background: "#e63946" }} />
              )}
            </div>
          </div>
          <div style={{ fontWeight: 600, fontSize: 4.6, lineHeight: 1.35, color: "#6a6a66" }}>
            {step.label[0]}
            <br />
            {step.label[1]}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── FRONT ───────────────────────────────────────────────────────
function Front() {
  return (
    <div style={{
      position: "absolute", width: 172, height: 460, left: -1, top: 0,
      transform: "translateZ(100px)",
      background: "linear-gradient(100deg,#ffffff 0%,#fdfdfc 34%,#ebebe8 70%,#f7f7f5 100%)",
      borderRadius: 8,
      overflow: "hidden",
      boxShadow: "inset 0 0 0 1px rgba(0,0,0,.08),inset 0 1px 0 rgba(255,255,255,.95),inset -1px 0 0 rgba(0,0,0,.05)",
    }}>
      {/* Header bar  --  mascot face + wordmark, "PRINT IN 30s" pill */}
      <div style={{
        position: "absolute", top: 0, left: 0, width: "100%", height: 32,
        background: "linear-gradient(180deg,#ff6a75 0%,#f0404e 38%,#cd2c39 100%),radial-gradient(130% 70% at 18% -10%,rgba(255,255,255,.5),rgba(255,255,255,0) 62%)",
        zIndex: 4, display: "flex", alignItems: "center", paddingLeft: 26, boxSizing: "border-box",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ filter: "drop-shadow(0 .5px 0 rgba(120,15,25,.5))" }}>
            <Snappy state="idle" scale={20 / 150} decorative idleBeat={false} />
          </div>
          <span style={{ fontWeight: 800, fontSize: 14, letterSpacing: "-.7px", color: "#fff", textShadow: "0 .5px 0 rgba(120,15,25,.45)" }}>snaprint</span>
        </div>
        <span style={{ position: "absolute", right: 9, fontWeight: 700, fontSize: 5, letterSpacing: ".6px", color: "#fff", background: "rgba(0,0,0,.22)", padding: "2.5px 5.5px", borderRadius: 10 }}>PRINT IN 30s</span>
      </div>

      {/* Screen */}
      <div style={{
        position: "absolute", top: 46, left: 11, right: 8, height: 74,
        background: "linear-gradient(163deg,#33332f 0%,#141412 42%,#080807 100%)",
        borderRadius: 8, padding: 5, boxSizing: "border-box", zIndex: 5,
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,.16),inset 0 -1px 0 rgba(0,0,0,.8),0 4px 10px -4px rgba(0,0,0,.75)",
      }}>
        <div style={{ width: "100%", height: "100%", background: "linear-gradient(168deg,#ffffff,#f2f4f7)", borderRadius: 4, display: "flex", alignItems: "center", boxShadow: "inset 0 0 0 .5px rgba(0,0,0,.2)" }}>
          <div style={{ flex: 1, paddingLeft: 9, lineHeight: 0.88 }}>
            <div style={{ fontWeight: 900, fontSize: 13, letterSpacing: "-.6px" }}>snap.</div>
            <div style={{ fontWeight: 900, fontSize: 13, letterSpacing: "-.6px" }}>scan.</div>
            <div style={{ fontWeight: 900, fontSize: 13, letterSpacing: "-.6px", display: "inline-block", position: "relative" }}>
              print.
              <span style={{ position: "absolute", left: 0, bottom: 2, width: "100%", height: 4, background: "#e63946", zIndex: -1 }} />
            </div>
          </div>
          <div style={{ width: 52, height: "100%", background: "#f5f5f5", borderLeft: "1px solid #eee", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3 }}>
            <div style={{ width: 34, height: 34, background: "linear-gradient(150deg,#f04250,#d02f3c)", padding: 4, boxSizing: "border-box", boxShadow: "inset 0 0 0 .5px rgba(255,255,255,.35),0 1px 2px rgba(0,0,0,.18)" }}>
              <div style={{ width: "100%", height: "100%", background: "#fff", WebkitMask: "repeating-conic-gradient(#000 0 25%,transparent 0 50%) 0 0/6px 6px", mask: "repeating-conic-gradient(#000 0 25%,transparent 0 50%) 0 0/6px 6px" }} />
            </div>
            <span style={{ fontWeight: 700, fontSize: 5, color: "#111110" }}>scan to print</span>
          </div>
        </div>
      </div>

      <StepsRow />

      {/* Red separator */}
      <div style={{ position: "absolute", top: 228, left: 0, width: "100%", height: 3, background: "#e63946", zIndex: 2 }} />

      {/* Dark lower chassis  --  front access door with paper-collect slot */}
      <div style={{
        position: "absolute", top: 231, left: 0, width: "100%", bottom: 0,
        background: "linear-gradient(100deg,#232320 0%,#141412 55%,#080807 100%)",
        borderRadius: "0 0 7px 7px",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,.1),inset 0 -14px 24px -18px rgba(0,0,0,.9)",
      }}>
        <div style={{ position: "absolute", top: 8, left: 14, right: 8, bottom: 34, border: "1.5px solid rgba(230,57,70,.55)", borderRadius: 6, background: "linear-gradient(95deg,rgba(255,255,255,.03),rgba(0,0,0,.16))" }}>
          <div style={{ position: "absolute", top: "50%", left: -2, transform: "translateY(-50%)", width: 3, height: 26, background: "linear-gradient(90deg,#0a0a09,#222)", borderRadius: 1, boxShadow: "inset 0 0 2px rgba(0,0,0,.8)" }} />
          <div style={{ position: "absolute", top: 48, left: "50%", transform: "translateX(-50%)", width: 98, height: 16, border: "1px solid rgba(255,255,255,.14)", borderRadius: 4, background: "linear-gradient(95deg,#1f1f1d,#161614)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "inset 0 1px 2px rgba(0,0,0,.5)" }}>
            <div style={{ width: "80%", height: 2, background: "linear-gradient(90deg,rgba(230,57,70,0),#e63946,rgba(230,57,70,0))", boxShadow: "0 0 4px rgba(230,57,70,.6)" }} />
          </div>
          <div style={{ position: "absolute", top: 66, left: "50%", transform: "translateX(-50%)", width: 98, textAlign: "center", fontWeight: 600, fontSize: 4.6, letterSpacing: 1, color: "#6a6a66" }}>PAPER COLLECT</div>
        </div>
      </div>
    </div>
  );
}

// ─── BACK ────────────────────────────────────────────────────────
function Back() {
  return (
    <div style={{
      position: "absolute", width: 172, height: 460, left: -1, top: 0,
      transform: "rotateY(180deg) translateZ(100px)",
      background: "linear-gradient(100deg,#fdfdfc 0%,#f4f4f2 40%,#e7e7e4 100%)",
      borderRadius: 8,
      overflow: "hidden",
      boxShadow: "inset 0 0 0 1px rgba(0,0,0,.08),inset 0 1px 0 rgba(255,255,255,.9)",
    }}>
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 32, background: "linear-gradient(180deg,#ff6a75 0%,#f0404e 38%,#cd2c39 100%),radial-gradient(130% 70% at 18% -10%,rgba(255,255,255,.5),rgba(255,255,255,0) 62%)" }} />
      <div style={{ position: "absolute", top: 52, left: 0, width: "100%", textAlign: "center", fontWeight: 700, fontSize: 9, letterSpacing: 2, color: "#cfcfcb" }}>SNAPRINT</div>
      <div style={{ position: "absolute", top: 90, left: "50%", transform: "translateX(-50%)", width: 40, height: 20, background: "#e9e9e6", boxShadow: "inset 0 0 0 1px rgba(0,0,0,.08)", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
        <div style={{ width: 5, height: 9, background: "#bdbdb9" }} />
        <div style={{ width: 8, height: 5, background: "#bdbdb9" }} />
      </div>
      <div style={{ position: "absolute", top: 114, left: 0, width: "100%", textAlign: "center", fontSize: 5, color: "#bdbdb9" }}>power · ethernet</div>
      <div style={{ position: "absolute", top: 124, left: 0, width: "100%", textAlign: "center", fontWeight: 600, fontSize: 5, letterSpacing: ".6px", color: "#8a8a86" }}>Product by Sanskriti Labs</div>
      <div style={{ position: "absolute", top: 228, left: 0, width: "100%", height: 3, background: "#e63946" }} />
      <div style={{ position: "absolute", top: 231, left: 0, width: "100%", bottom: 0, background: "linear-gradient(100deg,#201f1d,#0d0d0c)", borderRadius: "0 0 7px 7px" }} />
      {/* Paper refill door */}
      <div style={{ position: "absolute", top: 74, left: 25, width: 110, height: 150, background: "linear-gradient(95deg,#1f1f1d,#161614)", border: "1.5px solid #e63946", borderRadius: 6 }}>
        <div style={{ position: "absolute", top: "50%", left: 9, transform: "translateY(-50%)", width: 5, height: 30, background: "linear-gradient(90deg,#0a0a09,#222)", boxShadow: "inset 0 0 3px rgba(0,0,0,.8)" }} />
        <div style={{ position: "absolute", bottom: 10, left: 0, width: "100%", textAlign: "center", fontWeight: 600, fontSize: 6, letterSpacing: 1, color: "#6a6a66" }}>A4 PAPER REFILL</div>
      </div>
    </div>
  );
}

// ─── LEFT SIDE  --  printed mascot decal, "ready to print" ───────────
function LeftSide() {
  return (
    <div style={{
      position: "absolute", width: 200, height: 460, left: -15, top: 0,
      transform: "rotateY(-90deg) translateZ(84px)",
      background: "linear-gradient(100deg,#e9e9e6 0%,#fafaf8 20%,#dcdcd9 58%,#f0f0ed 100%)",
      borderRadius: 8,
      overflow: "hidden",
      boxShadow: "inset 0 0 0 1px rgba(0,0,0,.08),inset 0 1px 0 rgba(255,255,255,.9)",
    }}>
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 32, background: "linear-gradient(180deg,#ff6a75 0%,#f0404e 38%,#cd2c39 100%),radial-gradient(130% 70% at 18% -10%,rgba(255,255,255,.5),rgba(255,255,255,0) 62%)" }} />
      <div style={{ position: "absolute", top: 46, right: 9, width: 42, height: 74, background: "linear-gradient(90deg,#1a1a18,#111110)", borderRadius: "0 0 0 7px", transform: "skewY(7deg)", transformOrigin: "right", boxShadow: "-2px 4px 10px -4px rgba(0,0,0,.4)" }} />
      <div style={{ position: "absolute", top: 134, right: 9, width: 26, height: 9, background: "linear-gradient(180deg,#cfcfcb,#eee)", borderRadius: "0 0 0 3px" }} />

      <div style={{ position: "absolute", left: 46, top: 128, width: 108, height: 150, background: "radial-gradient(ellipse at 50% 42%,rgba(0,0,0,.16),rgba(0,0,0,0) 70%)" }} />

      {/* Printed-vinyl mascot decal */}
      <div style={{ position: "absolute", top: 150, left: 62, width: 64, height: 70, filter: "drop-shadow(0 1px 1px rgba(0,0,0,.18))" }}>
        <div style={{ position: "absolute", left: 8, top: 0, width: 48, height: 58, background: "linear-gradient(155deg,#2a2a27,#131311)", borderRadius: 11, boxShadow: "inset 0 0 0 .6px rgba(255,255,255,.14)" }} />
        <div style={{ position: "absolute", left: 8, top: 0, width: 48, height: 11, background: "linear-gradient(180deg,#ff5c68,#d0303d)", borderRadius: "11px 11px 0 0" }} />
        <div style={{ position: "absolute", left: 14, top: 16, width: 36, height: 25, background: "#f7f7f5", borderRadius: 5, boxShadow: "inset 0 0 0 .5px rgba(0,0,0,.16)" }} />
        <div style={{ position: "absolute", left: 22, top: 24, width: 5.5, height: 6.5, background: "#0e0e0d", borderRadius: 3 }} />
        <div style={{ position: "absolute", left: 38, top: 24, width: 5.5, height: 6.5, background: "#0e0e0d", borderRadius: 3 }} />
        <div style={{ position: "absolute", left: 27, top: 33, width: 11, height: 4, borderBottom: "1.8px solid #0e0e0d", borderRadius: "0 0 6px 6px" }} />
        <div style={{ position: "absolute", left: 19, top: 45, width: 26, height: 3.5, background: "#0e0e0d", borderRadius: 2, overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: "62%", height: "100%", background: "#e63946" }} />
        </div>
        <div style={{ position: "absolute", left: 22, top: 50, width: 20, height: 14, background: "#fdfdfc", borderRadius: "0 0 2px 2px", boxShadow: "0 1px 3px -1px rgba(0,0,0,.4)" }} />
        <div style={{ position: "absolute", left: 2, top: 22, width: 8, height: 3, background: "#141412", borderRadius: 2, transform: "rotate(18deg)" }} />
        <div style={{ position: "absolute", right: 2, top: 22, width: 8, height: 3, background: "#141412", borderRadius: 2, transform: "rotate(-18deg)" }} />
        <div style={{ position: "absolute", left: 0, bottom: 0, width: "100%", textAlign: "center", fontWeight: 700, fontSize: 5.5, letterSpacing: 1.2, color: "#8f8f8a" }}>READY TO PRINT</div>
      </div>

      <div style={{ position: "absolute", top: 228, left: 0, width: "100%", height: 3, background: "#e63946" }} />
      <div style={{ position: "absolute", top: 231, left: 0, width: "100%", bottom: 0, background: "linear-gradient(100deg,#111110,#232320)", borderRadius: "0 0 7px 7px" }} />
    </div>
  );
}

// ─── RIGHT SIDE  --  printed mascot decal, "done" state ──────────────
function RightSide() {
  return (
    <div style={{
      position: "absolute", width: 200, height: 460, left: -15, top: 0,
      transform: "rotateY(90deg) translateZ(84px)",
      background: "linear-gradient(260deg,#e9e9e6 0%,#f7f7f5 24%,#dcdcd9 62%,#eeeeeb 100%)",
      borderRadius: 8,
      overflow: "hidden",
      boxShadow: "inset 0 0 0 1px rgba(0,0,0,.08),inset 0 1px 0 rgba(255,255,255,.9)",
    }}>
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 32, background: "linear-gradient(180deg,#ff6a75 0%,#f0404e 38%,#cd2c39 100%),radial-gradient(130% 70% at 18% -10%,rgba(255,255,255,.5),rgba(255,255,255,0) 62%)" }} />
      <div style={{ position: "absolute", top: 46, left: 9, width: 42, height: 74, background: "linear-gradient(90deg,#111110,#1a1a18)", transform: "skewY(-7deg)", transformOrigin: "left", boxShadow: "2px 4px 10px -4px rgba(0,0,0,.4)" }} />
      <div style={{ position: "absolute", top: 134, left: 9, width: 26, height: 9, background: "linear-gradient(180deg,#cfcfcb,#eee)" }} />
      <div style={{ position: "absolute", top: 228, left: 0, width: "100%", height: 3, background: "#e63946" }} />
      <div style={{ position: "absolute", top: 231, left: 0, width: "100%", bottom: 0, background: "linear-gradient(260deg,#111110,#232320)", borderRadius: "0 0 7px 7px" }} />

      <div style={{ position: "absolute", left: 46, top: 128, width: 108, height: 150, background: "radial-gradient(ellipse at 50% 42%,rgba(0,0,0,.16),rgba(0,0,0,0) 70%)" }} />

      {/* Printed-vinyl mascot decal  --  done state */}
      <div style={{ position: "absolute", top: 150, left: 56, width: 76, height: 78, filter: "drop-shadow(0 1px 1px rgba(0,0,0,.18))" }}>
        <div style={{ position: "absolute", left: 12, top: 8, width: 52, height: 56, background: "linear-gradient(155deg,#2a2a27,#131311)", borderRadius: 12, boxShadow: "inset 0 0 0 .6px rgba(255,255,255,.14)" }} />
        <div style={{ position: "absolute", left: 12, top: 8, width: 52, height: 22, background: "linear-gradient(180deg,#ff5c68,#e63946 55%,#d0303d)", borderRadius: "12px 12px 0 0" }} />
        <div style={{ position: "absolute", left: 18, top: 22, width: 40, height: 30, background: "#f7f7f5", borderRadius: 6, boxShadow: "inset 0 0 0 .5px rgba(0,0,0,.16)" }} />
        <div style={{ position: "absolute", left: 25, top: 33, width: 8, height: 2.4, background: "#0e0e0d", borderRadius: 2, transform: "rotate(8deg)" }} />
        <div style={{ position: "absolute", left: 43, top: 33, width: 8, height: 2.4, background: "#0e0e0d", borderRadius: 2, transform: "rotate(-8deg)" }} />
        <div style={{ position: "absolute", left: 27, top: 38, width: 22, height: 9, borderBottom: "2.4px solid #0e0e0d", borderRadius: "0 0 11px 11px" }} />
        <div style={{ position: "absolute", left: 20, top: 54, width: 36, height: 20, background: "#fdfdfc", borderRadius: "0 0 3px 3px", boxShadow: "0 3px 6px -2px rgba(0,0,0,.4)", paddingTop: 3, boxSizing: "border-box" }}>
          <div style={{ width: "70%", height: 1.6, background: "#d8d8d5", borderRadius: 1, margin: "2px auto" }} />
          <div style={{ width: "55%", height: 1.6, background: "#d8d8d5", borderRadius: 1, margin: "2px auto" }} />
          <div style={{ width: "60%", height: 1.6, background: "#e63946", borderRadius: 1, margin: "2px auto" }} />
        </div>
      </div>
      <div style={{ position: "absolute", top: 232, left: 56, width: 76, textAlign: "center", fontWeight: 700, fontSize: 6.5, letterSpacing: 1.2, color: "#f5f5f3" }}>GRAB YOUR PRINT</div>
    </div>
  );
}

// ─── TOP ─────────────────────────────────────────────────────────
function Top() {
  return (
    <div style={{
      position: "absolute", width: 170, height: 200, left: 0, top: 130,
      transform: "rotateX(90deg) translateZ(230px)",
      background: "linear-gradient(135deg,#ff4956,#cf2f3c)",
      borderRadius: 8,
      overflow: "hidden",
      boxShadow: "inset 0 0 0 1px rgba(0,0,0,.1)",
    }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 9, background: "#fff" }} />
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontWeight: 800, fontSize: 13, letterSpacing: "-.6px", color: "#fff" }}>snaprint</span>
      </div>
      <div style={{ position: "absolute", bottom: 8, left: 0, width: "100%", textAlign: "center", fontSize: 6, color: "rgba(255,255,255,.8)", letterSpacing: 1 }}>FRONT (LED edge) ◀</div>
    </div>
  );
}

// ─── BOTTOM ──────────────────────────────────────────────────────
function Bottom() {
  const foot = (style: React.CSSProperties) => (
    <div style={{ position: "absolute", width: 22, height: 22, borderRadius: "50%", background: "radial-gradient(circle at 38% 35%,#2a2a28,#0a0a09)", boxShadow: "0 0 0 2px #e63946", ...style }} />
  );
  return (
    <div style={{
      position: "absolute", width: 170, height: 200, left: 0, top: 130,
      transform: "rotateX(-90deg) translateZ(230px)",
      background: "#f3f3f1",
      borderRadius: 8,
      overflow: "hidden",
      boxShadow: "inset 0 0 0 1px rgba(0,0,0,.06)",
    }}>
      {foot({ top: 14, left: 14 })}
      {foot({ top: 14, right: 14 })}
      {foot({ bottom: 14, left: 14 })}
      {foot({ bottom: 14, right: 14 })}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 36, height: 16, background: "#111110", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 5, color: "#6a6a66", letterSpacing: 1 }}>CABLE</span>
      </div>
    </div>
  );
}

// ─── STUDIO GLOSS  --  key light top-left, fill right, rim on the trailing
//     edge of each face. Purely a lighting overlay: pointer-events none,
//     sits a fraction of a pixel above each face it lights. ───────────
function Gloss() {
  return (
    <>
      <div style={{
        position: "absolute", width: 172, height: 460, left: -1, top: 0,
        transform: "translateZ(100.4px)", pointerEvents: "none", borderRadius: 8,
        background: "linear-gradient(112deg,rgba(255,255,255,.72) 0%,rgba(255,255,255,.2) 9%,rgba(255,255,255,0) 22%),linear-gradient(180deg,rgba(255,255,255,.12),rgba(255,255,255,0) 26%,rgba(0,0,0,.2) 100%)",
      }} />
      <div style={{
        position: "absolute", top: 46, left: 11, width: 153, height: 74,
        transform: "translateZ(100.7px)", pointerEvents: "none",
        background: "linear-gradient(118deg,rgba(198,220,255,.5) 0%,rgba(255,255,255,.16) 22%,rgba(255,255,255,0) 44%,rgba(255,255,255,0) 100%)",
      }} />
      <div style={{
        position: "absolute", width: 200, height: 460, left: -15, top: 0,
        transform: "rotateY(-90deg) translateZ(84.4px)", pointerEvents: "none", borderRadius: 8,
        background: "linear-gradient(96deg,rgba(255,255,255,.5),rgba(255,255,255,.07) 40%,rgba(0,0,0,.14)),linear-gradient(180deg,rgba(255,255,255,.1),rgba(0,0,0,.2))",
      }} />
      <div style={{
        position: "absolute", width: 200, height: 460, left: -15, top: 0,
        transform: "rotateY(90deg) translateZ(84.4px)", pointerEvents: "none", borderRadius: 8,
        background: "linear-gradient(90deg,rgba(255,255,255,.85) 0%,rgba(255,255,255,0) 3.5%),linear-gradient(264deg,rgba(0,0,0,.34),rgba(0,0,0,.08) 52%,rgba(255,255,255,.08))",
      }} />
      <div style={{
        position: "absolute", width: 170, height: 200, left: 0, top: 130,
        transform: "rotateX(90deg) translateZ(230.4px)", pointerEvents: "none", borderRadius: 8,
        background: "linear-gradient(150deg,rgba(255,255,255,.6),rgba(255,255,255,.08) 40%,rgba(0,0,0,.24))",
      }} />
    </>
  );
}

export interface Machine3DHandle {
  /** Scroll-driven base rotation (degrees). No-ops while the user is actively
   *  dragging  --  the touch system owns rotation exclusively while active, and
   *  this resumes contributing smoothly (no jump) the moment they release,
   *  since it's applied additively on top of whatever the drag left behind. */
  setExternalRotation: (rotY: number, rotX: number) => void;
}

interface Machine3DProps {
  vignette?: boolean;
  scale?: number;
  interactive?: boolean;
}

// ─── MACHINE 3D ──────────────────────────────────────────────────
// `interactive=false` gives a non-interactive, non-draggable presentation of
// the same component  --  used so only ONE live, draggable instance exists on
// the page at a time (design-system §7) while still reusing the real asset
// instead of a flat static image for the second placement.
const Machine3D = forwardRef<Machine3DHandle, Machine3DProps>(function Machine3D(
  { vignette = false, scale = 1, interactive = true },
  ref
) {
  const stageRef = useRef<HTMLDivElement>(null);
  const hitRef = useRef<HTMLDivElement>(null);

  const state = useRef({
    // Base pose: driven externally (hero scroll camera) when present, or the
    // component's own resting angle otherwise (e.g. the static hardware-section
    // placement, which has no external driver).
    baseRotY: -28,
    baseRotX: -8,
    // Manual drag offset  --  persists after release ("stays in manual position").
    dragRotY: 0,
    dragRotX: 0,
    velY: 0,
    velX: 0,
    dragging: false,
    pointerId: null as number | null,
    hitRect: null as DOMRect | null,
    lastX: 0,
    lastY: 0,
    lastT: 0,
    // Idle ambient auto-rotate state  --  non-interactive instances only.
    idleAt: 0,
    autoRampStart: 0,
    raf: 0,
  });

  const ROT_X_MIN = -32;
  const ROT_X_MAX = 22;
  const IDLE_MS = 4000;
  const AUTO_SPEED = 0.14;
  const RAMP_MS = 1600;
  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

  const clampX = (v: number) => Math.max(ROT_X_MIN, Math.min(ROT_X_MAX, v));

  const apply = () => {
    if (!stageRef.current) return;
    const s = state.current;
    const rotY = s.baseRotY + s.dragRotY;
    const rotX = clampX(s.baseRotX + s.dragRotX);
    stageRef.current.style.transform = `scale(${0.78 * scale}) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  };

  useImperativeHandle(ref, () => ({
    setExternalRotation: (rotY: number, rotX: number) => {
      const s = state.current;
      if (s.dragging) return;
      s.baseRotY = rotY;
      s.baseRotX = rotX;
      apply();
    },
  }));

  // Ambient idle auto-rotate  --  non-interactive placements only (e.g. the
  // hardware section's static reuse of this asset, which nobody can touch).
  // The interactive hero instance never runs this: its rotation comes from
  // the scroll camera and, once touched, the user  --  a continuous auto-spin
  // was explicitly the thing being fixed here.
  useEffect(() => {
    if (interactive) return;
    const s = state.current;
    let prev = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(2, (now - prev) / 16.67);
      prev = now;
      if (now >= s.idleAt) {
        if (!s.autoRampStart) s.autoRampStart = now;
        const rampT = Math.min(1, (now - s.autoRampStart) / RAMP_MS);
        s.baseRotY += AUTO_SPEED * easeOutCubic(rampT) * dt;
        apply();
      }
      s.raf = requestAnimationFrame(tick);
    };
    s.raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(s.raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interactive]);

  // Very light, very short release inertia  --  a physical "settle," not a spin.
  // Capped velocity + steep decay means it's fully stopped within a few
  // frames; if it ever reads like a carousel, this is the block to gut.
  useEffect(() => {
    if (!interactive) return;
    const s = state.current;
    let raf = 0;
    const tick = () => {
      if (!s.dragging && (Math.abs(s.velY) > 0.01 || Math.abs(s.velX) > 0.01)) {
        s.dragRotY += s.velY;
        s.dragRotX += s.velX;
        s.velY *= 0.78;
        s.velX *= 0.78;
        apply();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [interactive]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (!interactive) return;
    const s = state.current;
    const el = e.currentTarget as HTMLElement;
    s.dragging = true;
    s.velY = 0;
    s.velX = 0;
    s.lastX = e.clientX;
    s.lastY = e.clientY;
    s.lastT = performance.now();
    s.pointerId = e.pointerId;
    s.hitRect = el.getBoundingClientRect();
    el.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const s = state.current;
    if (!s.dragging || s.pointerId !== e.pointerId || !s.hitRect) return;
    const now = performance.now();
    const dx = e.clientX - s.lastX;
    const dy = e.clientY - s.lastY;
    const dt = Math.max(8, now - s.lastT);
    s.dragRotY += dx * 0.35;
    s.dragRotX -= dy * 0.25;
    s.velY = ((dx * 0.35) / dt) * 16.67;
    s.velX = ((-dy * 0.25) / dt) * 16.67;
    s.lastX = e.clientX;
    s.lastY = e.clientY;
    s.lastT = now;
    apply();
  };

  const endDrag = (e: React.PointerEvent) => {
    const s = state.current;
    if (!s.dragging) return;
    s.dragging = false;
    s.pointerId = null;
    // Cap so release inertia can only ever be a brief settle, never a coast.
    s.velY = Math.max(-5, Math.min(5, s.velY));
    s.velX = Math.max(-5, Math.min(5, s.velX));
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* pointer capture already released by the browser  --  safe to ignore */
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, userSelect: "none" }}>
      {/* Floor shadows */}
      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div
          ref={hitRef}
          data-machine3d={interactive ? "true" : undefined}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          style={{
            width: 760 * scale, maxWidth: "100%", height: 680 * scale, perspective: 1900,
            cursor: interactive ? "grab" : "default",
            display: "flex", alignItems: "center", justifyContent: "center",
            // `pan-y` (not `none`) even while interactive: this hit area is large
            // enough to cover most of the mobile hero viewport, and `none` used to
            // give it total ownership of every touch gesture inside it  --  including
            // a vertical swipe meant to scroll the page, which just spun the kiosk
            // instead and left mobile visitors stuck unable to scroll past the
            // hero. `pan-y` lets the browser take over a vertical swipe as a
            // normal scroll; horizontal drag is still free for touch-rotate since
            // only vertical panning is reserved for the browser. Mouse drag on
            // desktop is unaffected either way  --  touch-action only governs touch.
            touchAction: "pan-y",
            position: "relative",
          }}
        >
          {/* Shadow layers */}
          <div style={{ position: "absolute", bottom: 150, left: "50%", transform: "translateX(-50%)", width: 420, height: 80, background: "radial-gradient(ellipse at 50% 0%,rgba(0,0,0,.14),transparent 70%)", filter: "blur(4px)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: 152, left: "50%", transform: "translateX(-50%)", width: 200, height: 50, background: "radial-gradient(ellipse at 50% 0%,rgba(230,57,70,.25),transparent 70%)", filter: "blur(9px)", pointerEvents: "none" }} />

          {/* Cinematic vignette  --  explorer placement only. Uses an INSET box-shadow
              (fixed-pixel blur/spread) rather than a percentage-based radial-gradient:
              the box here is the full 760*scale-wide perspective container, mostly
              empty transparent padding around the much narrower machine graphic, so a
              gradient sized as a % of that box reaches its "dark edge" stop while
              still inside the box  --  which, once this box sits close to neighboring
              content, can visibly darken it. inset shadows are physically incapable
              of painting outside their own box, so this can never bleed out. */}
          {vignette && (
            <div
              style={{
                position: "absolute", inset: 0,
                boxShadow: "inset 0 0 30px 0 rgba(0,0,0,.4)",
                pointerEvents: "none",
              }}
              aria-hidden
            />
          )}

          {/* Stage */}
          <div
            ref={stageRef}
            style={{
              position: "relative",
              width: 170, height: 460,
              transformStyle: "preserve-3d",
              transform: `scale(${0.78 * scale}) rotateX(-8deg) rotateY(-28deg)`,
            }}
          >
            <Core />
            <Front />
            <Back />
            <LeftSide />
            <RightSide />
            <Top />
            <Bottom />
            <Gloss />
          </div>
        </div>
      </div>

      <p style={{ fontFamily: "Inter,sans-serif", fontSize: 11, letterSpacing: "0.14em", color: interactive ? "#8a8a84" : "#555550", textTransform: "uppercase", margin: 0 }}>
        {interactive ? "drag to explore · every face detailed" : "the Snaprint S1 · every face detailed"}
      </p>
    </div>
  );
});

export default Machine3D;
