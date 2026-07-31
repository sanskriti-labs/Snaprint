"use client";

import { motion } from "framer-motion";

export default function Machine() {
  return (
    <motion.div
      className="relative"
      animate={{ y: [0, -12, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      style={{
        filter:
          "drop-shadow(0 40px 80px rgba(230,57,70,0.15)) drop-shadow(0 8px 32px rgba(0,0,0,0.08))",
      }}
    >
      <svg
        width="280"
        viewBox="0 0 280 700"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Snaprint S1 kiosk machine front view — white body, red header, red left LED stripe, 15.6 inch touch screen showing snap scan print UI, print output tray, and printer housing below"
        role="img"
      >
        {/* Machine body */}
        <rect x="8" y="8" width="264" height="684" rx="13" fill="#F2F0EB" />
        <rect
          x="8"
          y="8"
          width="264"
          height="684"
          rx="13"
          fill="none"
          stroke="#E0DED8"
          strokeWidth="0.8"
        />

        {/* Red header bar */}
        <rect x="8" y="8" width="264" height="66" rx="13" fill="#E63946" />
        <rect x="8" y="44" width="264" height="30" fill="#E63946" />

        {/* Logo in header */}
        <text
          x="48"
          y="40"
          fontFamily="monospace"
          fontSize="20"
          fontWeight="700"
          fill="white"
          letterSpacing="-0.4"
        >
          snaprint
        </text>
        <text
          x="48"
          y="56"
          fontFamily="monospace"
          fontSize="5.5"
          fill="rgba(255,255,255,0.4)"
          letterSpacing="2.5"
        >
          INSTANT PRINT NETWORK
        </text>

        {/* RED LEFT LED STRIPE — signature design element from prototype */}
        <rect
          x="8"
          y="8"
          width="9"
          height="684"
          rx="4.5"
          fill="#E63946"
        />

        {/* Camera / QR scanner dot */}
        <circle cx="248" cy="38" r="6" fill="#1A1A18" />
        <circle cx="248" cy="38" r="3" fill="#0A0A09" />
        <circle cx="246.5" cy="36.5" r="1" fill="#E63946" opacity="0.5" />

        {/* Screen panel */}
        <rect x="22" y="80" width="228" height="228" rx="6" fill="#0A0A09" />
        <rect
          x="22"
          y="80"
          width="228"
          height="228"
          rx="6"
          fill="none"
          stroke="#E63946"
          strokeWidth="0.8"
        />

        {/* Screen: red top bar with logo */}
        <rect x="26" y="84" width="220" height="28" rx="4" fill="#E63946" />
        <text
          x="136"
          y="102"
          textAnchor="middle"
          fontFamily="monospace"
          fontSize="10"
          fontWeight="700"
          fill="white"
        >
          snaprint
        </text>

        {/* Screen: big snap.scan.print. headline */}
        <text
          x="46"
          y="144"
          fontFamily="monospace"
          fontSize="18"
          fontWeight="700"
          fill="white"
        >
          snap.
        </text>
        <text
          x="46"
          y="166"
          fontFamily="monospace"
          fontSize="18"
          fontWeight="700"
          fill="white"
        >
          scan.
        </text>
        <text
          x="46"
          y="188"
          fontFamily="monospace"
          fontSize="18"
          fontWeight="700"
          fill="#E63946"
        >
          print.
        </text>

        {/* B&W ₹3 / Colour ₹10 pricing on screen */}
        <text
          x="46"
          y="208"
          fontFamily="monospace"
          fontSize="7"
          fill="rgba(255,255,255,0.35)"
        >
          B&amp;W ₹3 · Colour ₹10
        </text>

        {/* QR box on screen */}
        <rect x="152" y="120" width="84" height="84" rx="4" fill="#111110" />
        <rect
          x="152"
          y="120"
          width="84"
          height="84"
          rx="4"
          fill="none"
          stroke="#E63946"
          strokeWidth="0.6"
        />
        <text
          x="194"
          y="136"
          textAnchor="middle"
          fontFamily="monospace"
          fontSize="5"
          fill="#E63946"
        >
          SCAN TO PRINT
        </text>
        {/* QR pattern */}
        {[
          [160, 142, 10, 10], [172, 142, 4, 4], [178, 142, 6, 4],
          [186, 142, 4, 4], [192, 142, 10, 10],
          [160, 154, 4, 4], [166, 154, 4, 4], [172, 154, 8, 4],
          [182, 154, 4, 4], [188, 154, 4, 4], [194, 154, 6, 4],
          [160, 160, 10, 10], [172, 162, 4, 6],
          [178, 160, 6, 4], [186, 160, 4, 4], [192, 160, 10, 10],
          [160, 172, 8, 4], [170, 172, 10, 4], [182, 172, 6, 4],
          [190, 172, 8, 4],
          [160, 178, 4, 6], [166, 178, 8, 6], [176, 178, 4, 6],
          [182, 178, 8, 6], [194, 178, 6, 6],
          [160, 186, 10, 4], [174, 186, 6, 4], [184, 186, 4, 4],
          [192, 186, 10, 4],
        ].map(([x, y, w, h], i) => (
          <rect key={i} x={x} y={y} width={w} height={h} fill="#E63946" />
        ))}

        {/* Screen: status bar */}
        <rect x="26" y="272" width="220" height="9" rx="0" fill="#0A0A09" />
        <text
          x="136"
          y="279"
          textAnchor="middle"
          fontFamily="monospace"
          fontSize="4.5"
          fill="#333330"
        >
          SCAN · UPLOAD · PAY · COLLECT
        </text>

        {/* Screen: red CTA */}
        <rect x="26" y="282" width="220" height="18" rx="0" fill="#E63946" />
        <text
          x="136"
          y="295"
          textAnchor="middle"
          fontFamily="monospace"
          fontSize="7"
          fontWeight="700"
          fill="white"
        >
          SCAN QR TO START →
        </text>

        {/* Collect label */}
        <text
          x="136"
          y="326"
          textAnchor="middle"
          fontFamily="monospace"
          fontSize="6"
          fill="#BBBBBA"
        >
          COLLECT YOUR PRINTS HERE
        </text>

        {/* Red LED accent line above tray */}
        <rect x="18" y="330" width="244" height="3" rx="1.5" fill="#E63946" opacity="0.7" />

        {/* Output tray */}
        <rect x="18" y="334" width="244" height="30" rx="4" fill="#E2E0DA" />
        <rect
          x="18"
          y="334"
          width="244"
          height="30"
          rx="4"
          fill="none"
          stroke="#D8D6D0"
          strokeWidth="0.6"
        />
        <rect x="26" y="340" width="228" height="16" rx="2" fill="#D0CEC8" />

        {/* Red separator bar */}
        <rect x="8" y="366" width="264" height="5" fill="#E63946" />

        {/* Printer housing section */}
        <rect x="8" y="373" width="264" height="224" fill="#ECEAE5" />
        <rect
          x="8"
          y="373"
          width="264"
          height="224"
          fill="none"
          stroke="#DCDAD4"
          strokeWidth="0.5"
        />
        <text
          x="136"
          y="395"
          textAnchor="middle"
          fontFamily="monospace"
          fontSize="6.5"
          fill="#C0BEB8"
        >
          PRINTER UNIT · INTERNAL
        </text>

        {/* Printer engine dashed box */}
        <rect
          x="22"
          y="403"
          width="236"
          height="108"
          rx="4"
          fill="#E4E2DC"
          stroke="#CCCAC4"
          strokeWidth="0.5"
          strokeDasharray="3 2"
        />
        <text
          x="140"
          y="446"
          textAnchor="middle"
          fontFamily="monospace"
          fontSize="7.5"
          fill="#AAAAAA"
        >
          UNIVERSAL PRINTER ENGINE
        </text>
        <text
          x="140"
          y="461"
          textAnchor="middle"
          fontFamily="monospace"
          fontSize="5.5"
          fill="#C0BEB8"
        >
          any brand · A4
        </text>

        {/* OS hub + network chips */}
        <rect x="22" y="520" width="116" height="28" rx="3" fill="#DEDAD4" />
        <rect
          x="22"
          y="520"
          width="116"
          height="28"
          rx="3"
          fill="none"
          stroke="#E63946"
          strokeWidth="0.5"
        />
        <text
          x="80"
          y="537"
          textAnchor="middle"
          fontFamily="monospace"
          fontSize="6"
          fill="#E63946"
        >
          snaprint OS hub
        </text>

        <rect x="146" y="520" width="116" height="28" rx="3" fill="#DEDAD4" />
        <rect
          x="146"
          y="520"
          width="116"
          height="28"
          rx="3"
          fill="none"
          stroke="#CCCAC4"
          strokeWidth="0.5"
        />
        <text
          x="204"
          y="537"
          textAnchor="middle"
          fontFamily="monospace"
          fontSize="6"
          fill="#AAAAAA"
        >
          power + data
        </text>

        {/* Power + UPS row */}
        <rect x="22" y="558" width="74" height="22" rx="3" fill="#D8D6D0" />
        <text
          x="59"
          y="573"
          textAnchor="middle"
          fontFamily="monospace"
          fontSize="5"
          fill="#AAAAAA"
        >
          UPS backup
        </text>
        <rect x="104" y="558" width="82" height="22" rx="3" fill="#D8D6D0" />
        <text
          x="145"
          y="573"
          textAnchor="middle"
          fontFamily="monospace"
          fontSize="5"
          fill="#AAAAAA"
        >
          India 5A power
        </text>
        <rect x="194" y="558" width="64" height="22" rx="3" fill="#D8D6D0" />
        <text
          x="226"
          y="573"
          textAnchor="middle"
          fontFamily="monospace"
          fontSize="5"
          fill="#AAAAAA"
        >
          USB hub
        </text>

        {/* Service panel */}
        <line x1="8" y1="591" x2="272" y2="591" stroke="#DCDAD4" strokeWidth="0.5" />
        <rect x="8" y="592" width="264" height="20" fill="#E2E0DA" />
        <text
          x="136"
          y="606"
          textAnchor="middle"
          fontFamily="monospace"
          fontSize="5.5"
          fill="#AAAAAA"
        >
          SERVICE PANEL · REAR LOCKABLE DOOR
        </text>

        {/* Bottom red accent */}
        <rect x="8" y="614" width="264" height="5" fill="#E63946" />

        {/* Ventilation */}
        <rect x="8" y="621" width="264" height="55" fill="#ECEAE5" />
        {[638, 649, 660, 670].map((y) => (
          <line key={y} x1="18" y1={y} x2="262" y2={y} stroke="#DCDAD4" strokeWidth="0.8" />
        ))}
        <text
          x="136"
          y="685"
          textAnchor="middle"
          fontFamily="monospace"
          fontSize="5"
          fill="#AAAAAA"
        >
          VENTILATION + CABLE MANAGEMENT
        </text>

        {/* Base ports */}
        <rect x="8" y="678" width="264" height="14" rx="0 0 13 13" fill="#E8E6E0" />
        <rect x="22" y="681" width="64" height="9" rx="2" fill="#DEDAD4" />
        <text
          x="54"
          y="688"
          textAnchor="middle"
          fontFamily="monospace"
          fontSize="4"
          fill="#AAAAAA"
        >
          USB-C · USB-A
        </text>
        <rect x="108" y="681" width="64" height="9" rx="2" fill="#DEDAD4" />
        <text
          x="140"
          y="688"
          textAnchor="middle"
          fontFamily="monospace"
          fontSize="4"
          fill="#AAAAAA"
        >
          5A INDIA POWER
        </text>
        <rect x="194" y="681" width="64" height="9" rx="2" fill="#DEDAD4" />
        <text
          x="226"
          y="688"
          textAnchor="middle"
          fontFamily="monospace"
          fontSize="4"
          fill="#E63946"
        >
          HDMI OUT
        </text>
      </svg>
    </motion.div>
  );
}
