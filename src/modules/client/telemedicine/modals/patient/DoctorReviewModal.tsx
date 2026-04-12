/* eslint-disable @next/next/no-img-element */
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Star, User } from "lucide-react";
import { useSession } from "@/modules/client/auth/betterauth/auth-client";
import { usePatientModalStore } from "../../stores/patient-modal-store";
import { getProfileInitials } from "@/modules/shared/helper";

const DoctorReviewModal = () => {
  const session = useSession();
  const closeModal = usePatientModalStore((state) => state.onClose);
  const modalType = usePatientModalStore((state) => state.type);
  const isOpen = usePatientModalStore((state) => state.isOpen);
  const doctorData = usePatientModalStore((state) => state.doctorData);

  const isModalOpen = isOpen && modalType === "doctorReview";

  if (!session || !isModalOpen || !doctorData) return null;

  function handleCloseModal() {
    closeModal();
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
      <DialogContent>
        <div className="flex flex-col h-full">
          {/* Header */}
          <DialogHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-2 pr-8">
              <p className="w-12 h-12 rounded-full border flex items-center justify-center text-2xl font-semibold uppercase bg-muted text-foreground">
                {getProfileInitials(doctorData.name)}
              </p>
              <div>
                <DialogTitle asChild>
                  <h3 className="text-lg font-bold mb-1 text-left">
                    Reviews for {doctorData.name}
                  </h3>
                </DialogTitle>
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex items-center text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="ml-1 font-bold">{doctorData.rating}</span>
                  </div>
                  <span className="text-muted-foreground">
                    • {doctorData.reviews.length} total reviews
                  </span>
                </div>
              </div>
            </div>
          </DialogHeader>

          {/* Content - Scrollable */}
          <div className="flex-1 h-full overflow-y-auto py-6 px-2 space-y-6">
            {doctorData.reviews.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No reviews yet for this doctor.
              </div>
            ) : (
              doctorData.reviews.map((review: any) => (
                <div
                  key={review.id}
                  className="border-b border-zinc-300 dark:border-zinc-700 last:border-0 pb-6 last:pb-0"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full border flex items-center justify-center text-zinc-400">
                        <User className="w-4 h-4" />
                      </div>
                      <span className="font-medium">{review.author}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(review.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex text-yellow-500 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < review.rating
                            ? "fill-current"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    &quot;{review.comment}&quot;
                  </p>
                </div>
              ))
            )}
          </div>
          <DialogFooter className="w-full">
            <DialogClose asChild>
              <Button size="sm" className="w-full">
                Close Reviews
              </Button>
            </DialogClose>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { DoctorReviewModal };
