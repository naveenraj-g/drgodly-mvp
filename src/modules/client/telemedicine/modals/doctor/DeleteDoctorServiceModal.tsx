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
import { AlertTriangleIcon, Loader2 } from "lucide-react";
import { useServerAction } from "zsa-react";
import { useDoctorModalStore } from "../../stores/doctor-modal-store";
import { deleteDoctorService } from "../../server-actions/doctorService-action";

export const DeleteDoctorServiceModal = () => {
  const closeModal = useDoctorModalStore((s) => s.onClose);
  const modalType = useDoctorModalStore((s) => s.type);
  const isOpen = useDoctorModalStore((s) => s.isOpen);
  const userId = useDoctorModalStore((s) => s.userId);
  const orgId = useDoctorModalStore((s) => s.orgId);
  const serviceId = useDoctorModalStore((s) => s.serviceId);

  const isModalOpen = isOpen && modalType === "deleteService";

  const { execute, isPending } = useServerAction(deleteDoctorService, {
    onSuccess({ data }) {
      toast.success(`${data?.name ?? ""} service Deleted.`);
      handleCloseModal();
    },
    onError({ err }) {
      toast.error("An Error Occurred!", {
        description: err.message,
      });
    },
  });

  async function handleAppDelete() {
    if (!userId || !orgId || !serviceId) {
      toast.error("Unauthorized", {
        description: "User or Organization or Service information is missing.",
      });
      return;
    }

    await execute({ orgId, serviceId, userId });
  }

  function handleCloseModal() {
    closeModal();
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
      <DialogContent>
        <div className="flex items-start space-x-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
            <AlertTriangleIcon className="h-6 w-6 text-red-600" />
          </div>
          <DialogHeader>
            <DialogTitle>Delete Service</DialogTitle>
            <DialogDescription>
              Deleting this service will permanently remove it from your service
              list and related records.
            </DialogDescription>
          </DialogHeader>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button size="sm" variant="outline" disabled={isPending}>
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleAppDelete} disabled={isPending} size="sm">
            {isPending ? (
              <>
                <Loader2 className="animate-spin" />
                Delete
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
