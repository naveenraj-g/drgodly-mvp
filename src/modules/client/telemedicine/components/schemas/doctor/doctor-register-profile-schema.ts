import z from "zod";

const SocialPlatform = z.enum([
  "github",
  "twitter",
  "facebook",
  "linkedin",
  "instagram",
  "youtube",
  "tiktok",
  "other",
]);

const socialSchema = z.object({
  id: z.string(),
  platform: SocialPlatform.optional().or(z.literal("")),
  url: z.string().optional(),
});

export const socialProviderData = Object.values(SocialPlatform.Enum);

export const DoctorPersonalDetailsSchema = z.object({
  title: z.string().min(1, "Title is required"),
  fullName: z.string().min(1, "Full name is required"),
  nationality: z.string().min(1, "Nationality is required"),
  languagesSpoken: z.array(z.string()).min(1, "Select at least one language"),
  dateOfBirth: z.date({ required_error: "Date of birth is required" }),
  gender: z.string().min(1, "Gender is required"),
  // fatherName: z.string().min(1, "Father's name is required"),
  socialAccounts: z.array(socialSchema).optional(),
  kycAddress: z.object({
    careOf: z.string().min(1, "Care of is required"),
    addressLine: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    district: z.string().min(1, "District is required"),
    state: z.string().min(1, "State is required"),
    pincode: z.string().regex(/^\d{6}$/, "Invalid pincode"),
  }),
  communicationAddress: z.object({
    sameAsKyc: z.boolean(),
    careOf: z.string().optional(),
    addressLine: z.string().optional(),
    city: z.string().optional(),
    district: z.string().optional(),
    state: z.string().optional(),
    pincode: z.string().optional(),
  }),
  mobileNumber: z.string().regex(/^\d{10}$/, "Invalid mobile number"),
  email: z.string().email("Invalid email address"),
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
export type TDoctorPersonalDetails = z.infer<
  typeof DoctorPersonalDetailsSchema
>;

const qualificationSchema = z.object({
  id: z.string(),
  countryOfQualification: z.string().min(1, "Country is required"),
  degreeName: z.string().min(1, "Degree name is required"),
  country: z.string().min(1, "Country is required"),
  state: z.string().min(1, "State is required"),
  college: z.string().min(1, "College is required"),
  university: z.string().min(1, "University is required"),
  passingMonth: z.string().min(1, "Month is required"),
  passingYear: z.string().min(1, "Year is required"),
  nameMatchesAadhaar: z.boolean(),
});

export const DoctorQualificationsSchema = z
  .object({
    systemOfMedicine: z.string().min(1, "System of medicine is required"),
    category: z.string().min(1, "Category is required"),
    councilName: z.string().min(1, "Council name is required"),
    registrationNumber: z.string().min(1, "Registration number is required"),
    dateOfFirstRegistration: z.date({
      required_error: "Registration date is required",
    }),
    registrationType: z.enum(["permanent", "renewal"]),
    registrationValidDate: z.date().optional(),
    nameMatchesAadhaar: z.boolean(),
    qualifications: z
      .array(qualificationSchema)
      .min(1, "Add at least one qualification"),
  })
  .refine(
    (data) =>
      data.registrationType === "permanent" ||
      (data.registrationType === "renewal" && data.registrationValidDate),
    {
      message: "Registration valid date is required for renewal type",
      path: ["registrationValidDate"],
    }
  );
export type TDoctorQualifications = z.infer<typeof DoctorQualificationsSchema>;

export const doctorWorkingFacilityDetailSchema = z.object({
  id: z.string(),
  facilityId: z.string().min(1, { message: "Facility Id is required" }),
  facilityStatus: z.boolean(),
  facilityName: z.string().min(1, { message: "Facility name is required" }),
  address: z.string().min(1, { message: "Facility address is required" }),
  state: z.string().min(1, { message: "State is required" }),
  district: z.string().min(1, { message: "State is required" }),
  type: z.string().min(1, { message: "Facility type is required" }),
  department: z.string().min(1, { message: "Working department is required" }),
  designation: z
    .string()
    .min(1, { message: "Working designation is required" }),
});
export type TDoctorWorkingFacilityDetail = z.infer<
  typeof doctorWorkingFacilityDetailSchema
>;

const workStatus = ["government", "private", "both"] as const;

export const DoctorWorkDetailsSchema = z
  .object({
    currentlyWorking: z.boolean(),
    experience: z.string().min(1, "Experience is required"),
    reasonForNotWorking: z.string().optional(),
    otherReason: z.string().optional(),

    natureOfWork: z.string().optional(),
    teleConsultationURL: z.string().optional(),
    workStatus: z.enum(workStatus).optional(),

    governmentCategory: z.enum(["central", "state"]).optional(),
    centralGovernment: z.string().optional(),

    workingFacilityDetails: z
      .array(doctorWorkingFacilityDetailSchema)
      .optional(),

    about: z
      .string()
      .min(50, "About section should be at least 50 characters")
      .max(500, "About section should not exceed 1000 characters"),
  })
  .superRefine((data, ctx) => {
    // 1️⃣ When not currently working → must specify reason
    if (!data.currentlyWorking && !data.reasonForNotWorking) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Reason for not working is required",
        path: ["reasonForNotWorking"],
      });
    }

    // 2️⃣ When reason = "other" → require 'otherReason'
    if (
      !data.currentlyWorking &&
      data.reasonForNotWorking === "other" &&
      !data.otherReason
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please specify the reason for not working",
        path: ["otherReason"],
      });
    }

    // 3️⃣ When currently working → require key work fields
    if (data.currentlyWorking) {
      if (!data.natureOfWork) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Nature of work is required",
          path: ["natureOfWork"],
        });
      }
      if (!data.workStatus) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Work status is required",
          path: ["workStatus"],
        });
      }
    }

    // 4️⃣ Government category validation
    if (data.workStatus === "government" || data.workStatus === "both") {
      if (!data.governmentCategory) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Government category is required",
          path: ["governmentCategory"],
        });
      }

      if (data.governmentCategory === "central" && !data.centralGovernment) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Central government department is required",
          path: ["centralGovernment"],
        });
      }
    }

    // 5️⃣ When currently working → require at least one facility
    if (data.currentlyWorking) {
      if (
        !data.workingFacilityDetails ||
        data.workingFacilityDetails.length === 0
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "At least one working facility detail is required",
          path: ["workingFacilityDetails"],
        });
      }
    }

    // 6️⃣ When not working → workingFacilityDetails must be empty or ignored
    if (!data.currentlyWorking && data.workingFacilityDetails?.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Working facility details should be empty when not currently working",
        path: ["workingFacilityDetails"],
      });
    }
  });

export type TDoctorWorkDetails = z.infer<typeof DoctorWorkDetailsSchema>;

export const DoctorConcentSchema = z.object({
  isAgreeToShowDetailsPublic: z.boolean().optional(),
  name: z.boolean(),
  systemOfMedicine: z.boolean(),
  qualification: z.boolean(),
  experience: z.boolean(),
  showToPublic: z.boolean().optional(),
  email: z.boolean().optional(),
  contactNumber: z.boolean().optional(),
  placeOfWork: z.boolean().optional(),
  profilePicture: z.boolean().optional(),
  languageSpoken: z.boolean().optional(),
  workStatus: z.boolean().optional(),
  teleConsultation: z.boolean().optional(),
  isDeclearedToCreateDoctorAccount: z.boolean(),
});
export type TDoctorConcent = z.infer<typeof DoctorConcentSchema>;
