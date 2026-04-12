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
import { useAdminModalStore } from "../../stores/admin-modal-store";
import { useServerAction } from "zsa-react";
import { FormInput } from "@/modules/shared/custom-form-fields";
import { FieldGroup } from "@/components/ui/field";
import { handleInputParseError } from "@/modules/shared/utils/handleInputParseError";
import {
  CreateDoctorByHPRidSchema,
  TCreateDoctorByHPRid,
} from "@/modules/shared/schemas/telemedicine/doctorProfile/doctorProfileValidationSchema";
import { getDoctorProfileByHPRId } from "../../server-actions/doctorProfile-actions";

export const CreateDoctorByHPRIdModal = () => {
  const session = useSession();
  const closeModal = useAdminModalStore((state) => state.onClose);
  const modalType = useAdminModalStore((state) => state.type);
  const isOpen = useAdminModalStore((state) => state.isOpen);

  const isModalOpen = isOpen && modalType === "addDoctorByHPR";

  const form = useForm<TCreateDoctorByHPRid>({
    resolver: zodResolver(CreateDoctorByHPRidSchema),
    defaultValues: {
      id: "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const { execute } = useServerAction(getDoctorProfileByHPRId, {
    onSuccess() {
      toast.success("Doctor profile fetched successfully!");
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

  async function handleCreateApp(values: TCreateDoctorByHPRid) {
    if (!session) {
      return;
    }

    const [data, error] = await execute({ ...values });
    console.log(data);
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
            onSubmit={form.handleSubmit(handleCreateApp)}
            className="space-y-5"
          >
            <DialogHeader>
              <DialogTitle>Create Doctor Profile</DialogTitle>
              <DialogDescription>
                Enter the doctor’s HPR ID. We will fetch their authenticated
                information from the Healthcare Professional Registry (HPR) and
                use it to create the profile.
              </DialogDescription>
            </DialogHeader>
            <FieldGroup>
              <FormInput
                control={form.control}
                name="id"
                label="HPR ID"
                placeholder="Enter the doctor’s HPR ID"
              />
            </FieldGroup>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" size="sm" disabled={isSubmitting}>
                  Cancel
                </Button>
              </DialogClose>
              <Button disabled={isSubmitting} size="sm">
                {isSubmitting ? (
                  <>
                    Create <Loader2 className="animate-spin" />
                  </>
                ) : (
                  "Create"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
