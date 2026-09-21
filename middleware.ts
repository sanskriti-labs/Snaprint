import { NextResponse, type NextRequest } from "next/server";

// ponytail: in-memory bucket resets per instance/cold start  --  fine for a
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

function bookMiddleware(req: NextRequest): NextResponse {
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
      { error: "Too many booking requests  --  please wait a minute." },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  bucket.count += 1;
  return NextResponse.next();
}

// True when the client's Accept header prefers text/markdown over text/html
//  --  i.e. a markdown-specific media range is present and, if both are listed,
// markdown's q-value is not lower than html's. Per acceptmarkdown.com.
function prefersMarkdown(acceptHeader: string | null): boolean {
  if (!acceptHeader) return false;
  const entries = acceptHeader.split(",").map((part) => {
    const [rawType, ...params] = part.trim().split(";");
    const qParam = params.find((p) => p.trim().startsWith("q="));
    const q = qParam ? parseFloat(qParam.split("=")[1]) : 1;
    return { type: rawType.trim().toLowerCase(), q: Number.isNaN(q) ? 1 : q };
  });

  const markdown = entries.find((e) => e.type === "text/markdown");
  if (!markdown) return false;

  const html = entries.find((e) => e.type === "text/html" || e.type === "*/*");
  if (!html) return true;

  return markdown.q >= html.q;
}

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/api/book/")) {
    return bookMiddleware(req);
  }

  if (req.method !== "GET") {
    return NextResponse.next();
  }

  if (prefersMarkdown(req.headers.get("accept"))) {
    // Any path gets a markdown response: a known page gets its markdown
    // variant, an unknown one gets the same short markdown 404 body used by
    // the agent-friendly-404 fix (see notFoundMarkdown in
    // lib/markdown-negotiation.ts)  --  an agent asking for markdown on a dead
    // path still gets pointed at the sitemap/llms.txt instead of an HTML 404.
    // (The Vary header for pages that DO serve HTML normally comes from
    // vercel.json, not from here  --  Next's App Router page pipeline calls
    // res.setHeader("vary", ...) unconditionally deep in its own rendering
    // code, which *overwrites* anything set on a page response by middleware
    // or next.config.mjs's headers(). vercel.json's headers run at Vercel's
    // edge layer, after Next has already finished building the response, so
    // they land after that overwrite instead of before it. See
    // next.config.mjs for the longer version of this note.)
    //
    // Route handlers reached via a middleware rewrite see `nextUrl` as the
    // *original* incoming URL, not the rewritten target  --  request.nextUrl's
    // search params inside app/api/markdown/route.ts come back empty even
    // though the rewrite target URL carries ?path=. A request header
    // survives the rewrite intact, so pass the original path that way
    // instead.
    const url = req.nextUrl.clone();
    const originalPath = url.pathname;
    url.pathname = "/api/markdown";
    url.search = "";
    const headers = new Headers(req.headers);
    headers.set("x-markdown-path", originalPath);
    return NextResponse.rewrite(url, { request: { headers } });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/book/:path*",
    /*
     * Match every path except:
     * - /api/* (own negotiation, or unrelated API routes)
     * - /_next/static, /_next/image (build assets)
     * - files with an extension (favicon.ico, robots.txt, sitemap.xml,
     *   images, etc.)  --  these aren't HTML pages and have no markdown
     *   variant; letting them through avoids adding Vary/negotiation
     *   overhead to every static asset request.
     */
    "/((?!api/|_next/static|_next/image|.*\\..*).*)",
  ],
};
