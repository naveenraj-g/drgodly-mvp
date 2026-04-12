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
import { useServerAction } from "zsa-react";
import { FormInput } from "@/modules/shared/custom-form-fields";
import { FieldGroup } from "@/components/ui/field";
import {
  CreateOrganizationFormSchema as EditOrganizationFormSchema,
  TCreateOrganizationForm as TEditOrganizationForm,
} from "@/modules/shared/schemas/admin/organizationValidationSchema";
import { editOrganization } from "../server-actions/organization-actions";
import { useEffect } from "react";

export const EditOrganizationModal = () => {
  const session = useSession();
  const closeModal = useAdminModalStore((state) => state.onClose);
  const modalType = useAdminModalStore((state) => state.type);
  const isOpen = useAdminModalStore((state) => state.isOpen);
  const organizationData = useAdminModalStore(
    (state) => state.organizationData
  );

  const isModalOpen = isOpen && modalType === "editOrganization";

  const form = useForm<TEditOrganizationForm>({
    resolver: zodResolver(EditOrganizationFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      logo: "",
      metadata: "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  useEffect(() => {
    if (isModalOpen && organizationData) {
      form.reset({
        name: organizationData.name,
        slug: organizationData.slug,
        logo: organizationData.logo,
        metadata: organizationData.metadata,
      });
    }
  }, [organizationData, form, isModalOpen]);

  const { execute } = useServerAction(editOrganization, {
    onSuccess({ data }) {
      toast.success(`${data?.name ?? ""} organization edited.`);
      handleCloseModal();
    },
    onError({ err }) {
      toast.error("An Error Occurred!", {
        description: err.message,
      });
    },
  });

  async function handleCreateApp(values: TEditOrganizationForm) {
    if (!session) {
      return;
    }

    if (!organizationData || !organizationData?.id) {
      toast.warning("No organization data found.");
      return;
    }

    const data = {
      id: organizationData?.id,
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
            onSubmit={form.handleSubmit(handleCreateApp)}
            className="space-y-5"
          >
            <DialogHeader>
              <DialogTitle>Edit Organization</DialogTitle>
              <DialogDescription>
                Update the organization details below. Changes will be saved
                immediately after submission.
              </DialogDescription>
            </DialogHeader>
            <FieldGroup>
              <FormInput
                control={form.control}
                name="name"
                label="Name"
                placeholder="Enter the updated organization name (e.g., Acme Corp)"
              />

              <FormInput
                control={form.control}
                name="slug"
                label="Slug"
                description="Defines the organization's URL path. Example: /orgs/acme-corp"
                placeholder="Enter a update the slug (e.g., acme-corp)"
              />

              <FormInput
                control={form.control}
                name="logo"
                label="Logo"
                placeholder="Enter or update the logo image URL (optional)"
              />

              <FormInput
                control={form.control}
                name="metadata"
                label="Meta Data"
                placeholder="Edit or update any additional information"
              />
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
