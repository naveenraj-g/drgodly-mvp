/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  MapPin,
  Calendar,
  Clock,
  ChevronLeft,
  Filter,
  Loader2,
  Stethoscope,
  Video,
} from "lucide-react";
import { SPECIALTIES } from "./data";
import { Doctor, SelectedService } from "./types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StepIndicator } from "./stepIndicator";
import { DoctorCard } from "./doctorCard";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ConfirmedAppointmentMessageModal } from "@/modules/client/telemedicine/modals/patient";
import { usePatientModalStore } from "@/modules/client/telemedicine/stores/patient-modal-store";
import { TGetDoctorsByOrgOutput } from "@/modules/server/telemedicine/interface-adapters/controllers/doctor";
import { TSharedUser } from "@/modules/shared/types";
import type { ZSAError } from "zsa";
import { toast } from "sonner";
import { ServiceSelector } from "./ServiceSelector";
import { useServerAction } from "zsa-react";
import {
  bookAppointment,
  getBookedSlotsForDoctor,
} from "@/modules/client/telemedicine/server-actions/appointment-action";
import { TBookAppointmentValidation } from "@/modules/shared/schemas/telemedicine/appointment/appointmentValidationSchema";
import { DateScroller } from "../../../DateScroll";
import { useSearchParams } from "next/navigation";
import { getProfileInitials } from "@/modules/shared/helper";

type TProps = {
  doctorsData: TGetDoctorsByOrgOutput | null;
  error: ZSAError | null;
  user: TSharedUser;
};

const DAY_NAMES = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
] as const;

function generateTimeSlots(
  start: string,
  end: string,
  interval = 30,
): string[] {
  const toMins = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };
  const slots: string[] = [];
  for (let t = toMins(start); t < toMins(end); t += interval) {
    slots.push(
      `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`,
    );
  }
  return slots;
}

