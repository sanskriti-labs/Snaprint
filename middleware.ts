import { NextResponse, type NextRequest } from "next/server";

// ponytail: in-memory bucket resets per instance/cold start — fine for a
// single small deployment; move to Upstash Redis if abuse persists across
// instances.
const buckets = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 5;

function isAllowedOrigin(req: NextRequest): boolean {
  if (req.method !== "POST") return true;
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

function clientIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
}

export function middleware(req: NextRequest) {
  if (!req.nextUrl.pathname.startsWith("/api/book/")) {
    return NextResponse.next();
  }

  if (!isAllowedOrigin(req)) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  }

  const ip = clientIp(req);
  const now = Date.now();
  const bucket = buckets.get(ip);

  if (!bucket || now > bucket.resetAt) {
    buckets.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return NextResponse.next();
  }

  if (bucket.count >= MAX_REQUESTS) {
    return NextResponse.json(
      { error: "Too many booking requests — please wait a minute." },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  bucket.count += 1;
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/book/:path*"],
};
