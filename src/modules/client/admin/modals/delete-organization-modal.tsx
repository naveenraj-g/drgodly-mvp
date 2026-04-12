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
import { deleteOrganization } from "../server-actions/organization-actions";

export const DeleteOrganizationModal = () => {
  const closeModal = useAdminModalStore((state) => state.onClose);
  const modalType = useAdminModalStore((state) => state.type);
  const isOpen = useAdminModalStore((state) => state.isOpen);
  const organizationId = useAdminModalStore((state) => state.organizationId);

  const isModalOpen = isOpen && modalType === "deleteOrganization";

  const { execute, isPending } = useServerAction(deleteOrganization, {
    onSuccess({ data }) {
      toast.success(`${data?.name ?? ""} organization Deleted.`);
      handleCloseModal();
    },
    onError({ err }) {
      toast.error("An Error Occurred!", {
        description: err.message,
      });
    },
  });

  async function handleAppDelete() {
    if (!organizationId) {
      toast.error("No organization id found.");
      return;
    }

    await execute({ id: organizationId });
  }

  function handleCloseModal() {
    closeModal();
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Organization</DialogTitle>
          <DialogDescription>
            Deleting this organization will permanently remove it from your
            organization list and related records.
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
