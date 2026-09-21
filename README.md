# Snaprint  --  snap. scan. print.

India's instant print network. Built for xerox shop owners.  
Powered by **Sanskriti Labs**, Bengaluru.

---

## Tech stack

| Layer | Tech |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS v3 |
| Components | shadcn/ui pattern (custom) |
| Animations | Framer Motion |
| Icons | Lucide React |
| Fonts | Space Grotesk (display) + Inter (body) |
| Hosting | Vercel |

---

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Run dev server
npm run dev
# → http://localhost:3000

# 3. Build for production
npm run build
npm start
```

---

## Project structure

```
snaprint/
├── app/
│   ├── layout.tsx          # Root layout  --  fonts, metadata, globals
│   ├── page.tsx            # Home page  --  composes all sections
│   └── globals.css         # Tailwind base + custom CSS vars
├── components/
│   ├── ui/
│   │   └── Button.tsx      # shadcn-style button with Snaprint variants
│   ├── sections/
│   │   ├── Hero.tsx        # Hero with Framer Motion stagger
│   │   ├── Marquee.tsx     # Scrolling ticker
│   │   ├── Problem.tsx     # 4-card problem grid
│   │   ├── HowItWorks.tsx  # 4-step process
│   │   ├── Why.tsx         # Cards + comparison table (dark section)
│   │   ├── MachineSpecs.tsx# Kiosk SVG + specs table
│   │   ├── Franchise.tsx   # Pricing cards + partner steps
│   │   ├── Testimonials.tsx# 3 testimonial cards
│   │   └── CtaFinal.tsx    # Red CTA section
│   ├── Machine.tsx         # Animated kiosk SVG (from prototype PDF)
│   ├── Navbar.tsx          # Fixed nav with scroll shadow
│   └── Footer.tsx          # 4-column footer
├── lib/
│   └── utils.ts            # cn() utility (clsx + tailwind-merge)
├── tailwind.config.ts      # snap-red, snap-charcoal tokens + keyframes
├── next.config.ts
├── tsconfig.json
└── package.json
```

---

## Brand tokens (Tailwind)

```
snap-red         #E63946   → CTAs, LED stripe, accents
snap-red-dark    #C1121F   → hover states
snap-red-tint    #FFF0F1   → icon backgrounds, ROI box
snap-charcoal    #111110   → body text, dark sections
snap-gray        #888780   → secondary text
snap-border      #E8E6E0   → dividers, card borders
snap-surface     #F5F3EE   → section backgrounds
```

---

## Deploy to Vercel

```bash
# Push to GitHub, then:
vercel
# Vercel auto-detects Next.js  --  zero config needed
```

Or connect your GitHub repo in the Vercel dashboard → auto-deploys on every push.

---

## Before going live  --  replace these

| File | Placeholder | Replace with |
|---|---|---|
| Multiple | `919999999999` | Your WhatsApp number |
| `public/og.png`, `public/favicon.ico` | Generated placeholders | Real brand assets |
| All | Testimonial names | Real shop owner quotes after survey |

---

Built with ♥ by Sanskriti Labs · Bengaluru · 2026
