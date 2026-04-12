import { CheckCircle2, MapPin, MessageSquare, Phone, Star } from "lucide-react";
import { Doctor } from "./types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePatientModalStore } from "@/modules/client/telemedicine/stores/patient-modal-store";
import { getProfileInitials } from "@/modules/shared/helper";

export const DoctorCard = ({
  doctor,
  selected,
  onSelect,
}: {
  doctor: Doctor;
  selected: boolean;
  onSelect: () => void;
}) => {
  const openModal = usePatientModalStore((state) => state.onOpen);

  return (
    <Card
      onClick={onSelect}
      className={`relative p-5 cursor-pointer group transition-all hover:shadow-md ${
        selected
          ? "border-primary shadow-md bg-primary/5"
          : "hover:border-primary/50 border-border"
      }`}
    >
      {selected && (
        <div className="bg-primary text-secondary p-1 rounded-full absolute right-5">
          <CheckCircle2 className="w-4 h-4" />
        </div>
      )}
      <div className="flex flex-col md:flex-row gap-4 flex-1">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <p className="w-18 h-18 rounded-full border flex items-center justify-center text-3xl font-semibold uppercase bg-muted text-foreground">
            {getProfileInitials(doctor.name)}
          </p>
        </div>

        {/* Content */}
        <div className="flex-grow space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">{doctor.name}</h3>
              <p className="text-muted-foreground font-medium text-sm">
                {doctor.speciality}
              </p>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-x-4 gap-y-2 text-sm">
            <div className="flex items-center gap-1 text-yellow-500">
              <Star className="w-4 h-4 fill-current" />
              <span className="font-bold">{doctor.ratingAverage}</span>
              <span className="text-muted-foreground">
                ({doctor.ratingCount} reviews)
              </span>
            </div>

            <Button
              size="sm"
              variant="link"
              onClick={(e) => {
                e.stopPropagation();
                openModal({ type: "doctorReview", doctorData: doctor });
              }}
              className="text-xs font-medium text-muted-foreground underline decoration-muted-foreground hover:text-orange-400 hover:decoration-orange-400 transition-colors flex items-center gap-1 !p-0 h-fit"
            >
              <MessageSquare className="w-3 h-3" />
              View Reviews
            </Button>
          </div>

          <div className="grid gap-1 text-sm text-muted-foreground mt-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5" />
              {doctor.location || "Dental Center, New York"}
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5" />
              {doctor.mobileNumber}
            </div>
          </div>

          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
            {doctor.description ||
              "Experienced dental professional providing top-quality care with a gentle touch."}
          </p>
        </div>
      </div>
    </Card>
  );
};
