"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, CalendarDays, User, Loader2 } from "lucide-react";
import { SoapEditor } from "./soap/SoapEditor";
import { ClinicalExtractionPanel } from "./clinical/ClinicalExtractionPanel";
import { submitClinicalReview } from "@/modules/client/telemedicine/server-actions/appointment-action";
import type {
  SoapNote,
  ConditionFormItem,
  ObservationFormItem,
  MedicationFormItem,
  ServiceRequestFormItem,
  StagingReport,
} from "./types";

// ── Mock staging report (used when no real data available) ────────────────────
const MOCK_REPORT: StagingReport = {
  soap: {
    subjective: {
      chief_complaint: "Fever, cough, and sore throat for the last 4 days.",
      history_of_present_illness:
        "Patient reports fever, dry cough, and sore throat for the last 4 days. Denies shortness of breath and chest pain. No history of diabetes or hypertension.",
      associated_symptoms: ["Fever", "Dry cough", "Sore throat"],
    },
    objective: {
      observations: [
        "Temperature: 101.2 F",
        "Blood pressure: 138/88 mmHg",
        "Heart rate: 96 beats per minute",
        "Oxygen saturation: 98% on room air",
        "Throat mildly congested on examination",
        "Lungs clear on auscultation",
      ],
    },
    assessment: {
      possible_conditions: ["Upper Respiratory Tract Infection"],
      clinical_reasoning:
        "Symptoms of fever, dry cough, and sore throat with mild throat congestion and unremarkable chest/lung findings are consistent with an upper respiratory tract infection.",
    },
    plan: {
      next_steps: [
        "CBC (Complete Blood Count)",
        "Chest X-Ray",
        "Encouraged to drink plenty of fluids and get adequate rest",
        "Follow-up in one week or earlier if symptoms worsen",
      ],
      when_to_seek_care: "Return earlier if symptoms worsen.",
    },
    summary:
      "Patient presents with fever, dry cough, and sore throat for 4 days. Vitals are stable. Exam reveals mild throat congestion and clear lungs. Suspected upper respiratory tract infection. Advised rest, fluids, CBC, chest X-ray, and follow-up in one week or sooner if symptoms worsen.",
  },
  clinicalExtraction: {
    conditions: [
      { display: "Upper Respiratory Tract Infection", terminologySystem: "SNOMED" },
      { display: "Viral upper respiratory tract infection", terminologySystem: "SNOMED" },
      { display: "Bacterial pharyngitis", terminologySystem: "SNOMED" },
    ],
    observations: [
      { display: "Temperature", terminologySystem: "LOINC", value: "101.2", unit: "F" },
      { display: "Blood Pressure", terminologySystem: "LOINC", value: "138/88", unit: "mmHg" },
      { display: "Heart rate", terminologySystem: "LOINC", value: "96", unit: "beats per minute" },
      { display: "Oxygen saturation", terminologySystem: "LOINC", value: "98", unit: "%" },
    ],
    medicationRequests: [
      {
        display: "Amoxicillin",
        terminologySystem: "RXNORM",
        dose: "500 mg",
        frequency: "Three times daily",
        duration: "7 days",
        route: "Oral",
      },
      {
        display: "Paracetamol",
        terminologySystem: "RXNORM",
        dose: "650 mg",
        frequency: "Every 6 hours as needed",
        duration: null,
        route: "Oral",
      },
    ],
    serviceRequests: [
      { display: "Complete Blood Count", terminologySystem: "LOINC" },
      { display: "Chest X-Ray", terminologySystem: "LOINC" },
    ],
  },
};

function toConditionItem(c: StagingReport["clinicalExtraction"]["conditions"][0]): ConditionFormItem {
  return { ...c, id: crypto.randomUUID() };
}
function toObservationItem(o: StagingReport["clinicalExtraction"]["observations"][0]): ObservationFormItem {
  return { ...o, id: crypto.randomUUID() };
}
function toMedicationItem(m: StagingReport["clinicalExtraction"]["medicationRequests"][0]): MedicationFormItem {
  return { ...m, id: crypto.randomUUID() };
}
function toServiceRequestItem(s: StagingReport["clinicalExtraction"]["serviceRequests"][0]): ServiceRequestFormItem {
  return { ...s, id: crypto.randomUUID() };
}

