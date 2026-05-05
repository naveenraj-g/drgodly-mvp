"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Phone,
  Star,
  Clock,
  MonitorSmartphone,
  Users,
} from "lucide-react";
import { usePatientModalStore } from "../../stores/patient-modal-store";
import { getProfileInitials } from "@/modules/shared/helper";

const DoctorProfileModal = () => {
  const closeModal = usePatientModalStore((s) => s.onClose);
  const modalType = usePatientModalStore((s) => s.type);
  const isOpen = usePatientModalStore((s) => s.isOpen);
  const doctor = usePatientModalStore((s) => s.doctorData);

  const isModalOpen = isOpen && modalType === "doctorProfile";

  if (!isModalOpen || !doctor) return null;

  const services: any[] = doctor.services ?? [];

  return (
    <Dialog open={isModalOpen} onOpenChange={closeModal}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-full border bg-muted flex items-center justify-center text-base font-semibold uppercase shrink-0">
              {getProfileInitials(doctor.name)}
            </div>
            <div>
              <DialogTitle className="text-base font-semibold leading-snug">
                {doctor.name}
              </DialogTitle>
              <p className="text-sm text-muted-foreground">{doctor.speciality}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Star className="size-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-medium">
                  {doctor.ratingAverage ?? "—"}
                </span>
                {doctor.ratingCount != null && (
                  <span className="text-xs text-muted-foreground">
                    ({doctor.ratingCount} reviews)
                  </span>
                )}
                <Badge
                  variant={doctor.available ? "secondary" : "outline"}
                  className={`ml-1 text-[10px] px-1.5 h-4 ${
                    doctor.available
                      ? "bg-emerald-100 text-emerald-700"
                      : "text-muted-foreground"
                  }`}
                >
                  {doctor.available ? "Available" : "Unavailable"}
                </Badge>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Contact & location */}
          <div className="space-y-2 text-sm">
            {doctor.location && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="size-3.5 shrink-0" />
                <span>{doctor.location}</span>
              </div>
            )}
            {doctor.mobileNumber && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="size-3.5 shrink-0" />
                <span>{doctor.mobileNumber}</span>
              </div>
            )}
          </div>

          {/* Description */}
          {doctor.description && (
            <>
              <Separator />
              <p className="text-sm text-muted-foreground leading-relaxed">
                {doctor.description}
              </p>
            </>
          )}

          {/* Services */}
          {services.length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Services
                </p>
                <div className="space-y-2">
                  {services.map((svc: any) => (
                    <div
                      key={svc.id}
                      className="flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-2"
                    >
                      <div className="space-y-0.5">
                        <p className="text-sm font-medium">{svc.name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="size-3" />
                          <span>{svc.duration} min</span>
                          {svc.supportedModes?.length > 0 && (
                            <>
                              <MonitorSmartphone className="size-3 ml-1" />
                              <span>
                                {svc.supportedModes
                                  .map((m: string) =>
                                    m === "VIRTUAL" ? "Virtual" : "In-person",
                                  )
                                  .join(", ")}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      {svc.priceAmount != null && (
                        <p className="text-sm font-semibold shrink-0 ml-3">
                          {svc.priceCurrency ?? "$"} {svc.priceAmount}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Reviews count teaser */}
          {doctor.reviews?.length > 0 && (
            <>
              <Separator />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="size-3.5" />
                <span>{doctor.reviews.length} patient reviews</span>
                <Button
                  size="sm"
                  variant="link"
                  className="h-auto p-0 text-xs ml-auto"
                  onClick={() => {
                    closeModal();
                    setTimeout(() => {
                      usePatientModalStore
                        .getState()
                        .onOpen({ type: "doctorReview", doctorData: doctor });
                    }, 150);
                  }}
                >
                  View reviews →
                </Button>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="w-full rounded-full" size="sm">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { DoctorProfileModal };
