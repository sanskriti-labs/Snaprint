# scripts/seo — pseo body generator

This directory holds the one-shot pipeline that produces the prose bodies
under `content/pseo/bodies/`. The bodies are the long-form copy on each
city / area / college landing page — the part that gives Google enough
text to rank, and the part that gives a visitor enough to decide.

The pipeline is intentionally **two-step**: deterministic first, LLM only
for thin pages. Stub bodies (areas / colleges / cities with healthy
verified shop counts) are pure intro copy and need no model call. Only
priority bodies (shopCount <= 3 — usually 0 or 1 verified shops) go
through Claude.

---

## Quick start

```bash
# 1. After adding or editing any pseo data (areas.ts / colleges.ts / cities.ts / shops.ts)
pnpm run generate:bodies

# 2. After the stub step, for thin pages only:
export ANTHROPIC_API_KEY=sk-ant-...
pnpm run generate:priority
```

---

## Two-step workflow

### Step 1 — `pnpm run generate:bodies`

`scripts/generate-bodies.mjs`

- Reads `content/pseo/{cities,areas,colleges}.ts` as text and extracts
  the top-level object blocks via regex (no TS runtime required).
- For each `live` / `served` entity, computes `shopCount`:
  - **area / city:** number of `liveLocations[]` declared on the entity.
  - **college:** number of xerox shops within 1.5 km of campus coords
    (same JSONL + same haversine as `content/pseo/shops.ts`).
- Classifies:
  - `shopCount <= 3` → **priority** (placeholder, `needsLLM: true`)
  - `shopCount  > 3` → **stub** (the existing intro, verbatim, with
    `wordCount` set to the intro's word count).
- **Idempotent:** if `content/pseo/bodies/{kind}-{slug}.md` already
  exists, it is skipped (never overwritten). The 13 hand-written
  priority files are detected via the `## About this place` heading;
  the 132 stub files are detected by file presence.
- Summary printed to stdout (written / skipped / priority / stub counts
  per kind).

### Step 2 — `pnpm run generate:priority`

`scripts/seo/run-priority-api.mjs`

- Reads all `content/pseo/bodies/*.md`, filters to those flagged
  `needsLLM: true` in frontmatter.
- For each:
  - Resolves the entity's data from the .ts files (name, city name,
    pin codes, shopCount, top-rated shop, intro).
  - Renders the prompt template `scripts/seo/prompts/priority-body.md`
    with `{{double-brace}}` slot replacement.
  - POSTs to `https://api.anthropic.com/v1/messages` with
    `model: "claude-opus-5"`, `max_tokens: 2000`.
  - Writes the response into the placeholder file, replacing the
    `<!-- needsLLM -->` comment, and updates `wordCount` / `needsLLM`
    in the frontmatter.
- Sequential (not parallel) so we never hit rate limits and the output
  is deterministic.
- `ANTHROPIC_API_KEY` must be set. Script exits with a clear error
  otherwise.

---

## When to run each

| Trigger                                                  | Command                       |
|----------------------------------------------------------|-------------------------------|
| New city, area, or college added to pseo .ts files       | `pnpm run generate:bodies` then `pnpm run generate:priority` |
| Shop JSONL refreshed (more verified shops in a city)     | `pnpm run generate:bodies`    |
| Intro / keywords / pin codes hand-edited in a .ts file   | `pnpm run generate:bodies`    |
| Existing body content needs to be re-generated           | delete the file, then `generate:bodies` and `generate:priority` |
| Minor copy fix on a single page                          | edit the body .md file directly (do not re-run)         |

If you edit a body .md file by hand and then re-run `generate:bodies`,
the file will be skipped (existence check). To force a regeneration,
delete the file first.

---

## How to add a new city (concrete steps)

Example: rolling out **Mumbai**.

1. **`content/pseo/cities.ts`** — add a `Mumbai` entry to the
   `cities: City[]` array. Set `presence: "served"` (publish the
   directory page, no kiosk yet). Populate `pinCodes`, `intro`,
   `keywords`, `state: "Maharashtra"`, `lat` / `lng`.

2. **`content/pseo/areas.ts`** — add a Mumbai areas section. For each
   Mumbai neighborhood, copy the format used for Bengaluru / Hyderabad
   entries. Use `presence: "live"` if the area has verified shop data,
   `presence: "served"` if it has aggregator data only, `presence:
   "planned"` if you want the page to 404 for now.

3. **`content/pseo/colleges.ts`** — add Mumbai colleges that pass
   `scripts/match/colleges_radius.py` (≥ 1 shop within 1.5 km).

4. **`scripts/scraper/data/shops-clean.jsonl`** — add the Mumbai shops
   (re-run `scripts/clean/clean_shops.py` if the raw scrape covers
   Mumbai; otherwise add records by hand for now).

5. Run the pipeline:

   ```bash
   pnpm run generate:bodies
   export ANTHROPIC_API_KEY=sk-ant-...
   pnpm run generate:priority
   ```

6. Commit. The sitemap auto-updates on next `next build` because
   `getAllCitySlugs` / `getAllCollegeSlugs` / `getAllAreaSlugs` are
   derived from the .ts data, not from the bodies directory.

7. Optional: run `pnpm run verify:pseo` to confirm the new city
   doesn't trip any of the published-vs-data guards.

---

## Cost

Claude API cost is driven entirely by `generate:priority`, which only
runs for thin pages.

Per priority page:
- Input: ~1,200 tokens (the prompt template + slot data).
- Output: ~600 tokens (the 400-500 word body).
- Total: ~1,800 tokens.

At Claude Opus 5 list pricing (~$15 / MTok input, ~$75 / MTok output),
that's roughly **$0.06 per priority page** (input $0.018 + output $0.045).

### Per-city estimate

Bengaluru has 10 priority areas / 4 priority colleges / 1 priority city =
15 priority pages → ~**$0.90 per city** on first roll-out.

Subsequent regenerations of the same pages (e.g. after shop data
refreshes) are usually not needed — only the 13 hand-written pages
need refreshing, and only after manual review.

---

## Troubleshooting

| Symptom                                                                | Fix |
|------------------------------------------------------------------------|-----|
| `ANTHROPIC_API_KEY is not set.`                                        | `export ANTHROPIC_API_KEY=sk-ant-...` then re-run. |
| `Claude API 401: invalid x-api-key`                                    | Bad / expired key. Check `echo $ANTHROPIC_API_KEY`. |
| `Claude API 429: rate_limit_error`                                     | Wait a minute and re-run. The script is already sequential. |
| `Claude API 5xx: ...`                                                  | Transient. Re-run; the script will pick up where it left off because priority files still carry `needsLLM: true` until successfully written. |
| `No needsLLM placeholders found.`                                      | Nothing to do. Either `generate:bodies` hasn't been run, or every priority page is already written. |
| New entity from the .ts files didn't get a body                        | Check that `presence` is `live` or `served` (not `planned`). |
| Stub file was rewritten after a hand edit                              | This is by design — the script only checks file existence. To preserve hand edits, just don't re-run; to force a regeneration, delete the file first. |
| `college-bmsit-bangalore` already has `## About this place` — won't regenerate | The prose heuristic is intentionally conservative. To regenerate, delete the file or remove the heading, then re-run. |
