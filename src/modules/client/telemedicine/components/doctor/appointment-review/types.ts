export const TERMINOLOGY_SYSTEM_URL: Record<string, string> = {
  SNOMED: "http://snomed.info/sct",
  LOINC: "http://loinc.org",
  RXNORM: "http://www.nlm.nih.gov/research/umls/rxnorm",
  "ICD-10": "http://hl7.org/fhir/sid/icd-10-cm",
};

export interface ResolvedConcept {
  code: string;
  system: string;
  display: string;
  text: string; // same as display — the human-readable label stored in CodeableConcept.text
}

// ── SOAP ──────────────────────────────────────────────────────────────────────

export interface SoapNote {
  subjective: {
    chief_complaint: string;
    history_of_present_illness: string;
    associated_symptoms: string[];
  };
  objective: {
    observations: string[];
  };
  assessment: {
    possible_conditions: string[];
    clinical_reasoning: string;
  };
  plan: {
    next_steps: string[];
    when_to_seek_care: string;
  };
  summary: string;
}

// ── Raw AI extraction shapes ───────────────────────────────────────────────────

export interface AiCondition {
  display: string;
  terminologySystem: string;
}

export interface AiObservation {
  display: string;
  terminologySystem: string;
  value: string | null;
  unit: string | null;
}

export interface AiMedicationRequest {
  display: string;
  terminologySystem: string;
  dose: string | null;
  frequency: string | null;
  duration: string | null;
  route: string | null;
}

export interface AiServiceRequest {
  display: string;
  terminologySystem: string;
}

// ── Form item shapes (include resolved code + doctor edits) ───────────────────

export interface ConditionFormItem extends AiCondition {
  id: string;
  resolved?: ResolvedConcept;
  clinicalStatus?: string;
  verificationStatus?: string;
}

export interface ObservationFormItem extends AiObservation {
  id: string;
  resolved?: ResolvedConcept;
  status?: string;
  editedValue?: string;
  editedUnit?: string;
}

export interface MedicationFormItem extends AiMedicationRequest {
  id: string;
  resolved?: ResolvedConcept;
  status?: string;
  intent?: string;
  editedDose?: string;
  editedFrequency?: string;
  editedDuration?: string;
  editedRoute?: string;
}

export interface ServiceRequestFormItem extends AiServiceRequest {
  id: string;
  resolved?: ResolvedConcept;
  status?: string;
  intent?: string;
  priority?: string;
}

// ── Full staging report shape ─────────────────────────────────────────────────

export interface StagingReport {
  soap: SoapNote;
  assessment?: unknown;
  clinicalExtraction: {
    conditions: AiCondition[];
    observations: AiObservation[];
    medicationRequests: AiMedicationRequest[];
    serviceRequests: AiServiceRequest[];
  };
}

// ── FHIR enum fallbacks ───────────────────────────────────────────────────────

export const CONDITION_CLINICAL_STATUS = [
  { code: "active", display: "Active" },
  { code: "recurrence", display: "Recurrence" },
  { code: "relapse", display: "Relapse" },
  { code: "inactive", display: "Inactive" },
  { code: "remission", display: "Remission" },
  { code: "resolved", display: "Resolved" },
];

export const CONDITION_VERIFICATION_STATUS = [
  { code: "unconfirmed", display: "Unconfirmed" },
  { code: "provisional", display: "Provisional" },
  { code: "differential", display: "Differential" },
  { code: "confirmed", display: "Confirmed" },
  { code: "refuted", display: "Refuted" },
  { code: "entered-in-error", display: "Entered in Error" },
];

export const OBSERVATION_STATUS = [
  { code: "registered", display: "Registered" },
  { code: "preliminary", display: "Preliminary" },
  { code: "final", display: "Final" },
  { code: "amended", display: "Amended" },
  { code: "corrected", display: "Corrected" },
  { code: "cancelled", display: "Cancelled" },
  { code: "entered-in-error", display: "Entered in Error" },
  { code: "unknown", display: "Unknown" },
];

export const MEDICATION_REQUEST_STATUS = [
  { code: "active", display: "Active" },
  { code: "on-hold", display: "On Hold" },
  { code: "cancelled", display: "Cancelled" },
  { code: "completed", display: "Completed" },
  { code: "entered-in-error", display: "Entered in Error" },
  { code: "stopped", display: "Stopped" },
  { code: "draft", display: "Draft" },
  { code: "unknown", display: "Unknown" },
];

export const MEDICATION_REQUEST_INTENT = [
  { code: "proposal", display: "Proposal" },
  { code: "plan", display: "Plan" },
  { code: "order", display: "Order" },
  { code: "original-order", display: "Original Order" },
  { code: "reflex-order", display: "Reflex Order" },
  { code: "instance-order", display: "Instance Order" },
  { code: "option", display: "Option" },
];

export const SERVICE_REQUEST_STATUS = [
  { code: "active", display: "Active" },
  { code: "on-hold", display: "On Hold" },
  { code: "revoked", display: "Revoked" },
  { code: "completed", display: "Completed" },
  { code: "entered-in-error", display: "Entered in Error" },
  { code: "unknown", display: "Unknown" },
];

export const SERVICE_REQUEST_INTENT = [
  { code: "proposal", display: "Proposal" },
  { code: "plan", display: "Plan" },
  { code: "directive", display: "Directive" },
  { code: "order", display: "Order" },
  { code: "original-order", display: "Original Order" },
  { code: "reflex-order", display: "Reflex Order" },
  { code: "instance-order", display: "Instance Order" },
  { code: "option", display: "Option" },
];

export const SERVICE_REQUEST_PRIORITY = [
  { code: "routine", display: "Routine" },
  { code: "urgent", display: "Urgent" },
  { code: "asap", display: "ASAP" },
  { code: "stat", display: "Stat" },
];
