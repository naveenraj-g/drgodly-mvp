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
  CreateOrganizationFormSchema,
  TCreateOrganizationForm,
} from "@/modules/shared/schemas/admin/organizationValidationSchema";
import { createOrganization } from "../server-actions/organization-actions";

export const CreateOrganizationModal = () => {
  const session = useSession();
  const closeModal = useAdminModalStore((state) => state.onClose);
  const modalType = useAdminModalStore((state) => state.type);
  const isOpen = useAdminModalStore((state) => state.isOpen);

  const isModalOpen = isOpen && modalType === "addOrganization";

  const form = useForm<TCreateOrganizationForm>({
    resolver: zodResolver(CreateOrganizationFormSchema),
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

  const { execute } = useServerAction(createOrganization, {
    onSuccess({ data }) {
      toast.success(`${data?.name ?? ""} organization created.`);
      handleCloseModal();
    },
    onError({ err }) {
      toast.error("An Error Occurred!", {
        description: err.message,
      });
    },
  });

  async function handleCreateApp(values: TCreateOrganizationForm) {
    if (!session) {
      return;
    }

    await execute({ ...values });
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
              <DialogTitle>Create Organization</DialogTitle>
              <DialogDescription>
                Add a new organization by providing its basic details below.
              </DialogDescription>
            </DialogHeader>
            <FieldGroup>
              <FormInput
                control={form.control}
                name="name"
                label="Name"
                placeholder="Enter the organization name (e.g., Acme Corp)"
              />

              <FormInput
                control={form.control}
                name="slug"
                label="Slug"
                description="Defines the organization's URL path. Example: /orgs/acme-corp"
                placeholder="Enter a unique slug (e.g., acme-corp)"
              />

              <FormInput
                control={form.control}
                name="logo"
                label="Logo"
                placeholder="Enter the logo image URL (optional)"
              />

              <FormInput
                control={form.control}
                name="metadata"
                label="Meta Data"
                placeholder="Enter additional info or select a type"
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
