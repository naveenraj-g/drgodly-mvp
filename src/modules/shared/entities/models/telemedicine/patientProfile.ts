import z from "zod";

const gender = z.enum(["MALE", "FEMALE", "OTHER"]);

const DefaultFieldsSchema = z.object({
  id: z.string(),
  orgId: z.string(),
  createdBy: z.string().nullable(),
  updatedBy: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const PatientInitialProfileSchema = z
  .object({
    userId: z.string().nullable(),
    patientId: z.number(),
    isCompleted: z.boolean(),
    isABHAPatientProfile: z.boolean(),
  })
  .extend(DefaultFieldsSchema.shape);
export type TPatientInitialProfile = z.infer<
  typeof PatientInitialProfileSchema
>;

export const PatientPersonalDetailsSchema = z
  .object({
    name: z.string(),
    dateOfBirth: z.date(),
    gender: gender,
    insuranceProvider: z.string().nullable(),
    insuranceNumber: z.string().nullable(),
    idCardNumber: z.string().nullable(),
    maritalStatus: z.string(),
    bloodGroup: z.string().nullable(),
    mobileNumber: z.string(),
    email: z.string(),
    address: z.string(),
    alternativeAddress: z.string().nullable(),
    alternativeMobileNumber: z.string().nullable(),
    alternativeEmail: z.string().nullable(),
    patientId: z.string(),
  })
  .extend(DefaultFieldsSchema.shape);
export type TPatientPersonalDetails = z.infer<
  typeof PatientPersonalDetailsSchema
>;

export const PatientCreateOrUpdatePatientProfileSchema =
  PatientPersonalDetailsSchema.omit({
    id: true,
    createdAt: true,
    createdBy: true,
    updatedAt: true,
    updatedBy: true,
  }).extend({
    id: z.string().nullable(),
    operationBy: z.string(),
  });
export type TPatientCreateOrUpdatePatientProfile = z.infer<
  typeof PatientCreateOrUpdatePatientProfileSchema
>;

export const PatientWithPersonalProfileSchema =
  PatientInitialProfileSchema.extend(
    z.object({
      personal: PatientPersonalDetailsSchema.nullable(),
    }).shape
  );
export type TPatientWithPersonalProfile = z.infer<
  typeof PatientWithPersonalProfileSchema
>;
