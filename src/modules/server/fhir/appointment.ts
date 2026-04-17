import { createFhirEncounter } from "./encounter";
import { fhirRequest } from "./client";
import type {
  EncounterClass,
  EncounterPriority,
  EncounterStatus,
  FhirAppointmentCreatePayload,
  FhirAppointmentPatchPayload,
  FhirAppointmentResponse,
  FhirAppointmentWithEncounterResult,
  FhirEncounterParticipantInput,
} from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// Composite helper: create Encounter → create Appointment
// ─────────────────────────────────────────────────────────────────────────────

export interface CreateFhirAppointmentInput {
  // FHIR public IDs for the participants
  fhirPatientId: string; // e.g. "10001"
  fhirPractitionerId: string; // e.g. "30001"
  patientName?: string | null;
  practitionerName?: string | null;

  // Scheduling
  start: string; // ISO datetime string
  end: string; // ISO datetime string
  minutesDuration?: number | null;

  // Appointment metadata
  appointmentStatus?: FhirAppointmentCreatePayload["status"];
  appointmentTypeMode?: "virtual" | "in-person"; // maps → encounterClass + appointmentTypeCode
  description?: string | null;
  comment?: string | null;
  patientInstruction?: string | null;
  serviceTypeCode?: string | null;
  serviceTypeDisplay?: string | null;
  specialtyCode?: string | null;
  specialtyDisplay?: string | null;

  // Encounter metadata
  encounterStatus?: EncounterStatus;
  encounterClass?: EncounterClass;
  encounterPriority?: EncounterPriority;
}

/**
 * The canonical appointment-creation flow:
 *   1. Create an Encounter on the FHIR server (required pre-condition).
 *   2. Create an Appointment linked to that Encounter.
 *
 * Returns both the created Encounter and Appointment so the caller can
 * persist the FHIR public ids (encounter.id, appointment.id) for future
 * update / delete operations.
 */
export async function createFhirAppointmentWithEncounter(
  input: CreateFhirAppointmentInput,
): Promise<FhirAppointmentWithEncounterResult> {
  const {
    fhirPatientId,
    fhirPractitionerId,
    patientName,
    practitionerName,
    start,
    end,
    minutesDuration,
    appointmentStatus = "booked",
    appointmentTypeMode,
    description,
    comment,
    patientInstruction,
    serviceTypeCode,
    serviceTypeDisplay,
    specialtyCode,
    specialtyDisplay,
    encounterStatus = "planned",
    encounterPriority = "routine",
  } = input;

  const encounterClass: EncounterClass =
    input.encounterClass ??
    (appointmentTypeMode === "virtual" ? "virtual" : "ambulatory");

  const participants: FhirEncounterParticipantInput[] = [
    {
      type_text: "Attending Physician",
      individual: `Practitioner/${fhirPractitionerId}`,
      period_start: start,
      period_end: end,
    },
  ];

  // Step 1 — create Encounter
  const encounter = await createFhirEncounter({
    status: encounterStatus,
    class_code: encounterClass,
    subject: `Patient/${fhirPatientId}`,
    period_start: start,
    period_end: end,
    priority: encounterPriority,
    participant: participants,
  });

  const encounterId = Number(encounter.id);

  // Step 2 — create Appointment linked to the new Encounter
  const appointmentPayload: FhirAppointmentCreatePayload = {
    status: appointmentStatus,
    subject: `Patient/${fhirPatientId}`,
    subject_display: patientName ?? undefined,
    encounter_id: encounterId,
    start,
    end,
    minutes_duration: minutesDuration ?? undefined,
    created: new Date().toISOString(),
    description: description ?? undefined,
    comment: comment ?? undefined,
    patient_instruction: patientInstruction ?? undefined,
    service_type_code: serviceTypeCode ?? undefined,
    service_type_display: serviceTypeDisplay ?? undefined,
    specialty_code: specialtyCode ?? undefined,
    specialty_display: specialtyDisplay ?? undefined,
    appointment_type_code:
      appointmentTypeMode === "virtual" ? "VIRTUAL" : "INPERSON",
    appointment_type_display:
      appointmentTypeMode === "virtual" ? "Virtual Consultation" : "In-Person Visit",
    participant: [
      {
        actor: `Patient/${fhirPatientId}`,
        actor_display: patientName ?? undefined,
        required: "required",
        status: "accepted",
      },
      {
        actor: `Practitioner/${fhirPractitionerId}`,
        actor_display: practitionerName ?? undefined,
        type_code: "ATND",
        type_display: "attender",
        required: "required",
        status: "accepted",
      },
    ],
  };

  const appointment = await fhirRequest<FhirAppointmentResponse>(
    "POST",
    "/api/fhir/v1/appointments/",
    appointmentPayload,
  );

  return { encounter, appointment };
}

// ─────────────────────────────────────────────────────────────────────────────
// Standalone Appointment CRUD (for update / delete after creation)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Partially updates an Appointment.
 * Patchable fields: status, start, end, minutes_duration, description, comment,
 * patient_instruction, priority_value, cancellation_reason, cancellation_date.
 *
 * @param fhirAppointmentId - the public FHIR appointment id returned from
 *   createFhirAppointmentWithEncounter (appointment.id)
 */
export async function updateFhirAppointment(
  fhirAppointmentId: string,
  payload: FhirAppointmentPatchPayload,
): Promise<FhirAppointmentResponse> {
  return fhirRequest<FhirAppointmentResponse>(
    "PATCH",
    `/api/fhir/v1/appointments/${fhirAppointmentId}`,
    payload,
  );
}

/**
 * Deletes an Appointment resource.
 * Also call deleteFhirEncounter with the linked encounter id if the encounter
 * should be removed as well.
 *
 * @param fhirAppointmentId - the public FHIR appointment id
 */
export async function deleteFhirAppointment(
  fhirAppointmentId: string,
): Promise<void> {
  return fhirRequest<void>(
    "DELETE",
    `/api/fhir/v1/appointments/${fhirAppointmentId}`,
  );
}
