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
import { FormInput, FormTextarea } from "@/modules/shared/custom-form-fields";
import { FieldGroup } from "@/components/ui/field";
import {
  CreateRoleValidationSchema,
  TCreateRoleForm,
} from "@/modules/shared/schemas/admin/roleValidationSchema";
import { createRole } from "../server-actions/role-actions";

export const CreateRoleModal = () => {
  const session = useSession();
  const closeModal = useAdminModalStore((state) => state.onClose);
  const modalType = useAdminModalStore((state) => state.type);
  const isOpen = useAdminModalStore((state) => state.isOpen);

  const isModalOpen = isOpen && modalType === "addRole";

  const form = useForm<TCreateRoleForm>({
    resolver: zodResolver(CreateRoleValidationSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const { execute } = useServerAction(createRole, {
    onSuccess({ data }) {
      toast.success(`${data?.name ?? ""} role created.`);
      handleCloseModal();
    },
    onError({ err }) {
      toast.error("An Error Occurred!", {
        description: err.message,
      });
    },
  });

  async function handleCreateRole(values: TCreateRoleForm) {
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
            onSubmit={form.handleSubmit(handleCreateRole)}
            className="space-y-5"
          >
            <DialogHeader>
              <DialogTitle>Create Role</DialogTitle>
              <DialogDescription>
                Add a new global role to your application to manage user access
                and permissions.
              </DialogDescription>
            </DialogHeader>
            <FieldGroup>
              <FormInput
                control={form.control}
                name="name"
                label="Name"
                placeholder="Enter a role name (e.g., Admin, Editor, Viewer)"
              />

              <FormTextarea
                control={form.control}
                name="description"
                label="Description"
                placeholder="Briefly describe the permissions or purpose of this role"
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
