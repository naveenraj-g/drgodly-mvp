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
  updateFhirPractitioner,
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

function toFhirDate(d: Date | string): string {
  return new Date(d).toISOString().split("T")[0];
}

function toFhirGender(g: string): "male" | "female" | "other" | "unknown" {
  switch (g.toLowerCase()) {
    case "male": return "male";
    case "female": return "female";
    case "other": return "other";
    default: return "unknown";
  }
}

type PersonalFhirInput = {
  fullName: string;
  gender: string;
  dateOfBirth: Date | string;
  mobileNumber: string;
  email: string;
  speciality: string;
  alternativeMobileNumber?: string | null;
  kycAddress?: {
    addressLine: string;
    city: string;
    district: string;
    state: string;
    pincode: string;
  } | null;
  communicationAddress?: {
    sameAsKyc: boolean;
    addressLine?: string | null;
    city?: string | null;
    district?: string | null;
    state?: string | null;
    pincode?: string | null;
  } | null;
};

type QualificationFhirInput = {
  registrationNumber: string;
  councilName: string;
  qualifications: Array<{
    degreeName: string;
    university: string;
    college: string;
    passingYear: string;
    countryOfQualification: string;
  }>;
};

/**
 * Creates or updates a Practitioner on FHIR using personal detail data.
 * Returns the fhirPractitionerId that was created or updated.
 */
