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
import { z } from "zod";
import { authClient } from "../../auth/betterauth/auth-client";
import { useAdminModalStore } from "../stores/admin-modal-store";
import { FormInput } from "@/modules/shared/custom-form-fields";
import { FieldGroup } from "@/components/ui/field";
import { useRouter } from "@/i18n/navigation";
import { useEffect } from "react";

const UpdateUserValidationSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  username: z.string().min(3, "Name must be at least 3 characters"),
  role: z.string(),
});

export type TUpdateUserForm = z.infer<typeof UpdateUserValidationSchema>;

export const UpdateUserModal = () => {
  const router = useRouter();
  const closeModal = useAdminModalStore((state) => state.onClose);
  const modalType = useAdminModalStore((state) => state.type);
  const isOpen = useAdminModalStore((state) => state.isOpen);
  const user = useAdminModalStore((state) => state.user);

  const isModalOpen = isOpen && modalType === "editUser";

  const form = useForm<TUpdateUserForm>({
    resolver: zodResolver(UpdateUserValidationSchema),
    defaultValues: {
      name: "",
      username: "",
      role: "",
    },
  });

  useEffect(() => {
    if (user && isModalOpen) {
      form.setValue("name", user.name);
      form.setValue("username", user.username);
      form.setValue("role", user.role);
    }
  }, [form, isModalOpen, user]);

  const {
    formState: { isSubmitting },
  } = form;

  async function handleUpdateUser(values: TUpdateUserForm) {
    if (!user) {
      toast.error("User not found.");
      return;
    }

    const { name, role, username } = values;

    await authClient.admin.updateUser(
      { userId: user.id, data: { name, role, username } },
      {
        onSuccess() {
          toast.success("User updated.");
          router.refresh();
          handleCloseModal();
        },
        onError(ctx) {
          toast.error("Failed to update user", {
            description: ctx.error.message,
          });
        },
      }
    );
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
            onSubmit={form.handleSubmit(handleUpdateUser)}
            className="space-y-5"
          >
            <DialogHeader>
              <DialogTitle>Update User</DialogTitle>
              <DialogDescription>
                Update the details to edit user.
              </DialogDescription>
            </DialogHeader>

            <FieldGroup>
              <FormInput
                control={form.control}
                name="name"
                label="Name"
                placeholder="Enter full name"
              />

              <FormInput
                control={form.control}
                name="username"
                label="User Name"
                placeholder="Enter username"
              />

              <FormInput
                control={form.control}
                name="role"
                label="Role"
                placeholder="Enter role"
              />
            </FieldGroup>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" size="sm" disabled={isSubmitting}>
                  Close
                </Button>
              </DialogClose>

              <Button size="sm" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    Update <Loader2 className="animate-spin" />
                  </>
                ) : (
                  "Update"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
