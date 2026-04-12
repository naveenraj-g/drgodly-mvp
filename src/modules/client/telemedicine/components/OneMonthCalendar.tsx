import { useMemo } from "react";
import { addMonths, startOfToday } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

type Props = {
  selectedDate: Date | undefined;
  onSelect: (d: Date | undefined) => void;
};

export function OneMonthCalendar({ selectedDate, onSelect }: Props) {
  const fromDate = useMemo(() => startOfToday(), []);
  const toDate = useMemo(() => addMonths(fromDate, 1), [fromDate]);

  return (
    <div className="rounded-xl border p-2 w-fit">
      <Calendar
        mode="single"
        numberOfMonths={1}
        selected={selectedDate}
        onSelect={onSelect}
        defaultMonth={selectedDate ?? fromDate}
        hidden={{ before: fromDate, after: toDate }}
      />
    </div>
  );
}
