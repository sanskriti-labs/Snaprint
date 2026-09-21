/**
 * A blank gray placeholder shaped like the content that's about to appear  -- 
 * shown while real data (an image, in practice on this site) loads, so the
 * layout doesn't jump and the wait feels shorter. Purely a `className`-driven
 * box: give it the same size/shape (fixed dimensions, `absolute inset-0`,
 * `rounded-full`, etc.) as the real content and it stays responsive for free,
 * since it just fills whatever space its className gives it.
 */
export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-[#E8E6E0] ${className}`} aria-hidden>
      <div className="animate-shimmer absolute inset-0" />
    </div>
  );
}
