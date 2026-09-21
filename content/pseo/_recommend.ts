import type { LiveLocation } from "./types";

/**
 * Score a shop for the "recommended" callout: rating carries most of the
 * weight, review count acts as a confidence multiplier (a 5.0★ shop with 2
 * reviews shouldn't beat a 4.6★ shop with 200), and proximity  --  when known  -- 
 * is a smaller bonus so a slightly-further, clearly-better shop still wins.
 * Returns null when there's nothing worth recommending (no rated shops).
 */
export function pickRecommended(locations: LiveLocation[]): LiveLocation | null {
  const rated = locations.filter((l) => typeof l.rating === "number" && l.rating > 0);
  if (rated.length === 0) return null;

  let best: LiveLocation | null = null;
  let bestScore = -Infinity;
  for (const loc of rated) {
    const reviewConfidence = Math.log10((loc.reviews ?? 0) + 1); // 0 reviews -> 0, 100 reviews -> 2
    const proximityBonus = loc.distanceKm != null ? Math.max(0, 1.5 - loc.distanceKm) : 0;
    const score = loc.rating! * (1 + reviewConfidence) + proximityBonus;
    if (score > bestScore) {
      bestScore = score;
      best = loc;
    }
  }
  return best;
}

/** One-line reason shown under the recommended shop's name. */
export function recommendReason(loc: LiveLocation): string {
  const parts: string[] = [];
  if (loc.rating) parts.push(`${loc.rating.toFixed(1)}★`);
  if (loc.reviews) parts.push(`${loc.reviews.toLocaleString()} reviews`);
  if (loc.distanceKm != null) {
    parts.push(loc.distanceKm < 1 ? `${Math.round(loc.distanceKm * 1000)}m away` : `${loc.distanceKm.toFixed(1)}km away`);
  }
  return parts.join(" · ");
}
