"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useSession } from "@/modules/client/auth/betterauth/auth-client";
import { useFilenestAdminStoreModal } from "../../stores/admin-store-modal";
import { useServerAction } from "zsa-react";
import { handleInputParseError } from "@/modules/shared/utils/handleInputParseError";
import { LocalStorageForm } from "../../forms/modals/admin/LocalStorageForm";
import {
  CreateOrUpdateLocalStorageFormSchema,
  TCreateOrUpdateLocalStorageFormSchema,
} from "@/modules/shared/schemas/filenest/filenestValidationSchemas";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createLocalStorageConfig } from "../../server-actions/local-storage-action";

export const CreateLocalStorageModal = () => {
  const session = useSession();
  const closeModal = useFilenestAdminStoreModal((state) => state.onClose);
  const modalType = useFilenestAdminStoreModal((state) => state.type);
  const isOpen = useFilenestAdminStoreModal((state) => state.isOpen);

  const isModalOpen = isOpen && modalType === "createLocalStorage";

  const form = useForm<TCreateOrUpdateLocalStorageFormSchema>({
    resolver: zodResolver(CreateOrUpdateLocalStorageFormSchema),
    defaultValues: {
      name: "",
      basePath: "",
      maxFileSize: 500,
      isActive: true,
    },
  });

  const { execute } = useServerAction(createLocalStorageConfig, {
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

  async function handleCreateCloudStorage(
    values: TCreateOrUpdateLocalStorageFormSchema
  ) {
    if (!session || !session.data?.user || !session.data.user?.currentOrgId) {
      return;
    }

    const data = {
      ...values,
      userId: session.data.user.id,
      orgId: session.data.user.currentOrgId,
    };

    await execute(data);
  }

  function handleCloseModal() {
    form.reset();
    closeModal();
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Local Storage</DialogTitle>
          <DialogDescription>
            Fill in the local storage (vps) details to add a new one to your
            collection.
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...form}>
          <LocalStorageForm
            onCancel={handleCloseModal}
            onSubmit={handleCreateCloudStorage}
          />
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};
