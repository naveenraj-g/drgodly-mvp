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
  CreateOrUpdateAppStorageSettingFormSchema,
  TCreateOrUpdateAppStorageSettingFormSchema,
} from "@/modules/shared/schemas/filenest/filenestValidationSchemas";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppSettingForm } from "../../forms/modals/admin/AppSettingForm";
import { createAppStorageSetting } from "../../server-actions/app-storage-setting-action";

export const CreateAppSettingModal = () => {
  const session = useSession();
  const closeModal = useFilenestAdminStoreModal((state) => state.onClose);
  const modalType = useFilenestAdminStoreModal((state) => state.type);
  const isOpen = useFilenestAdminStoreModal((state) => state.isOpen);
  const appSettingsRequiredDatas = useFilenestAdminStoreModal(
    (state) => state.appSettingsRequiredDatas
  );

  const isModalOpen = isOpen && modalType === "createAppSetting";

  const form = useForm({
    resolver: zodResolver(CreateOrUpdateAppStorageSettingFormSchema),
    defaultValues: {
      appId: "",
      appSlug: "",
      name: "",
      type: "LOCAL",
      subFolder: "",
      maxFileSize: 500,
      isActive: false,
      cloudStorageConfigId: null,
      localStorageConfigId: null,
    },
  });

  const { execute } = useServerAction(createAppStorageSetting, {
    onSuccess({ data }) {
      toast.success(`${data?.name ?? ""} app setting created.`);
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

  async function handleCreateAppSetting(
    values: TCreateOrUpdateAppStorageSettingFormSchema
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
          <DialogTitle>Add App Setting</DialogTitle>
          <DialogDescription>
            Fill in the App settings details to add a new one to your
            collection.
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...form}>
          <AppSettingForm
            appSettingsRequiredDatas={appSettingsRequiredDatas}
            onCancel={handleCloseModal}
            onSubmit={handleCreateAppSetting}
          />
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};
