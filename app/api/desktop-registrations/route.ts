import { NextRequest, NextResponse } from "next/server";
import { getDesktopLeadsPool } from "@/lib/desktopLeadsDb";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_RE = /^[^\d[\]{}<>]{1,120}$/;
const PHONE_RE = /^[+0-9 ()\-]{6,32}$/;
const CITY_RE = /^[a-zA-Z\s.'-]{0,80}$/;
const MAX_BODY_BYTES = 4 * 1024;

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
  if (typeof phone !== "string" || !PHONE_RE.test(phone.trim())) {
    return NextResponse.json({ error: "A valid 'phone' is required" }, { status: 400 });
  }
  if (typeof email !== "string" || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "A valid 'email' is required" }, { status: 400 });
  }
  if (city !== undefined && (typeof city !== "string" || !CITY_RE.test(city))) {
    return NextResponse.json({ error: "'city' must be a plain place name" }, { status: 400 });
  }

  try {
    const pool = getDesktopLeadsPool();
    await pool.query(
      `INSERT INTO desktop_registrations (shop_name, owner_name, phone, email, city)
       VALUES ($1, $2, $3, $4, $5)`,
      [shopName.trim(), ownerName.trim(), phone.trim(), email.trim(), city?.trim() || null]
    );
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[desktop-registrations] insert failed:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: "We couldn't save your registration — please email us and we'll add you manually." },
      { status: 502 }
    );
  }
}
