import { CheckCircle2, MessageSquare, Star, UserRound } from "lucide-react";
import { Doctor } from "./types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePatientModalStore } from "@/modules/client/telemedicine/stores/patient-modal-store";
import { getProfileInitials } from "@/modules/shared/helper";
import { cn } from "@/lib/utils";

export const DoctorCard = ({
  doctor,
  selected,
  onSelect,
}: {
  doctor: Doctor;
  selected: boolean;
  onSelect: () => void;
}) => {
  const openModal = usePatientModalStore((s) => s.onOpen);

  return (
    <Card
      onClick={onSelect}
      className={cn(
        "relative p-4 cursor-pointer transition-all hover:shadow-md",
        selected
          ? "border-primary shadow-md bg-primary/5"
          : "hover:border-primary/50 border-border",
      )}
    >
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="size-10 rounded-full border bg-muted flex items-center justify-center text-sm font-semibold uppercase shrink-0">
          {getProfileInitials(doctor.name)}
        </div>

        {/* Core info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-semibold truncate">{doctor.name}</p>
            {selected && (
              <CheckCircle2 className="size-3.5 text-primary shrink-0" />
            )}
          </div>
          <p className="text-xs text-muted-foreground truncate">
            {doctor.speciality}
          </p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Star className="size-3 fill-yellow-400 text-yellow-400 shrink-0" />
            <span className="text-xs font-medium">
              {doctor.ratingAverage ?? "—"}
            </span>
            {doctor.ratingCount != null && (
              <span className="text-xs text-muted-foreground">
                ({doctor.ratingCount})
              </span>
            )}
            {!doctor.available && (
              <Badge
                variant="secondary"
                className="ml-1 text-[10px] px-1.5 h-4"
              >
                Unavailable
              </Badge>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          <Button
            size="icon"
            variant="ghost"
            className="size-7 text-muted-foreground"
            title="View profile"
            onClick={(e) => {
              e.stopPropagation();
              openModal({ type: "doctorProfile", doctorData: doctor });
            }}
          >
            <UserRound className="size-3.5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="size-7 text-muted-foreground"
            title="View reviews"
            onClick={(e) => {
              e.stopPropagation();
              openModal({ type: "doctorReview", doctorData: doctor });
            }}
          >
            <MessageSquare className="size-3.5" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
