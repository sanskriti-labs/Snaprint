# Write a unique 400-500 word body for a pseo page

You are writing prose for a local landing page on snaprints.com, an instant print kiosk network in India. Each page must be GENUINELY UNIQUE  --  no template fills, no shuffle-from-pools. Write like a local journalist who knows the place.

## Page data

- **Page kind:** {{kind}}  (one of: area, college, city)
- **Name:** {{name}}
- **City:** {{cityName}}  (parent city)
- **Slug:** {{slug}}
- **Pin codes served:** {{pinCodes}}  (comma-separated, may be empty for colleges)
- **Shop count:** {{shopCount}}  (verified xerox/print shops)
- **Top-rated shop:** {{topShopName}} at {{topShopRating}} stars
- **Existing intro string (anchor  --  do not contradict):** {{intro}}

## Sections to cover (markdown headings, in this order)

### ## About this place
(80-100 words) Local character  --  what kind of place is this. For areas: neighborhood history, residential vs commercial mix, what's it known for. For colleges: the institution's character, what students study, campus size if known. Weave in the pin codes and the verified shop count.

### ## Getting here and around
(60-80 words) Transit (metro stations, bus stops, major roads), parking, how locals navigate.

### ## Why printing demand is high here
(80-100 words) Concrete reasons tied to the place  --  college exam season, office district, government offices, residential density. Use the verified shop count as credibility anchor.

### ## What people typically print here
(60-80 words) Common jobs  --  be specific to the place type.

### ## How Snaprint fits in
(60-80 words) Brief, non-promotional. Link to /book once for shop owners. Link to /print-near/{slug} for students.

## Hard rules

- **400-500 words TOTAL** (count before returning)
- **NO template fills**  --  write each sentence fresh
- **NO repetition** of "verified xerox shops in..." phrases more than twice in the whole piece
- **Use the actual shop name(s)** from the data  --  weave at least one specific shop name into the prose
- **Use the actual pin code(s)**  --  reference at least one
- **Different opening sentence** than any other page you've written  --  vary structure, vocabulary, length
- **No generic filler** like "this vibrant locality offers..." or "in conclusion..."
- Output ONLY the markdown body  --  no preamble, no explanation
