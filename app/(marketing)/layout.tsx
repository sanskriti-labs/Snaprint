import SnappyLoader from "@/components/mascot/SnappyLoader";
import LenisProvider from "@/components/motion/LenisProvider";
import CustomCursor from "@/components/motion/CustomCursor";
import RouteTransition from "@/components/motion/RouteTransition";

// The full cinematic experience (boot preloader, custom cursor, GSAP+Lenis
// smooth scroll, route-curtain transitions) is scoped to marketing routes
// (/, /book, /franchise/brochure, /style) rather than the root layout — PSEO,
// blog, and legal pages don't need it and get a lighter, faster layout
// instead (see app/layout.tsx).
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SnappyLoader />
      <RouteTransition />
      <CustomCursor />
      <LenisProvider>{children}</LenisProvider>
    </>
  );
}
