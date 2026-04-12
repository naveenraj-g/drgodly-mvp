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
import { deleteAppointment } from "../../server-actions/appointment-action";

export const DeleteAppointmentModal = () => {
  const session = useSession();
  const closeModal = useAppointmentModalStore((state) => state.onClose);
  const modalType = useAppointmentModalStore((state) => state.type);
  const isOpen = useAppointmentModalStore((state) => state.isOpen);
  const appointment = useAppointmentModalStore(
    (state) => state.appointmentData
  );

  const isModalOpen = isOpen && modalType === "deleteAppointment";

  const { execute, isPending } = useServerAction(deleteAppointment, {
    onSuccess() {
      toast.success("Appointment Deleted.");
      handleCloseModal();
    },
    onError({ err }) {
      toast.error("An unexpected error occurred.", {
        description: err.message ?? "Please try again later.",
      });
    },
  });

  async function handleDeleteAppointment() {
    if (!session || !session.data?.user.currentOrgId) {
      return;
    }

    if (!appointment) {
      toast.error("Appointment not found.");
      return;
    }

    await execute({
      appointmentId: appointment.id,
      orgId: session.data?.user.currentOrgId,
      userId: session.data?.user.id,
    });
  }

  function handleCloseModal() {
    closeModal();
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Appointment</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this appointment?
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
            onClick={handleDeleteAppointment}
          >
            {isPending ? (
              <>
                Delete <Loader2 className="animate-spin" />
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
