"use client";

import { useRef, useEffect, useState } from "react";

// ─── INNER CORE — seals the hollow so no gap reveals emptiness ───
function Core() {
  const s: React.CSSProperties = { position: "absolute", background: "#1a1a18" };
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

// ─── FRONT ───────────────────────────────────────────────────────
function Front() {
  return (
    <div style={{
      position: "absolute", width: 172, height: 460, left: -1, top: 0,
      transform: "translateZ(100px)",
      background: "linear-gradient(95deg,#ffffff,#f3f3f1)",
      overflow: "hidden",
      boxShadow: "inset 0 0 0 1px rgba(0,0,0,.06)",
    }}>
      {/* Red left LED stripe */}
      <div style={{ position: "absolute", top: 0, left: 13, width: 7, height: "100%", background: "linear-gradient(180deg,#ff5663,#e63946 45%,#c92a37)", zIndex: 3 }} />
      {/* Red header bar */}
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 32, background: "linear-gradient(180deg,#ff4956,#cf2f3c)", zIndex: 4, display: "flex", alignItems: "center", paddingLeft: 26, boxSizing: "border-box" }}>
        <span style={{ fontWeight: 800, fontSize: 14, letterSpacing: "-.7px", color: "#fff" }}>snaprint</span>
      </div>
      {/* Screen bezel */}
      <div style={{ position: "absolute", top: 46, left: 11, right: 8, height: 74, background: "#111110", padding: 3, boxSizing: "border-box", zIndex: 5 }}>
        <div style={{ width: "100%", height: "100%", background: "#fff", display: "flex", alignItems: "center" }}>
          {/* snap.scan.print. */}
          <div style={{ flex: 1, paddingLeft: 9, lineHeight: 0.88 }}>
            <div style={{ fontWeight: 900, fontSize: 13, letterSpacing: "-.6px" }}>snap.</div>
            <div style={{ fontWeight: 900, fontSize: 13, letterSpacing: "-.6px" }}>scan.</div>
            <div style={{ fontWeight: 900, fontSize: 13, letterSpacing: "-.6px", display: "inline-block", position: "relative" }}>
              print.
              <span style={{ position: "absolute", left: 0, bottom: 2, width: "100%", height: 4, background: "#e63946", zIndex: -1 }} />
            </div>
          </div>
          {/* QR + label */}
          <div style={{ width: 52, height: "100%", background: "#f5f5f5", borderLeft: "1px solid #eee", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3 }}>
            <div style={{ width: 34, height: 34, background: "#e63946", padding: 4, boxSizing: "border-box" }}>
              <div style={{ width: "100%", height: "100%", background: "#fff", WebkitMask: "repeating-conic-gradient(#000 0 25%,transparent 0 50%) 0 0/6px 6px", mask: "repeating-conic-gradient(#000 0 25%,transparent 0 50%) 0 0/6px 6px" }} />
            </div>
            <span style={{ fontWeight: 700, fontSize: 5, color: "#111110" }}>scan to print</span>
          </div>
        </div>
      </div>
      {/* Collect slot */}
      <div style={{ position: "absolute", top: 134, left: 24, right: 8, zIndex: 5 }}>
        <div style={{ fontWeight: 700, fontSize: 5, letterSpacing: 1, color: "#bbb", textAlign: "center", marginBottom: 3 }}>COLLECT YOUR PRINTS</div>
        <div style={{ height: 1.5, background: "linear-gradient(90deg,rgba(230,57,70,0),#e63946,rgba(230,57,70,0))", boxShadow: "0 0 4px rgba(230,57,70,.5)", marginBottom: 2 }} />
        <div style={{ height: 9, background: "linear-gradient(180deg,#cfcfcb,#f0f0ee)", boxShadow: "inset 0 3px 5px -2px rgba(0,0,0,.5)" }} />
      </div>
      {/* Steps 01/02/03 */}
      <div style={{ position: "absolute", top: 172, left: 14, right: 8, display: "flex", gap: 5, zIndex: 5 }}>
        {[["01","scan"],["02","pay"],["03","grab"]].map(([n,l]) => (
          <div key={n} style={{ flex: 1, background: "#f5f5f5", padding: "6px 2px", textAlign: "center" }}>
            <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#e63946", fontWeight: 800, fontSize: 7, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 3px" }}>{n}</div>
            <div style={{ fontWeight: 600, fontSize: 6, color: "#6a6a66" }}>{l}</div>
          </div>
        ))}
      </div>
      {/* Red separator */}
      <div style={{ position: "absolute", top: 228, left: 0, width: "100%", height: 3, background: "#e63946", zIndex: 2 }} />
      {/* Dark lower chassis */}
      <div style={{ position: "absolute", top: 231, left: 0, width: "100%", bottom: 0, background: "linear-gradient(95deg,#1a1a18,#111110 60%,#0a0a09)" }}>
        <div style={{ position: "absolute", top: 12, left: 24, right: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontWeight: 700, fontSize: 7, color: "#fff" }}>B&amp;W ₹3</span>
          <span style={{ fontWeight: 700, fontSize: 5, color: "#fff", background: "#e63946", padding: "2px 5px", borderRadius: 20 }}>UPI</span>
        </div>
        <div style={{ position: "absolute", bottom: 26, left: 0, width: "100%", textAlign: "center", fontWeight: 600, fontSize: 6, color: "#5a5a56" }}>prints in under 30 seconds</div>
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
      background: "linear-gradient(95deg,#fbfbfa,#eee)",
      overflow: "hidden",
      boxShadow: "inset 0 0 0 1px rgba(0,0,0,.06)",
    }}>
      {/* Red top bar */}
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 32, background: "linear-gradient(180deg,#ff4956,#cf2f3c)" }} />
      {/* Red stripe on right edge */}
      <div style={{ position: "absolute", top: 0, right: 13, width: 7, height: "100%", background: "linear-gradient(180deg,#ff5663,#e63946 45%,#c92a37)", zIndex: 3 }} />
      {/* SNAPRINT label */}
      <div style={{ position: "absolute", top: 52, left: 0, width: "100%", textAlign: "center", fontWeight: 700, fontSize: 9, letterSpacing: 2, color: "#cfcfcb" }}>SNAPRINT</div>
      {/* Port cluster */}
      <div style={{ position: "absolute", top: 90, left: "50%", transform: "translateX(-50%)", width: 40, height: 20, background: "#e9e9e6", boxShadow: "inset 0 0 0 1px rgba(0,0,0,.08)", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
        <div style={{ width: 5, height: 9, background: "#bdbdb9" }} />
        <div style={{ width: 8, height: 5, background: "#bdbdb9" }} />
      </div>
      <div style={{ position: "absolute", top: 114, left: 0, width: "100%", textAlign: "center", fontSize: 5, color: "#bdbdb9" }}>power · ethernet</div>
      {/* Red separator */}
      <div style={{ position: "absolute", top: 228, left: 0, width: "100%", height: 3, background: "#e63946" }} />
      {/* Dark lower */}
      <div style={{ position: "absolute", top: 231, left: 0, width: "100%", bottom: 0, background: "linear-gradient(95deg,#1a1a18,#111110)" }} />
      {/* Paper refill door */}
      <div style={{ position: "absolute", top: 74, left: 25, width: 110, height: 150, background: "linear-gradient(95deg,#1f1f1d,#161614)", border: "1.5px solid #e63946", borderRadius: 6 }}>
        {/* Door handle bar */}
        <div style={{ position: "absolute", top: "50%", left: 9, transform: "translateY(-50%)", width: 5, height: 30, background: "linear-gradient(90deg,#0a0a09,#222)", boxShadow: "inset 0 0 3px rgba(0,0,0,.8)" }} />
        {/* Key lock */}
        <div style={{ position: "absolute", top: 9, right: 9, width: 12, height: 12, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#ff6b76,#c92a37)" }}>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 1.5, height: 5, background: "#7a1620" }} />
        </div>
        {/* Label */}
        <div style={{ position: "absolute", bottom: 10, left: 0, width: "100%", textAlign: "center", fontWeight: 600, fontSize: 6, letterSpacing: 1, color: "#6a6a66" }}>A4 PAPER REFILL</div>
      </div>
    </div>
  );
}

// ─── LEFT SIDE ───────────────────────────────────────────────────
function LeftSide() {
  return (
    <div style={{
      position: "absolute", width: 200, height: 460, left: -15, top: 0,
      transform: "rotateY(-90deg) translateZ(84px)",
      background: "linear-gradient(100deg,#e2e2df,#f2f2ef)",
      overflow: "hidden",
      boxShadow: "inset 0 0 0 1px rgba(0,0,0,.06)",
    }}>
      {/* Top header */}
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 32, background: "linear-gradient(180deg,#ff4956,#cf2f3c)" }} />
      {/* LED stripe — front edge = right side of this face */}
      <div style={{
        position: "absolute", top: 0, right: 9, width: 8, height: "100%",
        background: "linear-gradient(180deg,#ff5663,#e63946 45%,#c92a37)",
        boxShadow: "0 0 14px 2px rgba(230,57,70,.55)",
        animation: "ledPulse 3.4s ease-in-out infinite",
        zIndex: 3,
      }} />
      {/* Screen slab edge */}
      <div style={{ position: "absolute", top: 46, right: 9, width: 42, height: 74, background: "linear-gradient(90deg,#1a1a18,#111110)", borderRadius: "0 0 0 7px", transform: "skewY(7deg)", transformOrigin: "right", boxShadow: "-2px 4px 10px -4px rgba(0,0,0,.4)" }} />
      {/* Tray edge */}
      <div style={{ position: "absolute", top: 134, right: 9, width: 26, height: 9, background: "linear-gradient(180deg,#cfcfcb,#eee)", borderRadius: "0 0 0 3px" }} />
      {/* Red separator */}
      <div style={{ position: "absolute", top: 228, left: 0, width: "100%", height: 3, background: "#e63946" }} />
      {/* Printer housing */}
      <div style={{ position: "absolute", top: 231, left: 0, width: "100%", bottom: 0, background: "linear-gradient(95deg,#0f0f0e,#1a1a18)" }}>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontWeight: 600, fontSize: 8, letterSpacing: 2, color: "#4a4a46" }}>PRINTER HOUSING</span>
        </div>
        <div style={{ position: "absolute", top: 20, left: 30, display: "flex", flexDirection: "column", gap: 6 }}>
          {[0,1,2,3].map(i => <div key={i} style={{ width: 120, height: 1.5, background: "rgba(255,255,255,.05)" }} />)}
        </div>
      </div>
    </div>
  );
}

