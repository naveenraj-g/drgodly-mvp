"use server";

import { prismaTelemedicine } from "@/modules/server/prisma/prisma";
import {
  createDoctorInitialProfileController,
  getAllDoctorsDataController,
  getDoctorDataByIdController,
  deleteDoctorProfileController,
  createorUpdateDoctorPersonalDetailsController,
  createorUpdateDoctorQualificationDetailsController,
  createorUpdateDoctorWorkDetailsController,
  createorUpdateDoctorConcentController,
  submitDoctorFullProfileController,
  getDoctorProfileByHPRIdController,
} from "@/modules/server/telemedicine/interface-adapters/controllers/doctorProfile";
import { getDoctorDataByUserIdController } from "@/modules/server/telemedicine/interface-adapters/controllers/doctorProfile/getDoctorDataByUserId.controller";
import {
  TDoctor,
  TDoctorDatas,
  TDoctorInitialProfile,
  TDoctorPersonalDetails,
  TDoctorQualifications,
  TDoctorWorkDetails,
  TDoctorConcent,
} from "@/modules/shared/entities/models/telemedicine/doctorProfile";
import {
  getAllDoctorSchema,
  CreateDoctorInitialProfileSchema,
  SeedAgentDoctorsValidationSchema,
  DeleteDoctorProfileSchema,
  DoctorProfileCreateOrUpdateValidationSchema,
  DoctorQualificationCreateOrUpdateValidation,
  DoctorWorkDetailCreateOrUpdateValidation,
  DoctorConcentCreateOrUpdateValidation,
  SubmitDoctorFullProfileValidationSchema,
  GetDoctorByUserIdSchema,
  CreateDoctorByHPRidSchema,
} from "@/modules/shared/schemas/telemedicine/doctorProfile/doctorProfileValidationSchema";
import { withMonitoring } from "@/modules/shared/utils/serverActionWithMonitoring";
import { createServerAction } from "zsa";
import {
  createFhirPractitioner,
  addFhirPractitionerTelecom,
  addFhirPractitionerAddress,
  addFhirPractitionerIdentifier,
  addFhirPractitionerQualification,
} from "@/modules/server/fhir";

// ── FHIR mapping helpers ──────────────────────────────────────────────────────

function parseDoctorName(fullName: string): { given_name: string; family_name?: string } {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return { given_name: parts[0] };
  return {
    given_name: parts.slice(0, -1).join(" "),
    family_name: parts[parts.length - 1],
  };
}

function toFhirDate(d: Date): string {
  return d.toISOString().split("T")[0];
}

function toFhirGender(g: string): "male" | "female" | "other" | "unknown" {
  switch (g.toLowerCase()) {
    case "male": return "male";
    case "female": return "female";
    case "other": return "other";
    default: return "unknown";
  }
}

/**
 * Pushes a practitioner's personal details to FHIR:
 * creates the Practitioner resource, then adds telecom + address in parallel.
 */
async function syncPractitionerPersonalToFhir(personal: TDoctorPersonalDetails) {
  const { given_name, family_name } = parseDoctorName(personal.fullName);

  const fhirPractitioner = await createFhirPractitioner({
    given_name,
    family_name,
    gender: toFhirGender(personal.gender),
    birth_date: toFhirDate(personal.dateOfBirth),
    active: true,
    role: "doctor",
    specialty: personal.speciality,
  });

  const subResources: Promise<unknown>[] = [
    addFhirPractitionerTelecom(fhirPractitioner.id, {
      system: "phone",
      value: personal.mobileNumber,
      use: "mobile",
      rank: 1,
    }),
    addFhirPractitionerTelecom(fhirPractitioner.id, {
      system: "email",
      value: personal.email,
      use: "work",
      rank: 2,
    }),
  ];

  if (personal.alternativeMobileNumber) {
    subResources.push(
      addFhirPractitionerTelecom(fhirPractitioner.id, {
        system: "phone",
        value: personal.alternativeMobileNumber,
        use: "mobile",
        rank: 3,
      }),
    );
  }

  if (personal.kycAddress) {
    subResources.push(
      addFhirPractitionerAddress(fhirPractitioner.id, {
        use: "home",
        type: "physical",
        line: personal.kycAddress.addressLine,
        city: personal.kycAddress.city,
        district: personal.kycAddress.district,
        state: personal.kycAddress.state,
        postal_code: personal.kycAddress.pincode,
        country: "IN",
      }),
    );
  }

  if (
    personal.communicationAddress &&
    !personal.communicationAddress.sameAsKyc &&
    personal.communicationAddress.addressLine
  ) {
    subResources.push(
      addFhirPractitionerAddress(fhirPractitioner.id, {
        use: "work",
        type: "postal",
        line: personal.communicationAddress.addressLine ?? undefined,
        city: personal.communicationAddress.city ?? undefined,
        district: personal.communicationAddress.district ?? undefined,
        state: personal.communicationAddress.state ?? undefined,
        postal_code: personal.communicationAddress.pincode ?? undefined,
        country: "IN",
      }),
    );
  }

  await Promise.all(subResources);
  return fhirPractitioner;
}

