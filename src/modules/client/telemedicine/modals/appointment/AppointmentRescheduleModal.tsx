"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, Loader2 } from "lucide-react";
import { useSession } from "@/modules/client/auth/betterauth/auth-client";
import { useAppointmentModalStore } from "../../stores/appointment-modal-store";
import { useEffect, useMemo, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { OneMonthCalendar } from "../../components/OneMonthCalendar";
import { useServerAction } from "zsa-react";
import {
  rescheduleAppointment,
  getBookedSlotsForDoctor,
} from "../../server-actions/appointment-action";
import { getDoctorWeeklyAvailability } from "../../server-actions/doctor-action";
import { toast } from "sonner";
import type { Matcher } from "react-day-picker";

// ── helpers ───────────────────────────────────────────────────────────────────

const DAY_NAMES = [
  "SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY",
  "THURSDAY", "FRIDAY", "SATURDAY",
] as const;

function toMins(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function generateTimeSlots(start: string, end: string, interval = 30): string[] {
  const slots: string[] = [];
  for (let t = toMins(start); t < toMins(end); t += interval) {
    slots.push(
      `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`,
    );
  }
  return slots;
}

type WeeklyAvail = {
  dayOfWeek: string;
  isEnabled: boolean;
  slots: { start: string; end: string }[];
};

// ── component ─────────────────────────────────────────────────────────────────

export function AppointmentRescheduleModal() {
  const session = useSession();
  const closeModal = useAppointmentModalStore((s) => s.onClose);
  const modalType = useAppointmentModalStore((s) => s.type);
  const isOpen = useAppointmentModalStore((s) => s.isOpen);
  const appointment = useAppointmentModalStore((s) => s.appointmentData);

  const isModalOpen = isOpen && modalType === "rescheduleAppointment";

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Doctor availability state
  const [weeklyAvail, setWeeklyAvail] = useState<WeeklyAvail[]>([]);
  const [isFetchingAvail, setIsFetchingAvail] = useState(false);
  const [bookedSlots, setBookedSlots] = useState<Set<string>>(new Set());
  const [isFetchingSlots, setIsFetchingSlots] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (!isModalOpen || !appointment) return;
    setSelectedDate(appointment.appointmentDate ?? null);
    setSelectedTime(appointment.time ?? null);
    setWeeklyAvail([]);
    setBookedSlots(new Set());

    const doctorUserId = appointment.doctor?.userId;
    const orgId = session.data?.session.activeOrganizationId;
    if (!doctorUserId || !orgId || doctorUserId === "AIDOCTOR") return;

    setIsFetchingAvail(true);
    getDoctorWeeklyAvailability({ doctorUserId, orgId })
      .then(([data]) => setWeeklyAvail(data ?? []))
      .finally(() => setIsFetchingAvail(false));
  }, [isModalOpen, appointment, session.data]);

  // Fetch booked slots when date changes
  useEffect(() => {
    if (!selectedDate || !appointment) {
      setBookedSlots(new Set());
      return;
    }
    const doctorUserId = appointment.doctor?.userId;
    const orgId = session.data?.session.activeOrganizationId;
    if (!doctorUserId || !orgId || doctorUserId === "AIDOCTOR") return;

    setIsFetchingSlots(true);
    getBookedSlotsForDoctor({
      doctorUserId,
      orgId,
      date: selectedDate.toISOString(),
    })
      .then(([data]) => setBookedSlots(new Set(data ?? [])))
      .finally(() => setIsFetchingSlots(false));
  }, [selectedDate, appointment, session.data]);

  // Derived: enabled days set for calendar disabled matcher
  const enabledDays = useMemo<Set<string>>(
    () =>
      weeklyAvail.length === 0
        ? new Set(DAY_NAMES) // no availability config → allow all
        : new Set(weeklyAvail.filter((w) => w.isEnabled).map((w) => w.dayOfWeek)),
    [weeklyAvail],
  );

  const calendarDisabled = useMemo<Matcher>(
    () => (date: Date) => !enabledDays.has(DAY_NAMES[date.getDay()]),
    [enabledDays],
  );

  // Derived: time slots for selected date
  const availableTimeSlots = useMemo<string[]>(() => {
    if (!selectedDate || weeklyAvail.length === 0) return [];
    const dayName = DAY_NAMES[selectedDate.getDay()];
    const dayAvail = weeklyAvail.find((w) => w.dayOfWeek === dayName && w.isEnabled);
    if (!dayAvail || dayAvail.slots.length === 0) return [];
    return generateTimeSlots(dayAvail.slots[0].start, dayAvail.slots[0].end);
  }, [selectedDate, weeklyAvail]);

  const { execute, isPending } = useServerAction(rescheduleAppointment, {
    onSuccess() {
      toast.success("Appointment rescheduled successfully");
      closeModal();
    },
    onError({ err }) {
      toast.error("An Error Occurred!", {
        description: err.message ?? "Failed to reschedule appointment",
      });
    },
  });

  if (!session || !isModalOpen) return null;

  async function handleReschedule() {
    if (!session.data?.session.activeOrganizationId || !appointment) return;
    if (!selectedDate || !selectedTime) {
      toast.error("Please select a date and time");
      return;
    }
    await execute({
      appointmentId: appointment.id,
      time: selectedTime,
      appointmentDate: selectedDate,
      userId: session.data.user.id,
      orgId: session.data.session.activeOrganizationId,
    });
  }

  if (!appointment) {
    return (
      <Dialog open={isModalOpen} onOpenChange={closeModal}>
        <DialogContent className="!max-w-lg">
          <DialogHeader>
            <DialogTitle>Reschedule Appointment</DialogTitle>
            <DialogDescription>Appointment not found</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  const doctorName = appointment.doctor.personal?.fullName ?? "Doctor";

  return (
    <Dialog open={isModalOpen} onOpenChange={closeModal}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold tracking-tight text-left">
            Reschedule Appointment
          </DialogTitle>
          <DialogDescription className="text-sm font-medium text-left">
            Pick a new date and time for your appointment
          </DialogDescription>
        </DialogHeader>

        <div className="mb-2">
          <Button variant="badge" className="flex items-center gap-2 rounded-full">
            <span className="text-muted-foreground text-sm">Appointment with</span>
            <Avatar className="h-6 w-6">
              <AvatarFallback>{doctorName[0]}</AvatarFallback>
            </Avatar>
            <span className="text-foreground text-sm font-semibold">
              Dr. {doctorName}
            </span>
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-6">
          {/* Calendar */}
          <div>
            <h3 className="font-semibold text-muted-foreground text-sm mb-3">
              Available Dates{selectedDate ? ` (${selectedDate.toDateString()})` : ""}
            </h3>
            {isFetchingAvail ? (
              <Skeleton className="h-[280px] w-[260px] rounded-xl" />
            ) : (
              <OneMonthCalendar
                selectedDate={selectedDate ?? undefined}
                disabled={calendarDisabled}
                onSelect={(d) => {
                  setSelectedDate(d ?? null);
                  setSelectedTime(null);
                }}
              />
            )}
          </div>

          {/* Time slots */}
          <div
            className={`flex-1 transition-opacity duration-300 ${
              !selectedDate ? "opacity-50 pointer-events-none" : "opacity-100"
            }`}
          >
            <h3 className="font-semibold text-muted-foreground text-sm mb-3">
              Available Times
            </h3>

            {isFetchingSlots ? (
              <div className="grid grid-cols-2 xs:grid-cols-3 gap-2">
                {Array.from({ length: 10 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-full rounded-md" />
                ))}
              </div>
            ) : availableTimeSlots.length === 0 && selectedDate ? (
              <p className="text-sm text-muted-foreground py-4">
                No available slots for this day.
              </p>
            ) : (
              <div className="grid grid-cols-2 xs:grid-cols-3 gap-2">
                {availableTimeSlots.map((time) => {
                  const isBooked = bookedSlots.has(time);
                  const isSelected = selectedTime === time;
                  return (
                    <Button
                      key={time}
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      disabled={isBooked}
                      onClick={() => setSelectedTime(time)}
                      className={`flex items-center justify-center gap-1.5 ${
                        isBooked ? "cursor-not-allowed line-through opacity-50" : ""
                      }`}
                    >
                      <Clock className="w-3 h-3" />
                      {time}
                    </Button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex items-center justify-between">
          <DialogClose asChild>
            <Button variant="outline" className="rounded-full" disabled={isPending}>
              Close
            </Button>
          </DialogClose>
          <Button
            className="rounded-full"
            disabled={isPending || !selectedDate || !selectedTime}
            onClick={handleReschedule}
          >
            {isPending && <Loader2 className="animate-spin" />}
            Reschedule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