interface AppointmentReviewProps {
  appointmentId: string;
  userId: string;
  data?: {
    fullReport?: unknown;
    appointment?: {
      appointmentDate?: Date | null;
      patient?: { personal?: { name?: string | null } | null } | null;
      doctor?: { personal?: { fullName?: string | null } | null } | null;
    } | null;
  } | null;
}

export function AppointmentReview({ appointmentId, userId, data }: AppointmentReviewProps) {
  const report =
    data?.fullReport && typeof data.fullReport === "object"
      ? (data.fullReport as StagingReport)
      : MOCK_REPORT;

  const [soap, setSoap] = useState<SoapNote>(report.soap);
  const [conditions, setConditions] = useState<ConditionFormItem[]>(
    report.clinicalExtraction.conditions.map(toConditionItem),
  );
  const [observations, setObservations] = useState<ObservationFormItem[]>(
    report.clinicalExtraction.observations.map(toObservationItem),
  );
  const [medications, setMedications] = useState<MedicationFormItem[]>(
    report.clinicalExtraction.medicationRequests.map(toMedicationItem),
  );
  const [serviceRequests, setServiceRequests] = useState<ServiceRequestFormItem[]>(
    report.clinicalExtraction.serviceRequests.map(toServiceRequestItem),
  );
  const [isPending, startTransition] = useTransition();

  const patientName =
    data?.appointment?.patient?.personal?.name ?? "Patient";
  const doctorName =
    data?.appointment?.doctor?.personal?.fullName ?? "Doctor";
  const appointmentDate = data?.appointment?.appointmentDate
    ? new Date(data.appointment.appointmentDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const handleConfirm = () => {
    startTransition(async () => {
      try {
        await submitClinicalReview({
          appointmentId,
          userId,
          soap: soap as unknown as Record<string, unknown>,
          conditions,
          observations,
          medications,
          serviceRequests,
        });
        toast.success("Clinical records saved to patient medical history.");
      } catch (err) {
        console.error(err);
        toast.error("Failed to save records. Please try again.");
      }
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] gap-0">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b bg-background shrink-0">
        <div className="flex items-center gap-4">
          <div>
            <p className="text-sm font-semibold">Post-Consultation Review</p>
            <p className="text-xs text-muted-foreground">
              Review and confirm AI-generated clinical data before saving to records
            </p>
          </div>
          <Separator orientation="vertical" className="h-8" />
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <User className="h-3.5 w-3.5" />
            <span>{patientName}</span>
          </div>
          {appointmentDate && (
            <>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <CalendarDays className="h-3.5 w-3.5" />
                <span>{appointmentDate}</span>
              </div>
            </>
          )}
          <Badge variant="secondary" className="text-xs">
            Dr. {doctorName}
          </Badge>
        </div>

        <Button onClick={handleConfirm} size="sm" className="gap-2" disabled={isPending}>
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <CheckCircle2 className="h-4 w-4" />
          )}
          {isPending ? "Saving..." : "Confirm & Save to Records"}
        </Button>
      </div>

      {/* Body — two-column layout */}
      <div className="flex flex-1 min-h-0 gap-0">
        {/* Left: SOAP editor */}
        <div className="w-[420px] shrink-0 border-r flex flex-col min-h-0">
          <div className="px-4 py-3 border-b shrink-0">
            <p className="text-sm font-medium">SOAP Note</p>
            <p className="text-xs text-muted-foreground">Edit and review clinical notes</p>
          </div>
          <ScrollArea className="flex-1 min-h-0">
            <div className="p-4">
              <SoapEditor soap={soap} onChange={setSoap} />
            </div>
          </ScrollArea>
        </div>

        {/* Right: Clinical extraction */}
        <div className="flex-1 min-h-0 flex flex-col">
          <div className="px-4 py-3 border-b shrink-0">
            <p className="text-sm font-medium">Clinical Extraction</p>
            <p className="text-xs text-muted-foreground">
              Confirm terminology codes — AI suggestions are pre-loaded
            </p>
          </div>
          <div className="flex-1 min-h-0 p-4">
            <ClinicalExtractionPanel
              conditions={conditions}
              observations={observations}
              medications={medications}
              serviceRequests={serviceRequests}
              onConditionsChange={setConditions}
              onObservationsChange={setObservations}
              onMedicationsChange={setMedications}
              onServiceRequestsChange={setServiceRequests}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
