"use client";

import { useEffect, useRef, useState } from "react";
import { mockAppointments } from "../../../datas/doctor-dashboard";
import { Calendar } from "lucide-react";
import { AppointmentList } from "./appointments/AppointmentList";
import { AppointmentDetails } from "./appointments/AppointmentDetails";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

function DoctorDashboard() {
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    string | null
  >(mockAppointments[0]?.id || null);
  // const [isInView, setIsInView] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  const selectedAppointment = mockAppointments.find(
    (apt) => apt.id === selectedAppointmentId
  );

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // const observer = new IntersectionObserver(
    //   (entries) => {
    //     const entry = entries[0];
    //     // setIsInView(entry.isIntersecting);
    //   },
    //   {
    //     threshold: 0.01,
    //   }
    // );

    document.addEventListener("scroll", () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setIsSticky(rect.top <= 64);
      }
    });

    // if (containerRef.current) {
    //   observer.observe(containerRef.current);
    // }

    // return () => observer.disconnect();
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
              <h1 className="text-2xl font-bold text-foreground">
                Doctor Dashboard
              </h1>
              <p className="text-sm text-muted-foreground">
                Patient appointment management system
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="leading-none font-semibold">
              Today&apos;s Appointments
            </h2>
            <p className="text-muted-foreground text-sm">
              {mockAppointments.length ?? 0} appointments scheduled
            </p>
          </div>
        </div>
      </header>

      <main>
        <div className="flex flex-col gap-6">
          <div className={cn("sticky top-16 h-fit z-10")} ref={containerRef}>
            <AppointmentList
              appointments={mockAppointments}
              selectedId={selectedAppointmentId}
              onSelect={setSelectedAppointmentId}
              isSticky={isSticky}
            />
          </div>

          <Separator />

          <div className="lg:col-span-3 h-full">
            {selectedAppointment ? (
              <AppointmentDetails appointment={selectedAppointment} />
            ) : (
              <div className="h-full flex items-center justify-center bg-card rounded-lg border">
                <p className="text-muted-foreground">
                  Select an appointment to view details
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default DoctorDashboard;
