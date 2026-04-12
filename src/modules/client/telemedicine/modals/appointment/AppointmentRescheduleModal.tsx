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
import { Clock, Loader2 } from "lucide-react";
import { useSession } from "@/modules/client/auth/betterauth/auth-client";
import { useAppointmentModalStore } from "../../stores/appointment-modal-store";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TIME_SLOTS } from "../../components/patient/appointments/bookAppointment/data";
import { OneMonthCalendar } from "../../components/OneMonthCalendar";
import { useServerAction } from "zsa-react";
import { rescheduleAppointment } from "../../server-actions/appointment-action";
import { toast } from "sonner";

export function AppointmentRescheduleModal() {
  const session = useSession();
  const closeModal = useAppointmentModalStore((state) => state.onClose);
  const modalType = useAppointmentModalStore((state) => state.type);
  const isOpen = useAppointmentModalStore((state) => state.isOpen);
  const appointment = useAppointmentModalStore(
    (state) => state.appointmentData
  );

  const isModalOpen = isOpen && modalType === "rescheduleAppointment";

  const [selectedDate, setSelectedDate] = useState<Date | null>(
    appointment?.appointmentDate ?? null
  );
  const [selectedTime, setSelectedTime] = useState<string | null>(
    appointment?.time ?? null
  );

  useEffect(() => {
    if (isModalOpen && appointment) {
      setSelectedDate(appointment?.appointmentDate ?? null);
      setSelectedTime(appointment?.time ?? null);
    }
  }, [appointment, isModalOpen]);

  const { execute, isPending } = useServerAction(rescheduleAppointment, {
    onSuccess() {
      toast.success("Appointment rescheduled successfully");
      handleCloseModal();
    },
    onError({ err }) {
      toast.error("An Error Occurred!", {
        description: err.message ?? "Failed to reschedule appointment",
      });
    },
  });

  if (!session || !isModalOpen) return null;

  async function rescheduleAppointmentHandler() {
    if (
      !session ||
      !session.data ||
      !session.data.user.currentOrgId ||
      !appointment
    )
      return;

    if (!selectedDate || !selectedTime) {
      toast.error("Please select a date and time");
      return;
    }

    await execute({
      appointmentId: appointment.id,
      time: selectedTime,
      appointmentDate: selectedDate,
      userId: session.data?.user.id,
      orgId: session.data?.user.currentOrgId,
    });
  }

  function handleCloseModal() {
    closeModal();
  }

  if (!appointment) {
    return (
      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="!max-w-lg">
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
            <DialogDescription>Appointment not found</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold tracking-tight text-left">
            Appointment Overview
          </DialogTitle>
          <DialogDescription className="text-sm font-medium text-left">
            Detailed information about this appointment
          </DialogDescription>
        </DialogHeader>
        <div className="mb-6">
          <Button
            variant="badge"
            className="flex items-center gap-2 rounded-full"
          >
            <span className="text-muted-foreground text-sm">
              Appointment with
            </span>
            <Avatar className="h-6 w-6">
              <AvatarImage src={"https://picsum.photos/seed/jane/200/200"} />
              <AvatarFallback>
                {appointment.doctor.personal?.fullName[0]}
              </AvatarFallback>
            </Avatar>
            <span className="text-foreground text-sm font-semibold">
              Dr. {appointment.doctor.personal?.fullName}
            </span>
          </Button>
        </div>
        <div className="space-y-8 flex flex-col sm:flex-row gap-6">
          {/* Date Scroller */}
          <div className="mb-4">
            <h3 className="font-semibold text-muted-foreground text-sm mb-4">
              Available Dates{" "}
              {selectedDate ? `(${selectedDate.toDateString()})` : null}
            </h3>
            <OneMonthCalendar
              selectedDate={selectedDate ?? undefined}
              onSelect={(d) => {
                setSelectedDate(d ?? null);
                setSelectedTime(null);
              }}
            />
          </div>

          {/* Time Grid */}
          <div
            className={`flex-1 transition-opacity duration-300 mb-0 ${
              !selectedDate
                ? "opacity-50 pointer-events-none grayscale"
                : "opacity-100"
            }`}
          >
            <h3 className="font-semibold mb-4 text-muted-foreground text-sm">
              Available Times
            </h3>
            <div className="grid xxs:grid-cols-[repeat(auto-fit,minmax(90px,1fr))] gap-3">
              {TIME_SLOTS.map((time, idx) => {
                const isBooked = idx % 5 === 3; // Mock booked slots
                const isSelected = selectedTime === time;

                return (
                  <Button
                    variant={isSelected ? "default" : "outline"}
                    key={time}
                    disabled={isBooked}
                    size="sm"
                    onClick={() => setSelectedTime(time)}
                    className={`transition-all flex items-center justify-center gap-2 ${
                      isBooked && "cursor-not-allowed line-through"
                    }`}
                  >
                    <Clock className={`w-3.5 h-3.5`} />
                    {time}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
        <DialogFooter className="flex items-center justify-between">
          <DialogClose asChild>
            <Button
              variant="outline"
              className="rounded-full"
              disabled={isPending}
            >
              Close
            </Button>
          </DialogClose>
          <Button
            className="rounded-full"
            disabled={isPending}
            onClick={rescheduleAppointmentHandler}
          >
            {isPending && <Loader2 className="animate-spin" />} Reschedule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
