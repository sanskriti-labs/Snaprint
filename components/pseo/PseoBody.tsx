import { bodies, type BodyKind } from "@/content/pseo/bodies";

type Props = {
  kind: BodyKind;
  slug: string;
  city: string;
};

// ---------------------------------------------------------------------------
// Tiny markdown → React renderer.
//
// Handles exactly the subset our hand-written bodies use: ## headings,
// paragraphs (split on blank lines), inline [text](url) links, **bold**.
// No lists, no code, no images  --  the body files don't use them and adding
// support here would just be dead code. ~40 lines, no new deps.
// ---------------------------------------------------------------------------

type Block =
  | { kind: "h2"; text: string }
  | { kind: "p"; text: string };

function parseBlocks(md: string): Block[] {
  const blocks: Block[] = [];
  const paragraphs = md.split(/\n\s*\n/);
  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith("## ")) {
      blocks.push({ kind: "h2", text: trimmed.slice(3).trim() });
    } else {
      blocks.push({ kind: "p", text: trimmed });
    }
  }
  return blocks;
}

// Render a single inline string with **bold** + [text](url) support.
// Returns an array of React nodes. We deliberately keep this naive  -- 
// nested formatting, escaped brackets, etc. don't occur in our bodies.
function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  // Match links first, then bold, in a single alternation.
  const re = /(\[([^\]]+)\]\(([^)]+)\))|(\*\*([^*]+)\*\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let i = 0;
  while ((match = re.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    if (match[1]) {
      // link
      nodes.push(
        <a
          key={`${keyPrefix}-l-${i++}`}
          href={match[3]}
          className="text-[#E63946] underline underline-offset-4"
        >
          {match[2]}
        </a>
      );
    } else if (match[4]) {
      // bold
      nodes.push(<strong key={`${keyPrefix}-b-${i++}`}>{match[5]}</strong>);
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }
  return nodes;
}

export default function PseoBody({ kind, slug, city }: Props) {
  const key = `${kind}-${slug}`;
  const entry = bodies[key];
  if (!entry) return null;

  const blocks = parseBlocks(entry.markdown);

  return (
    <section className="mb-16">
      <div className="prose-snap max-w-none">
        {blocks.map((b, i) => {
          if (b.kind === "h2") {
            return (
              <h2
                key={i}
                className="font-display text-[24px] font-bold mt-10 mb-4 text-[#111110]"
              >
                {b.text}
              </h2>
            );
          }
          return (
            <p
              key={i}
              className="text-[16px] leading-[1.78] text-[#3A3A36] mb-5"
            >
              {renderInline(b.text, `${i}`)}
            </p>
          );
        })}
      </div>
    </section>
  );
}
