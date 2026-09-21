# Snaprint Submission Kit  --  reusable assets for every directory/launch listing

Last updated: 2026-09-18.

Purpose: nearly every directory, launch platform, and press listing asks for the same
handful of fields (name, tagline, short/long description, category, logo, screenshots,
founder info, social links). Instead of re-writing these per submission, this doc is the
single source of truth  --  pull from here, adapt only the framing note per directory type,
and paste.

Two other docs feed off this one and stay separate because they're workflow, not raw copy:
- `directories.md`  --  the India-directory checklist (Crunchbase, F6S, YourStory, IndiaMART, etc.), tracks submission status
- `product-hunt-launch-plan.md`  --  PH-specific launch mechanics (timing, algorithm, first comment)

---

## 0. Fix before submitting anywhere  --  these will propagate

Submitting the same wrong fact to 10+ directories is worse than submitting to none, because
directory listings are slow/painful to edit after the fact. Resolve these first:

| Issue | Where | Fix needed |
|---|---|---|
| Install timeline says two different things | `app/(marketing)/franchise/page.tsx`  --  hero stat block says **"7 days" from payment to live**, but step 03 ("Install") says **"typically within 15 days of payment"** | Pick one real number, update both, then use that number in every submission below |
| Two blog posts link to `/pricing`, which doesn't exist as a route | `content/blog/xerox-shop-investment-cost-india.mdx`, `content/blog/xerox-shop-franchise-cost-india.mdx` | Point to `/franchise` or `/#pricing` instead |
| "Year founded: 2025"  --  unverified | `directories.md` canonical NAP | Confirm this is correct before it goes on Crunchbase/F6S (hard to quietly change later) |
| Only 2 real product photos exist | `public/kiosks/` | Directories/PH expect 5–8; see `product-hunt-launch-plan.md` for the full list of what's missing |

Until the install-timeline number is fixed, **use "within 2 weeks of payment" everywhere below**  --  it's true under either published number and won't need correcting later.

---

## 1. Identity block

