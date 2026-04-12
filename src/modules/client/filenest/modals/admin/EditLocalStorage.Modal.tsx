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
import {
  CreateOrUpdateLocalStorageFormSchema,
  TCreateOrUpdateLocalStorageFormSchema,
} from "@/modules/shared/schemas/filenest/filenestValidationSchemas";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { updateLocalStorageConfig } from "../../server-actions/local-storage-action";
import { LocalStorageForm } from "../../forms/modals/admin/LocalStorageForm";

export const EditLocalStorageModal = () => {
  const session = useSession();
  const closeModal = useFilenestAdminStoreModal((state) => state.onClose);
  const modalType = useFilenestAdminStoreModal((state) => state.type);
  const isOpen = useFilenestAdminStoreModal((state) => state.isOpen);
  const localStorageConfigData = useFilenestAdminStoreModal(
    (state) => state.localStorageConfigData
  );

  const isModalOpen = isOpen && modalType === "editLocalStorage";

  const form = useForm<TCreateOrUpdateLocalStorageFormSchema>({
    resolver: zodResolver(CreateOrUpdateLocalStorageFormSchema),
    defaultValues: {
      name: localStorageConfigData?.name || "",
      basePath: localStorageConfigData?.basePath || "",
      maxFileSize: localStorageConfigData?.maxFileSize || 500,
      isActive: localStorageConfigData?.isActive ?? true,
    },
  });

  useEffect(() => {
    if (!localStorageConfigData) return;

    form.reset(localStorageConfigData);
  }, [localStorageConfigData, form]);

  const { execute } = useServerAction(updateLocalStorageConfig, {
    onSuccess({ data }) {
      toast.success(`${data?.name ?? ""} cloud storage edited.`);
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

  async function handleCreateLocalStorage(
    values: TCreateOrUpdateLocalStorageFormSchema
  ) {
    if (!session || !session.data?.user || !session.data.user?.currentOrgId) {
      toast.error("User not authenticated.");
      return;
    }

    if (!localStorageConfigData) {
      toast.error("Local Storage Config not found.");
      return;
    }

    const data = {
      ...values,
      userId: session.data.user.id,
      orgId: session.data.user.currentOrgId,
      id: localStorageConfigData.id,
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
          <DialogTitle>Edit Local Storage</DialogTitle>
          <DialogDescription>
            Edit the local storage details to update this entry in your
            collection.
          </DialogDescription>
        </DialogHeader>
        {!localStorageConfigData || !session ? (
          <p className="text-center py-10">Failed to get Local Storage Data</p>
        ) : (
          <FormProvider {...form}>
            <LocalStorageForm
              onCancel={handleCloseModal}
              onSubmit={handleCreateLocalStorage}
            />
          </FormProvider>
        )}
      </DialogContent>
    </Dialog>
  );
};
