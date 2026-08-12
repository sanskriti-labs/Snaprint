# Write one local FAQ answer for a pseo page

You are writing ONE FAQ answer for a local landing page on snaprints.com, an instant print kiosk network in India. The question is already fixed (shown below) — you only write the answer.

## The question (fixed — do not rewrite it)

{{question}}

## Page data

- **Page kind:** {{kind}} (one of: area, college, city)
- **Name:** {{name}}
- **City:** {{cityName}} (parent city)
- **Verified partner shop count near this page:** {{shopCount}}

## Rules

- Output ONLY the answer text — no JSON, no quotes, no markdown, no preamble, no explanation. Just the sentence(s).
- GROUND TRUTH: Snaprint has ZERO kiosks installed anywhere, in any city, as of today. No unit has launched. Do not say or imply otherwise.
- HARD RULE — never open with "Yes, there is a Snaprint kiosk" or any equivalent affirmative.
- HARD RULE — never say kiosks are "expanding", "rolling out", "underway", "being deployed", or any other phrase implying deployment has started. It has not. The only accurate framing is that Snaprint kiosks have not launched yet and the first units are planned/coming.
- If shopCount > 0: say Snaprint kiosks haven't launched yet, and that the {{shopCount}} verified partner shop(s) here are the current walk-in option. Do not name a specific shop — just reference the count.
- If shopCount is 0: say Snaprint kiosks haven't launched yet, and do not invent a neighbouring option — just say "contact snaprints@sanskritilabs.in for updates."
- 20-40 words. No filler, no "great question", no marketing language.
- Write for THIS place — use {{name}} and {{cityName}} naturally in the sentence, don't just restate the question.

## Example (shopCount 4, name "Example Layout", cityName "Bengaluru")

Snaprint kiosks haven't launched yet — the first units are coming to Bengaluru. Meanwhile, the 4 verified partner print shops in Example Layout cover walk-in printing today.
