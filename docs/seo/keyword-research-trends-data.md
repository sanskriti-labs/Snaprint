# Keyword Research  --  Google Trends Data Pass

Date: 2026-09-18. Method: `pytrends` (unofficial Google Trends API wrapper) via the
`trends` CLI already installed on this machine, geo-targeted to India. This supersedes the
"no volume data available" caveat in `keyword-research.md` (July 2026) for the terms tested
below  --  that file's qualitative SERP/competitor analysis still stands, this adds real demand
signal on top of it.

## Important methodology caveat

Google Trends gives **relative search interest (0–100 index over time)**, not absolute
monthly search volume, CPC, or competition. It's genuinely useful for: which of several
phrasings actually gets searched, growth vs. decline over time, and discovering real related
queries. It is **not** a substitute for Keyword Planner's absolute numbers when it comes to
sizing content ROI precisely.

**Real Keyword Planner access (absolute volume/CPC/competition) is still blocked**  --  the
`keywords-cli` tool on this machine calls the Google Ads API directly, which needs a
`developer_token` and `customer_id` that aren't configured. To unblock: sign in to
[ads.google.com](https://ads.google.com) with the Sanskriti Labs account → any existing or
new Google Ads account works, doesn't need active spend → Tools & Settings → API Center →
apply for a developer token (Basic access is usually near-instant for a new token; get the
customer ID from the account number shown in the top-right, digits only, no dashes). Once you
have both, add them to `~/.config/keywords-cli.json` (or pass as `--developer-token` /
`--customer-id` flags) and `keywords-cli -k "xerox shop near me" "print kiosk franchise"`
gives real monthly search volume + CPC + competition directly.

---

## Findings by cluster

### Cluster 1  --  Near-me local (the dominant real cluster)

| Query | Signal |
|---|---|
| **xerox shop near me** | Real, large, and still rising  --  index climbed from ~0 (pre-2016) to 31.6 by 2026, peaked 33.2 in 2023. **This is the one term that actually carries volume in this entire research pass.** |
| photocopy near me | Real but much smaller (~5.5), roughly flat |
| instant print near me | ~0  --  essentially unsearched as a literal phrase |
| print and scan near me | ~0  --  essentially unsearched |

**New finding  --  rising query:** `xerox shop near me low price` is a **breakout/rising** related
query (value 400 = Google's "rising sharply" flag, from a low base). Nobody in the existing
content targets price-sensitivity within the near-me search. This is genuinely new signal, not
in the July research.

**Adjacent cluster surfaced:** `stationery near me` / `stationery shop near me` rank as **top**
related queries to "xerox shop near me"  --  i.e., people searching for a xerox shop and a
stationery shop are the same search behavior. Relevant because Snaprint kiosks often sit
inside stationery shops too (see `content/blog/print-kiosk-coworking-apartment-complexes.mdx`
for the precedent of extending beyond pure xerox-shop framing).

### Cluster 2  --  Hardware/pricing (real, but not the audience Snaprint's blog serves)

| Query | Signal |
|---|---|
| **xerox machine price** | Real historical volume, but in **long decline**  --  peaked 42.8 (2013), now 11.1 (2026) |
| photocopy price per page | ~0 |
| printing cost per page | ~0 (barely 1.8) |

Related queries for "xerox machine price" are almost entirely **brand-model shopping**: "canon
xerox machine price," "fully automatic xerox machine price" (rising, value 550), "brother/
kyocera/epson xerox machine price." This is IndiaMART/TradeIndia's audience  --  people comparing
printer brands to buy hardware outright, not evaluating a kiosk franchise. Confirms the
original research's read that this cluster is won by marketplaces, not blog content  --  but
surfaces one new angle: **"which printer should I buy for my xerox shop" content that pivots to
"or skip the equipment decision" is a real, searched entry point** nothing currently targets.

### Cluster 3  --  Franchise / kiosk investment (real volume, but volatile and low-frequency)

| Query | Signal |
|---|---|
| **kiosk franchise cost** | Real but spiky  --  peaked 55.1 (2022), down to 10.5 (2026), no stable trend |
| printing kiosk franchise | **Zero measurable volume**  --  below Trends' reporting floor entirely (confirmed via isolated single-term query, not a scaling artifact) |
| xerox shop franchise cost | **Zero measurable volume**, same confirmation |

This is a real, if small, finding: the exact phrases `printing kiosk franchise` and `xerox shop
franchise cost`  --  both currently targeted as primary keywords in
`snaprint-franchise-print-kiosk-investment.mdx` and `xerox-shop-franchise-cost-india.mdx`  -- 
carry effectively no standalone search volume. That doesn't mean drop them (they're still the
right *category* terms and may pick up volume as the category matures, and AI-citation/GEO
value doesn't require search volume the way ranking does), but it does mean **don't expect
these two posts to drive meaningful direct organic traffic on their own**  --  their real job is
being the destination page other channels (PH, directories, Reddit) point at.

### Cluster 4  --  "How to start a xerox shop" (zero measurable Trends volume, contradicts assumption)

`how to start a xerox shop`, `xerox shop business plan`, `xerox shop profit`  --  **all
effectively zero** in Trends' India index, despite IIFL, Khatabook, and others clearly
investing in this content (per the July SERP research). Likely explanation: real demand here is
diffuse across many phrasings (no single string clears Trends' volume floor) and/or increasingly
mediated through AI chat rather than typed Google queries  --  which is exactly the GEO case for
this content, not a reason to deprioritize it. **Keep `how-to-start-a-xerox-shop-in-india.mdx`**
 --  its value is AI-citation and being the definitive page for a topic competitors have already
proven monetizable, not classic keyword-volume SEO.

### Cluster 5  --  Low-investment franchise halo (confirms existing content, one keyword swap)

| Query | Signal |
|---|---|
| **franchise business india** | Real, large, historically dominant (peaked 67 in 2009), still meaningful today (~15) |
| low investment franchise business | Small but real and steady (~1–3) |
| business ideas under 5 lakhs | ~0 |

`low-investment-franchise-business-ideas-india.mdx` already exists and targets this cluster,
but its keyword list leads with `"franchise business india low investment"` rather than the
bare `"franchise business india"`  --  the actually-dominant anchor term. Small, low-risk fix:
add `"franchise business india"` to that post's keywords array.

### Cluster 6  --  Student/mobile print (mostly zero  --  surprising given autocomplete signal)

`print resume near me`, `print assignment near me`  --  **zero** measurable volume, despite both
appearing as Google autocomplete suggestions in the July research. Autocomplete reflects
prefix-completion patterns, not proportional search volume  --  a real methodological gap between
the two research passes worth remembering. `print from phone` has small real volume (~2.4,
spiked to 9.7 in 2025)  --  the existing `print-from-your-phone-instantly.mdx` post is targeting
the right general shape of query, just not the specific near-me/resume/assignment variants,
which don't seem to carry independent volume.

---

## What this changes: prioritized action list

1. **New, highest-confidence content gap: price-sensitivity in near-me search.** `xerox shop
   near me low price` is a genuine rising query nothing currently targets. Given Brief 1's own
   guidance that near-me intent is won by pSEO/local pages (not blog posts), the right fix is
   adding a "cheapest near me" / pricing-transparency angle into the existing `content/pseo/`
   templates (`faqs.ts` / `faq-tails.ts`) rather than a new blog post  --  check current FAQ
   coverage there before writing.
2. **New content gap: stationery-shop overlap.** `stationery near me` / `stationery shop near
   me` are top related queries. Worth a short blog post extending the pattern already
   established in `print-kiosk-coworking-apartment-complexes.mdx`  --  "Print Kiosks for
   Stationery and Book Shops"  --  plus folding stationery-shop language into pSEO copy where
   Snaprint installs are actually in combo stationery/xerox shops.
3. **New content gap: the printer-buying decision.** "Which printer should I buy for a xerox
   shop" is real, searched demand (via the xerox-machine-price related queries) that currently
   has no Snaprint-authored answer  --  a natural pivot point to "or don't buy one, add a kiosk
   instead," consistent with the existing `print-kiosk-franchise-vs-own-printer.mdx` post but
   from the buying-a-machine entry point rather than the kiosk-vs-software entry point.
4. **Low-risk fix:** add `"franchise business india"` (the real anchor term) to
   `low-investment-franchise-business-ideas-india.mdx`'s keyword list.
5. **No new content needed, expectations reset:** `how-to-start-a-xerox-shop-in-india.mdx`,
   `snaprint-franchise-print-kiosk-investment.mdx`, and `xerox-shop-franchise-cost-india.mdx`
   are all already covering the right topics  --  Trends showing ~zero volume for their exact
   target phrases doesn't mean the content is wrong, it means their traffic will come from
   GEO/AI citation and directory/launch referrals, not classic keyword-volume ranking. Don't
   write more posts chasing volume on these exact strings.

## Related

- `keyword-research.md`  --  original qualitative SERP/competitor research (July 2026), still the source for competitor and SERP-structure analysis
- `submission-kit.md`, `product-hunt-launch-plan.md`, `submission-tracker.csv`  --  distribution side; this file is the content-targeting side
