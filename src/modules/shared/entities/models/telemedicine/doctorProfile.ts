import z from "zod";

const DefaultFieldsSchema = z.object({
  id: z.string(),
  orgId: z.string(),
  createdBy: z.string().nullable(),
  updatedBy: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

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

const SocialSchema = z
  .object({
    platform: SocialPlatform.optional().or(z.literal("")),
    url: z.string().optional(),
    doctorPersonalDetailId: z.string(),
  })
  .merge(DefaultFieldsSchema);

const LanguageSpoken = z
  .object({
    langCode: z.string(),
    doctorPersonalDetailId: z.string(),
  })
  .merge(DefaultFieldsSchema);

export const DoctorPersonalDetailsSchema = z
  .object({
    title: z.string(),
    fullName: z.string(),
    nationality: z.string(),
    dateOfBirth: z.date(),
    gender: z.string(),
    mobileNumber: z.string(),
    email: z.string().email(),
    speciality: z.string(),
    alternativeMobileNumber: z.string().nullable(),
    alternativeEmail: z.string().nullable(),
    doctorId: z.string(),
    languagesSpoken: z.array(LanguageSpoken),
    socialAccounts: z.array(SocialSchema),
    kycAddress: z
      .object({
        careOf: z.string(),
        addressLine: z.string(),
        city: z.string(),
        district: z.string(),
        state: z.string(),
        pincode: z.string(),
        doctorPersonalDetailId: z.string(),
      })
      .merge(DefaultFieldsSchema)
      .nullable(),
    communicationAddress: z
      .object({
        sameAsKyc: z.boolean(),
        careOf: z.string().nullable(),
        addressLine: z.string().nullable(),
        city: z.string().nullable(),
        district: z.string().nullable(),
        state: z.string().nullable(),
        pincode: z.string().nullable(),
        doctorPersonalDetailId: z.string(),
      })
      .merge(DefaultFieldsSchema)
      .nullable(),
  })
  .merge(DefaultFieldsSchema);
export type TDoctorPersonalDetails = z.infer<
  typeof DoctorPersonalDetailsSchema
>;

export type TDoctorProfileDetailsCreateData = {
  doctorData: {
    orgId: string;
    userId: string;
    doctorId: string;
  };
  profileData: TDoctorPersonalDetails;
};

const qualificationSchema = z
  .object({
    countryOfQualification: z.string(),
    degreeName: z.string(),
    country: z.string(),
    state: z.string(),
    college: z.string(),
    university: z.string(),
    passingMonth: z.string(),
    passingYear: z.string(),
    nameMatchesAadhaar: z.boolean(),
    doctorQualificationId: z.string(),
  })
  .merge(DefaultFieldsSchema);

export const DoctorQualificationSchema = z
  .object({
    systemOfMedicine: z.string(),
    category: z.string(),
    councilName: z.string(),
    registrationNumber: z.string(),
    dateOfFirstRegistration: z.date(),
    registrationType: z.enum(["permanent", "renewal"]),
    registrationValidDate: z.date().nullable(),
    nameMatchesAadhaar: z.boolean(),
    doctorId: z.string(),
    qualifications: z.array(qualificationSchema),
  })
  .merge(DefaultFieldsSchema);
export type TDoctorQualifications = z.infer<typeof DoctorQualificationSchema>;

export const DoctorWorkingFacilityDetailSchema = z
  .object({
    facilityId: z.string(),
    facilityStatus: z.boolean(),
    facilityName: z.string(),
    address: z.string(),
    state: z.string(),
    district: z.string(),
    type: z.string(),
    department: z.string(),
    designation: z.string(),
    doctorWorkId: z.string(),
  })
  .merge(DefaultFieldsSchema);
export type TDoctorWorkingFacilityDetail = z.infer<
  typeof DoctorWorkingFacilityDetailSchema
>;

const workStatus = ["government", "private", "both"] as const;

export const DoctorWorkDetailsSchema = z
  .object({
    currentlyWorking: z.boolean(),
    experience: z.string(),
    reasonForNotWorking: z.string().nullable(),
    otherReason: z.string().nullable(),
    natureOfWork: z.string().nullable(),
    teleConsultationURL: z.string().nullable(),
    workStatus: z.enum(workStatus).nullable(),
    governmentCategory: z.enum(["central", "state"]).nullable(),
    centralGovernment: z.string().nullable(),
    doctorId: z.string(),

    workingFacilityDetails: z.array(DoctorWorkingFacilityDetailSchema),

    about: z.string(),
  })
  .merge(DefaultFieldsSchema);
export type TDoctorWorkDetails = z.infer<typeof DoctorWorkDetailsSchema>;

export const DoctorConcentSchema = z
  .object({
    isAgreeToShowDetailsPublic: z.boolean(),
    name: z.boolean(),
    systemOfMedicine: z.boolean(),
    qualification: z.boolean(),
    experience: z.boolean(),
    // showToPublic: z.boolean().optional(),
    email: z.boolean().nullable(),
    contactNumber: z.boolean().nullable(),
    placeOfWork: z.boolean().nullable(),
    profilePicture: z.boolean().nullable(),
    languageSpoken: z.boolean().nullable(),
    workStatus: z.boolean().nullable(),
    teleConsultation: z.boolean().nullable(),
    isDeclearedToCreateDoctorAccount: z.boolean(),
    doctorId: z.string(),
  })
  .merge(DefaultFieldsSchema);
export type TDoctorConcent = z.infer<typeof DoctorConcentSchema>;

export const DoctorSchema = z
  .object({
    userId: z.string().nullable(),
    doctorId: z.number(),
    isCompleted: z.boolean(),
    registrationNumber: z.string().nullable(),
    registrationProvider: z.string().nullable(),
    isABDMDoctorProfile: z.boolean().nullable(),
    personal: DoctorPersonalDetailsSchema.nullable(),
    qualification: DoctorQualificationSchema.nullable(),
    workDetail: DoctorWorkDetailsSchema.nullable(),
    concent: DoctorConcentSchema.nullable(),
  })
  .merge(DefaultFieldsSchema);
export type TDoctor = z.infer<typeof DoctorSchema>;

export const DoctorDatasSchema = z.object({
  doctorDatas: z.array(DoctorSchema),
  total: z.number(),
});
export type TDoctorDatas = z.infer<typeof DoctorDatasSchema>;

export const DoctorInitialProfileSchema = z
  .object({
    userId: z.string().nullable(),
    doctorId: z.number(),
    isCompleted: z.boolean(),
    isABDMDoctorProfile: z.boolean(),
  })
  .merge(DefaultFieldsSchema);
export type TDoctorInitialProfile = z.infer<typeof DoctorInitialProfileSchema>;

const AddressSchema = z.object({
  careOf: z.string(),
  addressLine: z.string(),
  city: z.string(),
  district: z.string(),
  state: z.string(),
  pincode: z.string(),
});

export const createOrUpdateDoctorProfileDetailSchema =
  DoctorPersonalDetailsSchema.omit({
    kycAddress: true,
    communicationAddress: true,
    languagesSpoken: true,
    socialAccounts: true,
    id: true,
    createdAt: true,
    createdBy: true,
    updatedAt: true,
    updatedBy: true,
  }).merge(
    z.object({
      id: z.string().nullable(),
      operationBy: z.string(),
      languagesSpoken: z.array(z.string()),
      socialAccounts: z
        .array(
          z.object({
            id: z.string(),
            platform: SocialPlatform.optional().or(z.literal("")),
            url: z.string().optional(),
          })
        )
        .optional(),
      kycAddress: AddressSchema,
      communicationAddress: z.object({
        sameAsKyc: z.boolean(),
        careOf: z.string().optional(),
        addressLine: z.string().optional(),
        city: z.string().optional(),
        district: z.string().optional(),
        state: z.string().optional(),
        pincode: z.string().optional(),
      }),
    })
  );
export type TCreateOrUpdateDoctorProfileDetail = z.infer<
  typeof createOrUpdateDoctorProfileDetailSchema
>;

export const createOrUpdateDoctorQualificationDetailSchema =
  DoctorQualificationSchema.omit({
    qualifications: true,
    id: true,
    createdAt: true,
    createdBy: true,
    updatedAt: true,
    updatedBy: true,
  }).merge(
    z.object({
      id: z.string().nullable(),
      operationBy: z.string(),
      orgId: z.string(),
      qualifications: z.array(
        qualificationSchema.omit({
          doctorQualificationId: true,
          orgId: true,
          createdAt: true,
          createdBy: true,
          updatedAt: true,
          updatedBy: true,
        })
      ),
    })
  );

export type TCreateOrUpdateDoctorQualificationDetail = z.infer<
  typeof createOrUpdateDoctorQualificationDetailSchema
>;

export const createOrUpdateDoctorWorkDetailSchema =
  DoctorWorkDetailsSchema.omit({
    workingFacilityDetails: true,
    id: true,
    createdAt: true,
    createdBy: true,
    updatedAt: true,
    updatedBy: true,
  }).merge(
    z.object({
      id: z.string().nullable(),
      operationBy: z.string(),
      workingFacilityDetails: z
        .array(
          DoctorWorkingFacilityDetailSchema.omit({
            doctorWorkId: true,
            orgId: true,
            createdBy: true,
            updatedBy: true,
            createdAt: true,
            updatedAt: true,
          })
        )
        .optional(),
    })
  );
export type TCreateOrUpdateDoctorWorkDetail = z.infer<
  typeof createOrUpdateDoctorWorkDetailSchema
>;

export const createOrUpdateDoctorConcentSchema = DoctorConcentSchema.omit({
  id: true,
  createdAt: true,
  createdBy: true,
  updatedAt: true,
  updatedBy: true,
}).merge(
  z.object({
    id: z.string().nullable(),
    operationBy: z.string(),
  })
);
export type TCreateOrUpdateDoctorConcent = z.infer<
  typeof createOrUpdateDoctorConcentSchema
>;

export type TSubmitFullDoctorProfile = {
  doctorId: string;
  orgId: string;
  operationBy: string;
  personal: TCreateOrUpdateDoctorProfileDetail;
  qualification: TCreateOrUpdateDoctorQualificationDetail;
  work: TCreateOrUpdateDoctorWorkDetail;
  concent: TCreateOrUpdateDoctorConcent;
};
