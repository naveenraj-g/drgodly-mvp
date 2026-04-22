"use server";

import {
  bookAppointmentController,
  bookConsultationAppointmentController,
  bookIntakeAppointmentController,
  cancelAppointmentController,
  confirmAppointmentController,
  deleteAppointmentController,
  getAppointmentForOnlineConsultationController,
  getAppointmentsForDoctorController,
  getAppointmentsForPatientController,
  getDoctorDashboardAppointmentsController,
  rescheduleAppointmentController,
  TBookAppointmentControllerOutput,
  TBookConsultationAppointmentControllerOutput,
  TBookIntakeAppointmentControllerOutput,
  TCancelAppointmentControllerOutput,
  TConfirmAppointmentControllerOutput,
  TDeleteAppointmentControllerOutput,
  TGetAppointmentForOnlineConsultationControllerOutput,
  TGetAppointmentsForDoctorControllerOutput,
  TGetAppointmentsForPatientControllerOutput,
  TGetDoctorDashboardAppointmentsControllerOutput,
  TRescheduleAppointmentControllerOutput,
} from "@/modules/server/telemedicine/interface-adapters/controllers/appointment";
import {
  BookAppointmentValidationSchema,
  BookConsultationAppointmentValidationSchema,
  BookIntakeAppointmentValidationSchema,
  CancelAppointmentValidationSchema,
  DeleteAppointmentValidationSchema,
  GetAppointmentValidationSchema,
  RescheduleAppointmentValidationSchema,
} from "@/modules/shared/schemas/telemedicine/appointment/appointmentValidationSchema";
import { withMonitoring } from "@/modules/shared/utils/serverActionWithMonitoring";
import { createServerAction } from "zsa";
import {
  createFhirEncounter,
  createFhirQuestionnaireResponse,
} from "@/modules/server/fhir";
import { fhirRequest } from "@/modules/server/fhir/client";
import type { EncounterClass, FhirAppointmentCreatePayload } from "@/modules/server/fhir";

// ── FHIR helpers ──────────────────────────────────────────────────────────────

function buildIsoDatetime(date: Date, timeStr: string): string {
  const d = new Date(date);
  const [h, m] = timeStr.split(":").map(Number);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
}

function addMinutes(isoStr: string, mins: number): string {
  return new Date(new Date(isoStr).getTime() + mins * 60_000).toISOString();
}

function toEncounterClass(mode: string): EncounterClass {
  return mode === "VIRTUAL" ? "virtual" : "ambulatory";
}

/**
 * Creates an Encounter and then an Appointment on the FHIR server.
 * Returns the encounter so callers can reference its id for QR sync.
 */
async function syncEncounterAndAppointment({
  startIso,
  endIso,
  encounterClass,
  description,
  patientDisplay,
  practitionerDisplay,
}: {
  startIso: string;
  endIso: string;
  encounterClass: EncounterClass;
  description?: string | null;
  patientDisplay?: string | null;
  practitionerDisplay?: string | null;
}) {
  const encounter = await createFhirEncounter({
    status: "planned",
    class_code: encounterClass,
    period_start: startIso,
    period_end: endIso,
  });

  const participants: FhirAppointmentCreatePayload["participant"] = [];
  if (patientDisplay) {
    participants.push({ actor_display: patientDisplay, required: "required", status: "accepted" });
  }
  if (practitionerDisplay) {
    participants.push({ actor_display: practitionerDisplay, type_text: "Attending Physician", required: "required", status: "accepted" });
  }
  if (participants.length === 0) {
    participants.push({ status: "needs-action" });
  }

  const appointmentPayload: FhirAppointmentCreatePayload = {
    status: "booked",
    encounter_id: Number(encounter.id),
    start: startIso,
    end: endIso,
    minutes_duration: 30,
    created: new Date().toISOString(),
    description: description ?? undefined,
    participant: participants,
  };

  await fhirRequest("POST", "/api/fhir/v1/appointments/", appointmentPayload);

  return encounter;
}

export const bookAppointment = createServerAction()
  .input(BookAppointmentValidationSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    const result = await withMonitoring<TBookAppointmentControllerOutput>(
      "bookAppointment",
      () => bookAppointmentController(input),
      {
        operationErrorMessage: "Failed to book appointment.",
      }
    );

    try {
      const startIso = buildIsoDatetime(result.appointmentDate, result.time);
      const endIso = addMinutes(startIso, 30);
      await syncEncounterAndAppointment({
        startIso,
        endIso,
        encounterClass: toEncounterClass(result.appointmentMode),
        description: result.type,
        patientDisplay: result.patient.personal?.name,
        practitionerDisplay: result.doctor.personal?.fullName,
      });
    } catch (err) {
      console.error("[FHIR] bookAppointment sync failed:", err);
    }

    return result;
  });

