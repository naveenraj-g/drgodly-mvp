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
import { useServerAction } from "zsa-react";
import { deleteAppMenuItem } from "../server-actions/appMenutem-actions";
import { useSession } from "../../auth/betterauth/auth-client";

export const DeleteAppMenuItemModal = () => {
  const session = useSession();
  const closeModal = useAdminModalStore((state) => state.onClose);
  const modalType = useAdminModalStore((state) => state.type);
  const isOpen = useAdminModalStore((state) => state.isOpen);
  const appId = useAdminModalStore((state) => state.appId);
  const appMenuItemId = useAdminModalStore((state) => state.appMenuItemId);

  const isModalOpen = isOpen && modalType === "deleteAppMenuItem";

  const { execute, isPending } = useServerAction(deleteAppMenuItem, {
    onSuccess({ data }) {
      toast.success(`${data?.name ?? ""} menu item Deleted.`);
      handleCloseModal();
    },
    onError({ err }) {
      toast.error("An Error Occurred!", {
        description: err.message,
      });
    },
  });

  async function handleDelete() {
    if (!session) {
      return;
    }

    if (!appId || !appMenuItemId) {
      toast.error("No app id or menu item id found.");
      return;
    }

    await execute({ appId, id: appMenuItemId });
  }

  function handleCloseModal() {
    closeModal();
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Menu Item</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this menu item? This action cannot
            be undone and will remove it from your app menu.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" size="sm" disabled={isPending}>
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleDelete} disabled={isPending} size="sm">
            {isPending ? (
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
