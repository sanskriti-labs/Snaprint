"use client";

import { useRef, useState, useEffect, useCallback } from "react";

// ─── FACE: FRONT ─────────────────────────────────────────────────────────────
function FrontFace() {
  return (
    <svg width="280" viewBox="0 0 280 700" xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <rect x="8" y="8" width="264" height="684" rx="13" fill="#F2F0EB" />
      <rect x="8" y="8" width="264" height="684" rx="13" fill="none" stroke="#E0DED8" strokeWidth="0.8" />
      {/* Red header */}
      <rect x="8" y="8" width="264" height="66" rx="13" fill="#E63946" />
      <rect x="8" y="44" width="264" height="30" fill="#E63946" />
      {/* Logo */}
      <text x="48" y="40" fontFamily="monospace" fontSize="20" fontWeight="700" fill="white" letterSpacing="-0.4">snaprint</text>
      <text x="48" y="56" fontFamily="monospace" fontSize="5.5" fill="rgba(255,255,255,0.4)" letterSpacing="2.5">INSTANT PRINT NETWORK</text>
      {/* Red LED stripe */}
      <rect x="8" y="8" width="9" height="684" rx="4.5" fill="#E63946" />
      {/* Camera dot */}
      <circle cx="248" cy="38" r="6" fill="#1A1A18" />
      <circle cx="248" cy="38" r="3" fill="#0A0A09" />
      <circle cx="246.5" cy="36.5" r="1" fill="#E63946" opacity="0.5" />
      {/* Screen */}
      <rect x="22" y="80" width="228" height="228" rx="6" fill="#0A0A09" />
      <rect x="22" y="80" width="228" height="228" rx="6" fill="none" stroke="#E63946" strokeWidth="0.8" />
      <rect x="26" y="84" width="220" height="28" rx="4" fill="#E63946" />
      <text x="136" y="102" textAnchor="middle" fontFamily="monospace" fontSize="10" fontWeight="700" fill="white">snaprint</text>
      <text x="46" y="144" fontFamily="monospace" fontSize="18" fontWeight="700" fill="white">snap.</text>
      <text x="46" y="166" fontFamily="monospace" fontSize="18" fontWeight="700" fill="white">scan.</text>
      <text x="46" y="188" fontFamily="monospace" fontSize="18" fontWeight="700" fill="#E63946">print.</text>
      <text x="46" y="208" fontFamily="monospace" fontSize="7" fill="rgba(255,255,255,0.35)">B&amp;W ₹3 · Colour ₹10</text>
      {/* QR box */}
      <rect x="152" y="120" width="84" height="84" rx="4" fill="#111110" />
      <rect x="152" y="120" width="84" height="84" rx="4" fill="none" stroke="#E63946" strokeWidth="0.6" />
      <text x="194" y="136" textAnchor="middle" fontFamily="monospace" fontSize="5" fill="#E63946">SCAN TO PRINT</text>
      {[
        [160,142,10,10],[172,142,4,4],[178,142,6,4],[186,142,4,4],[192,142,10,10],
        [160,154,4,4],[166,154,4,4],[172,154,8,4],[182,154,4,4],[188,154,4,4],[194,154,6,4],
        [160,160,10,10],[172,162,4,6],[178,160,6,4],[186,160,4,4],[192,160,10,10],
        [160,172,8,4],[170,172,10,4],[182,172,6,4],[190,172,8,4],
        [160,178,4,6],[166,178,8,6],[176,178,4,6],[182,178,8,6],[194,178,6,6],
        [160,186,10,4],[174,186,6,4],[184,186,4,4],[192,186,10,4],
      ].map(([x,y,w,h],i)=>(
        <rect key={i} x={x} y={y} width={w} height={h} fill="#E63946"/>
      ))}
      {/* Screen status + CTA */}
      <rect x="26" y="272" width="220" height="9" fill="#0A0A09" />
      <text x="136" y="279" textAnchor="middle" fontFamily="monospace" fontSize="4.5" fill="#333330">SCAN · UPLOAD · PAY · COLLECT</text>
      <rect x="26" y="282" width="220" height="18" fill="#E63946" />
      <text x="136" y="295" textAnchor="middle" fontFamily="monospace" fontSize="7" fontWeight="700" fill="white">SCAN QR TO START →</text>
      {/* Collect label */}
      <text x="136" y="326" textAnchor="middle" fontFamily="monospace" fontSize="6" fill="#BBBBBA">COLLECT YOUR PRINTS HERE</text>
      {/* LED accent line above tray */}
      <rect x="18" y="330" width="244" height="3" rx="1.5" fill="#E63946" opacity="0.7" />
      {/* Output tray */}
      <rect x="18" y="334" width="244" height="30" rx="4" fill="#E2E0DA" />
      <rect x="18" y="334" width="244" height="30" rx="4" fill="none" stroke="#D8D6D0" strokeWidth="0.6" />
      <rect x="26" y="340" width="228" height="16" rx="2" fill="#D0CEC8" />
      {/* Red separator */}
      <rect x="8" y="366" width="264" height="5" fill="#E63946" />
      {/* Printer housing */}
      <rect x="8" y="373" width="264" height="224" fill="#ECEAE5" />
      <rect x="8" y="373" width="264" height="224" fill="none" stroke="#DCDAD4" strokeWidth="0.5" />
      <text x="136" y="395" textAnchor="middle" fontFamily="monospace" fontSize="6.5" fill="#C0BEB8">PRINTER UNIT · INTERNAL</text>
      <rect x="22" y="403" width="236" height="108" rx="4" fill="#E4E2DC" stroke="#CCCAC4" strokeWidth="0.5" strokeDasharray="3 2" />
      <text x="140" y="446" textAnchor="middle" fontFamily="monospace" fontSize="7.5" fill="#AAAAAA">UNIVERSAL PRINTER ENGINE</text>
      <text x="140" y="461" textAnchor="middle" fontFamily="monospace" fontSize="5.5" fill="#C0BEB8">any brand · 2000 sheets · A4 + Legal</text>
      <rect x="22" y="520" width="116" height="28" rx="3" fill="#DEDAD4" />
      <rect x="22" y="520" width="116" height="28" rx="3" fill="none" stroke="#E63946" strokeWidth="0.5" />
      <text x="80" y="537" textAnchor="middle" fontFamily="monospace" fontSize="6" fill="#E63946">snaprint OS hub</text>
      <rect x="146" y="520" width="116" height="28" rx="3" fill="#DEDAD4" />
      <rect x="146" y="520" width="116" height="28" rx="3" fill="none" stroke="#CCCAC4" strokeWidth="0.5" />
      <text x="204" y="537" textAnchor="middle" fontFamily="monospace" fontSize="6" fill="#AAAAAA">4G SIM + WiFi 6</text>
      <rect x="22" y="558" width="74" height="22" rx="3" fill="#D8D6D0" />
      <text x="59" y="573" textAnchor="middle" fontFamily="monospace" fontSize="5" fill="#AAAAAA">UPS backup</text>
      <rect x="104" y="558" width="82" height="22" rx="3" fill="#D8D6D0" />
      <text x="145" y="573" textAnchor="middle" fontFamily="monospace" fontSize="5" fill="#AAAAAA">India 5A power</text>
      <rect x="194" y="558" width="64" height="22" rx="3" fill="#D8D6D0" />
      <text x="226" y="573" textAnchor="middle" fontFamily="monospace" fontSize="5" fill="#AAAAAA">USB hub</text>
      <line x1="8" y1="591" x2="272" y2="591" stroke="#DCDAD4" strokeWidth="0.5" />
      <rect x="8" y="592" width="264" height="20" fill="#E2E0DA" />
      <text x="136" y="606" textAnchor="middle" fontFamily="monospace" fontSize="5.5" fill="#AAAAAA">SERVICE PANEL · REAR LOCKABLE DOOR</text>
      <rect x="8" y="614" width="264" height="5" fill="#E63946" />
      <rect x="8" y="621" width="264" height="55" fill="#ECEAE5" />
      {[638,649,660,670].map(y=>(
        <line key={y} x1="18" y1={y} x2="262" y2={y} stroke="#DCDAD4" strokeWidth="0.8"/>
      ))}
      <text x="136" y="685" textAnchor="middle" fontFamily="monospace" fontSize="5" fill="#AAAAAA">VENTILATION + CABLE MANAGEMENT</text>
      <rect x="8" y="678" width="264" height="14" fill="#E8E6E0" />
      <rect x="22" y="681" width="64" height="9" rx="2" fill="#DEDAD4" />
      <text x="54" y="688" textAnchor="middle" fontFamily="monospace" fontSize="4" fill="#AAAAAA">USB-C · USB-A</text>
      <rect x="108" y="681" width="64" height="9" rx="2" fill="#DEDAD4" />
      <text x="140" y="688" textAnchor="middle" fontFamily="monospace" fontSize="4" fill="#AAAAAA">5A INDIA POWER</text>
      <rect x="194" y="681" width="64" height="9" rx="2" fill="#DEDAD4" />
      <text x="226" y="688" textAnchor="middle" fontFamily="monospace" fontSize="4" fill="#E63946">HDMI OUT</text>
    </svg>
  );
}

