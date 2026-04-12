"use client";

import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AppType } from "../../../server/prisma/generated/main-database";
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
import { useSession } from "@/modules/client/auth/betterauth/auth-client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  TCreateAppForm as TEditAppForm,
  CreateAppValidationSchema as EditAppValidationFormSchema,
} from "@/modules/shared/schemas/admin/appValidationSchema";
import { useEffect } from "react";
import { editApp } from "../server-actions/app-actions";
import { useServerAction } from "zsa-react";
import {
  FormInput,
  FormSelect,
  FormTextarea,
} from "@/modules/shared/custom-form-fields";
import { SelectItem } from "@/components/ui/select";

export const EditAppModal = () => {
  const session = useSession();
  const closeModal = useAdminModalStore((state) => state.onClose);
  const modalType = useAdminModalStore((state) => state.type);
  const isOpen = useAdminModalStore((state) => state.isOpen);
  const appData = useAdminModalStore((state) => state.appData);

  const isModalOpen = isOpen && modalType === "editApp";

  const form = useForm<TEditAppForm>({
    resolver: zodResolver(EditAppValidationFormSchema),
    defaultValues: {
      name: appData?.name,
      slug: appData?.slug,
      description: appData?.description,
      type: appData?.type,
    },
  });

  useEffect(() => {
    if (isModalOpen && appData) {
      form.reset({
        name: appData.name,
        slug: appData.slug,
        description: appData.description,
        type: appData.type,
      });
    }
  }, [appData, form, isModalOpen]);

  const {
    formState: { isSubmitting },
  } = form;

  const { execute } = useServerAction(editApp, {
    onSuccess({ data }) {
      toast.success(`${data?.name ?? ""} app edited.`);
      handleCloseModal();
    },
    onError({ err }) {
      toast.error("An Error Occurred!", {
        description: err.message,
      });
    },
  });

  async function handleEditUser(values: TEditAppForm) {
    if (!session) {
      return;
    }

    if (!appData || !appData?.id) {
      toast.warning("No app data found.");
      return;
    }

    const data = {
      id: appData?.id,
      ...values,
    };

    await execute({ ...data });
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
            onSubmit={form.handleSubmit(handleEditUser)}
            className="space-y-5"
          >
            <DialogHeader>
              <DialogTitle className="">Edit App</DialogTitle>
              <DialogDescription>
                Modify this application’s information. Changes will be reflected
                in your app list.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-5">
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
                placeholder="Unique identifier, e.g. project-tracker"
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
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" size="sm">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="cursor-pointer"
                disabled={isSubmitting}
                size="sm"
              >
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
