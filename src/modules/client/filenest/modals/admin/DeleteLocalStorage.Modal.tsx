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
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useServerAction } from "zsa-react";
import { useFilenestAdminStoreModal } from "../../stores/admin-store-modal";
import { useSession } from "@/modules/client/auth/betterauth/auth-client";
import { deleteLocalStorageConfig } from "../../server-actions/local-storage-action";

export const DeleteLocalStorageModal = () => {
  const session = useSession();
  const closeModal = useFilenestAdminStoreModal((state) => state.onClose);
  const modalType = useFilenestAdminStoreModal((state) => state.type);
  const isOpen = useFilenestAdminStoreModal((state) => state.isOpen);
  const localStorageconfigId = useFilenestAdminStoreModal(
    (state) => state.localStorageConfigId
  );

  const isModalOpen = isOpen && modalType === "deleteLocalStorage";

  const { execute, isPending } = useServerAction(deleteLocalStorageConfig, {
    onSuccess({ data }) {
      toast.success(`${data?.name ?? ""} cloud storage Deleted.`);
      handleCloseModal();
    },
    onError({ err }) {
      toast.error("An Error Occurred!", {
        description: err.message ?? "Please try again later.",
      });
    },
  });

  async function handleAppDelete() {
    if (!session || !session.data?.user || !session.data.user?.currentOrgId) {
      toast.error("User not authenticated.");
      return;
    }

    if (!localStorageconfigId) {
      toast.error("Cloud Storage Config not found.");
      return;
    }

    await execute({
      id: localStorageconfigId,
      orgId: session.data.user.currentOrgId,
      userId: session.data.user.id,
    });
  }

  function handleCloseModal() {
    closeModal();
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Local Storage</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the
            storage configuration.
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
                <Loader2 className="animate-spin" /> Delete
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