// ─── FACE: SIDE ──────────────────────────────────────────────────────────────
function SideFace({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      width="280"
      viewBox="0 0 280 700"
      xmlns="http://www.w3.org/2000/svg"
      style={flip ? { transform: "scaleX(-1)", display: "block" } : { display: "block" }}
    >
      {/* Body */}
      <rect x="0" y="0" width="280" height="700" fill="#F2F0EB" />
      <rect x="0" y="0" width="280" height="700" fill="none" stroke="#E0DED8" strokeWidth="0.8" />
      {/* Red header band */}
      <rect x="0" y="0" width="280" height="74" fill="#E63946" />
      {/* Front edge LED stripe (left edge of side view) */}
      <rect x="0" y="0" width="9" height="700" fill="#E63946" />
      {/* Depth dimension label */}
      <text x="140" y="55" textAnchor="middle" fontFamily="monospace" fontSize="7" fill="rgba(255,255,255,0.5)" letterSpacing="1.5">65 cm DEEP</text>
      {/* Screen housing — thick black slab from side */}
      <rect x="14" y="80" width="252" height="248" rx="5" fill="#0A0A09" />
      <rect x="14" y="80" width="252" height="248" rx="5" fill="none" stroke="#E63946" strokeWidth="0.8" />
      {/* Screen glass shine from side */}
      <rect x="20" y="86" width="240" height="8" rx="2" fill="rgba(255,255,255,0.04)" />
      {/* Screen label */}
      <text x="140" y="218" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="#333330" letterSpacing="2">23&quot; DISPLAY</text>
      {/* Tablet mounting rail from side */}
      <rect x="26" y="310" width="228" height="6" rx="3" fill="#1E1E1C" />
      {/* Collect tray from side */}
      <text x="140" y="326" textAnchor="middle" fontFamily="monospace" fontSize="6" fill="#BBBBBA">COLLECT YOUR PRINTS HERE</text>
      <rect x="0" y="330" width="280" height="3" rx="0" fill="#E63946" opacity="0.7" />
      <rect x="14" y="334" width="252" height="30" rx="4" fill="#E2E0DA" />
      <rect x="14" y="334" width="252" height="30" rx="4" fill="none" stroke="#D8D6D0" strokeWidth="0.6" />
      <rect x="22" y="340" width="236" height="16" rx="2" fill="#D0CEC8" />
      {/* Red separator */}
      <rect x="0" y="367" width="280" height="5" fill="#E63946" />
      {/* Printer housing — side */}
      <rect x="0" y="374" width="280" height="226" fill="#ECEAE5" />
      <rect x="0" y="374" width="280" height="226" fill="none" stroke="#DCDAD4" strokeWidth="0.5" />
      <text x="140" y="400" textAnchor="middle" fontFamily="monospace" fontSize="6.5" fill="#C0BEB8">PRINTER HOUSING</text>
      {/* Printer engine block from side */}
      <rect x="20" y="408" width="240" height="110" rx="4" fill="#E4E2DC" stroke="#CCCAC4" strokeWidth="0.5" strokeDasharray="3 2" />
      <text x="140" y="455" textAnchor="middle" fontFamily="monospace" fontSize="7.5" fill="#AAAAAA">PRINTER ENGINE</text>
      <text x="140" y="470" textAnchor="middle" fontFamily="monospace" fontSize="5.5" fill="#C0BEB8">A4 · Legal · 2000 sheets</text>
      {/* OS hub row from side */}
      <rect x="20" y="526" width="240" height="28" rx="3" fill="#DEDAD4" />
      <rect x="20" y="526" width="240" height="28" rx="3" fill="none" stroke="#E63946" strokeWidth="0.5" />
      <text x="140" y="543" textAnchor="middle" fontFamily="monospace" fontSize="6" fill="#E63946">snaprint OS hub · 4G SIM + WiFi 6</text>
      {/* Ventilation side */}
      <rect x="0" y="618" width="280" height="5" fill="#E63946" />
      <rect x="0" y="625" width="280" height="50" fill="#ECEAE5" />
      {[638,649,660].map(y=>(
        <line key={y} x1="10" y1={y} x2="270" y2={y} stroke="#DCDAD4" strokeWidth="0.8"/>
      ))}
      <text x="140" y="682" textAnchor="middle" fontFamily="monospace" fontSize="5" fill="#AAAAAA">VENTILATION · CABLE MGMT</text>
      {/* Base ports from side */}
      <rect x="0" y="678" width="280" height="14" fill="#E8E6E0" />
      <rect x="20" y="681" width="80" height="9" rx="2" fill="#DEDAD4" />
      <text x="60" y="688" textAnchor="middle" fontFamily="monospace" fontSize="4" fill="#AAAAAA">5A INDIA POWER</text>
      <rect x="110" y="681" width="60" height="9" rx="2" fill="#DEDAD4" />
      <text x="140" y="688" textAnchor="middle" fontFamily="monospace" fontSize="4" fill="#AAAAAA">USB-C · A</text>
      <rect x="180" y="681" width="60" height="9" rx="2" fill="#DEDAD4" />
      <text x="210" y="688" textAnchor="middle" fontFamily="monospace" fontSize="4" fill="#E63946">HDMI OUT</text>
    </svg>
  );
}

