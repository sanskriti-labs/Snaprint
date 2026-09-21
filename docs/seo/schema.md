# Schema.org / JSON-LD

## Where it lives

- `app/layout.tsx`  --  site-wide `@graph`: `Organization` + `WebSite` (every page, via root layout).
- `app/page.tsx`  --  homepage-only: `Product` (S1 kiosk), `WebApplication`, `FAQPage`. Scoped to the homepage so kiosk pricing doesn't leak into PSEO shop-directory pages.
- `app/about/page.tsx`, `app/franchise/page.tsx`  --  `AboutPage` / `Service` + `FAQPage`.
- `app/instant-print/[city]/page.tsx`, `app/print-near/[entity]/page.tsx`  --  per-entity `LocalBusiness` / `Place`+`EducationalOrganization`, `BreadcrumbList`, gated `FAQPage` (only emitted when the entity has FAQs beyond shared boilerplate  --  avoids thin-content duplication). Rendered via `components/PseoPage.tsx`'s `jsonLd` prop.
- `components/BlogPage.tsx`  --  `BlogPosting` + `BreadcrumbList` per post (added 2026-08-14). `author`/`publisher` both point at the `Organization` `@id`  --  posts aren't bylined in the UI, so attributing to a fabricated person would be wrong. `image` falls back to `/og.png` since posts have no per-post image field in frontmatter yet.

## WebSite `SearchAction`

Added 2026-08-14. `app/layout.tsx`'s `WebSite` node now has:

```js
potentialAction: {
  "@type": "SearchAction",
  target: { "@type": "EntryPoint", urlTemplate": `${siteUrl}/search?q={search_term_string}` },
  "query-input": "required name=search_term_string",
}
```

This is what can make Google show a search box under the domain in results (the "sitelinks search box"), separate from the directory-style sitelinks (Franchise, Pricing, etc.) that come from consistent nav/footer linking + distinct per-page metadata.

Requires the `urlTemplate` to point at a real, working search page  --  `app/search/page.tsx` was added alongside this so the hint isn't pointing at a 404. It does a simple substring match over: static pages, blog posts (`lib/blog.ts`), and published PSEO cities/colleges/areas (`content/pseo/seo.ts`, already filtered through `isPublished()` so `planned` entities never surface). The results page itself is `noindex` (search-results pages are typically excluded from indexing)  --  only the `SearchAction` template is meant to be picked up by Google.

## Not yet done

- `Organization` in `layout.tsx` has a `contactPoint` (email only, added 2026-08-14) but still no `telephone`/street address  --  add if a public support number/office address should be published (mirrors what competitor sites use for their `LocalBusiness`/`ProfessionalService` node).
- `sameAs` only lists LinkedIn  --  Crunchbase/F6S/Justdial entries are commented out in `layout.tsx` pending real profiles existing (don't fake `sameAs` links).
- Blog posts have no per-post `image` in frontmatter, so `BlogPosting.image` falls back to the site-wide `/og.png`  --  add a real per-post image field if posts ever get unique cover art.
