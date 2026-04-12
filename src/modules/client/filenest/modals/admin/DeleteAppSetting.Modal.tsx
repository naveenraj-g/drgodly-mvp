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
import { deleteAppStorageSetting } from "../../server-actions/app-storage-setting-action";

export const DeleteAppSettingModal = () => {
  const session = useSession();
  const closeModal = useFilenestAdminStoreModal((state) => state.onClose);
  const modalType = useFilenestAdminStoreModal((state) => state.type);
  const isOpen = useFilenestAdminStoreModal((state) => state.isOpen);
  const appSettingDataId = useFilenestAdminStoreModal(
    (state) => state.appSettingDataId
  );

  const isModalOpen = isOpen && modalType === "deleteAppSetting";

  const { execute, isPending } = useServerAction(deleteAppStorageSetting, {
    onSuccess({ data }) {
      toast.success(`${data?.name ?? ""} app setting Deleted.`);
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

    if (!appSettingDataId) {
      toast.error("App Setting not found.");
      return;
    }

    await execute({
      id: appSettingDataId,
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
          <DialogTitle>Delete App Setting</DialogTitle>
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