// ─── RIGHT SIDE ──────────────────────────────────────────────────
function RightSide() {
  return (
    <div style={{
      position: "absolute", width: 200, height: 460, left: -15, top: 0,
      transform: "rotateY(90deg) translateZ(84px)",
      background: "linear-gradient(100deg,#f2f2ef,#e2e2df)",
      overflow: "hidden",
      boxShadow: "inset 0 0 0 1px rgba(0,0,0,.06)",
    }}>
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 32, background: "linear-gradient(180deg,#ff4956,#cf2f3c)" }} />
      {/* LED stripe — front edge = left side of this face */}
      <div style={{
        position: "absolute", top: 0, left: 9, width: 8, height: "100%",
        background: "linear-gradient(180deg,#ff5663,#e63946 45%,#c92a37)",
        boxShadow: "0 0 14px 2px rgba(230,57,70,.55)",
        animation: "ledPulse 3.4s ease-in-out infinite",
        zIndex: 3,
      }} />
      <div style={{ position: "absolute", top: 46, left: 9, width: 42, height: 74, background: "linear-gradient(90deg,#111110,#1a1a18)", transform: "skewY(-7deg)", transformOrigin: "left", boxShadow: "2px 4px 10px -4px rgba(0,0,0,.4)" }} />
      <div style={{ position: "absolute", top: 134, left: 9, width: 26, height: 9, background: "linear-gradient(180deg,#cfcfcb,#eee)" }} />
      <div style={{ position: "absolute", top: 228, left: 0, width: "100%", height: 3, background: "#e63946" }} />
      <div style={{ position: "absolute", top: 231, left: 0, width: "100%", bottom: 0, background: "linear-gradient(95deg,#1a1a18,#0f0f0e)" }}>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontWeight: 600, fontSize: 8, letterSpacing: 2, color: "#4a4a46" }}>PRINTER HOUSING</span>
        </div>
      </div>
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
      overflow: "hidden",
      boxShadow: "inset 0 0 0 1px rgba(0,0,0,.1)",
    }}>
      {/* White left edge marker (front edge) */}
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
      overflow: "hidden",
      boxShadow: "inset 0 0 0 1px rgba(0,0,0,.06)",
    }}>
      {foot({ top: 14, left: 14 })}
      {foot({ top: 14, right: 14 })}
      {foot({ bottom: 14, left: 14 })}
      {foot({ bottom: 14, right: 14 })}
      {/* Cable cutout */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 36, height: 16, background: "#111110", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 5, color: "#6a6a66", letterSpacing: 1 }}>CABLE</span>
      </div>
    </div>
  );
}