// ─── FACE: BACK ──────────────────────────────────────────────────────────────
function BackFace() {
  return (
    <svg width="280" viewBox="0 0 280 700" xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <rect x="8" y="8" width="264" height="684" rx="13" fill="#F2F0EB" />
      <rect x="8" y="8" width="264" height="684" rx="13" fill="none" stroke="#E0DED8" strokeWidth="0.8" />
      {/* LED stripe on RIGHT edge when viewed from back (same physical stripe as front left) */}
      <rect x="263" y="8" width="9" height="684" rx="4.5" fill="#E63946" />
      {/* Top header — dark, showing back of screen housing */}
      <rect x="8" y="8" width="264" height="74" rx="13" fill="#1A1A18" />
      <rect x="8" y="44" width="264" height="38" fill="#1A1A18" />
      {/* SNAPRINT brand on back */}
      <text x="136" y="46" textAnchor="middle" fontFamily="monospace" fontSize="17" fontWeight="700" fill="white" letterSpacing="7">SNAPRINT</text>
      {/* Power · status indicators */}
      <circle cx="44" cy="30" r="4.5" fill="#22c55e" opacity="0.7" />
      <circle cx="60" cy="30" r="4.5" fill="#E63946" opacity="0.45" />
      <text x="52" y="21" fontFamily="monospace" fontSize="4" fill="rgba(255,255,255,0.35)" textAnchor="middle" letterSpacing="0.5">power · status</text>
      <text x="54" y="59" fontFamily="monospace" fontSize="4.5" fill="rgba(255,255,255,0.2)" letterSpacing="1">snaprint OS</text>
      {/* Large paper refill door panel */}
      <rect x="18" y="90" width="244" height="268" rx="6" fill="#111110" />
      <rect x="18" y="90" width="244" height="268" rx="6" fill="none" stroke="#2A2A28" strokeWidth="1" />
      {/* Door hinge line */}
      <rect x="18" y="90" width="244" height="4" rx="2" fill="#E63946" opacity="0.4" />
      {/* A4 PAPER REFILL label */}
      <text x="140" y="192" textAnchor="middle" fontFamily="monospace" fontSize="10" fill="#2A2A28" letterSpacing="2">A4 PAPER REFILL</text>
      <text x="140" y="212" textAnchor="middle" fontFamily="monospace" fontSize="6" fill="#222220" letterSpacing="1">← slide tray out to refill</text>
      {/* Paper stack icon */}
      {[230,237,244,251,258].map((y,i)=>(
        <rect key={i} x="90" y={y} width="100" height="5" rx="1" fill={`rgba(255,255,255,${0.04 + i*0.015})`} />
      ))}
      <text x="140" y="285" textAnchor="middle" fontFamily="monospace" fontSize="7" fill="#333330">500 SHEETS CAPACITY</text>
      {/* Door handle */}
      <rect x="110" y="342" width="60" height="10" rx="5" fill="#2A2A28" />
      <rect x="118" y="344" width="44" height="6" rx="3" fill="#1A1A18" />
      {/* Lock indicator */}
      <rect x="122" y="328" width="36" height="10" rx="5" fill="#E63946" opacity="0.75" />
      <text x="140" y="337" textAnchor="middle" fontFamily="monospace" fontSize="5" fill="white">LOCKED</text>
      {/* Red separator */}
      <rect x="8" y="368" width="264" height="5" fill="#E63946" />
      {/* Lower service panel */}
      <rect x="18" y="378" width="244" height="210" rx="5" fill="#E4E2DC" stroke="#DCDAD4" strokeWidth="0.5" strokeDasharray="4 2" />
      <text x="140" y="400" textAnchor="middle" fontFamily="monospace" fontSize="7" fill="#AAAAAA">SERVICE PANEL</text>
      <text x="140" y="416" textAnchor="middle" fontFamily="monospace" fontSize="5.5" fill="#AAAAAA">REAR LOCKABLE ACCESS DOOR</text>
      {/* Internal labels visible through dashed box */}
      <text x="140" y="445" textAnchor="middle" fontFamily="monospace" fontSize="6" fill="#C0BEB8">PRINT ENGINE</text>
      <text x="140" y="460" textAnchor="middle" fontFamily="monospace" fontSize="5" fill="#C0BEB8">snaprint OS hub · 4G + WiFi 6</text>
      <text x="140" y="474" textAnchor="middle" fontFamily="monospace" fontSize="5" fill="#C0BEB8">UPS · India 5A · USB hub</text>
      {/* Service door screws */}
      {[[30,430],[250,430],[30,560],[250,560]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r="4" fill="#D8D6D0" stroke="#C8C6C0" strokeWidth="0.5"/>
      ))}
      {/* Ventilation */}
      <rect x="8" y="598" width="264" height="5" fill="#E63946" />
      <rect x="8" y="605" width="264" height="64" fill="#ECEAE5" />
      {[618,630,642,654,664].map(y=>(
        <line key={y} x1="18" y1={y} x2="262" y2={y} stroke="#DCDAD4" strokeWidth="0.8"/>
      ))}
      <text x="140" y="677" textAnchor="middle" fontFamily="monospace" fontSize="5" fill="#AAAAAA">VENTILATION · CABLE EXIT</text>
      {/* Base */}
      <rect x="8" y="678" width="264" height="14" fill="#E8E6E0" />
      <rect x="22" y="681" width="64" height="9" rx="2" fill="#DEDAD4" />
      <text x="54" y="688" textAnchor="middle" fontFamily="monospace" fontSize="4" fill="#AAAAAA">5A POWER IN</text>
      <rect x="108" y="681" width="64" height="9" rx="2" fill="#DEDAD4" />
      <text x="140" y="688" textAnchor="middle" fontFamily="monospace" fontSize="4" fill="#AAAAAA">USB-C · USB-A</text>
      <rect x="194" y="681" width="64" height="9" rx="2" fill="#DEDAD4" />
      <text x="226" y="688" textAnchor="middle" fontFamily="monospace" fontSize="4" fill="#E63946">HDMI OUT</text>
    </svg>
  );
}

