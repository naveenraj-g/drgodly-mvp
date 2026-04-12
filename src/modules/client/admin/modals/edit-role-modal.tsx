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
  CreateRoleValidationSchema as EditRoleValidationSchema,
  TCreateRoleForm as TEditRoleForm,
} from "@/modules/shared/schemas/admin/roleValidationSchema";
import { editRole } from "../server-actions/role-actions";
import { useEffect } from "react";

export const EditRoleModal = () => {
  const session = useSession();
  const closeModal = useAdminModalStore((state) => state.onClose);
  const modalType = useAdminModalStore((state) => state.type);
  const isOpen = useAdminModalStore((state) => state.isOpen);
  const roleData = useAdminModalStore((state) => state.roleData);

  const isModalOpen = isOpen && modalType === "editRole";

  const form = useForm<TEditRoleForm>({
    resolver: zodResolver(EditRoleValidationSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (isModalOpen && roleData) {
      form.reset({
        name: roleData.name,
        description: roleData.description,
      });
    }
  }, [form, isModalOpen, roleData]);

  const {
    formState: { isSubmitting },
  } = form;

  const { execute } = useServerAction(editRole, {
    onSuccess({ data }) {
      toast.success(`${data?.name ?? ""} role edited.`);
      handleCloseModal();
    },
    onError({ err }) {
      toast.error("An Error Occurred!", {
        description: err.message,
      });
    },
  });

  async function handleCreateRole(values: TEditRoleForm) {
    if (!session) {
      return;
    }

    if (!roleData || !roleData?.id) {
      toast.warning("No role data found.");
      return;
    }

    const data = {
      id: roleData?.id,
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
            onSubmit={form.handleSubmit(handleCreateRole)}
            className="space-y-5"
          >
            <DialogHeader>
              <DialogTitle>Edit Role</DialogTitle>
              <DialogDescription>
                Update this global role’s name or description. Changes will
                affect all users assigned to this role.
              </DialogDescription>
            </DialogHeader>
            <FieldGroup>
              <FormInput
                control={form.control}
                name="name"
                label="Name"
                placeholder="Update the role name (e.g., Admin, Editor, Viewer)"
              />

              <FormTextarea
                control={form.control}
                name="description"
                label="Description"
                placeholder="Modify the role’s purpose or permission details"
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