async function syncPractitionerPersonalToFhir(
  personal: PersonalFhirInput,
  existingFhirPractitionerId?: number | null,
): Promise<number> {
  const { given_name, family_name } = parseDoctorName(personal.fullName);

  let fhirPractitionerId: number;

  if (existingFhirPractitionerId) {
    const updated = await updateFhirPractitioner(String(existingFhirPractitionerId), {
      given_name,
      family_name,
      gender: toFhirGender(personal.gender),
      birth_date: toFhirDate(personal.dateOfBirth),
      active: true,
    });
    fhirPractitionerId = Number(updated.id);
  } else {
    const created = await createFhirPractitioner({
      given_name,
      family_name,
      gender: toFhirGender(personal.gender),
      birth_date: toFhirDate(personal.dateOfBirth),
      active: true,
      role: "doctor",
      specialty: personal.speciality,
    });
    fhirPractitionerId = Number(created.id);
  }

  const subResources: Promise<unknown>[] = [
    addFhirPractitionerTelecom(String(fhirPractitionerId), {
      system: "phone",
      value: personal.mobileNumber,
      use: "mobile",
      rank: 1,
    }),
    addFhirPractitionerTelecom(String(fhirPractitionerId), {
      system: "email",
      value: personal.email,
      use: "work",
      rank: 2,
    }),
  ];

  if (personal.alternativeMobileNumber) {
    subResources.push(
      addFhirPractitionerTelecom(String(fhirPractitionerId), {
        system: "phone",
        value: personal.alternativeMobileNumber,
        use: "mobile",
        rank: 3,
      }),
    );
  }

  if (personal.kycAddress) {
    subResources.push(
      addFhirPractitionerAddress(String(fhirPractitionerId), {
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
      addFhirPractitionerAddress(String(fhirPractitionerId), {
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
  return fhirPractitionerId;
}

/**
 * Adds registration identifier + each degree qualification to an existing
 * FHIR Practitioner. Runs all calls in parallel.
 */
async function syncPractitionerQualificationToFhir(
  fhirPractitionerId: number,
  qualification: QualificationFhirInput,
) {
  const calls: Promise<unknown>[] = [
    addFhirPractitionerIdentifier(String(fhirPractitionerId), {
      value: qualification.registrationNumber,
      system: qualification.councilName,
      use: "official",
    }),
  ];

  for (const q of qualification.qualifications) {
    calls.push(
      addFhirPractitionerQualification(String(fhirPractitionerId), {
        code_text: q.degreeName,
        issuer: q.university,
        identifier_value: `${q.college}-${q.passingYear}`,
        identifier_system: q.countryOfQualification,
      }),
    );
  }

  await Promise.all(calls);
}

async function getDoctorFhirId(doctorId: string): Promise<number | null> {
  try {
    const doc = await prismaTelemedicine.doctor.findUnique({
      where: { id: doctorId },
      select: { fhirPractitionerId: true },
    });
    return doc?.fhirPractitionerId ?? null;
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────

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
    // Push placeholder Practitioner to FHIR first, store the returned ID
    let fhirPractitionerId: number | undefined;
    try {
      const fhirPractitioner = await createFhirPractitioner({ active: true, role: "doctor" });
      fhirPractitionerId = Number(fhirPractitioner.id);
    } catch (err) {
      console.error("[FHIR] createDoctorInitialProfile sync failed:", err);
    }

    return await withMonitoring<TDoctorInitialProfile>(
      "createDoctorInitialProfile",
      () => createDoctorInitialProfileController(input, fhirPractitionerId),
      {
        url: "/bezs/telemedicine/admin/manage-doctors",
        revalidatePath: true,
        operationErrorMessage: "Failed to create initial doctor profile.",
      }
    );
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
    // Get existing fhirPractitionerId if this is an update
    const existingFhirId = input.id ? await getDoctorFhirId(input.doctorId) : null;

    // Push personal details to FHIR first
    let fhirPractitionerId: number | undefined;
    try {
      fhirPractitionerId = await syncPractitionerPersonalToFhir(input, existingFhirId);
    } catch (err) {
      console.error("[FHIR] createOrUpdateDoctorPersonalDetails sync failed:", err);
    }

    return await withMonitoring<TDoctorPersonalDetails>(
      "createOrUpdateDoctorPersonalDetails",
      () => createorUpdateDoctorPersonalDetailsController(input, fhirPractitionerId),
      {
        url: `/bezs/telemedicine/admin/manage-doctors`,
        revalidateType: "layout",
        revalidatePath: true,
        operationErrorMessage: `Failed to ${
          input.id ? "update" : "create"
        } doctor personal profile.`,
      }
    );
  });

export const createOrUpdateDoctorQualificationDetails = createServerAction()
  .input(DoctorQualificationCreateOrUpdateValidation, {
    skipInputParsing: true,
  })
  .handler(async ({ input }) => {
    // Get or create a FHIR Practitioner, then sync qualifications
    let fhirPractitionerId: number | undefined;
    try {
      const existingFhirId = await getDoctorFhirId(input.doctorId);

      if (existingFhirId) {
        // Practitioner already exists — just push qualifications
        await syncPractitionerQualificationToFhir(existingFhirId, input);
        fhirPractitionerId = existingFhirId;
      } else {
        // Create a stub Practitioner then attach qualifications
        const fhirPractitioner = await createFhirPractitioner({ active: true, role: "doctor" });
        const newFhirId = Number(fhirPractitioner.id);
        await syncPractitionerQualificationToFhir(newFhirId, input);
        fhirPractitionerId = newFhirId;
      }
    } catch (err) {
      console.error("[FHIR] createOrUpdateDoctorQualificationDetails sync failed:", err);
    }

    return await withMonitoring<TDoctorQualifications>(
      "createOrUpdateDoctorPersonalDetails",
      () => createorUpdateDoctorQualificationDetailsController(input, fhirPractitionerId),
      {
        url: `/bezs/telemedicine/admin/manage-doctors`,
        revalidatePath: true,
        revalidateType: "layout",
        operationErrorMessage: `Failed to ${
          input.id ? "update" : "create"
        } doctor profile.`,
      }
    );
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
    // Get existing fhirPractitionerId, then FHIR sync first
    let fhirPractitionerId: number | undefined;
    try {
      const existingFhirId = await getDoctorFhirId(input.doctorId);
      fhirPractitionerId = await syncPractitionerPersonalToFhir(
        input.personal,
        existingFhirId,
      );
      await syncPractitionerQualificationToFhir(fhirPractitionerId, input.qualification);
    } catch (err) {
      console.error("[FHIR] submitDoctorFullProfile sync failed:", err);
    }

    return await withMonitoring<TDoctor>(
      "submitDoctorFullProfile",
      () => submitDoctorFullProfileController(input, fhirPractitionerId),
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
