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
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useSession } from "@/modules/client/auth/betterauth/auth-client";
import { useServerAction } from "zsa-react";
import { useAppointmentModalStore } from "../../stores/appointment-modal-store";
import { confirmAppointment } from "../../server-actions/appointment-action";

export const ConfirmAppointmentModal = () => {
  const session = useSession();
  const closeModal = useAppointmentModalStore((state) => state.onClose);
  const modalType = useAppointmentModalStore((state) => state.type);
  const isOpen = useAppointmentModalStore((state) => state.isOpen);
  const appointment = useAppointmentModalStore(
    (state) => state.appointmentData
  );

  const isModalOpen = isOpen && modalType === "confirmAppointment";

  const { execute, isPending } = useServerAction(confirmAppointment, {
    onSuccess() {
      toast.success("Appointment Cancelled.");
      handleCloseModal();
    },
    onError({ err }) {
      toast.error("An unexpected error occurred.", {
        description: err.message ?? "Please try again later.",
      });
    },
  });

  async function handleConfirmAppointment() {
    if (!session || !session.data?.user.currentOrgId) {
      return;
    }

    if (!appointment) {
      toast.error("Appointment not found.");
      return;
    }

    await execute({
      orgId: session.data?.user.currentOrgId,
      userId: session.data?.user.id,
      appointmentId: appointment.id,
    });
  }

  function handleCloseModal() {
    closeModal();
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Appointment</DialogTitle>
          <DialogDescription>
            Are you sure you want to Confirm this appointment?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" size="sm" disabled={isPending}>
              Close
            </Button>
          </DialogClose>
          <Button
            disabled={isPending}
            size="sm"
            onClick={handleConfirmAppointment}
          >
            {isPending ? (
              <>
                Confirm <Loader2 className="animate-spin" />
              </>
            ) : (
              "Confirm"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
