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
import { useAdminModalStore } from "../stores/admin-modal-store";
import { useSession } from "../../auth/betterauth/auth-client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import {
  CreateAppMenuItemFormSchema,
  TCreateAppMenuItemForm,
} from "@/modules/shared/schemas/admin/appMenuItemValidationSchema";
import { createAppMenuItem } from "../server-actions/appMenutem-actions";
import { useServerAction } from "zsa-react";
import { FieldGroup } from "@/components/ui/field";
import { FormInput, FormTextarea } from "@/modules/shared/custom-form-fields";

export const CreateAppMenuItemModal = () => {
  const session = useSession();
  const closeModal = useAdminModalStore((state) => state.onClose);
  const modalType = useAdminModalStore((state) => state.type);
  const isOpen = useAdminModalStore((state) => state.isOpen);
  const appId = useAdminModalStore((state) => state.appId) || "";

  const isModalOpen = isOpen && modalType === "addAppMenuItem";

  const form = useForm<TCreateAppMenuItemForm>({
    resolver: zodResolver(CreateAppMenuItemFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      icon: "",
      description: "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const { execute } = useServerAction(createAppMenuItem, {
    onSuccess({ data }) {
      toast.success(`${data?.name ?? ""} menu item created.`);
      handleCloseModal();
    },
    onError({ err }) {
      toast.error("An Error Occurred!", {
        description: err.message,
      });
    },
  });

  async function handleCreateMenuItem(values: TCreateAppMenuItemForm) {
    if (!session) {
      return;
    }

    if (!appId) {
      toast.error("No app id found.");
      return;
    }

    await execute({ ...values, appId });

    handleCloseModal();
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
            onSubmit={form.handleSubmit(handleCreateMenuItem)}
            className="space-y-5"
          >
            <DialogHeader>
              <DialogTitle>Create Menu Item</DialogTitle>
              <DialogDescription>
                Add a new menu item to your app by providing the details below.
              </DialogDescription>
            </DialogHeader>
            <FieldGroup>
              <FormInput
                control={form.control}
                name="name"
                label="Name"
                placeholder="Enter the menu item name (e.g., Project Tracker)"
              />

              <FormInput
                control={form.control}
                name="slug"
                label="Slug"
                description="Used to define the menu item's URL path. Example: /apps/project-tracker"
                placeholder="Enter a unique slug (e.g., project-tracker)"
              />

              <FormTextarea
                control={form.control}
                name="description"
                label="Description"
                placeholder="Provide a short summary of what this menu item represents or does"
              />

              <FormInput
                control={form.control}
                name="icon"
                label="Menu Icon"
                placeholder="Enter the icon name or identifier"
              />
            </FieldGroup>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" size="sm" disabled={isSubmitting}>
                  Cancel
                </Button>
              </DialogClose>
              <Button size="sm" disabled={isSubmitting}>
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
