"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

function toISODate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDayLabel(d: Date): { weekday: string; day: string } {
  return {
    weekday: d.toLocaleDateString("en-IN", { weekday: "short" }),
    day: d.toLocaleDateString("en-IN", { day: "numeric" }),
  };
}

type DatePickerProps = {
  selectedDate: string | null;
  onSelect: (date: string) => void;
  disabledDates?: string[];
};

export function DatePicker({ selectedDate, onSelect, disabledDates = [] }: DatePickerProps) {
  // Compute the day list client-side after mount so the grid always reflects the
  // visitor's actual "today", independent of build time or server/client timezone
  // divergence (server may render UTC, IST clients are UTC+5:30).
  const [days, setDays] = useState<Date[] | null>(null);

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    setDays(
      Array.from({ length: 30 }, (_, i) => {
        const d = new Date(today);
        d.setDate(d.getDate() + i);
        return d;
      })
    );
  }, []);

  if (!days) {
    return (
      <div
        role="listbox"
        aria-label="Select a date"
        aria-busy="true"
        className="grid grid-cols-5 gap-2 sm:grid-cols-6 md:grid-cols-10"
      >
        {Array.from({ length: 30 }, (_, i) => (
          <div
            key={i}
            className="h-[62px] animate-pulse rounded-[6px] border border-snap-border bg-snap-border/30"
          />
        ))}
      </div>
    );
  }

  return (
    <div
      role="listbox"
      aria-label="Select a date"
      className="grid grid-cols-5 gap-2 sm:grid-cols-6 md:grid-cols-10"
    >
      {days.map((d) => {
        const iso = toISODate(d);
        const { weekday, day } = formatDayLabel(d);
        const isSelected = iso === selectedDate;
        const isDisabled = disabledDates.includes(iso);

        return (
          <button
            key={iso}
            type="button"
            role="option"
            aria-selected={isSelected}
            disabled={isDisabled}
            onClick={() => onSelect(iso)}
            className={cn(
              "flex flex-col items-center gap-1 rounded-[6px] border px-2 py-3 font-body text-[13px] transition-all duration-150",
              isSelected
                ? "border-snap-red bg-snap-red text-white"
                : "border-snap-border bg-white text-snap-charcoal hover:border-snap-red",
              isDisabled && "cursor-not-allowed opacity-30 hover:border-snap-border"
            )}
          >
            <span className="uppercase tracking-wide opacity-70">{weekday}</span>
            <span className="font-display font-bold">{day}</span>
          </button>
        );
      })}
    </div>
  );
}
