"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, Calendar, ChevronRight } from "lucide-react";
import { usePatientModalStore } from "../../stores/patient-modal-store";
import { useSession } from "@/modules/client/auth/betterauth/auth-client";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";

export function BookAppointmentModal() {
  const session = useSession();
  const closeModal = usePatientModalStore((state) => state.onClose);
  const modalType = usePatientModalStore((state) => state.type);
  const isOpen = usePatientModalStore((state) => state.isOpen);

  const isModalOpen = isOpen && modalType === "bookAppointment";

  if (!session || !isModalOpen) return null;

  function handleCloseModal() {
    closeModal();
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="rounded-xl animate-in fade-in zoom-in-95 duration-200">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-2xl font-bold tracking-tight">
            How would you like to book?
          </DialogTitle>
          <DialogDescription>
            Choose the method that works best for you.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Card 1: AI Assistant */}
          <Card
            role="button"
            tabIndex={0}
            onClick={() => {}}
            className="group relative h-full cursor-pointer border hover:border-primary/50 hover:shadow-md transition-all rounded-xl py-0"
          >
            <Link
              href="/bezs/telemedicine/patient/appointments/intake"
              className="py-6"
              onClick={closeModal}
            >
              <CardHeader className="pb-2">
                <div className="mb-3 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 group-hover:scale-110 transition-transform duration-300">
                  <Bot className="h-6 w-6" />
                </div>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    AI Intake Assistant
                  </CardTitle>
                  <Badge
                    variant="secondary"
                    className="border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300"
                  >
                    New
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
                <p className="leading-relaxed">
                  Let our intelligent AI assistant guide you through the process
                  naturally. Perfect if you&apos;re unsure what you need or
                  prefer a conversation.
                </p>
                <div className="flex items-center text-sm font-medium text-primary">
                  Start Chat{" "}
                  <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </CardContent>
            </Link>
          </Card>

          {/* Card 2: Manual Booking */}
          <Card
            role="button"
            tabIndex={0}
            onClick={() => {}}
            className="group relative h-full cursor-pointer border hover:border-primary/50 hover:shadow-md transition-all rounded-xl py-0"
          >
            <Link
              href="/bezs/telemedicine/patient/appointments/book"
              className="py-6"
              onClick={closeModal}
            >
              <CardHeader className="pb-2">
                <div className="mb-3 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  Manual Booking
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
                <p className="leading-relaxed">
                  Fill out the standard form at your own pace. Best if you
                  already know exactly what you need and want to see all
                  available slots at a glance.
                </p>
                <div className="flex items-center text-sm font-medium text-primary">
                  Open Form{" "}
                  <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </CardContent>
            </Link>
          </Card>
        </div>

        <div className="mt-2 flex items-center justify-end gap-2">
          <Button variant="outline" onClick={handleCloseModal}>
            Cancel
          </Button>
        </div>

        <p className="mt-2 text-center text-xs text-muted-foreground">
          By booking, you agree to our{" "}
          <Link href="#" className="underline hover:text-primary">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="#" className="underline hover:text-primary">
            Privacy Policy
          </Link>
          .
        </p>
      </DialogContent>
    </Dialog>
  );
}
