"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAdminModalStore } from "../stores/admin-modal-store";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { authClient } from "../../auth/betterauth/auth-client";
import { useRouter } from "@/i18n/navigation";

export const DeleteUserModal = () => {
  const router = useRouter();
  const closeModal = useAdminModalStore((state) => state.onClose);
  const modalType = useAdminModalStore((state) => state.type);
  const isOpen = useAdminModalStore((state) => state.isOpen);
  const user = useAdminModalStore((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);

  const isModalOpen = isOpen && modalType === "deleteUser";

  async function handleUserDelete() {
    if (!user) {
      toast.error("User not found.");
      return;
    }

    setIsLoading(true);
    await authClient.admin.removeUser(
      {
        userId: user.id,
      },
      {
        onSuccess() {
          toast.success("User deleted.");
          router.refresh();
          setIsLoading(false);
          handleCloseModal();
        },
        onError(ctx) {
          toast.error("Failed to delete user", {
            description: ctx.error.message,
          });
          setIsLoading(false);
        },
      }
    );
  }

  function handleCloseModal() {
    closeModal();
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete User</DialogTitle>
          <DialogDescription>
            Deleting this user will permanently remove it from your app list and
            related records.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button size="sm" variant="outline" disabled={isLoading}>
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleUserDelete} disabled={isLoading} size="sm">
            {isLoading ? (
              <>
                Delete <Loader2 className="animate-spin" />
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
