import z from "zod";

export const IdSchema = z.object({
  id: z.string(),
  userId: z.string(),
  orgId: z.string(),
  createdBy: z.string(),
  isABHAPatientProfile: z.boolean(),
});

export const CreatePatientInitialProfileSchema = IdSchema.pick({
  createdBy: true,
  orgId: true,
  userId: true,
  isABHAPatientProfile: true,
});

export const PatientPersonalDetailsSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  dateOfBirth: z.date({ required_error: "Date of birth is required" }),
  gender: z.enum(["MALE", "FEMALE", "OTHER"], {
    required_error: "Gender is required",
  }),
  insuranceProvider: z.string().nullable(),
  insuranceNumber: z.string().nullable(),
  idCardNumber: z.string().nullable(),
  maritalStatus: z.string().min(1, "Marital status is required"),
  bloodGroup: z.string().nullable(),

  mobileNumber: z.string().regex(/^\d{10}$/, "Invalid mobile number"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(1, "Address required"),
  alternativeAddress: z.string().nullable(),
  alternativeMobileNumber: z
    .string()
    .transform((val) => (val === "" ? null : val))
    .refine((val) => !val || /^\d{10}$/.test(val), "Invalid mobile number")
    .nullable(),
  alternativeEmail: z
    .string()
    .transform((val) => (val === "" ? null : val))
    .refine(
      (val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      "Invalid mobile number"
    )
    .nullable(),
});
export type TPatientPersonalDetails = z.infer<
  typeof PatientPersonalDetailsSchema
>;

export const MedicalDetailsSchema = z.object({
  pastDiagnoses: z.string().min(1, "Past diagnoses is required"),
  pastSurgeries: z.string().min(1, "Past surgeries is required"),
  allergies: z.string().min(1, "Allergies is required"),
  immunization: z.string().min(1, "Immunization is required"),
  ongoingTreatment: z.string().min(1, "Ongoing treatment is required"),
  familyHistory: z.string().min(1, "Family history is required"),

  drugName: z.string().min(1, "Drug name is required"),
  fromDate: z.date({ required_error: "From date is required" }),
  toDate: z.date({ required_error: "To date is required" }),
  dose: z.string().min(1, "Dose is required"),
  frequency: z.string().min(1, "Frequency is required"),
  duration: z.string().min(1, "Duration is required"),
});

export type TMedicalDetails = z.infer<typeof MedicalDetailsSchema>;

export const LabResultSchema = z.object({
  parameter: z.string().min(1, { message: "Parameter is required" }),
  value: z.string().min(1, { message: "Value is required" }),
  range: z.string().min(1, { message: "Range is required" }),
  units: z.string().min(1, { message: "Units is required" }),
  abnormalFlag: z.string().min(1, { message: "Abnormal flag is required" }),
  labReportDate: z.date({ required_error: "Lab report date is required" }),
  labReportRefNo: z
    .string()
    .min(1, { message: "Lab report reference number is required" }),
  labName: z.string().min(1, { message: "Lab name is required" }),
});
export type TLabResultDetail = z.infer<typeof LabResultSchema>;

export const LifestyleDetailsSchema = z.object({
  bp: z.string().min(1, "Blood Pressure is required"),
  hr: z.string().min(1, "Heart Rate is required"),
  temp: z.string().min(1, "Temperature is required"),
  bmi: z.string().min(1, "BMI is required"),
  oxygenSat: z.string().min(1, "Oxygen Saturation is required"),
  asOnDate: z.date({ message: "As on date is required" }),

  smoking: z.string().min(1, "Smoking detail is required"),
  alcohol: z.string().min(1, "Alcohol detail is required"),
  exercise: z.string().min(1, "Exercise detail is required"),
  diet: z.string().min(1, "Diet detail is required"),
});

export type TLifeStyleDetails = z.infer<typeof LifestyleDetailsSchema>;

export const PatientProfileCreateOrUpdateValidationSchema = z
  .object({
    id: z.string().nullable(),
    orgId: z.string(),
    operationBy: z.string(),
    patientId: z.string(),
  })
  .merge(PatientPersonalDetailsSchema);
export type TPatientProfileCreateValidation = z.infer<
  typeof PatientProfileCreateOrUpdateValidationSchema
>;

export const GetPatientWithPersonalProfileSchema = z.object({
  orgId: z.string(),
  userId: z.string(),
});