| Field | Value |
|---|---|
| Business name | Snaprint |
| Full/legal display name | Snaprint  --  Instant Print Kiosks |
| Legal entity | Sanskriti Labs |
| Website | https://snaprints.com |
| Primary email | snaprints@sanskritilabs.in |
| Phone | None published  --  leave blank, don't invent one |
| Location | Bengaluru, Karnataka, India |
| Year founded | 2025 *(confirm before wide submission  --  see §0)* |
| Currently operating in | Bengaluru only |
| Founders | Goutham Singh  --  [LinkedIn](https://www.linkedin.com/in/goutham-singh-/) · Abhishek Rajpurohit  --  [site](https://abhishekrajpurohit.in) |
| Social | [Instagram](https://www.instagram.com/snaprints.labs/) · [LinkedIn company page](https://www.linkedin.com/company/snaprintss/) · [Reddit r/Snaprint](https://www.reddit.com/r/Snaprint/) |

---

## 2. Taglines (pick by character limit)

| Length | Copy |
|---|---|
| 3 words (brand line, from the site itself) | "snap. scan. print." |
| ~40 chars | "Self-service print kiosks for India" |
| ~60 chars | "Turn any xerox shop into a 24/7 self-service print kiosk" |
| ~60 chars, alt | "Scan, pay, print  --  no counter, no app, no queue" |

---

## 3. Descriptions (pick by length)

**~50 chars (list-view / card description):**
> Self-service print kiosks for xerox shops in India

**~160 chars (meta-description length  --  G2/Capterra/most directory "short description" fields):**
> Snaprint is a self-service print kiosk that fits inside existing xerox shops  --  scan, upload, pay via UPI, and collect in under a minute, 24/7.

**~260 chars (Product Hunt / longer directory fields):**
> Snaprint is a self-service print kiosk that fits inside an existing xerox or stationery shop. Customers scan a QR, upload from their phone, pay via UPI, and collect in under a minute  --  even when the shop's closed. Built in Bengaluru, owned outright by the shop owner.

**~100 words (Crunchbase / YourStory / Inc42 "about" fields):**
> Snaprint builds self-service print kiosks for India's xerox and stationery shops. Every xerox shop already runs an informal version of remote ordering  --  a customer WhatsApps a PDF and says "print two copies, I'll collect later"  --  but that demand is untracked and gets lost whenever the shop is busy or closed. Snaprint's S1 kiosk turns that pattern into a paid, self-service order: customers scan a QR, upload, pay via UPI, and collect, with no staff required. The kiosk installs alongside a shop's existing setup rather than replacing it, so counter traffic and self-service traffic never compete for the same printer. Built by Sanskriti Labs in Bengaluru; the shop owner purchases the hardware outright with no per-print commission.

---

## 4. Key facts (reusable bullet list  --  for "what makes it different" / "key features" fields)

- One-time hardware purchase  --  ₹84,999 to ₹2,99,999 across 3 kiosk models, plus 18% GST
- **No per-print commission**  --  the only per-transaction cost is the standard UPI merchant fee
- Dedicated hardware (2000-sheet capacity, 15.6" touch display), not a bolt-on to the shop's existing printer
- Fits *inside* an existing xerox/stationery shop rather than replacing it or standing alone
- Live owner dashboard  --  revenue, print counts, ink/paper status, from the owner's phone
- 24/7 unattended operation
- Currently Bengaluru-only, with in-person installation and training
- Files are end-to-end encrypted and auto-deleted after printing (privacy angle  --  useful for ID/document-heavy use cases)

---

## 5. Assets inventory

| Asset | Path / URL | Status |
|---|---|---|
| Square logo (1024×1024-ish) | `public/icon-512.png` → `https://snaprints.com/icon-512.png` | ✅ ready |
| Small icon | `public/icon-192.png` | ✅ ready |
| Favicon | `public/favicon.ico` | ✅ ready |
| Logo mark (vector) | `public/logo-mark.svg` | ✅ ready |
| OG/social share image | `public/og.png` | ✅ ready |
| Brochure PDF | `public/snaprint-kiosk-brochure.pdf` | ✅ ready  --  useful for directories that accept a PDF instead of a form (IndiaMART, TradeIndia) |
| Real product photos | `public/kiosks/gtc-bangalore.png`, `public/kiosks/lakshmi-print-hyderabad.png` | ⚠️ only 2  --  need 3–6 more (UI mid-order, dashboard, QR-scan moment) before PH/launch-grade submissions |
| Demo video (60–90s) |  --  | ❌ doesn't exist yet  --  blocks Product Hunt specifically; most directories don't require it |
| Founder photos | `public/founders/goutham.webp`, `public/founders/abhishek.webp` | ✅ ready |

---

## 6. Categories, by platform type

Use whichever the platform's taxonomy actually offers  --  exact names drift, so treat these as
the *intent* to match, not literal strings to paste blind:

| Platform type | Category to select |
|---|---|
| Startup/general directories (Crunchbase, F6S, YourStory, Inc42, Tracxn) | Hardware / Retail Tech / SMB Infrastructure |
| B2B marketplaces (IndiaMART, TradeIndia) | "Instant Print Kiosk" or "Printing Equipment Supplier"  --  list as a product, not a service |
| Local citations (Google Business Profile, Justdial, Sulekha) | Printing Services / Business Equipment Supplier / Internet Café (per existing NAP in `directories.md`) |
| Product Hunt | Hardware (primary); India or Fintech as secondary if the topic exists at submission time |
| B2B review sites (Clutch) | Hardware/IoT vendor, not a services firm |

**Skip entirely**  --  don't waste submission attempts here, wrong-category submissions get
rejected by moderators and cost more time than they're worth: AI tool directories (TAAFT,
Futurepedia, Toolify), MCP/agent registries, no-code directories. Snaprint is a physical
kiosk + local franchise business, not an AI product or a no-code tool  --  those tiers from the
general backlink playbook don't apply here.

---

## 7. Positioning note, by directory type

Per the general link-building playbook's "never copy-paste the same description everywhere"
rule  --  the core facts (§3, §4) stay the same, but lead differently:

- **Startup directories (Crunchbase, F6S, Tracxn):** lead with the entity/category framing  --  "self-service print kiosk hardware, Bengaluru." Data-first, not narrative.
- **Journalist-friendly (YourStory, Inc42):** lead with the founder-story angle  --  the "xerox shops are India's original dark stores" narrative (see `india-informal-retail-nobody-builds-for.mdx`). These editors want a story, not a spec sheet.
- **B2B marketplace (IndiaMART, TradeIndia):** lead with product specs and buyer framing  --  "Instant Print Kiosk supplier," 2000-sheet capacity, 15.6" display, works for shop owners sourcing hardware.
- **Product Hunt / Indie Hackers / HN:** lead with the maker-voice narrative and the "boring category nobody builds for" hook  --  see `product-hunt-launch-plan.md` for the drafted first comment.
- **Local citations (Google Business Profile, Justdial, Sulekha):** use the canonical NAP in `directories.md` verbatim  --  these are read by matching algorithms, not humans; consistency matters more than persuasion here.

---

## 8. Quick per-directory cheat sheet

| Directory | Description length to use | Category note |
|---|---|---|
| Crunchbase | ~100-word | Hardware / Retail Tech |
| F6S | ~160-char | Startup community  --  outcome-led framing |
| YourStory | ~100-word + link the "dark stores" essay | Bengaluru founder story angle |
| Inc42 | ~100-word | Startup-news framing, market gap angle |
| Tracxn | ~160-char | Data-first entity profile |
| IndiaMART / TradeIndia | ~160-char + brochure PDF | List as product, not company profile |
| Clutch | ~160-char | Hardware/IoT vendor category |
| Sulekha / Justdial / Google Business Profile | canonical NAP description verbatim | Local citation  --  no creative framing |
| Product Hunt | ~260-char + tagline | See `product-hunt-launch-plan.md` |

---

## 9. Full tracker  --  `submission-tracker.csv`

Sourced from the `directory-submission-copy` skill's full 13-tier catalog
(`~/.hermes/skills/seo/backlink-directory-submissions/references/directory-list.md`), filtered
down to what's a genuine fit for a physical kiosk/franchise business. Uses the skill's own CSV
tracker format so it's a drop-in replacement, not a new schema.

**Included:** Tier 1 launch platforms (all  --  generic aggregators, fine for hardware, not
SaaS-only), a curated Tier 2 subset of general-purpose startup directories (excluding the
SaaS-review-specific ones  --  see below), Dun & Bradstreet (genuine business-data directory,
same category as Crunchbase), Tier 9 local-business directories, and a handful of Tier 11
press-release sites for the launch announcement.

**Deliberately excluded, and why:**
- **Tier 3 (AI directories), Tier 4 (Agent/MCP registries), Tier 5 (no-code directories)**  --  Snaprint is a physical print kiosk, not an AI product, agent, or no-code tool. Submitting here gets rejected by moderators and burns the listing.
- **Tier 7 (integration marketplaces  --  Zapier, HubSpot, Slack, Notion)**  --  no software integrations exist to list.
- **G2, Capterra, GetApp, AlternativeTo, SourceForge, Slashdot, TrustRadius, Crozdesk, Software Advice, TheSaaSDirectory, SaaSWorthy, ToolsFine, New SaaSly, Business Software, Cuspera, FiveTaco, 10words, AlphaDigits** *(all technically Tier 2 in the source list)*  --  these are software-product review platforms. Snaprint isn't SaaS; there's no software product to review in that sense, and submitting here reads as a category mismatch to moderators.
- **Tier 8 profile/content platforms (Substack, Medium-equivalents, GitHub, etc.)**  --  this tier is really "publish content on a high-DA platform," a content-marketing tactic, not a directory listing. Worth doing later, but it's a different motion (needs original written content per platform)  --  not a bulk submission.
- **Tier 10 forums/communities**  --  these require genuine participation first per the platform's own "participate before you post" rule, not a one-time listing. Already tracked separately for Reddit specifically in `snaprint-details-product-core/reddit-research-leads.md`.
- **Tier 12 (social bookmarking), most of Tier 13 (niche verticals  --  legal, home, fitness, events)**  --  low remaining relevance or value for this category; skip unless a specific one becomes relevant later.
- India-specific directories (Crunchbase, F6S, YourStory, Inc42, IndiaMART, Justdial, Sulekha, Google Business Profile, etc.)  --  **stay in `directories.md`**, not duplicated here, since that file already tracks them with status checkboxes.

**Flagged in the tracker itself:** several Tier 9 local directories (CitySquares, eLocal,
iBegin, ezlocal) are US-focused  --  noted per-row as low priority for a Bengaluru-only
business rather than excluded outright, in case coverage improves later. DR figures
throughout are the source skill's own approximations and "drift over time" per its own
caveat  --  spot-check a handful with a real tool (Ahrefs/Moz) before trusting the list blindly
for prioritization.

---

## Related

- `directories.md`  --  India-directory submission checklist + canonical NAP (submission status tracker)
- `submission-tracker.csv`  --  the global/generic directory tracker (§9 above)
- `product-hunt-launch-plan.md`  --  PH launch mechanics, blocked on visual assets (§5 above)
- `keyword-research.md`  --  competitive/keyword context behind the positioning choices above
