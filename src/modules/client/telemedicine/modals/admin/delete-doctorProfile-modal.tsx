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
import { useAdminModalStore } from "../../stores/admin-modal-store";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useServerAction } from "zsa-react";
import { deleteDoctorProfile } from "../../server-actions/doctorProfile-actions";

export const DeleteDoctorProfileModal = () => {
  const closeModal = useAdminModalStore((state) => state.onClose);
  const modalType = useAdminModalStore((state) => state.type);
  const isOpen = useAdminModalStore((state) => state.isOpen);
  const doctorProfileId = useAdminModalStore((state) => state.doctorProfileId);

  const isModalOpen = isOpen && modalType === "deleteDoctorProfile";

  const { execute, isPending } = useServerAction(deleteDoctorProfile, {
    onSuccess() {
      toast.success(`Doctor Profile Deleted.`);
      handleCloseModal();
    },
    onError({ err }) {
      toast.error("An Error Occurred!", {
        description: err.message,
      });
    },
  });

  async function handleAppDelete() {
    if (!doctorProfileId) {
      toast.error("Doctor Profile id not found.");
      return;
    }

    await execute({ id: doctorProfileId });
  }

  function handleCloseModal() {
    closeModal();
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Doctor Profile</DialogTitle>
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
