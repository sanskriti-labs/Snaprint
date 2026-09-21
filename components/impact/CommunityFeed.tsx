"use client";

import { useEffect, useState } from "react";
import type { RedditPost } from "@/lib/reddit";
import { REDDIT_SUBREDDIT_URL, classifyFlair } from "@/lib/reddit";
import { Skeleton } from "@/components/ui/Skeleton";
import PostCard from "./PostCard";

const TABS = [
  { id: "latest", label: "Latest" },
  { id: "popular", label: "Popular" },
  { id: "announcement", label: "Announcements" },
  { id: "feedback", label: "Feedback" },
  { id: "question", label: "Questions" },
  { id: "general", label: "General" },
] as const;

type TabId = (typeof TABS)[number]["id"];
type State = { status: "loading" } | { status: "error" } | { status: "ok"; posts: RedditPost[] };

export default function CommunityFeed() {
  const [state, setState] = useState<State>({ status: "loading" });
  const [tab, setTab] = useState<TabId>("latest");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/reddit/feed")
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data.ok) setState({ status: "ok", posts: data.posts });
        else setState({ status: "error" });
      })
      .catch(() => {
        if (!cancelled) setState({ status: "error" });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const posts = state.status === "ok" ? state.posts : [];
  const filtered =
    tab === "latest"
      ? posts
      : tab === "popular"
        ? [...posts].sort((a, b) => b.score - a.score)
        : posts.filter((p) => classifyFlair(p.flair) === tab);

  return (
    <section id="community" className="bg-[#F8F7F4] px-6 py-20 md:px-10 md:py-28">
      <div className="mx-auto max-w-[1000px]">
        <p className="mb-4 font-body text-[11px] font-semibold uppercase tracking-[0.22em] text-[#E63946]">
          Live from r/Snaprint
        </p>
        <h2 className="mb-3 font-display text-[28px] font-extrabold tracking-tight text-[#111110] md:text-[36px]">
          The Snaprint Community
        </h2>
        <p className="mb-8 max-w-[520px] font-body text-[15px] font-light leading-[1.7] text-[#6B6B66]">
          See what people are saying, what's changing, and what's coming next.
        </p>

        <div className="mb-6 flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`rounded-full px-4 py-2 font-body text-[13px] font-medium transition-colors ${
                tab === t.id ? "bg-[#111110] text-white" : "bg-white text-[#6B6B66] hover:text-[#111110]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {state.status === "loading" && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-[150px] rounded-2xl" />
            ))}
          </div>
        )}

        {state.status === "error" && (
          <div className="light-card flex flex-col items-center rounded-2xl px-6 py-14 text-center">
            <p className="mb-2 font-display text-[16px] font-bold text-[#111110]">
              Reddit's taking a moment to respond.
            </p>
            <p className="mb-6 max-w-[360px] font-body text-[13.5px] font-light text-[#6B6B66]">
              The live feed couldn't load just now  --  the community itself is still very much there.
            </p>
            <a
              href={REDDIT_SUBREDDIT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#111110] px-6 py-3 font-display text-[13.5px] font-semibold text-white transition-colors hover:bg-[#E63946]"
            >
              Continue on Reddit
            </a>
          </div>
        )}

        {state.status === "ok" && filtered.length === 0 && (
          <div className="light-card flex flex-col items-center rounded-2xl px-6 py-14 text-center">
            <p className="mb-2 font-display text-[16px] font-bold text-[#111110]">Nothing here yet.</p>
            <p className="mb-6 max-w-[360px] font-body text-[13.5px] font-light text-[#6B6B66]">
              Be the first to start a conversation in this category.
            </p>
            <a
              href={REDDIT_SUBREDDIT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#111110] px-6 py-3 font-display text-[13.5px] font-semibold text-white transition-colors hover:bg-[#E63946]"
            >
              Open r/Snaprint
            </a>
          </div>
        )}

        {state.status === "ok" && filtered.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {filtered.slice(0, 12).map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
