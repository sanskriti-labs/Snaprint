"use client";

import { useState, type ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { FEEDBACK_CATEGORIES, buildRedditSubmitUrl, type FeedbackCategoryId } from "@/lib/reddit";

/**
 * "Share your thoughts"  --  category picker, then an optional inline title
 * before handing off to Reddit's real submit page (pre-filled via `title`).
 * We never claim to post on the visitor's behalf: this is the beautiful
 * fallback the spec calls for, not a simulation of in-page posting.
 */
export default function FeedbackModal({ trigger }: { trigger: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [categoryId, setCategoryId] = useState<FeedbackCategoryId | null>(null);
  const [draftTitle, setDraftTitle] = useState("");

  const category = FEEDBACK_CATEGORIES.find((c) => c.id === categoryId) ?? null;

  const reset = () => {
    setCategoryId(null);
    setDraftTitle("");
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[100] bg-[#111110]/45 data-[state=open]:animate-[fadeIn_0.2s_ease-out]" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-[101] w-[calc(100%-32px)] max-w-[460px] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-7 shadow-[0_20px_60px_rgba(0,0,0,0.25)] focus:outline-none sm:p-8"
          aria-describedby={undefined}
        >
          {!category ? (
            <>
              <Dialog.Title className="mb-1.5 font-display text-[22px] font-bold text-[#111110]">
                What do you want to share?
              </Dialog.Title>
              <p className="mb-6 font-body text-[13.5px] text-[#777770]">
                Pick what fits best  --  you'll finish on Reddit, in r/Snaprint.
              </p>
              <div className="flex flex-col gap-2">
                {FEEDBACK_CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCategoryId(c.id)}
                    className="light-card cursor-pointer rounded-xl px-4 py-3.5 text-left transition-transform hover:-translate-y-0.5"
                  >
                    <span className="block font-display text-[14.5px] font-semibold text-[#111110]">{c.label}</span>
                    <span className="mt-0.5 block font-body text-[12.5px] font-light text-[#777770]">{c.helper}</span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setCategoryId(null)}
                className="mb-4 inline-flex items-center gap-1 font-body text-[12.5px] font-medium text-[#777770] hover:text-[#111110]"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6" /></svg>
                Back
              </button>
              <Dialog.Title className="mb-1.5 font-display text-[20px] font-bold text-[#111110]">{category.label}</Dialog.Title>
              <p className="mb-4 font-body text-[13px] font-light text-[#777770]">{category.helper}</p>
              <label className="mb-1.5 block font-body text-[11px] font-semibold uppercase tracking-[0.1em] text-[#AAAAAA]" htmlFor="impact-draft-title">
                Give it a short title (optional)
              </label>
              <input
                id="impact-draft-title"
                type="text"
                value={draftTitle}
                onChange={(e) => setDraftTitle(e.target.value)}
                placeholder="e.g. Upload flow was confusing on my phone"
                maxLength={200}
                className="mb-5 w-full rounded-lg border border-[rgba(0,0,0,0.1)] px-3.5 py-2.5 font-body text-[14px] text-[#111110] outline-none transition-colors focus:border-[#E63946]"
              />
              <a
                href={buildRedditSubmitUrl(category.prefix, draftTitle)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#E63946] px-6 py-3.5 font-display text-[14px] font-semibold text-white transition-colors hover:bg-[#C1121F]"
              >
                Continue on Reddit
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M7 17L17 7M17 7H9M17 7v8" /></svg>
              </a>
              <p className="mt-4 font-body text-[12px] leading-[1.6] text-[#999994]">
                You'll post as yourself on Reddit  --  we never submit on your behalf. Want to keep your identity
                separate? Reddit accounts can use a username that isn't your real name.
              </p>
            </>
          )}
          <Dialog.Close asChild>
            <button
              type="button"
              aria-label="Close"
              className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full text-[#AAAAAA] transition-colors hover:bg-[#F5F5F3] hover:text-[#111110]"
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
