/**
 * "live" = kiosk physically present here. "served" = published on
 * aggregated GMaps shop data, no kiosk yet (the pSEO directory-first
 * strategy). "planned" = not published; page 404s, no links point to it.
 */
export type Presence = "live" | "planned" | "served";

/** kebab-case ASCII, hand-curated  --  one per entity, never reused */
export type Slug = string;

// ---------------------------------------------------------------------------
// City
// ---------------------------------------------------------------------------

export type LiveLocation = {
  name: string;
  address: string;
  lat: number;
  lng: number;
  phone?: string;
  rating?: number;
  reviews?: number;
  placeId?: string;
  /** Only set by getShopsNearCollege, which has a campus origin to measure from. */
  distanceKm?: number;
};

export type City = {
  slug: Slug;
  name: string; // display name, e.g. "Bengaluru"
  state: string; // e.g. "Karnataka"
  lat?: number;
  lng?: number;
  /** Public pin codes for the city. Safe to publish as-is. */
  pinCodes: string[];
  /** 1–2 sentence intro used as the hero subhead. Hand-written per city. */
  intro: string;
  /** 4–6 hand-picked keywords. No stuffing. */
  keywords: string[];
  /** Slugs of nearby cities to cross-link. Hand-curated  --  not auto-derived. */
  neighbors?: Slug[];
  /** Only filled with real, verified kiosk addresses. Never fabricated. */
  liveLocations?: LiveLocation[];
  presence: Presence;
  /** ISO date string. Bump whenever intro / keywords / pinCodes change. */
  lastReviewed: string;
};

// ---------------------------------------------------------------------------
// College
// ---------------------------------------------------------------------------

export type College = {
  slug: Slug;
  name: string; // full name, e.g. "Indian Institute of Science"
  shortName?: string; // e.g. "IISc"
  city: Slug; // parent city slug
  area?: Slug; // optional parent area slug
  address: string;
  lat?: number;
  lng?: number;
  /** Official institution homepage  --  verified to resolve, not fabricated. */
  website?: string;
  /** Hand-written intro. Must be unique per college  --  no template fill. */
  intro: string;
  keywords: string[];
  presence: Presence;
  lastReviewed: string;
  /** ISO date. Set when presence flips to "live" after operator verification. */
  verifiedAt?: string;
};

// ---------------------------------------------------------------------------
// Area (neighbourhood / locality)
// ---------------------------------------------------------------------------

export type Area = {
  slug: Slug;
  name: string; // display name, e.g. "Koramangala"
  city: Slug;
  pinCodes: string[];
  /** Hand-written intro. Must be unique per area  --  no template fill. */
  intro: string;
  keywords: string[];
  liveLocations?: LiveLocation[];
  presence: Presence;
  lastReviewed: string;
};
