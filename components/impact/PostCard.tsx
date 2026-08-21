import type { RedditPost } from "@/lib/reddit";

function timeAgo(unixSeconds: number): string {
  const diffMs = Date.now() - unixSeconds * 1000;
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return `${Math.max(mins, 1)}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(unixSeconds * 1000).toLocaleDateString("en-IN", { month: "short", year: "numeric" });
}

export default function PostCard({ post }: { post: RedditPost }) {
  return (
    <a
      href={post.permalink}
      target="_blank"
      rel="noopener noreferrer"
      className="light-card block rounded-2xl p-5 transition-transform hover:-translate-y-0.5 sm:p-6"
    >
      <div className="mb-2.5 flex flex-wrap items-center gap-2">
        {post.isOfficial && (
          <span className="inline-flex items-center gap-1 rounded-full bg-[rgba(230,57,70,0.1)] px-2.5 py-1 font-body text-[10px] font-semibold uppercase tracking-[0.1em] text-[#E63946]">
            Official update
          </span>
        )}
        {post.flair && !post.isOfficial && (
          <span className="inline-flex items-center rounded-full bg-[#F5F5F3] px-2.5 py-1 font-body text-[10px] font-semibold uppercase tracking-[0.1em] text-[#777770]">
            {post.flair}
          </span>
        )}
      </div>
      <h3 className="mb-1.5 font-display text-[15.5px] font-bold leading-snug text-[#111110]">{post.title}</h3>
      {post.preview && (
        <p className="mb-3 line-clamp-2 font-body text-[13px] font-light leading-[1.6] text-[#777770]">{post.preview}</p>
      )}
      <div className="flex items-center gap-3 font-body text-[12px] text-[#AAAAAA]">
        <span>u/{post.author}</span>
        <span>·</span>
        <span>{timeAgo(post.createdUtc)}</span>
        <span>·</span>
        <span className="inline-flex items-center gap-1">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" /></svg>
          {post.numComments}
        </span>
      </div>
    </a>
  );
}