/**
 * Adds registration identifier + each degree qualification to an existing
 * FHIR Practitioner. Runs all calls in parallel.
 */
async function syncPractitionerQualificationToFhir(
  fhirPractitionerId: string,
  qualification: TDoctorQualifications,
) {
  const calls: Promise<unknown>[] = [
    // Medical council registration number as a business identifier
    addFhirPractitionerIdentifier(fhirPractitionerId, {
      value: qualification.registrationNumber,
      system: qualification.councilName,
      use: "official",
    }),
  ];

  for (const q of qualification.qualifications) {
    calls.push(
      addFhirPractitionerQualification(fhirPractitionerId, {
        code_text: q.degreeName,
        issuer: q.university,
        identifier_value: `${q.college}-${q.passingYear}`,
        identifier_system: q.countryOfQualification,
      }),
    );
  }

  await Promise.all(calls);
}

export const getAllDoctorsData = createServerAction()
  .input(getAllDoctorSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    return await withMonitoring<TDoctorDatas>(
      "getAllDoctorsData",
      () => getAllDoctorsDataController(input),
      {
        operationErrorMessage: "Failed to get doctor datas.",
      }
    );
  });

export const createDoctorInitialProfile = createServerAction()
  .input(CreateDoctorInitialProfileSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    const result = await withMonitoring<TDoctorInitialProfile>(
      "createDoctorInitialProfile",
      () => createDoctorInitialProfileController(input),
      {
        url: "/bezs/telemedicine/admin/manage-doctors",
        revalidatePath: true,
        operationErrorMessage: "Failed to create initial doctor profile.",
      }
    );

    // Register a placeholder Practitioner on FHIR. Demographics are added
    // when personal details are saved (createOrUpdateDoctorPersonalDetails).
    try {
      await createFhirPractitioner({ active: true, role: "doctor" });
    } catch (err) {
      console.error("[FHIR] createDoctorInitialProfile sync failed:", err);
    }

    return result;
  });

export const deleteDoctorProfile = createServerAction()
  .input(DeleteDoctorProfileSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    return await withMonitoring<TDoctorInitialProfile>(
      "deleteDoctorProfile",
      () => deleteDoctorProfileController(input),
      {
        url: "/bezs/telemedicine/admin/manage-doctors",
        revalidatePath: true,
        operationErrorMessage: "Failed to delete doctor profile.",
      }
    );
  });

export const getDoctorDataById = createServerAction()
  .input(DeleteDoctorProfileSchema, { skipInputParsing: false })
  .handler(async ({ input }) => {
    return await withMonitoring<TDoctor | null>(
      "getDoctorDataById",
      () => getDoctorDataByIdController(input),
      {
        operationErrorMessage: "Failed to get doctor profile.",
      }
    );
  });

export const getDoctorDataByUserId = createServerAction()
  .input(GetDoctorByUserIdSchema, { skipInputParsing: false })
  .handler(async ({ input }) => {
    return await withMonitoring<TDoctor | null>(
      "getDoctorDataById",
      () => getDoctorDataByUserIdController(input),
      {
        operationErrorMessage: "Failed to get doctor profile.",
      }
    );
  });

export const createOrUpdateDoctorPersonalDetails = createServerAction()
  .input(DoctorProfileCreateOrUpdateValidationSchema, {
    skipInputParsing: true,
  })
  .handler(async ({ input }) => {
    const result = await withMonitoring<TDoctorPersonalDetails>(
      "createOrUpdateDoctorPersonalDetails",
      () => createorUpdateDoctorPersonalDetailsController(input),
      {
        url: `/bezs/telemedicine/admin/manage-doctors`,
        revalidateType: "layout",
        revalidatePath: true,
        operationErrorMessage: `Failed to ${
          input.id ? "update" : "create"
        } doctor personal profile.`,
      }
    );

    // Push full demographics + telecom + address to FHIR.
    // TODO: store the returned fhirPractitioner.id in the Doctor table to
    // enable updateFhirPractitioner() on subsequent edits instead of creating
    // a new resource each time.
    try {
      await syncPractitionerPersonalToFhir(result);
    } catch (err) {
      console.error("[FHIR] createOrUpdateDoctorPersonalDetails sync failed:", err);
    }

    return result;
  });

