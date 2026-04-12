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
import { Separator } from "@/components/ui/separator";
import {
  CalendarDays,
  Clock,
  User,
  Stethoscope,
  CreditCard,
  MapPin,
  ClipboardList,
  FileText,
} from "lucide-react";
import { format } from "date-fns";
import { useSession } from "@/modules/client/auth/betterauth/auth-client";
import { useAppointmentModalStore } from "../../stores/appointment-modal-store";
import { AppointmentStatusIndicator } from "../../components/AppointmentStatusIndicator";

export function AppointmentViewModal() {
  const session = useSession();
  const closeModal = useAppointmentModalStore((state) => state.onClose);
  const modalType = useAppointmentModalStore((state) => state.type);
  const isOpen = useAppointmentModalStore((state) => state.isOpen);
  const appointment = useAppointmentModalStore(
    (state) => state.appointmentData
  );
  const patientOrDoctor = useAppointmentModalStore(
    (state) => state.patientOrDoctor
  );

  const isModalOpen = isOpen && modalType === "viewAppointment";

  if (!session || !isModalOpen) return null;

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

  const cancelledBy =
    appointment.cancelledBy === patientOrDoctor
      ? "You"
      : appointment.cancelledBy ?? "UNKNOWN";

  return (
    <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold tracking-tight">
            Appointment Overview
          </DialogTitle>
          <DialogDescription className="text-sm font-medium">
            Detailed information about this appointment
          </DialogDescription>
        </DialogHeader>

        {/* Header Row */}
        <div className="mt-2 flex items-center justify-between">
          <h3 className="text-xl font-semibold">{appointment.type}</h3>
          <AppointmentStatusIndicator status={appointment.status} />
        </div>

        {appointment.status === "CANCELLED" && (
          <div className="text-muted-foreground">
            <p>Cancelled by {cancelledBy}</p>
            <p>Reason: {appointment.cancelReason ?? "Not Specified"}</p>
          </div>
        )}

        <Separator className="my-4" />

        {/* Grid Layout */}
        <div className="grid grid-cols-2 gap-6 text-sm">
          {/* Schedule */}
          <div className="space-y-3">
            <p className="text-muted-foreground text-xs font-semibold tracking-wide">
              SCHEDULE
            </p>

            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              <span className="font-medium">
                {format(new Date(appointment.appointmentDate), "PPP")}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="font-medium">{appointment.time}</span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span className="font-medium capitalize">
                {appointment.appointmentMode.toLowerCase()}
              </span>
            </div>
          </div>

          {/* Doctor / Patient */}
          <div className="space-y-3">
            <p className="text-muted-foreground text-xs font-semibold tracking-wide">
              PEOPLE
            </p>

            <div className="flex items-center gap-2">
              <Stethoscope className="h-4 w-4" />
              <span className="font-medium">
                Dr. {appointment.doctor.personal?.fullName}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="font-medium">
                {appointment.patient.personal?.name}
              </span>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Payment */}
        <div className="flex items-center gap-2 text-sm">
          <CreditCard className="h-4 w-4" />
          <span className="text-lg font-semibold">
            {appointment.priceCurrency} {appointment.price}
          </span>
        </div>

        {/* Notes */}
        {appointment.note && (
          <div className="bg-muted/40 mt-4 rounded-xl border p-4 text-sm">
            <p>{appointment.note}</p>
          </div>
        )}

        <DialogFooter className="mt-4 flex items-center justify-between">
          <DialogClose asChild>
            <Button variant="outline" className="rounded-full">
              Close
            </Button>
          </DialogClose>

          <div className="flex gap-2">
            <Button variant="secondary" className="rounded-full">
              <ClipboardList /> AI Intake Report
            </Button>
            <Button className="rounded-full">
              <FileText /> View Full Report
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
