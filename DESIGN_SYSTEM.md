# Snaprint — Design System & Motion Language

> Governing reference for the award-level rebuild of snaprints.com.
> **Nothing is placed or sized by guesswork.** If a value isn't in this file, it doesn't ship.
> References for feel: justmarriedbooth.com (cinematic, video-led) · gregkozakiewicz.com/piglet (tactile, crafted).
> Chosen lean: **balanced** — cinematic-premium foundation, one experimental signature moment.

Live preview of everything below: **`/style`** route.

---

## 1. Color tokens

The palette is deliberately tied to the **Snappy mascot** so brand + character are one system. Red is the *single* focal accent — used sparingly. One red thing per section, ideally.

| Token | Hex | Role |
|---|---|---|
| `charcoal` | `#0e0e0d` | near-black; dark sections, display type on light, mascot body |
| `ink` | `#1a1a18` | raised charcoal surfaces / cards on dark |
| `edge` | `#2f2f2c` | hairline borders on dark, mascot body edge |
| `graphite` | `#3a3a37` | muted dark UI, mascot limbs |
| `slate` | `#8a8a84` | secondary text on light |
| `mist` | `#c9c9c4` | dividers, disabled, mascot ink-lines |
| `cloud` | `#e8e8e4` | light borders, hover fills |
| `paper` | `#f5f5f3` | primary light background, mascot screen |
| `red` | `#e63946` | THE accent — CTAs, focal type, LED, one-per-section |
| `red-deep` | `#c1121f` | red hover / pressed |

**Rule:** no Tailwind default blues/greys anywhere. Accent is `red` only. Never two competing reds in one viewport.

---

## 2. Type scale

Display face: **Space Grotesk** (already loaded, geometric-modern) — pushed hard on size, weight 700, tight tracking. Identity comes from *scale + motion*, not a novelty face.
Body: **Inter**. Editorial accent: **Instrument Serif** (italic, sparingly). Mascot glyphs: **Baloo 2**.

Fluid `clamp()` scale — big type does the heavy lifting:

| Token | clamp() | Use |
|---|---|---|
| `display-2xl` | `clamp(3.25rem, 8.5vw, 8.5rem)` | hero headline only |
| `display-xl` | `clamp(2.5rem, 5.5vw, 5.5rem)` | section-opener headlines |
| `display-lg` | `clamp(2rem, 3.8vw, 3.5rem)` | sub-section headlines |
| `heading` | `clamp(1.4rem, 2.2vw, 2rem)` | card titles |
| `body-lg` | `1.125rem / 1.75` | lead paragraphs |
| `body` | `1rem / 1.7` | default copy |
| `caption` | `0.6875rem`, `0.22em` tracked, uppercase | eyebrows / labels |

Display tracking: `-0.03em` to `-0.045em` at the largest sizes. Line-height on display: `0.95–1.02`.

---

## 3. Spacing & grid

4px base unit. Scale (px): `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128 · 160 · 192`.

- **Grid:** 12 columns, `max-width: 1440px`, gutter `clamp(1.25rem, 4vw, 2.5rem)`, column gap `24px`.
- **Section rhythm:** vertical padding `clamp(6rem, 12vw, 12rem)` — generous, intentional. Whitespace is a design element; nothing cramped.
- **Content measure:** body copy caps at `~46ch`; lead paragraphs `~52ch`.
- No uniform evenly-spaced card grids as a default — vary rhythm and scale (bento, asymmetric splits).

---

## 4. Motion tokens

One coherent motion language. Expressive easings only — never `linear`, never default `ease`.

### Easings (CSS var → GSAP equivalent)
| Token | cubic-bezier | GSAP | Use |
|---|---|---|---|
| `--e-reveal` | `0.16, 1, 0.3, 1` | `expo.out` | content reveals, the default |
| `--e-power` | `0.22, 1, 0.36, 1` | `power4.out` | hero, large moves |
| `--e-inout` | `0.65, 0, 0.35, 1` | `power3.inOut` | pins, scrubbed, symmetric moves |
| `--e-hover` | `0.4, 0, 0.2, 1` | `power2.out` | hover / micro |

### Durations
| Token | value | Use |
|---|---|---|
| `--d-hover` | `0.4s` | hover + micro-interactions |
| `--d-reveal` | `0.6s` | standard element reveal |
| `--d-slow` | `0.9s` | large reveal |
| `--d-hero` | `1.2s` | hero / preloader handoff |
| stagger base | `0.08s` | between staggered children |

---

## 5. Interaction principles

- **Text reveal = masked clip, not opacity.** Words/lines sit in `overflow:hidden` masks and rise from `110%` with `--e-reveal`, staggered. Directional, never a plain fade. (`RevealText` utility.)
- **Sections enter** with a clip/translate + staggered children as they cross into view (GSAP ScrollTrigger, synced to Lenis).
- **Custom cursor** (Phase 1): a dot that grows + shows a label on interactive elements; buttons are *magnetic* (pull toward cursor). Auto-disabled on touch + reduced-motion.
- **Smooth scroll** (Lenis) is the foundation — tuned mid-weight (not floaty, not stiff). All scroll-linked motion hangs off it.
- **Hover:** `--d-hover` / `--e-hover`; lift + accent, never jumpy.
- **prefers-reduced-motion:** every animated element resolves to its clean final state instantly. No broken layouts, no reliance on JS having run.

---

## 6. Mascot (Snappy) — fixed size tiers

Use **only** these tokens. Never an in-between size — change the layout, not the token.

| Tier | px | Form | Roles |
|---|---|---|---|
| `XS` | 24 | simplified PNG | inline w/ text, tiny UI accents |
| `SM` | 32 | simplified | nav lockup, footer, list bullets |
| `MD` | 64 | full animated | section accents, loaders, toasts, scroll-top |
| `LG` | 120 | full animated | one supporting card / section moment, max 1/section |
| `XL` | 200–280 | full animated | the ONE hero/signature mascot per page |

Rules: exactly **one XL per page** (hero *or* signature, never both) · never two same-tier mascots in one viewport · below 40px use the simplified asset · safe-area ≥ 25% of the mascot's height on every side · align to grid, never a random float · never overlaps body copy.

---

## 7. S1 3D kiosk — usage system

- **One interactive 3D kiosk per page, max.** Lives in the hero or a dedicated "explore the S1" section — not repeated down the page.
- Everywhere else the kiosk appears: **static render or short loop video**, never a second live WebGL instance.
- Focal zone: ~40–60% of hero width on desktop, on-grid, real breathing room — never crammed in a corner.
- Consistent default camera angle across the site. On scroll-in: subtle fade + gentle rotate to default, then hand control to the user.
- Mobile: lightweight image/video by default; load the live model on tap / capable devices only. Never blocks first paint. Reserve its layout box (poster) so nothing shifts on load.

### Mascot vs kiosk — who leads per section
- **Product sections** (hero shot, explorer, comparison) → **kiosk leads**, mascot SM/MD supporting at most.
- **Experience/emotion sections** (how-it-works, empty states, 404, brand story) → **Snappy leads**, kiosk absent or static backdrop.
- One protagonist per section. Never XL mascot + interactive kiosk in the same viewport.

---

## 8. Stack

Lenis (smooth scroll) · GSAP + ScrollTrigger (all scroll choreography, synced to Lenis) · Framer Motion (React state transitions only) · Next 14 App Router + TS strict + Tailwind. Motion values live as CSS vars + a shared GSAP config — never scattered magic numbers.
