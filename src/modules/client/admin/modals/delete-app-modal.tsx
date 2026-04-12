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
import { deleteApp } from "../server-actions/app-actions";
import { useServerAction } from "zsa-react";

export const DeleteAppModal = () => {
  const closeModal = useAdminModalStore((state) => state.onClose);
  const modalType = useAdminModalStore((state) => state.type);
  const isOpen = useAdminModalStore((state) => state.isOpen);
  const appId = useAdminModalStore((state) => state.appId);

  const isModalOpen = isOpen && modalType === "deleteApp";

  const { execute, isPending } = useServerAction(deleteApp, {
    onSuccess({ data }) {
      toast.success(`${data?.name ?? ""} app Deleted.`);
      handleCloseModal();
    },
    onError({ err }) {
      toast.error("An Error Occurred!", {
        description: err.message,
      });
    },
  });

  async function handleAppDelete() {
    if (!appId) {
      toast.error("No app id found.");
      return;
    }

    await execute({ id: appId });
  }

  function handleCloseModal() {
    closeModal();
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete App</DialogTitle>
          <DialogDescription>
            Deleting this app will permanently remove it from your app list and
            related records.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button size="sm" variant="outline" disabled={isPending}>
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleAppDelete} disabled={isPending} size="sm">
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