export const createOrUpdateDoctorQualificationDetails = createServerAction()
  .input(DoctorQualificationCreateOrUpdateValidation, {
    skipInputParsing: true,
  })
  .handler(async ({ input }) => {
    const result = await withMonitoring<TDoctorQualifications>(
      "createOrUpdateDoctorPersonalDetails",
      () => createorUpdateDoctorQualificationDetailsController(input),
      {
        url: `/bezs/telemedicine/admin/manage-doctors`,
        revalidatePath: true,
        revalidateType: "layout",
        operationErrorMessage: `Failed to ${
          input.id ? "update" : "create"
        } doctor profile.`,
      }
    );

    // Create a minimal Practitioner stub then attach identifiers + qualifications.
    // TODO: when fhirPractitionerId is stored, skip createFhirPractitioner and
    // call syncPractitionerQualificationToFhir with the stored id directly.
    try {
      const fhirPractitioner = await createFhirPractitioner({
        active: true,
        role: "doctor",
      });
      await syncPractitionerQualificationToFhir(fhirPractitioner.id, result);
    } catch (err) {
      console.error("[FHIR] createOrUpdateDoctorQualificationDetails sync failed:", err);
    }

    return result;
  });

export const createOrUpdateDoctorWorkDetails = createServerAction()
  .input(DoctorWorkDetailCreateOrUpdateValidation, {
    skipInputParsing: true,
  })
  .handler(async ({ input }) => {
    return await withMonitoring<TDoctorWorkDetails>(
      "createOrUpdateDoctorWorkDetails",
      () => createorUpdateDoctorWorkDetailsController(input),
      {
        url: `/bezs/telemedicine/admin/manage-doctors`,
        revalidateType: "layout",
        revalidatePath: true,
        operationErrorMessage: `Failed to ${
          input.id ? "update" : "create"
        } doctor work details.`,
      }
    );
  });

export const createOrUpdateDoctorConcent = createServerAction()
  .input(DoctorConcentCreateOrUpdateValidation, {
    skipInputParsing: true,
  })
  .handler(async ({ input }) => {
    return await withMonitoring<TDoctorConcent>(
      "createOrUpdateDoctorConcent",
      () => createorUpdateDoctorConcentController(input),
      {
        url: `/bezs/telemedicine/admin/manage-doctors`,
        revalidateType: "layout",
        revalidatePath: true,
        operationErrorMessage: `Failed to ${
          input.id ? "update" : "create"
        } doctor concent.`,
      }
    );
  });

export const submitDoctorFullProfile = createServerAction()
  .input(SubmitDoctorFullProfileValidationSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    const result = await withMonitoring<TDoctor>(
      "submitDoctorFullProfile",
      () => submitDoctorFullProfileController(input),
      {
        url: `/bezs/telemedicine/admin/manage-doctors`,
        revalidateType: "layout",
        revalidatePath: true,
        operationErrorMessage: `Failed to ${
          input.personal.id ||
          input.qualification.id ||
          input.work.id ||
          input.concent.id
            ? "update"
            : "create"
        } doctor profile.`,
      }
    );

    // Comprehensive FHIR sync using the full returned Doctor record:
    // 1. Create Practitioner with demographics + telecom + address.
    // 2. Add council registration identifier + all degree qualifications.
    try {
      if (result.personal) {
        const fhirPractitioner = await syncPractitionerPersonalToFhir(result.personal);
        if (result.qualification) {
          await syncPractitionerQualificationToFhir(
            fhirPractitioner.id,
            result.qualification,
          );
        }
      }
    } catch (err) {
      console.error("[FHIR] submitDoctorFullProfile sync failed:", err);
    }

    return result;
  });

export const getDoctorProfileByHPRId = createServerAction()
  .input(CreateDoctorByHPRidSchema, {
    skipInputParsing: true,
  })
  .handler(async ({ input }) => {
    return await withMonitoring<any>(
      "getDoctorProfileByHPRId",
      () => getDoctorProfileByHPRIdController(input),
      {
        // url: `/bezs/telemedicine/admin/manage-doctors`,
        // revalidateType: "layout",
        // revalidatePath: true,
        operationErrorMessage: `Failed to get doctor profile.`,
      }
    );
  });

export const seedAgentDoctors = createServerAction()
  .input(SeedAgentDoctorsValidationSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    const { orgId, createdBy } = input;

    const agentDefs = [
      { userId: "INTAKE", doctorType: "INTAKE" as const },
      { userId: "AIDOCTOR", doctorType: "AIDOCTOR" as const },
    ] as const;

    const created: string[] = [];
    const skipped: string[] = [];

    for (const { userId, doctorType } of agentDefs) {
      const existing = await prismaTelemedicine.doctor.findFirst({
        where: { orgId, userId },
        select: { id: true },
      });

      if (existing) {
        skipped.push(userId);
      } else {
        await prismaTelemedicine.doctor.create({
          data: {
            orgId,
            userId,
            doctorType,
            isCompleted: true,
            createdBy,
            updatedBy: createdBy,
          },
        });
        created.push(userId);
      }
    }

    return { created, skipped };
  });
