/* eslint-disable @next/next/no-img-element */
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar, CheckCircle2, Clock } from "lucide-react";
import { useSession } from "@/modules/client/auth/betterauth/auth-client";
import { usePatientModalStore } from "../../stores/patient-modal-store";
import { Link } from "@/i18n/navigation";

const formatFullDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

function randNumGenTo100() {
  return Math.floor(Math.random() * 100) + 1;
}

const ConfirmedAppointmentMessageModal = ({
  data,
  resetAction,
}: {
  data: any;
  resetAction: () => void;
}) => {
  const session = useSession();
  const closeModal = usePatientModalStore((state) => state.onClose);
  const modalType = usePatientModalStore((state) => state.type);
  const isOpen = usePatientModalStore((state) => state.isOpen);

  const isModalOpen = isOpen && modalType === "confirmedAppointmentMessage";

  if (!session || !isModalOpen) return null;

  function handleCloseModal() {
    resetAction();
    closeModal();
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
      <DialogContent>
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-orange-400/20 rounded-full flex items-center justify-center mb-6 text-orange-400 border border-orange-400/50">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <DialogHeader className="mb-4">
            <DialogTitle asChild>
              <h2 className="text-2xl text-center font-bold">
                Appointment Confirmed!
              </h2>
            </DialogTitle>
            <DialogDescription className="text-center text-muted-foreground">
              Your appointment has been successfully booked.
            </DialogDescription>
          </DialogHeader>

          {/* 3D-ish Illustration Placeholder */}
          <div className="relative w-40 h-40 mx-auto mb-2">
            <img
              src={`https://api.dicebear.com/7.x/bottts/svg?seed=${randNumGenTo100()}&backgroundColor=transparent`}
              alt="Robot Assistant"
              className="w-full h-full drop-shadow-[0_10px_20px_rgba(249,115,22,0.2)]"
            />
            <div className="absolute top-10 -right-4 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-lg transform rotate-12">
              Email Sent!
            </div>
          </div>

          <p className="text-sm text-orange-400 mb-4 flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
            Details sent to your inbox
          </p>

          <div className="rounded-lg p-4 text-left mb-6 border border-zinc-800">
            <h4 className="text-xs font-semibold uppercase tracking-wider mb-3">
              Quick Summary
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="w-5 flex justify-center">
                  <span className=" text-base">👤</span>
                </div>
                <span>{data.selectedDoctor?.name}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="w-5 flex justify-center">
                  <Calendar className="w-3.5 h-3.5" />
                </div>
                <span>
                  {data?.selectedDate && formatFullDate(data?.selectedDate)}
                </span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="w-5 flex justify-center">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <span>{data?.selectedTime}</span>
              </div>
            </div>
          </div>

          <DialogFooter className="flex !flex-col gap-3 w-full">
            <Button
              onClick={() => closeModal()}
              variant="default"
              className="w-full"
              asChild
            >
              <Link href="/bezs/telemedicine/patient/appointments">
                View My Appointments
              </Link>
            </Button>
            <DialogClose asChild>
              <Button variant="secondary" className="w-full">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>

          <p className="text-xs text-muted-foreground mt-4">
            Please arrive 15 minutes early. Need to reschedule? Contact us 24
            hours in advance.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { ConfirmedAppointmentMessageModal };
