"use server";

import {
  bookAppointmentController,
  bookIntakeAppointmentController,
  cancelAppointmentController,
  confirmAppointmentController,
  deleteAppointmentController,
  getAppointmentForOnlineConsultationController,
  getAppointmentsForDoctorController,
  getAppointmentsForPatientController,
  rescheduleAppointmentController,
  TBookAppointmentControllerOutput,
  TBookIntakeAppointmentControllerOutput,
  TCancelAppointmentControllerOutput,
  TConfirmAppointmentControllerOutput,
  TDeleteAppointmentControllerOutput,
  TGetAppointmentForOnlineConsultationControllerOutput,
  TGetAppointmentsForDoctorControllerOutput,
  TGetAppointmentsForPatientControllerOutput,
  TRescheduleAppointmentControllerOutput,
} from "@/modules/server/telemedicine/interface-adapters/controllers/appointment";
import {
  BookAppointmentValidationSchema,
  BookIntakeAppointmentValidationSchema,
  CancelAppointmentValidationSchema,
  DeleteAppointmentValidationSchema,
  GetAppointmentValidationSchema,
  RescheduleAppointmentValidationSchema,
} from "@/modules/shared/schemas/telemedicine/appointment/appointmentValidationSchema";
import { withMonitoring } from "@/modules/shared/utils/serverActionWithMonitoring";
import { createServerAction } from "zsa";

export const bookAppointment = createServerAction()
  .input(BookAppointmentValidationSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    return await withMonitoring<TBookAppointmentControllerOutput>(
      "bookAppointment",
      () => bookAppointmentController(input),
      {
        operationErrorMessage: "Failed to book appointment.",
      }
    );
  });

export const bookIntakeAppointment = createServerAction()
  .input(BookIntakeAppointmentValidationSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    return await withMonitoring<TBookIntakeAppointmentControllerOutput>(
      "bookAppointment",
      () => bookIntakeAppointmentController(input),
      {
        operationErrorMessage: "Failed to book intake appointment.",
      }
    );
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
