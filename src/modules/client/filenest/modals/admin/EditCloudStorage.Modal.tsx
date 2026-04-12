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
import { CloudStorageForm } from "../../forms/modals/admin/CloudStorageForm";
import {
  CreateOrUpdateCloudStorageFormSchema,
  TCreateOrUpdateCloudStorageFormSchema,
} from "@/modules/shared/schemas/filenest/filenestValidationSchemas";
import { updateCloudStorageConfig } from "../../server-actions/cloud-storage-action";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

export const EditCloudStorageModal = () => {
  const session = useSession();
  const closeModal = useFilenestAdminStoreModal((state) => state.onClose);
  const modalType = useFilenestAdminStoreModal((state) => state.type);
  const isOpen = useFilenestAdminStoreModal((state) => state.isOpen);
  const cloudStorageConfigData = useFilenestAdminStoreModal(
    (state) => state.cloudStorageConfigData
  );

  const isModalOpen = isOpen && modalType === "editCloudStorage";

  const form = useForm<TCreateOrUpdateCloudStorageFormSchema>({
    resolver: zodResolver(CreateOrUpdateCloudStorageFormSchema),
    defaultValues: {
      name: cloudStorageConfigData?.name || "",
      vendor: cloudStorageConfigData?.vendor || "AWS_S3",
      region: cloudStorageConfigData?.region || "",
      bucketName: cloudStorageConfigData?.bucketName || "",
      containerName: cloudStorageConfigData?.containerName || "",
      clientId: cloudStorageConfigData?.clientId || "",
      clientSecret: cloudStorageConfigData?.clientSecret || "",
      maxFileSize: cloudStorageConfigData?.maxFileSize || 500,
      isActive: cloudStorageConfigData?.isActive ?? true,
    },
  });

  useEffect(() => {
    if (!cloudStorageConfigData) return;

    form.reset(cloudStorageConfigData);
  }, [cloudStorageConfigData, form]);

  const { execute } = useServerAction(updateCloudStorageConfig, {
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

  async function handleCreateCloudStorage(
    values: TCreateOrUpdateCloudStorageFormSchema
  ) {
    if (!session || !session.data?.user || !session.data.user?.currentOrgId) {
      toast.error("User not authenticated.");
      return;
    }

    if (!cloudStorageConfigData) {
      toast.error("Cloud Storage Config not found.");
      return;
    }

    const data = {
      ...values,
      userId: session.data.user.id,
      orgId: session.data.user.currentOrgId,
      id: cloudStorageConfigData.id,
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
          <DialogTitle>Edit Cloud Storage</DialogTitle>
          <DialogDescription>
            Edit the cloud storage details to update this entry in your
            collection.
          </DialogDescription>
        </DialogHeader>
        {!cloudStorageConfigData || !session ? (
          <p className="text-center py-10">Failed to get Cloud Storage Data</p>
        ) : (
          <FormProvider {...form}>
            <CloudStorageForm
              onCancel={handleCloseModal}
              onSubmit={handleCreateCloudStorage}
            />
          </FormProvider>
        )}
      </DialogContent>
    </Dialog>
  );
};