export function BookAppointment({ doctorsData, error, user }: TProps) {
  const openModal = usePatientModalStore((state) => state.onOpen);
  const closeModal = usePatientModalStore((state) => state.onClose);
  const searchParams = useSearchParams();
  const intakeId = searchParams?.get("id") as string;

  // State
  const [step, setStep] = useState(1);

  // Selection State
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedService, setSelectedService] =
    useState<SelectedService | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Availability state
  const [bookedSlots, setBookedSlots] = useState<Set<string>>(new Set());
  const [isFetchingSlots, setIsFetchingSlots] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");

  // Derived: enabled days for selected doctor
  const enabledDays = useMemo<Set<string>>(() => {
    if (!selectedDoctor) return new Set(DAY_NAMES);
    return new Set(
      selectedDoctor.weeklyAvailabilities
        .filter((w) => w.isEnabled)
        .map((w) => w.dayOfWeek),
    );
  }, [selectedDoctor]);

  // Derived: available time slots for the selected date
  const availableTimeSlots = useMemo<string[]>(() => {
    if (!selectedDoctor || !selectedDate) return [];
    const dayName = DAY_NAMES[selectedDate.getDay()];
    const avail = selectedDoctor.weeklyAvailabilities.find(
      (w) => w.dayOfWeek === dayName && w.isEnabled,
    );
    if (!avail || avail.slots.length === 0) return [];
    // use the first slot's start/end window
    const { start, end } = avail.slots[0];
    return generateTimeSlots(start, end);
  }, [selectedDoctor, selectedDate]);

  // Fetch booked slots whenever doctor + date change
  useEffect(() => {
    if (!selectedDoctor || !selectedDate) {
      setBookedSlots(new Set());
      return;
    }
    setIsFetchingSlots(true);
    getBookedSlotsForDoctor({
      doctorUserId: selectedDoctor.id,
      orgId: user.orgId,
      date: selectedDate.toISOString(),
    })
      .then(([data]) => {
        setBookedSlots(new Set(data ?? []));
      })
      .finally(() => setIsFetchingSlots(false));
  }, [selectedDoctor, selectedDate, user.orgId]);

  useEffect(() => {
    if (error) {
      toast.error("An Error Occurred!", {
        description: "Unable to load doctors data. Please try again later.",
      });
    }
  }, [error]);

  const { execute, isPending } = useServerAction(bookAppointment, {
    onSuccess() {
      toast.success("Appointment booked successfully!");
    },
    onError({ err }) {
      toast.error("An Error Occurred!.", {
        description: err.message || "Failed to book appointment",
      });
    },
  });

  const computedDoctors = useMemo(() => {
    if (!doctorsData) return [];

    const newData = doctorsData.map((doctor) => {
      const {
        id,
        fullName,
        ratingCount,
        ratingAverage,
        mobileNumber,
        location,
        about,
        services,
        weeklyAvailabilities,
        gender,
        speciality,
      } = doctor;
      const newDoctor: Doctor = {
        id,
        name: fullName,
        gender,
        speciality,
        ratingCount,
        ratingAverage,
        location: location ?? null,
        mobileNumber,
        image: null,
        description: about ?? null,
        available: true,
        services: services.map((s) => ({
          ...s,
          supportedModes: s.supportedModes || [],
        })),
        weeklyAvailabilities,
        reviews: [],
      };
      return newDoctor;
    });
    return newData;
  }, [doctorsData]);

  // Computed
  const filteredDoctors = useMemo(() => {
    return computedDoctors?.filter((doc: Doctor) => {
      const matchesSearch =
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.speciality?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSpecialty =
        selectedSpecialty === "All" || doc.speciality === selectedSpecialty;
      return matchesSearch && matchesSpecialty;
    });
  }, [searchQuery, selectedSpecialty]);

  // Generate next 30 days for calendar
  const calendarDates = useMemo(() => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      dates.push(d);
    }
    return dates;
  }, []);

  // Format Date helper
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  function formatCurrency(amount: number, country: string, currency: string) {
    return new Intl.NumberFormat(country, {
      style: "currency",
      currency,
      currencyDisplay: "narrowSymbol",
    }).format(amount);
  }

  const formatFullDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  // Handlers
  const handleNextStep = () => {
    if (step === 1 && selectedDoctor) {
      // Reset service if doctor specialty changes or just for safety
      const availableServices = selectedDoctor.services || [];
      if (
        availableServices.length > 0 &&
        (!selectedService ||
          !availableServices.find((s) => s.id === selectedService.id))
      ) {
        const firstService = availableServices[0];
        setSelectedService({
          id: firstService.id,
          duration: firstService.duration,
          name: firstService.name,
          priceAmount: firstService.priceAmount,
          priceCurrency: firstService.priceCurrency,
          selectedMode: firstService.supportedModes[0] || "VIRTUAL",
        });
      }
      setStep(2);
    } else if (step === 2 && selectedDate && selectedTime && selectedService) {
      setStep(3);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleConfirmBooking = async () => {
    if (
      !selectedDoctor ||
      !selectedService ||
      !selectedDate ||
      !selectedTime ||
      !selectedService.name
    ) {
      toast.error("Please complete all appointment details before confirming.");
      return;
    }

    const data: TBookAppointmentValidation = {
      patientUserId: user.id,
      doctorUserId: selectedDoctor?.id,
      orgId: user.orgId,
      appointmentDate: selectedDate,
      time: selectedTime,
      serviceId: selectedService.id,
      appointmentMode: selectedService.selectedMode,
      note: null,
      intakeId,
    };

    const [, bookAppointmentError] = await execute(data);

    if (bookAppointmentError) return;

    openModal({ type: "confirmedAppointmentMessage" });
  };

  const resetBooking = () => {
    setStep(1);
    setSelectedDoctor(null);
    setSelectedService(null);
    setSelectedDate(null);
    setSelectedTime(null);
    closeModal();
  };

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  return (
    <div className="flex flex-col min-h-[calc(100dvh-10rem)] -mb-6">
      <div className="flex-1">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
            Book an Appointment
          </h1>
          <p className="text-muted-foreground">
            Find and book with verified specialists in your area
          </p>
        </div>

        {/* Stepper */}
        <StepIndicator currentStep={step} />

        <div className="mb-4">
          {/* Step 1: Select Doctor */}
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Filters */}
              <div className="mb-4 flex flex-col md:flex-row gap-4 items-center">
                <InputGroup>
                  <InputGroupInput
                    placeholder="Search name, specialty, condition..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <InputGroupAddon>
                    <Search className="w-5 h-5 text-muted-foreground" />
                  </InputGroupAddon>
                </InputGroup>

                <div className="relative w-full md:w-auto min-w-[200px]">
                  <Select
                    value={selectedSpecialty}
                    onValueChange={(value) => setSelectedSpecialty(value)}
                  >
                    <SelectTrigger className="w-full h-9">
                      <Filter className="w-5 h-5 text-muted-foreground" />
                      <SelectValue placeholder="Select a value" />
                    </SelectTrigger>
                    <SelectContent>
                      {SPECIALTIES.map(
                        (s) =>
                          s && (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ),
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-between items-end mb-4">
                <h2 className="text-xl font-semibold">
                  Choose Your Specialist
                </h2>
                <span className="text-sm text-muted-foreground">
                  {filteredDoctors.length} available
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
                {filteredDoctors.map((doctor) => (
                  <DoctorCard
                    key={doctor.id}
                    doctor={doctor}
                    selected={selectedDoctor?.id === doctor.id}
                    onSelect={() => setSelectedDoctor(doctor)}
                  />
                ))}
                {filteredDoctors.length === 0 && (
                  <Card className="col-span-full text-center border border-dashed">
                    <p>No doctors found matching your criteria.</p>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedSpecialty("All");
                      }}
                      className="mt-2 w-fit mx-auto"
                    >
                      Clear filters
                    </Button>
                  </Card>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Choose Time */}
          {step === 2 && selectedDoctor && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 mb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePrevStep}
                  className="text-muted-foreground self-start"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </Button>
                <Button
                  variant="badge"
                  className="flex items-center gap-2 rounded-full"
                >
                  <span className="text-muted-foreground text-sm">
                    Booking with
                  </span>
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={
                        selectedDoctor.image ||
                        "https://picsum.photos/seed/jane/200/200"
                      }
                    />
                    <AvatarFallback>{selectedDoctor.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-foreground text-sm font-semibold">
                    Dr. {selectedDoctor.name}
                  </span>
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Services */}
                <ServiceSelector
                  formatCurrency={formatCurrency}
                  selectedServiceId={selectedService?.id || null}
                  services={selectedDoctor?.services}
                  onSelect={(service: SelectedService) =>
                    setSelectedService(service)
                  }
                />

                {/* Right: Date & Time */}
                <Card className="lg:col-span-2 space-y-8 py-4 px-4 h-fit">
                  {/* Date Scroller */}
                  <div className="mb-0">
                    <h3 className="font-semibold text-muted-foreground text-sm mb-4">
                      Available Dates{" "}
                      {selectedDate ? `(${selectedDate.toDateString()})` : null}
                    </h3>
                    <DateScroller
                      dates={calendarDates}
                      onSelect={(d) => {
                        setSelectedDate(d);
                        setSelectedTime(null);
                      }}
                      selectedDate={selectedDate}
                      enabledDays={enabledDays}
                    />
                  </div>

                  {/* Time Grid */}
                  <div
                    className={`transition-opacity duration-300 mb-0 ${
                      !selectedDate
                        ? "opacity-50 pointer-events-none grayscale"
                        : "opacity-100"
                    }`}
                  >
                    <h3 className="font-semibold mb-4 text-muted-foreground text-sm">
                      Available Times
                    </h3>
                    {isFetchingSlots ? (
                      <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                        {Array.from({ length: 10 }).map((_, i) => (
                          <Skeleton key={i} className="h-9 w-full rounded-md" />
                        ))}
                      </div>
                    ) : availableTimeSlots.length === 0 ? (
                      <p className="text-sm text-muted-foreground py-4">
                        No available slots for this day.
                      </p>
                    ) : (
                      <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                        {availableTimeSlots.map((time) => {
                          const isBooked = bookedSlots.has(time);
                          const isSelected = selectedTime === time;
                          return (
                            <Button
                              variant={isSelected ? "default" : "outline"}
                              key={time}
                              disabled={isBooked}
                              onClick={() => setSelectedTime(time)}
                              className={`transition-all flex items-center justify-center gap-2 ${
                                isBooked
                                  ? "cursor-not-allowed line-through opacity-50"
                                  : ""
                              }`}
                            >
                              <Clock className="w-3.5 h-3.5" />
                              {time}
                            </Button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* Step 3: Confirm */}
          {step === 3 &&
            selectedDoctor &&
            selectedService &&
            selectedDate &&
            selectedTime && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
                <div className="mb-3">
                  <h2 className="text-xl font-bold">Confirm Your Appointment</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Review the details below before confirming
                  </p>
                </div>

                <Card className="overflow-hidden">
                  {/* Hero */}
                  <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent px-4 py-3 border-b">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-background border-2 border-primary/20 flex items-center justify-center text-base font-bold text-primary shadow-sm shrink-0">
                        {getProfileInitials(selectedDoctor.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] text-muted-foreground">Appointment with</p>
                        <h3 className="font-bold text-sm truncate">{selectedDoctor.name}</h3>
                        {selectedDoctor.speciality && (
                          <p className="text-xs text-muted-foreground truncate">
                            {selectedDoctor.speciality}
                          </p>
                        )}
                      </div>
                      <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-full px-2.5 py-0.5 shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Ready to Book
                      </div>
                    </div>
                  </div>

                  {/* Detail tiles */}
                  <div className="p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {/* Service */}
                      <div className="flex items-start gap-2.5 p-3 rounded-lg bg-muted/40 border border-border/60">
                        <div className="p-1.5 rounded-md bg-background border shadow-xs shrink-0">
                          <Stethoscope className="w-3.5 h-3.5 text-muted-foreground" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Service</p>
                          <p className="font-semibold text-sm truncate">{selectedService.name}</p>
                          <p className="text-xs text-muted-foreground">{selectedService.duration} min</p>
                        </div>
                      </div>

                      {/* Mode */}
                      <div className="flex items-start gap-2.5 p-3 rounded-lg bg-muted/40 border border-border/60">
                        <div className="p-1.5 rounded-md bg-background border shadow-xs shrink-0">
                          {selectedService.selectedMode === "VIRTUAL"
                            ? <Video className="w-3.5 h-3.5 text-muted-foreground" />
                            : <MapPin className="w-3.5 h-3.5 text-muted-foreground" />}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Mode</p>
                          <p className="font-semibold text-sm">
                            {selectedService.selectedMode === "VIRTUAL" ? "Virtual" : "In-Person"}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {selectedService.selectedMode === "VIRTUAL"
                              ? "Online video call"
                              : selectedDoctor.location || "At clinic"}
                          </p>
                        </div>
                      </div>

                      {/* Date */}
                      <div className="flex items-start gap-2.5 p-3 rounded-lg bg-muted/40 border border-border/60">
                        <div className="p-1.5 rounded-md bg-background border shadow-xs shrink-0">
                          <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Date</p>
                          <p className="font-semibold text-sm">{formatFullDate(selectedDate)}</p>
                        </div>
                      </div>

                      {/* Time */}
                      <div className="flex items-start gap-2.5 p-3 rounded-lg bg-muted/40 border border-border/60">
                        <div className="p-1.5 rounded-md bg-background border shadow-xs shrink-0">
                          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Time</p>
                          <p className="font-semibold text-sm">{selectedTime}</p>
                        </div>
                      </div>
                    </div>

                    {/* Price */}
                    {selectedService.priceAmount && selectedService.priceCurrency && (
                      <div className="mt-2 flex items-center justify-between px-3 py-2.5 rounded-lg bg-primary/5 border border-primary/15">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total Amount</p>
                          <p className="text-xs text-muted-foreground">Due at appointment</p>
                        </div>
                        <p className="text-xl font-bold text-primary">
                          {formatCurrency(selectedService.priceAmount, "en-US", selectedService.priceCurrency)}
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            )}
        </div>
      </div>
      {/* end flex-1 content */}

      {/* Sticky bottom action bar — all steps */}
      <div className="sticky bottom-0 z-10 -mx-4 px-4 py-3 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-t flex justify-end">
        {step < 3 ? (
          <Button
            size="sm"
            className="w-full md:w-fit"
            disabled={
              (step === 1 && !selectedDoctor) ||
              (step === 2 &&
                (!selectedDate || !selectedTime || !selectedService))
            }
            onClick={handleNextStep}
          >
            {step === 1 ? "Continue to Time Selection" : "Review Booking"}
          </Button>
        ) : (
          <div className="flex flex-col-reverse sm:flex-row gap-3 w-full sm:w-auto">
            <Button variant="outline" size="sm" onClick={handlePrevStep}>
              Modify Appointment
            </Button>
            <Button size="sm" onClick={handleConfirmBooking} disabled={isPending}>
              {isPending && <Loader2 className="animate-spin" />}
              Confirm Booking
            </Button>
          </div>
        )}
      </div>

      {/* Success Modal */}
      <ConfirmedAppointmentMessageModal
        data={{ selectedDoctor, selectedDate, selectedTime }}
        resetAction={resetBooking}
      />
    </div>
  );
}
