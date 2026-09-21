// The full cinematic experience (custom cursor, GSAP+Lenis smooth scroll,
// route-curtain transitions) is visually scoped to marketing routes (/,
// /book, /franchisebrochure, /style)  --  but the providers themselves now
// live in the root layout (app/layout.tsx), mounted once, and internally
// check the current route (lib/marketing-routes.ts) to decide whether to
// actually run. Moving here-vs-root doesn't change what a visitor sees; it's
// what stopped a ~1.9s remount cost every time navigation crossed in or out
// of this route group (LenisProvider/CustomCursor no longer unmount, they
// just toggle off).
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