// ─── 360° VIEWER ─────────────────────────────────────────────────────────────
const FACE_LABELS = ["FRONT", "RIGHT SIDE", "BACK", "LEFT SIDE"];

export default function Machine360() {
  const [rotation, setRotation] = useState(0);
  const rotationRef = useRef(0);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startAngleRef = useRef(0);
  const autoTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const stopAuto = useCallback(() => {
    if (autoTimerRef.current) {
      clearInterval(autoTimerRef.current);
      autoTimerRef.current = null;
    }
  }, []);

  const startAuto = useCallback(() => {
    stopAuto();
    autoTimerRef.current = setInterval(() => {
      rotationRef.current -= 0.22;
      setRotation(rotationRef.current);
    }, 16);
  }, [stopAuto]);

  const pauseAndScheduleResume = useCallback(() => {
    stopAuto();
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(startAuto, 2800);
  }, [stopAuto, startAuto]);

  // Start autoplay on mount
  useEffect(() => {
    startAuto();
    return () => {
      stopAuto();
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, [startAuto, stopAuto]);

  // Drag / touch handlers
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onDown = (x: number) => {
      isDraggingRef.current = true;
      startXRef.current = x;
      startAngleRef.current = rotationRef.current;
      pauseAndScheduleResume();
    };

    const onMove = (x: number) => {
      if (!isDraggingRef.current) return;
      const delta = x - startXRef.current;
      const next = startAngleRef.current - delta * 0.45;
      rotationRef.current = next;
      setRotation(next);
    };

    const onUp = () => {
      isDraggingRef.current = false;
    };

    const md = (e: MouseEvent) => onDown(e.clientX);
    const mm = (e: MouseEvent) => onMove(e.clientX);
    const mu = () => onUp();
    const ts = (e: TouchEvent) => { e.preventDefault(); onDown(e.touches[0].clientX); };
    const tm = (e: TouchEvent) => { e.preventDefault(); onMove(e.touches[0].clientX); };
    const te = () => onUp();

    el.addEventListener("mousedown", md);
    window.addEventListener("mousemove", mm);
    window.addEventListener("mouseup", mu);
    el.addEventListener("touchstart", ts, { passive: false });
    window.addEventListener("touchmove", tm, { passive: false });
    window.addEventListener("touchend", te);

    return () => {
      el.removeEventListener("mousedown", md);
      window.removeEventListener("mousemove", mm);
      window.removeEventListener("mouseup", mu);
      el.removeEventListener("touchstart", ts);
      window.removeEventListener("touchmove", tm);
      window.removeEventListener("touchend", te);
    };
  }, [pauseAndScheduleResume]);

  // Active face indicator
  const norm = ((rotation % 360) + 360) % 360;
  const activeFace = Math.round(norm / 90) % 4;

  return (
    <div className="flex flex-col items-center gap-5 select-none">
      {/* 3D scene wrapper */}
      <div
        ref={containerRef}
        className="cursor-grab active:cursor-grabbing"
        style={{ perspective: "1100px" }}
      >
        {/* Rotating carousel */}
        <div
          style={{
            width: 280,
            height: 700,
            position: "relative",
            transformStyle: "preserve-3d",
            transform: `rotateY(${rotation}deg)`,
            filter:
              "drop-shadow(0 40px 80px rgba(230,57,70,0.18)) drop-shadow(0 8px 32px rgba(0,0,0,0.10))",
          }}
        >
          {/* FRONT — translateZ(140) */}
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "translateZ(140px)",
            }}
          >
            <FrontFace />
          </div>

          {/* RIGHT SIDE — rotateY(-90deg) translateZ(140) */}
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(-90deg) translateZ(140px)",
            }}
          >
            <SideFace />
          </div>

          {/* BACK — rotateY(180deg) translateZ(140) */}
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg) translateZ(140px)",
            }}
          >
            <BackFace />
          </div>

          {/* LEFT SIDE — rotateY(90deg) translateZ(140) */}
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(90deg) translateZ(140px)",
            }}
          >
            <SideFace flip />
          </div>
        </div>
      </div>

      {/* Face label + indicator dots */}
      <div className="flex flex-col items-center gap-2">
        <span className="font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-snap-red">
          {FACE_LABELS[activeFace]}
        </span>
        <div className="flex gap-1.5 items-center">
          {FACE_LABELS.map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === activeFace ? 20 : 6,
                height: 3,
                background: i === activeFace ? "#E63946" : "#E8E6E0",
              }}
            />
          ))}
        </div>
        <p className="font-body text-[10px] text-snap-gray-light tracking-wide">
          ← drag to rotate 360°
        </p>
      </div>
    </div>
  );
}
