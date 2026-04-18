// ─────────────────────────────────────────────────────────────────────────────
// Shared enum literals
// ─────────────────────────────────────────────────────────────────────────────

export type AdministrativeGender = "male" | "female" | "other" | "unknown";

export type AppointmentStatus =
  | "proposed"
  | "pending"
  | "booked"
  | "arrived"
  | "fulfilled"
  | "cancelled"
  | "noshow"
  | "entered-in-error"
  | "checked-in"
  | "waitlist";

export type AppointmentParticipantStatus =
  | "accepted"
  | "declined"
  | "tentative"
  | "needs-action";

export type AppointmentParticipantRequired = "required" | "optional" | "information-only";

export type EncounterStatus =
  | "planned"
  | "in-progress"
  | "on-hold"
  | "completed"
  | "cancelled"
  | "entered-in-error"
  | "unknown";

export type EncounterClass =
  | "inpatient"
  | "ambulatory"
  | "observation"
  | "emergency"
  | "virtual"
  | "home_health";

export type EncounterPriority = "routine" | "urgent" | "stat" | "asap";

export type QuestionnaireResponseStatus =
  | "in-progress"
  | "completed"
  | "amended"
  | "entered-in-error"
  | "stopped";

export type PractitionerRole =
  | "doctor"
  | "nurse"
  | "pharmacist"
  | "therapist"
  | "dentist"
  | "other";

// ─────────────────────────────────────────────────────────────────────────────
// Patient
// ─────────────────────────────────────────────────────────────────────────────

export interface FhirPatientCreatePayload {
  given_name?: string | null;
  family_name?: string | null;
  gender?: AdministrativeGender | null;
  birth_date?: string | null; // YYYY-MM-DD
  active?: boolean | null;
  deceased_boolean?: boolean | null;
  deceased_datetime?: string | null;
}

export interface FhirPatientPatchPayload {
  given_name?: string | null;
  family_name?: string | null;
  gender?: AdministrativeGender | null;
  birth_date?: string | null;
  active?: boolean | null;
}

