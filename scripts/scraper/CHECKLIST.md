# pSEO city rollout checklist

Follow in order. Each step names the exact command and the exact bug it
prevents  --  these are all things that have shipped broken at least once.
`pnpm run verify:pseo` (wired into `npm run build`) automates everything it
can; steps marked **[manual]** are judgment calls it can't check for you.

## A. New city, from zero

1. **[manual] Decide the slug.** kebab-case ASCII, one per entity, never
   reused (`content/pseo/types.ts` doc comment). Do not use underscores  -- 
   `delhi_ncr` shipped and broke `build-faq-tails-ts.mjs`'s filename regex
   (`^(area|college|city)-[a-z0-9-]+$`), fixed 2026-08-14 by renaming to
   `delhi-ncr` across `areas.ts`, `cities.ts`, the `.md` frontmatter, the
   FAQ tail filename, and the scraper config in one pass  --  renaming after
   the fact touches 5+ files, so get the slug right before any data exists
   for it.

2. **[manual] Write `scripts/scraper/cities/<slug>.py`**  --  `CITY_SLUG`,
   `QUERIES_FILE`, `CLEAN_FILE`, `RAW_DATA_FILE`, and the `AREA_KW` dict
   (area slug → keywords/display-name/pin-codes). This is the one genuinely
   manual, judgment-heavy step  --  nothing infers area boundaries for you.
   Read an existing city file (`bengaluru.py`, `delhi-ncr.py`) for the
   pattern, especially the comments on keyword collisions:
   - Bare short words substring-match unrelated addresses. Real incidents:
     `"kalyan"` matched `"kalyana mantapa"` (wedding hall) in Mathikere;
     `"camp"` matched `"...opp. polly hub, campus..."` in Pune's Vadgaon
     Budruk; Mumbai's `"cst"` bare-matched inside `"CST Road"` in
     unrelated Kalina/Santacruz addresses. Keep keywords specific
     (`"sector 14 market"`, not `"sector"`) or scope them to a longer,
     less collision-prone phrase.
   - Two real areas can be geographically adjacent with similar names  -- 
     keep their keyword lists mutually exclusive (Pune's Kothrud vs Karve
     Nagar note in `pune.py`).
   - If a city's queries span multiple sub-city names (Delhi NCR spans
     Delhi/Gurugram/Noida), add the city to `CITY_QUERY_SUFFIXES` in
     `process_areas.py` so the slug-derivation strips the right suffix  -- 
     but check whether any AREA_KW slug deliberately *keeps* a sub-city
     name as part of the slug (Noida's `sector-18-noida` etc. do); don't
     strip a suffix that's actually load-bearing in the slug.

3. **Scrape** → `scripts/scraper/data/results-<city>.json`, then
   **clean** → `python scripts/clean/clean_shops.py` (or equivalent) →
   `shops-clean-<city>.jsonl`. Real filtering bugs already fixed here,
   don't reintroduce:
   - Don't reject a listing for *any* matching negative category  --  a shop
     can legitimately combine a print counter with a side business
     (travel agency, insurance). Structural negatives (mall, hospital,
     hotel, bank) reject unconditionally; service-type negatives
     (travel/insurance/real-estate/corporate-office) should only reject
     when nothing else corroborates printing (fixed in `de4d46e`).
   - Don't treat "stationery"/"photo studio"/"scan"/"banner"/"flex" alone
     as proof of printing  --  a stationery shop sells paper, it doesn't
     necessarily print. Require corroboration (review text mentioning
     xerox/photocopy/print) when the category alone is ambiguous (fixed
     in `8c850a0`).
   - Drop businesses that *sell* printers/toner rather than offer
     printing services (`SUPPLY_SIDE` list)  --  checked before the
     print-keyword match so `"PRINT OUT AND XEROX SPACE"` isn't killed
     by an overzealous substring rule.

4. **Generate area entries**: `python scripts/scraper/process_areas.py
   <slug>`. Rewrites only that city's block in `content/pseo/areas.ts`,
   leaves every other city untouched. Read the printed summary  --  it lists
   areas with 0 matched shops (`presence: "planned"`, correctly excluded)
   and prints per-area shop counts.

   Shops are assigned to an area by *earliest* keyword match in the
   address, not first-in-`AREA_KW` (fixed 2026-08-17). Indian addresses run
   specific → general, so the locality named first is the one the shop is
   in. Before the fix, a broad early entry swallowed shops belonging to a
   more specific area declared later  --  `"bannerghatta road"` (btm-layout)
   took 8 of 11 Madiwala shops, `"jp nagar"` took 6 of 7 Kothnur shops  -- 
   leaving 1-shop pages that Search Console flagged "Duplicate without
   user-selected canonical" or refused to crawl. If a new area comes out
   suspiciously thin, check whether an earlier-positioned keyword in a
   *neighbouring* area's list is matching the same addresses.

4b. **Sync `public/llms.txt`**: `node scripts/seo/sync-llms-txt.mjs`.
   The neighbourhood lines carry a per-area shop count, and step 4 changes
   both the counts and which areas are published. `verify:pseo` only checks
   URL parity, so a stale *count* passes CI while telling crawlers something
   untrue  --  the counts sat capped at "20 shops" until 2026-08-17. Use
   `--check` in CI to fail on drift. College sections are hand-maintained
   and left untouched.

   Any area promoted from `planned` to `live` by step 4 also needs a FAQ
   tail (`content/pseo/faq-tails/area-<slug>.json`) or `verify:pseo` fails.
   Generate with `FAQ_TAIL_ONLY=<slug1>,<slug2> node
   scripts/seo/generate-faq-tails.mjs`. If the gateway 401s, note that the
   script resolves `ANTHROPIC_API_KEY ?? ANTHROPIC_AUTH_TOKEN`  --  `??` does
   not fall through an empty-but-set `ANTHROPIC_API_KEY`, so pass the
   gateway token explicitly.

5. **[manual, blocking] Add the city to `content/pseo/cities.ts`.**
   **This step is not automated by the scraper and has been missed for
   real**  --  Chennai/Mumbai/Pune/Delhi NCR shipped 48 live/served area
   pages on 2026-08-14 with zero matching `cities.ts` entries, silently
   dropping the breadcrumb city crumb (`buildBreadcrumbList` in
   `content/pseo/seo.ts` inserts it only if `getCity()` finds a match  -- 
   fails silently, not loudly) and orphaning every area page from its
   `/instant-print/<city>` hub. Fields: `slug`, `name`, `state`, `lat`/
   `lng`, `pinCodes` (pull from the area entries you just generated),
   hand-written `intro` (1-2 sentences), 4-6 hand-picked `keywords`, and
   `neighbors` (hand-curated cross-links to nearby cities  --  never
   auto-derived). **`verify:pseo` check #17 now catches a missing
   `cities.ts` entry automatically** (added 2026-08-14)  --  but writing the
   entry itself is still a manual step.

6. **[manual, blocking] Set `presence` correctly.** `"live"` = a physical
   Snaprint kiosk actually exists there. `"served"` = directory-only, no
   kiosk yet. **Every area/college defaults to whatever the generator
   script last set, and it's been wrong before**: `b602c00` had to flip
   Bengaluru/Hyderabad from `"live"` to `"served"` sitewide because every
   entity had shipped `"live"` despite no kiosk existing anywhere, which
   caused FAQ copy to falsely claim "the Snaprint kiosk works with your
   printer" on pages with no kiosk. The exact same mistake shipped again
   for Chennai/Mumbai/Pune/Delhi NCR on 2026-08-14 (48 areas), fixed by
   hand the same day. There is deliberately no automated check for
   this  --  kiosk existence is a real-world fact, not derivable from
   scraped data  --  so **check every new city/area/college's `presence`
   by hand before merging**. Flip a specific entity to `"live"` only once
   a kiosk is physically installed and verified there.

7. **Write body prose**: one `.md` file per area/college under
   `content/pseo/bodies/`, frontmatter `city: <slug>`. Must be unique
   per entity  --  `verify:pseo` checks for duplicate intros across areas
   (thin/doorway-content guard) and a minimum length (80 chars). Run
   `node scripts/build-bodies-ts.mjs` after adding/editing any `.md` file
    --  it regenerates `content/pseo/bodies.ts`; don't hand-edit that file,
   it's auto-generated and says so at the top.

8. **Write FAQ tails**: one `.json` per live/served entity under
   `content/pseo/faq-tails/`, named `{area|college|city}-<slug>.json`.
   A missing tail isn't a page break  --  it silently falls back to shared
   boilerplate FAQs only, which means the page never emits `FAQPage`
   structured data. This shipped once for 135 of 145 entities before
   `verify:pseo` check #16 was added to catch it  --  the check is now
   real, don't skip it. Run `node scripts/build-faq-tails-ts.mjs` after
   adding files  --  regenerates `content/pseo/faq-tails.ts`.

9. **Run `pnpm run verify:pseo`** (or just `npm run build`, which runs it
   as a prebuild gate automatically). Fix every `[FAIL]` line  --  don't
   merge with failures. As of 2026-08-14 it has 17 checks; see the numbered
   comment block at the top of `scripts/verify/pseo.js` for the full list
   and what regression each one guards against.

10. **Spot-check the built output directly**, not just the verifier  -- 
    the verifier can't catch everything (e.g. it wouldn't have caught the
    breadcrumb-drop bug on its own before check #17 existed):
    ```
    npm run build
    grep -o '"@type":"BreadcrumbList".\{300\}' .next/server/app/print-near/<some-area>.html
    ```
    Confirm the breadcrumb has 4 levels (`Home → Print Near You → <City>
    → <Area>`), not 3 (missing city = the bug).

## B. Existing city  --  scraping more shops / new areas

Same as steps 3-4 and 7-9 above, but scoped:

- Re-scrape and re-run `process_areas.py <slug>`  --  it only touches that
  city's block in `areas.ts`, every other city's data is untouched
  (this was itself a fixed bug: `752b4f8`  --  the old merge logic silently
  dropped whichever entry happened to be last in the file on every
  regen, regardless of city; fixed and verified across 4 repeated runs).
- **New areas still need body prose + FAQ tails** (steps 7-8)  --  they
  don't get generated for free.
- **No `cities.ts` change needed** if the city already has an entry  -- 
  just re-run `verify:pseo` to confirm the new areas roll up correctly
  (check "live city X has N published areas feeding its shops list").
- If shop counts change meaningfully, bump the city's `intro` text in
  `cities.ts` (it states a specific neighbourhood count) and its
  `lastReviewed` date.
- **Don't let a stale local git branch fool you into re-diagnosing a
  problem that's already fixed upstream.** Run `git fetch && git status`
  before trusting what's on disk  --  this session's whole `delhi_ncr` gap
  investigation started from a local branch that was one commit behind
  `origin/master`, which had already added the area data.

## C. Before merging any pSEO change, always

```
pnpm run verify:pseo     # data-layer checks (17, see file header)
npm run build             # also runs verify:meta, verify:schema, verify:seo-tags
```

All four must pass clean. They are wired into CI (`ca5702e`) and also gate
every Vercel deploy via `npm run build`. Don't bypass with `--no-verify` or
by editing the check instead of the data.