// ─── MACHINE 3D ──────────────────────────────────────────────────
export default function Machine3D() {
  const stageRef = useRef<HTMLDivElement>(null);
  const state = useRef({
    rotY: -28, rotX: -8,
    velY: 0, velX: 0,
    dragging: false,
    lastX: 0, lastY: 0, lastT: 0,
    idleAt: 0,
    raf: 0,
  });

  const IDLE_MS   = 4000;
  const AUTO_SPEED = 0.18;

  const apply = () => {
    if (stageRef.current) {
      const { rotX, rotY } = state.current;
      stageRef.current.style.transform =
        `scale(0.78) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    }
  };

  const clampX = () => {
    state.current.rotX = Math.max(-32, Math.min(24, state.current.rotX));
  };

  useEffect(() => {
    // Global ledPulse keyframe injection
    if (!document.getElementById("__ledPulse")) {
      const st = document.createElement("style");
      st.id = "__ledPulse";
      st.textContent = "@keyframes ledPulse{0%,100%{opacity:.85}50%{opacity:1}}";
      document.head.appendChild(st);
    }

    let prev = performance.now();
    const s = state.current;

    const tick = (now: number) => {
      const dt = Math.min(2, (now - prev) / 16.67);
      prev = now;

      if (!s.dragging) {
        if (Math.abs(s.velY) > 0.02 || Math.abs(s.velX) > 0.02) {
          s.rotY += s.velY * dt;
          s.rotX += s.velX * dt;
          clampX();
          const decay = Math.pow(0.94, dt);
          s.velY *= decay; s.velX *= decay;
          apply();
        } else {
          s.velY = 0; s.velX = 0;
          if (now >= s.idleAt) { s.rotY += AUTO_SPEED * dt; apply(); }
        }
      }
      s.raf = requestAnimationFrame(tick);
    };
    s.raf = requestAnimationFrame(tick);

    const onMove = (e: PointerEvent) => {
      if (!s.dragging) return;
      const now = performance.now();
      const dx = e.clientX - s.lastX;
      const dy = e.clientY - s.lastY;
      const dt = Math.max(8, now - s.lastT);
      s.rotY += dx * 0.5;
      s.rotX -= dy * 0.3;
      clampX();
      s.velY = (dx * 0.5) / dt * 16.67;
      s.velX = (-dy * 0.3) / dt * 16.67;
      s.lastX = e.clientX; s.lastY = e.clientY; s.lastT = now;
      apply();
    };

    const onUp = () => {
      if (!s.dragging) return;
      s.dragging = false;
      document.body.style.cursor = "";
      s.idleAt = performance.now() + IDLE_MS;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);

    return () => {
      cancelAnimationFrame(s.raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, []);

  const onDown = (e: React.PointerEvent) => {
    const s = state.current;
    s.dragging = true;
    s.velY = 0; s.velX = 0;
    s.idleAt = Infinity;
    s.lastX = e.clientX; s.lastY = e.clientY; s.lastT = performance.now();
    document.body.style.cursor = "grabbing";
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, userSelect: "none" }}>
      {/* Floor shadows */}
      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div
          onPointerDown={onDown}
          style={{ width: 760, maxWidth: "100%", height: 680, perspective: 1900, cursor: "grab", display: "flex", alignItems: "center", justifyContent: "center", touchAction: "none", position: "relative" }}
        >
          {/* Shadow layers */}
          <div style={{ position: "absolute", bottom: 150, left: "50%", transform: "translateX(-50%)", width: 420, height: 80, background: "radial-gradient(ellipse at 50% 0%,rgba(0,0,0,.14),transparent 70%)", filter: "blur(4px)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: 152, left: "50%", transform: "translateX(-50%)", width: 200, height: 50, background: "radial-gradient(ellipse at 50% 0%,rgba(230,57,70,.25),transparent 70%)", filter: "blur(9px)", pointerEvents: "none" }} />

          {/* Stage */}
          <div
            ref={stageRef}
            style={{
              position: "relative",
              width: 170, height: 460,
              transformStyle: "preserve-3d",
              transform: "scale(0.78) rotateX(-8deg) rotateY(-28deg)",
            }}
          >
            <Core />
            <Front />
            <Back />
            <LeftSide />
            <RightSide />
            <Top />
            <Bottom />
          </div>
        </div>
      </div>

      {/* Hint */}
      <p style={{ fontFamily: "Inter,sans-serif", fontSize: 11, letterSpacing: "0.14em", color: "#555550", textTransform: "uppercase", margin: 0 }}>
        drag to rotate · auto-spins · every face detailed
      </p>
    </div>
  );
}
