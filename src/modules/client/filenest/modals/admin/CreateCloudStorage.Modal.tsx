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
import { createCloudStorageConfig } from "../../server-actions/cloud-storage-action";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const CreateCloudStorageModal = () => {
  const session = useSession();
  const closeModal = useFilenestAdminStoreModal((state) => state.onClose);
  const modalType = useFilenestAdminStoreModal((state) => state.type);
  const isOpen = useFilenestAdminStoreModal((state) => state.isOpen);

  const isModalOpen = isOpen && modalType === "createCloudStorage";

  const form = useForm<TCreateOrUpdateCloudStorageFormSchema>({
    resolver: zodResolver(CreateOrUpdateCloudStorageFormSchema),
    defaultValues: {
      name: "",
      vendor: "AWS_S3",
      region: "",
      bucketName: "",
      containerName: "",
      clientId: "",
      clientSecret: "",
      maxFileSize: 500,
      isActive: true,
    },
  });

  const { execute } = useServerAction(createCloudStorageConfig, {
    onSuccess({ data }) {
      toast.success(`${data?.name ?? ""} cloud storage created.`);
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
    closeModal();
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Cloud Storage</DialogTitle>
          <DialogDescription>
            Fill in the cloud storage details to add a new one to your
            collection.
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...form}>
          <CloudStorageForm
            onCancel={handleCloseModal}
            onSubmit={handleCreateCloudStorage}
          />
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};
