import React, { useMemo } from "react";
import { Plus, Trash2, Copy, AlertCircle } from "lucide-react";
import { DaySchedule, TimeSlot } from "../../../types/doctor-availability";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { TimeSelect } from "./timeSelect";
import {
  generateTimeOptions,
  validateTimeOrder,
  generateId,
} from "../../../utils";
import { cn } from "@/lib/utils";

interface DayRowProps {
  day: DaySchedule;
  onUpdate: (updatedDay: DaySchedule) => void;
  onCopyToAll: () => void;
}

export const DayRow = ({ day, onUpdate, onCopyToAll }: DayRowProps) => {
  const timeOptions = useMemo(() => generateTimeOptions(15), []);

  const handleToggleDay = (enabled: boolean) => {
    onUpdate({ ...day, isEnabled: enabled });
  };

  const handleAddSlot = () => {
    const newSlot: TimeSlot = {
      id: generateId(),
      start: "09:00",
      end: "17:00",
    };
    onUpdate({ ...day, slots: [...day.slots, newSlot] });
  };

  const handleRemoveSlot = (slotId: string) => {
    onUpdate({
      ...day,
      slots: day.slots.filter((s) => s.id !== slotId),
    });
  };

  const handleTimeChange = (
    slotId: string,
    field: "start" | "end",
    value: string
  ) => {
    const updatedSlots = day.slots.map((slot) => {
      if (slot.id === slotId) {
        const newSlot = { ...slot, [field]: value };
        // Simple validation check
        const isValid = validateTimeOrder(newSlot.start, newSlot.end);
        return {
          ...newSlot,
          error: isValid ? undefined : "Start time must be before end time",
        };
      }
      return slot;
    });
    onUpdate({ ...day, slots: updatedSlots });
  };

  return (
    <div
      className={cn(
        "group relative rounded-xl border p-5 transition-all duration-200",
        day.isEnabled
          ? "bg-card border-border shadow-sm"
          : "bg-muted border-border/50 opacity-80"
      )}
    >
      <div className="flex flex-col flex-wrap sm:flex-row sm:items-start justify-between gap-4">
        {/* Header Section: Day Label & Toggle */}
        <div className="flex items-center justify-between sm:w-48 shrink-0">
          <div className="flex flex-col">
            <span
              className={cn(
                "font-semibold text-base capitalize",
                day.isEnabled ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {day.label.toLocaleLowerCase()}
            </span>

            {day.isEnabled && day.slots.length === 0 && (
              <span className="text-xs text-amber-600 font-medium">
                Unavailable (0 slots)
              </span>
            )}

            {!day.isEnabled && (
              <span className="text-xs text-muted-foreground">Unavailable</span>
            )}
          </div>
          <Switch
            checked={day.isEnabled}
            onCheckedChange={handleToggleDay}
            id={`switch-${day.id}`}
          />
        </div>

        {/* Slots Section */}
        <div className="flex-1 space-y-3">
          {day.isEnabled ? (
            <>
              {day.slots.map((slot, index) => (
                <div
                  key={slot.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-200"
                >
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="w-full sm:w-32">
                      <TimeSelect
                        options={timeOptions}
                        value={slot.start}
                        onChange={(value) =>
                          handleTimeChange(slot.id, "start", value)
                        }
                        className={cn(
                          slot.error &&
                            "border-destructive/50 focus-visible:ring-destructive"
                        )}
                      />
                    </div>
                    <span className="text-muted-foreground text-sm font-medium px-1">
                      to
                    </span>
                    <div className="w-full sm:w-32">
                      <TimeSelect
                        options={timeOptions}
                        value={slot.end}
                        onChange={(value) =>
                          handleTimeChange(slot.id, "end", value)
                        }
                        className={cn(
                          slot.error &&
                            "border-destructive/50 focus-visible:ring-destructive"
                        )}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-2 sm:mt-0 ml-auto sm:ml-0">
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleRemoveSlot(slot.id)}
                      className="text-destructive bg-destructive/10 border border-destructive/20 hover:bg-destructive/20 dark:bg-destructive/15 dark:hover:bg-destructive/25 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>

                    {index === 0 && (
                      <div className="hidden sm:block">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={onCopyToAll}
                          title="Copy this schedule to all days"
                          className="text-muted-foreground hover:text-primary"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  {slot.error && (
                    <div className="w-full flex items-center gap-1 text-destructive text-xs mt-1 sm:hidden">
                      <AlertCircle className="h-3 w-3" />
                      {slot.error}
                    </div>
                  )}
                </div>
              ))}

              <div className="flex items-center gap-3 mt-2">
                <Button variant="outline" size="sm" onClick={handleAddSlot}>
                  <Plus className="h-4 w-4" />
                  Add Time Slot
                </Button>

                {day.slots.some((s) => s.error) && (
                  <span className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Fix invalid times
                  </span>
                )}
              </div>
            </>
          ) : (
            <div className="h-10 flex items-center text-sm text-muted-foreground italic">
              Set as unavailable
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
