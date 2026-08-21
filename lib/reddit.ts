export type RedditPost = {
  id: string;
  title: string;
  preview: string;
  author: string;
  createdUtc: number;
  numComments: number;
  score: number;
  flair: string | null;
  permalink: string;
  isOfficial: boolean;
};

export type RedditFeedResult =
  | { ok: true; posts: RedditPost[] }
  | { ok: false; error: string };

const SUBREDDIT = "Snaprint";
export const REDDIT_SUBREDDIT_URL = `https://www.reddit.com/r/${SUBREDDIT}/`;

const OFFICIAL_FLAIR_RE = /official|announcement|update|launch/i;

export const FEEDBACK_CATEGORIES = [
  {
    id: "question",
    label: "Ask something",
    prefix: "[Question]",
    helper: "Curious how something works? Ask the team and the community directly.",
  },
  {
    id: "feedback",
    label: "Share feedback",
    prefix: "[Feedback]",
    helper: "Good, bad, or somewhere in between — tell us what you actually think.",
  },
  {
    id: "bug",
    label: "Report a problem",
    prefix: "[Problem]",
    helper: "Something broken or confusing? Flag it so we can fix it.",
  },
  {
    id: "idea",
    label: "Suggest an idea",
    prefix: "[Idea]",
    helper: "Missing a feature, or have a better way to do something? We're listening.",
  },
  {
    id: "experience",
    label: "Talk about your experience",
    prefix: "[Experience]",
    helper: "Used a Snaprint kiosk? Share how it went — the good and the rough edges.",
  },
] as const;

export type FeedbackCategoryId = (typeof FEEDBACK_CATEGORIES)[number]["id"];

/** Best-effort pre-fill — Reddit's submit page honors `title`; body pre-fill support
 * varies by client, so we only rely on the title carrying the intent. */
export function buildRedditSubmitUrl(prefix: string, title: string): string {
  const fullTitle = title.trim() ? `${prefix} ${title.trim()}` : prefix;
  const params = new URLSearchParams({ title: fullTitle });
  return `https://www.reddit.com/r/${SUBREDDIT}/submit?${params.toString()}`;
}

function classifyFlair(flair: string | null): string {
  if (!flair) return "general";
  const f = flair.toLowerCase();
  if (OFFICIAL_FLAIR_RE.test(f)) return "announcement";
  if (f.includes("feedback")) return "feedback";
  if (f.includes("question")) return "question";
  if (f.includes("bug") || f.includes("problem")) return "feedback";
  return "general";
}

export { classifyFlair };