export const bookIntakeAppointment = createServerAction()
  .input(BookIntakeAppointmentValidationSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    const result = await withMonitoring<TBookIntakeAppointmentControllerOutput>(
      "bookAppointment",
      () => bookIntakeAppointmentController(input),
      {
        operationErrorMessage: "Failed to book intake appointment.",
      }
    );

    try {
      const startIso = new Date().toISOString();
      const endIso = addMinutes(startIso, 30);
      const encounter = await syncEncounterAndAppointment({
        startIso,
        endIso,
        encounterClass: "ambulatory",
        description: "Intake Appointment",
      });

      if (input.intakeConversation != null || input.intakeReport != null) {
        await createFhirQuestionnaireResponse({
          questionnaire: "http://drgodly.com/fhir/Questionnaire/intake-conversation",
          status: "completed",
          encounter: `Encounter/${encounter.id}`,
          authored: startIso,
          item: [
            {
              link_id: "1",
              text: "Intake Conversation",
              answer: input.intakeConversation != null
                ? [{ value_string: JSON.stringify(input.intakeConversation) }]
                : undefined,
            },
            {
              link_id: "2",
              text: "Intake Report",
              answer: input.intakeReport != null
                ? [{ value_string: JSON.stringify(input.intakeReport) }]
                : undefined,
            },
          ],
        });
      }
    } catch (err) {
      console.error("[FHIR] bookIntakeAppointment sync failed:", err);
    }

    return result;
  });

export const getPatientAppointments = createServerAction()
  .input(GetAppointmentValidationSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    return await withMonitoring<TGetAppointmentsForPatientControllerOutput>(
      "getPatientAppointments",
      () => getAppointmentsForPatientController(input),
      {
        operationErrorMessage: "Failed to get appointments.",
      }
    );
  });

export const getDoctorAppointments = createServerAction()
  .input(GetAppointmentValidationSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    return await withMonitoring<TGetAppointmentsForDoctorControllerOutput>(
      "getDoctorAppointments",
      () => getAppointmentsForDoctorController(input),
      {
        operationErrorMessage: "Failed to get appointments.",
      }
    );
  });

export const getDoctorDashboardAppointments = createServerAction()
  .input(GetAppointmentValidationSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    return await withMonitoring<TGetDoctorDashboardAppointmentsControllerOutput>(
      "getDoctorDashboardAppointments",
      () => getDoctorDashboardAppointmentsController(input),
      {
        operationErrorMessage: "Failed to get dashboard appointments.",
      }
    );
  });

export const getAppointmentForOnlineConsultation = createServerAction()
  .input(DeleteAppointmentValidationSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    return await withMonitoring<TGetAppointmentForOnlineConsultationControllerOutput>(
      "getAppointmentForOnlineConsultation",
      () => getAppointmentForOnlineConsultationController(input),
      {
        operationErrorMessage: "Failed to get appointment.",
      }
    );
  });

export const rescheduleAppointment = createServerAction()
  .input(RescheduleAppointmentValidationSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    return await withMonitoring<TRescheduleAppointmentControllerOutput>(
      "rescheduleAppointment",
      () => rescheduleAppointmentController(input),
      {
        revalidatePath: true,
        url: "/bezs/telemedicine/patient/appointments",
        operationErrorMessage: "Failed to reschedule appointment.",
      }
    );
  });

export const cancelAppointment = createServerAction()
  .input(CancelAppointmentValidationSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    return await withMonitoring<TCancelAppointmentControllerOutput>(
      "cancelAppointment",
      () => cancelAppointmentController(input),
      {
        revalidatePath: true,
        url: "/bezs/telemedicine/patient/appointments",
        operationErrorMessage: "Failed to cancel appointment.",
      }
    );
  });

export const deleteAppointment = createServerAction()
  .input(DeleteAppointmentValidationSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    return await withMonitoring<TDeleteAppointmentControllerOutput>(
      "deleteAppointment",
      () => deleteAppointmentController(input),
      {
        revalidatePath: true,
        url: "/bezs/telemedicine/patient/appointments",
        operationErrorMessage: "Failed to delete appointment.",
      }
    );
  });

export const bookConsultationAppointment = createServerAction()
  .input(BookConsultationAppointmentValidationSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    const result = await withMonitoring<TBookConsultationAppointmentControllerOutput>(
      "bookConsultationAppointment",
      () => bookConsultationAppointmentController(input),
      {
        operationErrorMessage: "Failed to book consultation appointment.",
      }
    );

    try {
      const startIso = new Date().toISOString();
      const endIso = addMinutes(startIso, 30);
      const encounter = await syncEncounterAndAppointment({
        startIso,
        endIso,
        encounterClass: "virtual",
        description: "AI Consultation",
      });

      if (input.virtualConversation != null) {
        await createFhirQuestionnaireResponse({
          questionnaire: "http://drgodly.com/fhir/Questionnaire/virtual-consultation",
          status: "completed",
          encounter: `Encounter/${encounter.id}`,
          authored: startIso,
          item: [
            {
              link_id: "1",
              text: "Virtual Consultation Conversation",
              answer: [{ value_string: JSON.stringify(input.virtualConversation) }],
            },
          ],
        });
      }
    } catch (err) {
      console.error("[FHIR] bookConsultationAppointment sync failed:", err);
    }

    return result;
  });

export const confirmAppointment = createServerAction()
  .input(DeleteAppointmentValidationSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    return await withMonitoring<TConfirmAppointmentControllerOutput>(
      "deleteAppointment",
      () => confirmAppointmentController(input),
      {
        revalidatePath: true,
        url: "/bezs/telemedicine/patient/appointments",
        operationErrorMessage: "Failed to confirm appointment.",
      }
    );
  });
