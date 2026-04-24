"use client";

import { useEffect, useRef, useState } from "react";
import { Calendar } from "lucide-react";
import { AppointmentList } from "./appointments/AppointmentList";
import { AppointmentDetails } from "./appointments/AppointmentDetails";
import { DoctorAssistant } from "./DoctorAssistant";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { TAppointments } from "@/modules/shared/entities/models/telemedicine/appointment";

interface DoctorDashboardProps {
  appointments: TAppointments;
}

function DoctorDashboard({ appointments }: DoctorDashboardProps) {
  const [selectedId, setSelectedId] = useState<string | null>(
    appointments[0]?.id ?? null
  );
  const [isSticky, setIsSticky] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedAppointment = appointments.find((a) => a.id === selectedId) ?? null;

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setIsSticky(rect.top <= 64);
      }
    };
    document.addEventListener("scroll", handleScroll);
    return () => document.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      <header className="mb-4">
        <div className="flex items-center gap-2 justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary">
              <Calendar className="size-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Doctor Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Patient appointment management system
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="leading-none font-semibold">Today&apos;s Appointments</h2>
            <p className="text-muted-foreground text-sm">
              {appointments.length} appointment{appointments.length !== 1 ? "s" : ""} scheduled
            </p>
          </div>
        </div>
      </header>

      <main>
        <div className="flex flex-col gap-6">
          <div className={cn("sticky top-16 h-fit z-10")} ref={containerRef}>
            <AppointmentList
              appointments={appointments}
              selectedId={selectedId}
              onSelect={setSelectedId}
              isSticky={isSticky}
            />
          </div>

          <Separator />

          <div className="lg:col-span-3 h-full">
            {selectedAppointment ? (
              <AppointmentDetails appointment={selectedAppointment} />
            ) : (
              <div className="h-full flex items-center justify-center bg-card rounded-lg border p-12">
                <p className="text-muted-foreground">
                  {appointments.length === 0
                    ? "No appointments scheduled for today"
                    : "Select an appointment to view details"}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <DoctorAssistant selectedAppointment={selectedAppointment} />
    </div>
  );
}

export default DoctorDashboard;
