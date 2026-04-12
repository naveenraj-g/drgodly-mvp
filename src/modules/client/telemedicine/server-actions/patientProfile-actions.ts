"use server";

import {
  createorUpdatePatientPersonalDetailsController,
  createPatientInitialProfileController,
  getPatientWithPersonalProfileController,
  TCreateOrUpdatePatientPersonalDetailsOutput,
  TCreatePatientInitialProfileOutput,
  TGetPatientWithPersonalProfileOutput,
} from "@/modules/server/telemedicine/interface-adapters/controllers/patientProfile";
import {
  CreatePatientInitialProfileSchema,
  GetPatientWithPersonalProfileSchema,
  PatientProfileCreateOrUpdateValidationSchema,
} from "@/modules/shared/schemas/telemedicine/patientProfile/patientProfileValidationSchema";
import { withMonitoring } from "@/modules/shared/utils/serverActionWithMonitoring";
import { createServerAction } from "zsa";

export const getPatientWithPersonalProfile = createServerAction()
  .input(GetPatientWithPersonalProfileSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    return await withMonitoring<TGetPatientWithPersonalProfileOutput>(
      "getPatientWithPersonalProfile",
      () => getPatientWithPersonalProfileController(input),
      {
        operationErrorMessage: "Failed to get profile datas.",
      }
    );
  });

export const createPatientInitialProfile = createServerAction()
  .input(CreatePatientInitialProfileSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    return await withMonitoring<TCreatePatientInitialProfileOutput>(
      "createPatientInitialProfile",
      () => createPatientInitialProfileController(input),
      {
        url: "/bezs/telemedicine/patient/profile",
        revalidatePath: true,
        operationErrorMessage: "Failed to create initial profile.",
      }
    );
  });

export const createorUpdatePatientPersonalDetails = createServerAction()
  .input(PatientProfileCreateOrUpdateValidationSchema, {
    skipInputParsing: true,
  })
  .handler(async ({ input }) => {
    return await withMonitoring<TCreateOrUpdatePatientPersonalDetailsOutput>(
      "createorUpdatePatientPersonal",
      () => createorUpdatePatientPersonalDetailsController(input),
      {
        url: "/bezs/telemedicine/patient/profile",
        revalidatePath: true,
        operationErrorMessage: `Failed to ${
          input.id ? "update" : "create"
        } personal profile.`,
      }
    );
  });
