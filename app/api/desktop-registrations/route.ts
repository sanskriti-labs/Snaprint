import { NextRequest, NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_RE = /^[^\d[\]{}<>]{1,120}$/;
const CITY_RE = /^[a-zA-Z\s.'-]{0,80}$/;
const MAX_BODY_BYTES = 4 * 1024;
const WORKER_URL = process.env.SNAPRINT_WORKER_URL || "https://kiosk.snaprints.com";

// Indian mobile numbers only, same as the Worker's own PHONE_RE  --  accepts common human input
// shapes (spaces, hyphens, optional +91/91/0 prefix) and normalizes to +91XXXXXXXXXX before
// forwarding, since a free-text "+91 98765 43210"-style input never comes in pre-normalized.
function normalizeIndianPhone(raw: string): string | null {
  const digits = raw.replace(/[^\d]/g, "");
  const last10 = digits.length > 10 ? digits.slice(-10) : digits;
  if (!/^[6-9]\d{9}$/.test(last10)) return null;
  return `+91${last10}`;
}

export async function POST(req: NextRequest) {
  const contentLength = Number(req.headers.get("content-length") ?? "0");
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Request body too large" }, { status: 413 });
  }

  const contentType = req.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return NextResponse.json({ error: "Content-Type must be application/json" }, { status: 415 });
  }

  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (!origin || !host) {
    return NextResponse.json({ error: "Origin required" }, { status: 403 });
  }
  try {
    if (new URL(origin).host !== host) {
      return NextResponse.json({ error: "Cross-origin forbidden" }, { status: 403 });
    }
  } catch {
    return NextResponse.json({ error: "Invalid Origin header" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { shopName, ownerName, phone, email, city } = (body ?? {}) as Record<string, unknown>;

  if (typeof shopName !== "string" || !NAME_RE.test(shopName.trim())) {
    return NextResponse.json({ error: "A valid 'shopName' is required" }, { status: 400 });
  }
  if (typeof ownerName !== "string" || !NAME_RE.test(ownerName.trim())) {
    return NextResponse.json({ error: "A valid 'ownerName' is required" }, { status: 400 });
  }
  if (typeof phone !== "string") {
    return NextResponse.json({ error: "A valid 'phone' is required" }, { status: 400 });
  }
  const ownerPhone = normalizeIndianPhone(phone);
  if (!ownerPhone) {
    return NextResponse.json({ error: "A valid 10-digit Indian mobile number is required" }, { status: 400 });
  }
  if (typeof email !== "string" || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "A valid 'email' is required" }, { status: 400 });
  }
  if (city !== undefined && (typeof city !== "string" || !CITY_RE.test(city))) {
    return NextResponse.json({ error: "'city' must be a plain place name" }, { status: 400 });
  }

  // Registers the real shop record (Cloudflare KV + D1)  --  the Worker is the sole source of
  // truth now; there is no separate lead database. Credentials (deviceSecret, defaultPassword)
  // are deliberately NOT relayed back to the browser: they're persisted in the Worker's D1
  // shop_registrations table (GET /api/v1/admin/shop-registrations) for the team to retrieve
  // and hand to the owner directly, rather than exposing a device secret on a public page.
  try {
    const res = await fetch(`${WORKER_URL}/api/v1/shops/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shopName: shopName.trim(), ownerPhone }),
    });
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      const message = typeof errBody?.error === "string" ? errBody.error : "Registration failed";
      const status = res.status === 429 ? 429 : 502;
      return NextResponse.json({ error: message }, { status });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[desktop-registrations] Worker call failed:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: "We couldn't save your registration  --  please email us and we'll add you manually." },
      { status: 502 }
    );
  }
}
