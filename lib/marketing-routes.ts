const MARKETING_PATHS = ["/", "/book", "/franchisebrochure", "/style", "/impact", "/find-snaprint"];

/** The pages that get the full cinematic stack (Lenis, GSAP-driven cursor,
 * route curtain). Everything else (PSEO/blog/legal/Impact/etc.) stays on
 * native scroll — see app/layout.tsx vs the (marketing) route group. */
export function isMarketingRoute(pathname: string | null): boolean {
  if (!pathname) return false;
  return MARKETING_PATHS.includes(pathname);
}
