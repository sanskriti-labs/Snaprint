import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Design-system palette (tied to the Snappy mascot). See DESIGN_SYSTEM.md §1.
        charcoal: "#0e0e0d",
        ink: "#1a1a18",
        edge: "#2f2f2c",
        graphite: "#3a3a37",
        slate: "#8a8a84",
        mist: "#c9c9c4",
        cloud: "#e8e8e4",
        paper: "#f5f5f3",
        red: "#e63946",
        "red-deep": "#c1121f",
        // ── Legacy tokens (kept until Phase 2 rebuilds each section). Do not use in new work.
        "snap-red": "#E63946",
        "snap-red-dark": "#C1121F",
        "snap-red-tint": "#FFF0F1",
        "snap-charcoal": "#111110",
        "snap-charcoal-mid": "#1E1E1C",
        "snap-charcoal-soft": "#2C2C2A",
        "snap-gray": "#888780",
        "snap-gray-light": "#B4B2A9",
        "snap-border": "#E8E6E0",
        "snap-surface": "#F5F3EE",
      },
      fontFamily: {
        // Type system: serif headings/section titles, sans body/labels/nav,
        // mono for numbers/dates/money (tabular-nums keeps digits aligned).
        // Native OS stacks only — no webfont loading.
        display: ["var(--font-serif)"],
        serif: ["var(--font-serif)"],
        body: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      fontSize: {
        // Fluid display scale — DESIGN_SYSTEM.md §2
        "display-2xl": ["clamp(3.25rem, 8.5vw, 8.5rem)", { lineHeight: "0.95", letterSpacing: "-0.045em" }],
        "display-xl": ["clamp(2.5rem, 5.5vw, 5.5rem)", { lineHeight: "0.98", letterSpacing: "-0.035em" }],
        "display-lg": ["clamp(2rem, 3.8vw, 3.5rem)", { lineHeight: "1.02", letterSpacing: "-0.03em" }],
        heading: ["clamp(1.4rem, 2.2vw, 2rem)", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "body-lg": ["1.125rem", { lineHeight: "1.75" }],
        caption: ["0.6875rem", { lineHeight: "1", letterSpacing: "0.22em" }],
      },
      letterSpacing: {
        tightest: "-0.045em",
        tighter: "-0.03em",
        tight: "-0.02em",
      },
      spacing: {
        // 4px base scale — DESIGN_SYSTEM.md §3
        section: "clamp(6rem, 12vw, 12rem)",
        gutter: "clamp(1.25rem, 4vw, 2.5rem)",
      },
      maxWidth: {
        grid: "1440px",
        measure: "46ch",
        "measure-lg": "52ch",
      },
      transitionTimingFunction: {
        reveal: "cubic-bezier(0.16, 1, 0.3, 1)",
        power: "cubic-bezier(0.22, 1, 0.36, 1)",
        inout: "cubic-bezier(0.65, 0, 0.35, 1)",
        hover: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      animation: {
        float: "float 4s ease-in-out infinite",
        marquee: "marquee 28s linear infinite",
        "marquee-rev": "marquee-rev 32s linear infinite",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        "rotate-slow": "rotate-slow 20s linear infinite",
        "rotate-rev": "rotate-slow 25s linear infinite reverse",
        blink: "blink 1.2s ease-in-out infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "marquee-rev": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0)" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.5", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.08)" },
        },
        "rotate-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
