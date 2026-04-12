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
import { useSession } from "../../auth/betterauth/auth-client";
import { useAdminModalStore } from "../stores/admin-modal-store";
import { AppType } from "../../../server/prisma/generated/main-database";
import { useServerAction } from "zsa-react";
import { createApp } from "../server-actions/app-actions";
import {
  CreateAppValidationSchema,
  TCreateAppForm,
} from "@/modules/shared/schemas/admin/appValidationSchema";
import {
  FormInput,
  FormSelect,
  FormTextarea,
} from "@/modules/shared/custom-form-fields";
import { SelectItem } from "@/components/ui/select";
import { FieldGroup } from "@/components/ui/field";
import { handleInputParseError } from "@/modules/shared/utils/handleInputParseError";

export const CreateAppModal = () => {
  const session = useSession();
  const closeModal = useAdminModalStore((state) => state.onClose);
  const modalType = useAdminModalStore((state) => state.type);
  const isOpen = useAdminModalStore((state) => state.isOpen);

  const isModalOpen = isOpen && modalType === "addApp";

  const form = useForm<TCreateAppForm>({
    resolver: zodResolver(CreateAppValidationSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      type: "platform",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const { execute } = useServerAction(createApp, {
    onSuccess({ data }) {
      toast.success(`${data?.name ?? ""} app created.`);
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

  async function handleCreateApp(values: TCreateAppForm) {
    if (!session) {
      return;
    }

    await execute({ ...values });
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
              <DialogTitle>Create App</DialogTitle>
              <DialogDescription>
                Fill in the app details to add a new one to your collection.
              </DialogDescription>
            </DialogHeader>
            <FieldGroup>
              <FormInput
                control={form.control}
                name="name"
                label="Name"
                placeholder="Enter a descriptive app name (e.g. Project Tracker)"
              />

              <FormInput
                control={form.control}
                name="slug"
                label="Slug"
                description="Used to define the app's name in URL path. Example: admin or telemedicine"
                placeholder="Enter a unique slug (e.g., project-tracker)"
              />

              <FormTextarea
                control={form.control}
                name="description"
                label="Description"
                placeholder="Briefly describe what this app does or its purpose"
              />

              <FormSelect
                control={form.control}
                name="type"
                label="Type"
                placeholder="Select a Type"
                className="!w-fit"
              >
                {Object.keys(AppType).map((k) => (
                  <SelectItem key={k} value={k}>
                    {k}
                  </SelectItem>
                ))}
              </FormSelect>
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
