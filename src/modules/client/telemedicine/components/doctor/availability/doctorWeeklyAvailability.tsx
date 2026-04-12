"use client";

import { useEffect, useState } from "react";
import { DayRow } from "./dayRow";
import { Button } from "@/components/ui/button";
import { DaySchedule } from "../../../types/doctor-availability";
import { generateId } from "../../../utils";
import { Save, CalendarClock, Info, Copy, Loader2 } from "lucide-react";
import { TGetDoctorWeeklyAvailabilityControllerOutput } from "@/modules/server/telemedicine/interface-adapters/controllers/doctorWeeklyAvailability";
import { TSharedUser } from "@/modules/shared/types";
import type { ZSAError } from "zsa";
import { toast } from "sonner";
import { useServerAction } from "zsa-react";
import { upsertDoctorWeeklyAvailability } from "../../../server-actions/doctorWeeklyAvailability-action";
import { TUpsertFullWeekValidation } from "@/modules/shared/schemas/telemedicine/doctorWeeklyAvailability/doctorWeeklyAvailabilityValidationSchema";

const DAY_ORDER = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];

const INITIAL_SCHEDULE: DaySchedule[] = [
  { id: "sunday", label: "SUNDAY", isEnabled: false, slots: [] },
  {
    id: "monday",
    label: "MONDAY",
    isEnabled: false,
    slots: [],
  },
  {
    id: "tuesday",
    label: "TUESDAY",
    isEnabled: false,
    slots: [],
  },
  {
    id: "wednesday",
    label: "WEDNESDAY",
    isEnabled: false,
    slots: [],
  },
  {
    id: "thursday",
    label: "THURSDAY",
    isEnabled: false,
    slots: [],
  },
  {
    id: "friday",
    label: "FRIDAY",
    isEnabled: false,
    slots: [],
  },
  { id: "saturday", label: "SATURDAY", isEnabled: false, slots: [] },
];

type TProps = {
  data: TGetDoctorWeeklyAvailabilityControllerOutput | null;
  error: ZSAError | null;
  user: TSharedUser;
};

export default function DefaultWeeklyAvailability({
  data,
  user,
  error,
}: TProps) {
  const availableData = data
    ?.map((d) => {
      return {
        id: d.id,
        label: d.dayOfWeek,
        isEnabled: d.isEnabled,
        slots: d.slots.map((s) => {
          return {
            id: s.id,
            start: s.start,
            end: s.end,
          };
        }),
      };
    })
    .sort(
      (a, b) =>
        DAY_ORDER.indexOf(a.label.toUpperCase()) -
        DAY_ORDER.indexOf(b.label.toUpperCase())
    );

  const [schedule, setSchedule] = useState<DaySchedule[]>(
    (!!availableData?.length && availableData) || INITIAL_SCHEDULE
  );

  useEffect(() => {
    if (error) {
      toast.error("An Error Occurred!", {
        description: error.message || "Failed to get data",
      });
    }
  }, [error]);

  const { execute, isPending } = useServerAction(
    upsertDoctorWeeklyAvailability,
    {
      onSuccess() {
        toast.success("Availability saved successfully!");
      },
      onError({ err }) {
        toast.error("An Error Occurred!", {
          description: err.message || "Failed to save data",
        });
      },
    }
  );

  const handleUpdateDay = (updatedDay: DaySchedule) => {
    setSchedule((prev) =>
      prev.map((day) => (day.id === updatedDay.id ? updatedDay : day))
    );
  };

  const handleCopyToAll = (sourceDayId: string) => {
    const sourceDay = schedule.find((d) => d.id === sourceDayId);
    if (!sourceDay) return;

    if (
      confirm(
        `Are you sure you want to copy ${sourceDay.label}'s schedule to all other days?`
      )
    ) {
      setSchedule((prev) =>
        prev.map((day) => {
          if (day.id === sourceDay.id) return day;
          // Create deep copies of slots with new IDs
          const newSlots = sourceDay.slots.map((s) => ({
            ...s,
            id: generateId(),
          }));
          return {
            ...day,
            isEnabled: sourceDay.isEnabled,
            slots: newSlots,
          };
        })
      );
    }
  };

  const handleSave = async () => {
    const payload = schedule.map((d) => {
      return {
        dayOfWeek: d.label,
        isEnabled: d.isEnabled,
        slots: d.slots.map((s) => {
          return {
            start: s.start,
            end: s.end,
          };
        }),
      };
    });

    const data = {
      orgId: user.orgId,
      userId: user.id,
      payload,
    };

    await execute(data as TUpsertFullWeekValidation);
  };

  // Calculate stats for the header
  const totalActiveHours = schedule.reduce((acc, day) => {
    if (!day.isEnabled) return acc;
    return acc + day.slots.length; // Simply counting slots for visual summary
  }, 0);

  return (
    <div>
      {/* Main Container */}
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <CalendarClock className="h-8 w-8 text-primary-600" />
              Weekly Availability
            </h1>
            <p className="mt-2 text-muted-foreground">
              Set your recurring weekly schedule. This will be used as your
              default availability for new appointment slots.
            </p>
          </div>
          <div className="text-right hidden md:block">
            <span className="text-sm font-medium text-muted-foreground">
              Status
            </span>
            <div className="text-nowrap flex items-center gap-2 text-primary bg-primary/10 px-3 border border-primary/20 py-1 rounded-full text-sm font-medium mt-1">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
              {totalActiveHours > 0 ? "Accepting Appointments" : "Unavailable"}
            </div>
          </div>
        </div>

        {/* Schedule Card */}
        <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
          {/* Info Banner */}
          <div className="bg-primary/10 border-b border-primary/20 px-6 py-3 flex gap-3 items-start">
            <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <p className="text-sm text-primary">
              <strong>Tip:</strong> You can copy a day&apos;s schedule to the
              rest of the week by clicking the copy icon{" "}
              <Copy className="inline h-3 w-3 align-[-2px]" /> next to the first
              time slot.
            </p>
          </div>

          <div className="p-6 space-y-4">
            {schedule.map((day) => (
              <DayRow
                key={day.id}
                day={day}
                onUpdate={handleUpdateDay}
                onCopyToAll={() => handleCopyToAll(day.id)}
              />
            ))}
          </div>

          {/* Footer Action */}
          <div className="bg-muted px-6 py-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-sm text-muted-foreground text-center sm:text-left">
              All times are in your local timezone.
            </span>
            <Button
              onClick={handleSave}
              disabled={isPending}
              className="w-full sm:w-auto"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Schedule
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
