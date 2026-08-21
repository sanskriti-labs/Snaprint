import { NextResponse } from "next/server";
import type { RedditPost, RedditFeedResult } from "@/lib/reddit";

export const revalidate = 300; // 5 min — community feed doesn't need to be real-time

// Reddit throttles/blocks requests without a descriptive User-Agent. Format
// follows Reddit's own recommendation: "platform:app-id:version (by /u/user)".
const USER_AGENT = "web:snaprints-impact:1.0 (by /u/snaprints)";

type RawChild = {
  data: {
    id: string;
    title: string;
    selftext?: string;
    author: string;
    created_utc: number;
    num_comments: number;
    score: number;
    link_flair_text: string | null;
    permalink: string;
    stickied?: boolean;
  };
};

function toPost(raw: RawChild["data"]): RedditPost {
  const flair = raw.link_flair_text;
  return {
    id: raw.id,
    title: raw.title,
    preview: (raw.selftext || "").slice(0, 220).trim(),
    author: raw.author,
    createdUtc: raw.created_utc,
    numComments: raw.num_comments,
    score: raw.score,
    flair,
    permalink: `https://www.reddit.com${raw.permalink}`,
    isOfficial: /official|announcement|update|launch/i.test(flair || ""),
  };
}

async function fetchListing(sort: "hot" | "new"): Promise<RawChild[]> {
  const res = await fetch(`https://www.reddit.com/r/Snaprint/${sort}.json?limit=25`, {
    headers: { "User-Agent": USER_AGENT },
    next: { revalidate },
  });
  if (!res.ok) throw new Error(`Reddit responded ${res.status}`);
  const json = await res.json();
  return json?.data?.children ?? [];
}

export async function GET() {
  try {
    const [hot, fresh] = await Promise.all([fetchListing("hot"), fetchListing("new")]);
    const byId = new Map<string, RedditPost>();
    for (const child of [...hot, ...fresh]) {
      if (child.data.stickied) continue; // skip pinned meta/rules posts
      const post = toPost(child.data);
      if (!byId.has(post.id)) byId.set(post.id, post);
    }
    const posts = Array.from(byId.values()).sort((a, b) => b.createdUtc - a.createdUtc);
    const result: RedditFeedResult = { ok: true, posts };
    return NextResponse.json(result, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[api/reddit/feed] failed to fetch r/Snaprint:", message);
    const result: RedditFeedResult = { ok: false, error: message };
    return NextResponse.json(result, { status: 502 });
  }
}
