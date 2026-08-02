"use client";

import { cn } from "@/lib/utils";

function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

type TimeSlotsProps = {
  slots: { time: string }[];
  selectedTime: string | null;
  onSelect: (time: string) => void;
  loading: boolean;
};

export function TimeSlots({ slots, selectedTime, onSelect, loading }: TimeSlotsProps) {
  if (loading) {
    return (
      <div className="flex flex-wrap gap-2" aria-live="polite" aria-busy="true">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-11 w-24 animate-pulse rounded-[6px] bg-snap-surface" />
        ))}
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <p className="font-body text-[14px] text-snap-gray">
        No times available that day — try another date.
      </p>
    );
  }

  return (
    <div role="listbox" aria-label="Select a time" className="flex flex-wrap gap-2">
      {slots.map(({ time }) => {
        const isSelected = time === selectedTime;
        return (
          <button
            key={time}
            type="button"
            role="option"
            aria-selected={isSelected}
            onClick={() => onSelect(time)}
            className={cn(
              "rounded-[6px] border px-4 py-2.5 font-body text-[13px] font-medium transition-all duration-150",
              isSelected
                ? "border-snap-red bg-snap-red text-white"
                : "border-snap-border bg-white text-snap-charcoal hover:border-snap-red"
            )}
          >
            {formatTime(time)}
          </button>
        );
      })}
    </div>
  );
}
