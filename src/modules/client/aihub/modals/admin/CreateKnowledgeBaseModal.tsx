"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useAiHubAdminStore } from "../../stores/admin-store";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { KnowledgeBaseForm } from "../../form/admin/KnowledgeBaseForm";

export const CreateOrUpdateKnowledgeBaseFormSchema = z.object({
  name: z.string(),
  description: z.string(),
});
export type TCreateOrUpdateKnowledgeBaseFormSchema = z.infer<
  typeof CreateOrUpdateKnowledgeBaseFormSchema
>;

export const CreateKnowledgeBaseModal = () => {
  const closeModal = useAiHubAdminStore((state) => state.onClose);
  const modalType = useAiHubAdminStore((state) => state.type);
  const isOpen = useAiHubAdminStore((state) => state.isOpen);
  const user = useAiHubAdminStore((state) => state.user);

  const isModalOpen = isOpen && modalType === "createKnowledgeBase";

  const form = useForm({
    resolver: zodResolver(CreateOrUpdateKnowledgeBaseFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  //   const { execute } = useServerAction(createAppStorageSetting, {
  //     onSuccess({ data }) {
  //       toast.success(`${data?.name ?? ""} app setting created.`);
  //       handleCloseModal();
  //     },
  //     onError({ err }) {
  //       const handled = handleInputParseError({
  //         err,
  //         form,
  //         toastMessage: "Form validation failed",
  //         toastDescription: "Please correct the highlighted fields below.",
  //       });

  //       if (handled) return;

  //       toast.error("An unexpected error occurred.", {
  //         description: err.message ?? "Please try again later.",
  //       });
  //     },
  //   });

  async function handleCreateKnowledgeBase(
    values: TCreateOrUpdateKnowledgeBaseFormSchema,
  ) {
    if (!user || !user.id || !user.orgId) {
      return;
    }

    const data = {
      ...values,
      userId: user.id,
      orgId: user.orgId,
    };

    console.log(data);
    toast.warning("coming soon!");

    // await execute(data);
  }

  function handleCloseModal() {
    form.reset();
    closeModal();
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Knowledge Base</DialogTitle>
          <DialogDescription>
            Fill in the Knowledge Base details to add a new one to your
            collection.
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...form}>
          <KnowledgeBaseForm
            onCancel={handleCloseModal}
            onSubmit={handleCreateKnowledgeBase}
          />
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};