export interface FhirPatientResponse {
  resourceType: "Patient";
  id: string; // public patient_id, e.g. "10001"
  active?: boolean | null;
  gender?: string | null;
  birthDate?: string | null;
  name?: Array<{ family?: string; given?: string[] }> | null;
  telecom?: Array<{ system?: string; value?: string; use?: string }> | null;
  address?: Array<{
    use?: string;
    line?: string[];
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  }> | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Practitioner
// ─────────────────────────────────────────────────────────────────────────────

export interface FhirPractitionerCreatePayload {
  given_name?: string | null;
  family_name?: string | null;
  active?: boolean | null;
  gender?: AdministrativeGender | null;
  birth_date?: string | null; // YYYY-MM-DD
  role?: PractitionerRole | null;
  specialty?: string | null;
  deceased_boolean?: boolean | null;
  deceased_datetime?: string | null;
}

export interface FhirPractitionerPatchPayload {
  given_name?: string | null;
  family_name?: string | null;
  active?: boolean | null;
  gender?: AdministrativeGender | null;
  birth_date?: string | null;
  role?: PractitionerRole | null;
  specialty?: string | null;
}

export interface FhirPractitionerResponse {
  resourceType: "Practitioner";
  id: string; // public practitioner_id, e.g. "30001"
  active?: boolean | null;
  gender?: string | null;
  birthDate?: string | null;
  role?: string | null;
  specialty?: string | null;
  name?: Array<{ family?: string; given?: string[] }> | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Encounter
// ─────────────────────────────────────────────────────────────────────────────

export interface FhirEncounterParticipantInput {
  type_text?: string | null;
  individual?: string | null; // e.g. "Practitioner/30001"
  period_start?: string | null;
  period_end?: string | null;
}

export interface FhirEncounterTypeInput {
  coding_system?: string | null;
  coding_code?: string | null;
  coding_display?: string | null;
  text?: string | null;
}

export interface FhirEncounterCreatePayload {
  status: EncounterStatus;
  class_code: EncounterClass;
  subject?: string | null; // e.g. "Patient/10001"
  period_start?: string | null;
  period_end?: string | null;
  priority?: EncounterPriority | null;
  type?: FhirEncounterTypeInput[] | null;
  participant?: FhirEncounterParticipantInput[] | null;
  reason_codes?: Array<{
    coding_system?: string | null;
    coding_code?: string | null;
    coding_display?: string | null;
    text?: string | null;
  }> | null;
}

export interface FhirEncounterPatchPayload {
  status?: EncounterStatus | null;
  period_end?: string | null;
  priority?: EncounterPriority | null;
}

export interface FhirEncounterResponse {
  resourceType: "Encounter";
  id: string; // public encounter_id, e.g. "20001"
  status?: string | null;
  period?: { start?: string; end?: string } | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Appointment
// ─────────────────────────────────────────────────────────────────────────────

export interface FhirAppointmentParticipantInput {
  actor?: string | null; // e.g. "Patient/10001" or "Practitioner/30001"
  actor_display?: string | null;
  type_code?: string | null;
  type_display?: string | null;
  type_text?: string | null;
  required?: AppointmentParticipantRequired | null;
  status: AppointmentParticipantStatus;
  period_start?: string | null;
  period_end?: string | null;
}

export interface FhirAppointmentCreatePayload {
  status: AppointmentStatus;
  participant: FhirAppointmentParticipantInput[];
  subject?: string | null; // e.g. "Patient/10001"
  subject_display?: string | null;
  encounter_id?: number | null; // public encounter integer id
  start?: string | null;
  end?: string | null;
  minutes_duration?: number | null;
  created?: string | null;
  description?: string | null;
  comment?: string | null;
  patient_instruction?: string | null;
  priority_value?: number | null;
  service_category_code?: string | null;
  service_category_display?: string | null;
  service_type_code?: string | null;
  service_type_display?: string | null;
  specialty_code?: string | null;
  specialty_display?: string | null;
  appointment_type_code?: string | null;
  appointment_type_display?: string | null;
  cancellation_reason?: string | null;
  cancellation_date?: string | null;
  reason_codes?: Array<{
    coding_system?: string | null;
    coding_code?: string | null;
    coding_display?: string | null;
    text?: string | null;
  }> | null;
}

export interface FhirAppointmentPatchPayload {
  status?: AppointmentStatus | null;
  start?: string | null;
  end?: string | null;
  minutes_duration?: number | null;
  description?: string | null;
  comment?: string | null;
  patient_instruction?: string | null;
  priority_value?: number | null;
  cancellation_reason?: string | null;
  cancellation_date?: string | null;
}

export interface FhirAppointmentResponse {
  resourceType: "Appointment";
  id: string; // public appointment_id, e.g. "40001"
  status: string;
  start?: string | null;
  end?: string | null;
  minutesDuration?: number | null;
  encounter?: { reference?: string; display?: string } | null;
  subject?: { reference?: string; display?: string } | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// QuestionnaireResponse
// ─────────────────────────────────────────────────────────────────────────────

export interface FhirAnswerInput {
  value_boolean?: boolean | null;
  value_decimal?: number | null;
  value_integer?: number | null;
  value_date?: string | null; // YYYY-MM-DD
  value_datetime?: string | null;
  value_time?: string | null; // HH:MM:SS
  value_string?: string | null;
  value_uri?: string | null;
  value_coding?: {
    system?: string | null;
    code?: string | null;
    display?: string | null;
  } | null;
  value_quantity?: {
    value?: number | null;
    unit?: string | null;
    system?: string | null;
    code?: string | null;
  } | null;
  value_reference?: string | null; // e.g. "Patient/10001"
  item?: FhirQRItemInput[] | null;
}

export interface FhirQRItemInput {
  link_id: string;
  definition?: string | null;
  text?: string | null;
  answer?: FhirAnswerInput[] | null;
  item?: FhirQRItemInput[] | null;
}

export interface FhirQuestionnaireResponseCreatePayload {
  questionnaire: string; // canonical URL, e.g. "http://example.org/fhir/Questionnaire/phq-9"
  status: QuestionnaireResponseStatus;
  subject?: string | null; // e.g. "Patient/10001"
  subject_display?: string | null;
  encounter?: string | null; // e.g. "Encounter/20001" (string reference, NOT integer id)
  authored?: string | null;
  author?: string | null; // e.g. "Practitioner/30001"
  author_display?: string | null;
  source?: string | null; // e.g. "Patient/10001"
  source_display?: string | null;
  item?: FhirQRItemInput[] | null;
}

export interface FhirQuestionnaireResponsePatchPayload {
  status?: QuestionnaireResponseStatus | null;
  authored?: string | null;
}

export interface FhirQuestionnaireResponseResponse {
  resourceType: "QuestionnaireResponse";
  id: string; // public qr_id, e.g. "60001"
  questionnaire: string;
  status: string;
  subject?: { reference?: string; display?: string } | null;
  encounter?: { reference?: string; display?: string } | null;
  authored?: string | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Practitioner sub-resource payloads
// ─────────────────────────────────────────────────────────────────────────────

export type TelecomSystem = "phone" | "fax" | "email" | "pager" | "url" | "sms" | "other";
export type TelecomUse = "home" | "work" | "temp" | "old" | "mobile";
export type AddressUse = "home" | "work" | "temp" | "old" | "billing";
export type AddressType = "postal" | "physical" | "both";
export type IdentifierUse = "usual" | "official" | "temp" | "secondary" | "old";

export interface FhirPractitionerTelecomPayload {
  system: TelecomSystem;
  value: string;
  use?: TelecomUse | null;
  rank?: number | null;
}

export interface FhirPractitionerAddressPayload {
  use?: AddressUse | null;
  type?: AddressType | null;
  text?: string | null;
  line?: string | null; // comma-separated lines
  city?: string | null;
  district?: string | null;
  state?: string | null;
  postal_code?: string | null;
  country?: string | null;
}

export interface FhirPractitionerIdentifierPayload {
  value: string;
  system?: string | null;
  use?: IdentifierUse | null;
}

export interface FhirPractitionerQualificationPayload {
  code_text?: string | null;   // human-readable qualification name, e.g. "MD"
  issuer?: string | null;      // issuing organization display name
  identifier_system?: string | null;
  identifier_value?: string | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper: composite result for appointment create flow
// ─────────────────────────────────────────────────────────────────────────────

export interface FhirAppointmentWithEncounterResult {
  encounter: FhirEncounterResponse;
  appointment: FhirAppointmentResponse;
}
