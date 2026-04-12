import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { CalendarCheck, CheckCircle2 } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { usePatientModalStore } from "../../stores/patient-modal-store";
import { useSession } from "@/modules/client/auth/betterauth/auth-client";

function IntakeCompleteModal() {
  const session = useSession();
  const closeModal = usePatientModalStore((state) => state.onClose);
  const modalType = usePatientModalStore((state) => state.type);
  const isOpen = usePatientModalStore((state) => state.isOpen);
  const intakeAppointmentId = usePatientModalStore(
    (state) => state.intakeAppointmentId
  );

  const isModalOpen = isOpen && modalType === "intakeComplete";

  if (!session || !isModalOpen || !intakeAppointmentId) return null;

  function handleCloseModal() {
    closeModal();
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="sm:max-w-md border-0 shadow-dialog animate-scale-in">
        <DialogHeader className="text-center sm:text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10 animate-fade-in">
            <CheckCircle2 className="h-8 w-8 text-success" />
          </div>
          <DialogTitle className="text-xl font-semibold text-foreground">
            Intake Session Completed
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-base">
            Great job! Your intake section is now complete. Would you like to
            book an appointment with the doctor?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex flex-col gap-3 sm:flex-col mt-6">
          <Link
            href={`/bezs/telemedicine/patient/appointments/book?id=${intakeAppointmentId}`}
            onClick={handleCloseModal}
            className={cn(
              buttonVariants(),
              "w-full gap-2 h-12 text-base font-medium"
            )}
          >
            <CalendarCheck className="h-5 w-5" />
            Book Appointment
          </Link>
          <Button
            variant="ghost"
            onClick={handleCloseModal}
            className="w-full h-11 text-muted-foreground hover:text-foreground"
          >
            Maybe Later
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default IntakeCompleteModal;
