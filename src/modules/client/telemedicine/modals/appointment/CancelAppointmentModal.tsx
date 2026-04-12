"use client";

import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
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
import { FormTextarea } from "@/modules/shared/custom-form-fields";
import { FieldGroup } from "@/components/ui/field";
import { handleInputParseError } from "@/modules/shared/utils/handleInputParseError";
import { useAppointmentModalStore } from "../../stores/appointment-modal-store";
import { cancelAppointment } from "../../server-actions/appointment-action";
import z from "zod";

const CancelMessageSchema = z.object({
  cancelMessage: z.string().min(1, "Please enter a cancel message.").nullable(),
});
type TCancelMessage = z.infer<typeof CancelMessageSchema>;

export const CancelAppointmentModal = () => {
  const session = useSession();
  const closeModal = useAppointmentModalStore((state) => state.onClose);
  const modalType = useAppointmentModalStore((state) => state.type);
  const isOpen = useAppointmentModalStore((state) => state.isOpen);
  const appointment = useAppointmentModalStore(
    (state) => state.appointmentData
  );

  const isModalOpen = isOpen && modalType === "cancelAppointment";

  const form = useForm<TCancelMessage>({
    resolver: zodResolver(CancelMessageSchema),
    defaultValues: {
      cancelMessage: null,
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const { execute } = useServerAction(cancelAppointment, {
    onSuccess() {
      toast.success("Appointment Cancelled.");
      handleCloseModal();
    },
    onError({ err }) {
      const handled = handleInputParseError({
        err,
        form,
        toastMessage: "Form validation failed",
        toastDescription: "Please correct the highlighted fields below.",
      });

      if (handled) return;

      toast.error("An unexpected error occurred.", {
        description: err.message ?? "Please try again later.",
      });
    },
  });

  async function handleCancelAppointment(values: TCancelMessage) {
    if (!session || !session.data?.user.currentOrgId) {
      return;
    }

    if (!appointment) {
      toast.error("Appointment not found.");
      return;
    }

    await execute({
      cancelReason: values.cancelMessage,
      appointmentId: appointment.id,
      orgId: session.data?.user.currentOrgId,
      userId: session.data?.user.id,
    });
  }

  function handleCloseModal() {
    form.reset();
    closeModal();
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
      <DialogContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleCancelAppointment)}
            className="space-y-5"
          >
            <DialogHeader>
              <DialogTitle>Cancel Appointment</DialogTitle>
              <DialogDescription>
                Are you sure you want to cancel this appointment?
              </DialogDescription>
            </DialogHeader>
            <FieldGroup>
              <FormTextarea
                control={form.control}
                name="cancelMessage"
                label="Please enter the reason for cancelling the appointment. (optional)"
                placeholder="Enter the reason"
              />
            </FieldGroup>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" size="sm" disabled={isSubmitting}>
                  Close
                </Button>
              </DialogClose>
              <Button disabled={isSubmitting} size="sm">
                {isSubmitting ? (
                  <>
                    Cancel <Loader2 className="animate-spin" />
                  </>
                ) : (
                  "Cancel"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
