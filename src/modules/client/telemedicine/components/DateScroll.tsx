import { useEffect, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type DateScrollerProps = {
  dates: Date[];
  selectedDate: Date | null;
  onSelect: (d: Date) => void;
};

export function DateScroller({
  dates,
  selectedDate,
  onSelect,
}: DateScrollerProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);

  // scroll the selected date into view on change
  useEffect(() => {
    if (!trackRef.current || !selectedDate) return;
    const idx = dates.findIndex(
      (d) => d.toDateString() === selectedDate.toDateString()
    );
    if (idx === -1) return;
    const el = trackRef.current.querySelector<HTMLButtonElement>(
      `[data-date-index="${idx}"]`
    );
    if (el)
      el.scrollIntoView({
        inline: "center",
        block: "nearest",
        behavior: "smooth",
      });
  }, [selectedDate, dates]);

  const scrollBy = (dir: "left" | "right") => {
    const el = trackRef.current;
    if (!el) return;
    const delta = dir === "left" ? -1 : 1;
    const itemWidth = 112; // matches min-w-[112px] below
    el.scrollBy({ left: delta * itemWidth * 3, behavior: "smooth" });
  };

  return (
    <div className="relative">
      {/* Controls (hidden on very small screens to avoid overlap) */}
      <div className="pointer-events-none absolute inset-y-0 -left-5 -right-5 bottom-4 z-10 hidden sm:flex items-center justify-between">
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="pointer-events-auto rounded-full bg-background/70 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/50"
          onClick={() => scrollBy("left")}
          aria-label="Scroll dates left"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="pointer-events-auto rounded-full bg-background/70 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/50"
          onClick={() => scrollBy("right")}
          aria-label="Scroll dates right"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Track */}
      <div
        ref={trackRef}
        className="
          no-scrollbar
          overflow-x-auto
          scroll-smooth
          snap-x snap-mandatory
          pb-2 -mx-2 px-2
        "
        role="listbox"
        aria-label="Available dates"
      >
        <div className="flex gap-2">
          {dates.map((date, idx) => {
            const isSelected =
              selectedDate?.toDateString() === date.toDateString();
            const isToday = new Date().toDateString() === date.toDateString();

            return (
              <Button
                key={idx}
                role="option"
                aria-selected={isSelected}
                data-date-index={idx}
                type="button"
                variant={isSelected ? "default" : "outline"}
                onClick={() => onSelect(date)}
                // Stable width across breakpoints, prevents squish
                className="
                  flex-none snap-start
                  min-w-[112px]  // 7rem
                  sm:min-w-[120px]
                  md:min-w-[128px]
                  h-auto
                  rounded-xl border
                  px-3 py-2
                  flex flex-col items-center justify-center gap-1
                "
              >
                <span
                  className={`
                    text-[10px] font-semibold uppercase tracking-wide
                    ${
                      isSelected
                        ? "text-primary-foreground"
                        : "text-muted-foreground"
                    }
                  `}
                >
                  {isToday
                    ? "Today"
                    : date.toLocaleDateString("en-US", { weekday: "short" })}
                </span>
                <span className="text-base sm:text-lg font-medium">
                  {date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
