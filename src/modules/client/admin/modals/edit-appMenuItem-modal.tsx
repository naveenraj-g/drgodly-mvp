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
  CreateAppMenuItemFormSchema as EditAppMenuItemFormSchema,
  TCreateAppMenuItemForm as TEditAppMenuItemForm,
} from "@/modules/shared/schemas/admin/appMenuItemValidationSchema";
import { editAppMenuItem } from "../server-actions/appMenutem-actions";
import { useServerAction } from "zsa-react";
import { FieldGroup } from "@/components/ui/field";
import { FormInput, FormTextarea } from "@/modules/shared/custom-form-fields";

export const EditAppMenuItemModal = () => {
  const session = useSession();
  const closeModal = useAdminModalStore((state) => state.onClose);
  const modalType = useAdminModalStore((state) => state.type);
  const isOpen = useAdminModalStore((state) => state.isOpen);
  const appMenuItemData = useAdminModalStore((state) => state.appMenuItemData);

  const isModalOpen = isOpen && modalType === "editAppMenuItem";

  const form = useForm<TEditAppMenuItemForm>({
    resolver: zodResolver(EditAppMenuItemFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      icon: "",
      description: "",
    },
  });

  useEffect(() => {
    if (isModalOpen && appMenuItemData) {
      form.reset({
        name: appMenuItemData.name,
        slug: appMenuItemData.slug,
        description: appMenuItemData.description,
        icon: appMenuItemData.icon,
      });
    }
  }, [appMenuItemData, form, isModalOpen]);

  const {
    formState: { isSubmitting },
  } = form;

  const { execute } = useServerAction(editAppMenuItem, {
    onSuccess({ data }) {
      toast.success(`${data?.name ?? ""} menu item Edited.`);
      handleCloseModal();
    },
    onError({ err }) {
      toast.error("An Error Occurred!", {
        description: err.message,
      });
    },
  });

  async function handleCreateMenuItem(values: TEditAppMenuItemForm) {
    if (!session) {
      return;
    }

    if (!appMenuItemData?.appId || !appMenuItemData?.id) {
      toast.error("No app data found");
      return;
    }

    await execute({
      ...values,
      appId: appMenuItemData.appId,
      id: appMenuItemData.id,
    });

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
              <DialogTitle>Edit Menu Item</DialogTitle>
              <DialogDescription>
                Update the details of this menu item. Changes will be reflected
                in your app menu.
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
                description="Defines the menu item’s URL path. Example: /apps/project-tracker"
                placeholder="Enter or update the slug (e.g., project-tracker)"
              />

              <FormTextarea
                control={form.control}
                name="description"
                label="Description"
                placeholder="Update the summary of what this menu item represents or does"
              />

              <FormInput
                control={form.control}
                name="icon"
                label="Menu Icon"
                placeholder="Enter or update the icon name or identifier"
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
                    Edit <Loader2 className="animate-spin" />
                  </>
                ) : (
                  "Edit"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
