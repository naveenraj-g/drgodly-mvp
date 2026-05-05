import { useMemo } from "react";
import { addMonths, startOfToday } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import type { Matcher } from "react-day-picker";

type Props = {
  selectedDate: Date | undefined;
  onSelect: (d: Date | undefined) => void;
  disabled?: Matcher | Matcher[];
};

export function OneMonthCalendar({ selectedDate, onSelect, disabled }: Props) {
  const fromDate = useMemo(() => startOfToday(), []);
  const toDate = useMemo(() => addMonths(fromDate, 1), [fromDate]);

  const disabledMatchers: Matcher[] = [
    { before: fromDate, after: toDate },
    ...(disabled ? (Array.isArray(disabled) ? disabled : [disabled]) : []),
  ];

  return (
    <div className="rounded-xl border p-2 w-fit">
      <Calendar
        mode="single"
        numberOfMonths={1}
        selected={selectedDate}
        onSelect={onSelect}
        defaultMonth={selectedDate ?? fromDate}
        disabled={disabledMatchers}
      />
    </div>
  );
}
