import { NextResponse, type NextRequest } from "next/server";
import { resolveMarkdownForPath, notFoundMarkdown } from "@/lib/markdown-negotiation";

/**
 * Serves the markdown representation of a page for Accept: text/markdown
 * content negotiation (acceptmarkdown.com). middleware.ts rewrites eligible
 * GET requests here, passing the original page path as ?path=. Never
 * requested directly by a browser  --  see the rewrite condition in
 * middleware.ts for which requests land here.
 */
export function GET(request: NextRequest) {
  // Set by middleware.ts as a request header, not a rewritten query param  -- 
  // route handlers reached via a middleware rewrite see request.nextUrl as
  // the original incoming URL, so a header is what actually survives.
  const path = request.headers.get("x-markdown-path") ?? request.nextUrl.searchParams.get("path") ?? "/";
  const markdown = resolveMarkdownForPath(path);

  if (markdown === null) {
    return new NextResponse(notFoundMarkdown(path), {
      status: 404,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        Vary: "Accept, Accept-Encoding",
      },
    });
  }

  return new NextResponse(markdown, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      Vary: "Accept, Accept-Encoding",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
