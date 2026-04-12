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

import { useSession } from "../../auth/betterauth/auth-client";
import { authClient } from "../../auth/betterauth/auth-client";
import { useAdminModalStore } from "../stores/admin-modal-store";

import { FormInput } from "@/modules/shared/custom-form-fields";
import { FieldGroup } from "@/components/ui/field";
import { useRouter } from "@/i18n/navigation";

const CreateUserValidationSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  username: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(16, "Password must be at most 16 characters"),
  role: z.string(),
});

export type TCreateUserForm = z.infer<typeof CreateUserValidationSchema>;

export const CreateUserModal = () => {
  const session = useSession();
  const router = useRouter();
  const closeModal = useAdminModalStore((state) => state.onClose);
  const modalType = useAdminModalStore((state) => state.type);
  const isOpen = useAdminModalStore((state) => state.isOpen);

  const isModalOpen = isOpen && modalType === "addUser";

  const form = useForm<TCreateUserForm>({
    resolver: zodResolver(CreateUserValidationSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      role: "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  async function handleCreateUser(values: TCreateUserForm) {
    if (!session) return;

    const { name, email, password, role, username } = values;

    await authClient.admin.createUser(
      { name, email, password, role, data: { username } },
      {
        onSuccess() {
          toast.success("User created successfully.");
          router.refresh();
          handleCloseModal();
        },
        onError(ctx) {
          toast.error("Failed to create user", {
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
            onSubmit={form.handleSubmit(handleCreateUser)}
            className="space-y-5"
          >
            <DialogHeader>
              <DialogTitle>Create User</DialogTitle>
              <DialogDescription>
                Fill in the details to add a new user to the system.
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
                name="email"
                label="Email"
                placeholder="example@gmail.com"
              />

              <FormInput
                control={form.control}
                name="password"
                label="Password"
                type="password"
                placeholder="••••••••"
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
