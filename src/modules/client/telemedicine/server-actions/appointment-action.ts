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
  createFhirAppointmentWithEncounter,
  updateFhirAppointment,
} from "@/modules/server/fhir";
import { fhirRequest } from "@/modules/server/fhir/client";
import type { EncounterClass, FhirAppointmentCreatePayload } from "@/modules/server/fhir";
import { prismaTelemedicine } from "@/modules/server/prisma/prisma";

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
    let fhirEncounterId: number | undefined;
    let fhirAppointmentId: number | undefined;

    try {
      const [patientRecord, doctorRecord] = await Promise.all([
        prismaTelemedicine.patient.findUnique({
          where: { orgId_userId: { orgId: input.orgId, userId: input.patientUserId } },
          select: { fhirPatientId: true },
        }),
        prismaTelemedicine.doctor.findUnique({
          where: { orgId_userId: { orgId: input.orgId, userId: input.doctorUserId } },
          select: { fhirPractitionerId: true },
        }),
      ]);

      if (patientRecord?.fhirPatientId && doctorRecord?.fhirPractitionerId) {
        const startIso = buildIsoDatetime(new Date(input.appointmentDate), input.time);
        const endIso = addMinutes(startIso, 30);
        const { encounter, appointment } = await createFhirAppointmentWithEncounter({
          fhirPatientId: String(patientRecord.fhirPatientId),
          fhirPractitionerId: String(doctorRecord.fhirPractitionerId),
          patientName: null,
          practitionerName: null,
          start: startIso,
          end: endIso,
          appointmentTypeMode: input.appointmentMode === "VIRTUAL" ? "virtual" : "in-person",
          description: input.note ?? undefined,
        });
        fhirEncounterId = Number(encounter.id);
        fhirAppointmentId = Number(appointment.id);
      }
    } catch (err) {
      console.error("[FHIR] bookAppointment pre-sync failed:", err);
    }

    return await withMonitoring<TBookAppointmentControllerOutput>(
      "bookAppointment",
      () => bookAppointmentController(input, fhirEncounterId, fhirAppointmentId),
      {
        operationErrorMessage: "Failed to book appointment.",
      }
    );
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
    const result = await withMonitoring<TRescheduleAppointmentControllerOutput>(
      "rescheduleAppointment",
      () => rescheduleAppointmentController(input),
      {
        revalidatePath: true,
        url: "/bezs/telemedicine/patient/appointments",
        operationErrorMessage: "Failed to reschedule appointment.",
      }
    );

    try {
      if (result.fhirAppointmentId) {
        const startIso = buildIsoDatetime(new Date(input.appointmentDate), input.time);
        const endIso = addMinutes(startIso, 30);
        await updateFhirAppointment(String(result.fhirAppointmentId), {
          status: "booked",
          start: startIso,
          end: endIso,
        });
      }
    } catch (err) {
      console.error("[FHIR] rescheduleAppointment sync failed:", err);
    }

    return result;
  });

export const cancelAppointment = createServerAction()
  .input(CancelAppointmentValidationSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    const result = await withMonitoring<TCancelAppointmentControllerOutput>(
      "cancelAppointment",
      () => cancelAppointmentController(input),
      {
        revalidatePath: true,
        url: "/bezs/telemedicine/patient/appointments",
        operationErrorMessage: "Failed to cancel appointment.",
      }
    );

    try {
      if (result.fhirAppointmentId) {
        await updateFhirAppointment(String(result.fhirAppointmentId), {
          status: "cancelled",
          cancellation_reason: result.cancelReason ?? undefined,
          cancellation_date: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.error("[FHIR] cancelAppointment sync failed:", err);
    }

    return result;
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
