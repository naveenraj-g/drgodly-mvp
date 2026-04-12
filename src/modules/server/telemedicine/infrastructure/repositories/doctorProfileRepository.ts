import { injectable } from "inversify";
import { IDoctorProfileRepository } from "../../application/repositories/doctorProfileRepository.interface";
import { prismaTelemedicine } from "../../../prisma/prisma";
import {
  DoctorDatasSchema,
  DoctorInitialProfileSchema,
  DoctorSchema,
  TCreateOrUpdateDoctorProfileDetail,
  TDoctor,
  TDoctorDatas,
  TDoctorInitialProfile,
  TDoctorPersonalDetails,
  DoctorPersonalDetailsSchema,
  TCreateOrUpdateDoctorQualificationDetail,
  DoctorQualificationSchema,
  TDoctorQualifications,
  TCreateOrUpdateDoctorWorkDetail,
  TDoctorWorkDetails,
  DoctorWorkDetailsSchema,
  TCreateOrUpdateDoctorConcent,
  TDoctorConcent,
  DoctorConcentSchema,
  TSubmitFullDoctorProfile,
} from "../../../../shared/entities/models/telemedicine/doctorProfile";
import { OperationError } from "../../../../shared/entities/errors/commonError";
import { logOperation } from "../../../../shared/utils/server-logger/log-operation";
import { randomUUID } from "crypto";

injectable();
export class DoctorProfileRepository implements IDoctorProfileRepository {
  constructor() {}

  async getAllDoctorsData(orgId: string): Promise<TDoctorDatas> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    // Start log
    logOperation("start", {
      name: "getAllDoctorsDataRepository",
      startTimeMs,
      context: {
        operationId,
      },
    });

    try {
      const doctorDatas = await prismaTelemedicine.doctor.findMany({
        where: {
          orgId,
          doctorType: "HUMAN",
        },
        include: {
          personal: {
            include: {
              kycAddress: true,
              communicationAddress: true,
              languagesSpoken: true,
              socialAccounts: true,
            },
          },
          qualification: {
            include: {
              qualifications: true,
            },
          },
          workDetail: {
            include: {
              workingFacilityDetails: true,
            },
          },
          concent: true,
        },
      });

      const total = await prismaTelemedicine.doctor.count({
        where: {
          orgId,
        },
      });

      const result = await DoctorDatasSchema.parseAsync({
        doctorDatas,
        total,
      });

      // Success log
      logOperation("success", {
        name: "getAllDoctorsDataRepository",
        startTimeMs,
        context: {
          operationId,
        },
      });

      return result;
    } catch (error) {
      // Error log
      logOperation("error", {
        name: "getAllDoctorsDataRepository",
        startTimeMs,
        err: error,
        errName: "UnknownRepositoryError",
        context: {
          operationId,
        },
      });

      if (error instanceof Error) {
        throw new OperationError(error.message, { cause: error });
      }

      throw new OperationError("An unexpected error occurred", {
        cause: error,
      });
    }
  }

  async createDoctorInitialProfile(
    orgId: string,
    createdBy: string,
    isABDMDoctorProfile: boolean
  ): Promise<TDoctorInitialProfile> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    // Start log
    logOperation("start", {
      name: "createDoctorInitialProfileRepository",
      startTimeMs,
      context: {
        operationId,
      },
    });

    try {
      const initialDoctorProfile = await prismaTelemedicine.doctor.create({
        data: {
          orgId,
          createdBy,
          updatedBy: createdBy,
          isABDMDoctorProfile,
        },
      });

      const data = await DoctorInitialProfileSchema.parseAsync(
        initialDoctorProfile
      );

      // Success log
      logOperation("success", {
        name: "createDoctorInitialProfileRepository",
        startTimeMs,
        context: {
          operationId,
        },
      });

      return data;
    } catch (error) {
      // Error log
      logOperation("error", {
        name: "createDoctorInitialProfileRepository",
        startTimeMs,
        err: error,
        errName: "UnknownRepositoryError",
        context: {
          operationId,
        },
      });

      if (error instanceof Error) {
        throw new OperationError(error.message, { cause: error });
      }

      throw new OperationError("An unexpected error occurred", {
        cause: error,
      });
    }
  }

  async deleteDoctorProfile(id: string): Promise<TDoctorInitialProfile> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    // Start log
    logOperation("start", {
      name: "deleteDoctorProfileRepository",
      startTimeMs,
      context: {
        operationId,
      },
    });

    try {
      const doctorProfileData = await prismaTelemedicine.doctor.delete({
        where: {
          id,
        },
      });

      const data = await DoctorInitialProfileSchema.parseAsync(
        doctorProfileData
      );

      // Success log
      logOperation("success", {
        name: "deleteDoctorProfileRepository",
        startTimeMs,
        context: {
          operationId,
        },
      });

      return data;
    } catch (error) {
      // Error log
      logOperation("error", {
        name: "deleteDoctorProfileRepository",
        startTimeMs,
        err: error,
        errName: "UnknownRepositoryError",
        context: {
          operationId,
        },
      });

      if (error instanceof Error) {
        throw new OperationError(error.message, { cause: error });
      }

      throw new OperationError("An unexpected error occurred", {
        cause: error,
      });
    }
  }

  async getDoctorDataById(id: string): Promise<TDoctor | null> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    // Start log
    logOperation("start", {
      name: "getDoctorDataByIdRepository",
      startTimeMs,
      context: {
        operationId,
      },
    });

    try {
      const doctorData = await prismaTelemedicine.doctor.findUnique({
        where: {
          id,
        },
        include: {
          personal: {
            include: {
              kycAddress: true,
              communicationAddress: true,
              languagesSpoken: true,
              socialAccounts: true,
            },
          },
          qualification: {
            include: {
              qualifications: true,
            },
          },
          workDetail: {
            include: {
              workingFacilityDetails: true,
            },
          },
          concent: true,
        },
      });

      if (!doctorData) return null;

      const data = await DoctorSchema.parseAsync(doctorData);

      // Success log
      logOperation("success", {
        name: "getDoctorDataByIdRepository",
        startTimeMs,
        context: {
          operationId,
        },
      });

      return data;
    } catch (error) {
      // Error log
      logOperation("error", {
        name: "getDoctorDataByIdRepository",
        startTimeMs,
        err: error,
        errName: "UnknownRepositoryError",
        context: {
          operationId,
        },
      });

      if (error instanceof Error) {
        throw new OperationError(error.message, { cause: error });
      }

      throw new OperationError("An unexpected error occurred", {
        cause: error,
      });
    }
  }

  async getDoctorDataByUserId(
    userId: string,
    orgId: string
  ): Promise<TDoctor | null> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    // Start log
    logOperation("start", {
      name: "getDoctorDataByUserIdRepository",
      startTimeMs,
      context: {
        operationId,
      },
    });

    try {
      const doctorData = await prismaTelemedicine.doctor.findUnique({
        where: {
          orgId_userId: {
            orgId,
            userId,
          },
        },
        include: {
          personal: {
            include: {
              kycAddress: true,
              communicationAddress: true,
              languagesSpoken: true,
              socialAccounts: true,
            },
          },
          qualification: {
            include: {
              qualifications: true,
            },
          },
          workDetail: {
            include: {
              workingFacilityDetails: true,
            },
          },
          concent: true,
        },
      });

      if (!doctorData) return null;

      const data = await DoctorSchema.parseAsync(doctorData);

      // Success log
      logOperation("success", {
        name: "getDoctorDataByUserIdRepository",
        startTimeMs,
        context: {
          operationId,
        },
      });

      return data;
    } catch (error) {
      // Error log
      logOperation("error", {
        name: "getDoctorDataByUserIdRepository",
        startTimeMs,
        err: error,
        errName: "UnknownRepositoryError",
        context: {
          operationId,
        },
      });

      if (error instanceof Error) {
        throw new OperationError(error.message, { cause: error });
      }

      throw new OperationError("An unexpected error occurred", {
        cause: error,
      });
    }
  }

  async getDoctorInitialProfileByUniqueFields(
    orgId: string,
    userId: string
  ): Promise<TDoctorInitialProfile | null> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    // Start log
    logOperation("start", {
      name: "getDoctorInitialProfileByUniqueFieldsRepository",
      startTimeMs,
      context: {
        operationId,
      },
    });

    try {
      const initialDoctorProfile = await prismaTelemedicine.doctor.findUnique({
        where: {
          orgId_userId: {
            orgId,
            userId,
          },
        },
      });

      if (!initialDoctorProfile) return null;

      const data = await DoctorInitialProfileSchema.parseAsync(
        initialDoctorProfile
      );

      // Success log
      logOperation("success", {
        name: "getDoctorInitialProfileByUniqueFieldsRepository",
        startTimeMs,
        context: {
          operationId,
        },
      });

      return data;
    } catch (error) {
      // Error log
      logOperation("error", {
        name: "getDoctorInitialProfileByUniqueFieldsRepository",
        startTimeMs,
        err: error,
        errName: "UnknownRepositoryError",
        context: {
          operationId,
        },
      });

      if (error instanceof Error) {
        throw new OperationError(error.message, { cause: error });
      }

      throw new OperationError("An unexpected error occurred", {
        cause: error,
      });
    }
  }

  async createDoctorPersonalDetails(
    createData: TCreateOrUpdateDoctorProfileDetail
  ): Promise<TDoctorPersonalDetails> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    // Start log
    logOperation("start", {
      name: "createDoctorPersonalDetailsRepository",
      startTimeMs,
      context: {
        operationId,
      },
    });

    const {
      languagesSpoken,
      kycAddress,
      communicationAddress,
      socialAccounts,
      operationBy,
      id,
      ...rest
    } = createData;

    if (id) {
      throw new Error("Failed to create doctor profile.");
    }

    if (!rest.orgId || !rest.doctorId) {
      throw new Error(
        "Missing organization or doctor ID while creating profile."
      );
    }

    const lang = languagesSpoken.map((lang) => ({
      langCode: lang,
      orgId: rest.orgId,
      createdBy: operationBy,
      updatedBy: operationBy,
    }));

    const kyc = {
      ...kycAddress,
      orgId: rest.orgId,
      createdBy: operationBy,
      updatedBy: operationBy,
    };

    const comm = {
      ...communicationAddress,
      orgId: rest.orgId,
      createdBy: operationBy,
      updatedBy: operationBy,
    };

    const social =
      socialAccounts?.map((acc) => ({
        orgId: rest.orgId,
        createdBy: operationBy,
        updatedBy: operationBy,
        platform: acc.platform ?? "",
        url: acc.url ?? "",
      })) ?? [];

    try {
      const doctorPersonalDetails =
        await prismaTelemedicine.doctorPersonalDetail.create({
          data: {
            ...rest,
            createdBy: operationBy,
            updatedBy: operationBy,
            languagesSpoken: {
              createMany: {
                data: lang,
              },
            },
            kycAddress: {
              create: kyc,
            },
            communicationAddress: {
              create: comm,
            },
            socialAccounts: {
              createMany: {
                data: social,
              },
            },
          },
          include: {
            communicationAddress: true,
            kycAddress: true,
            languagesSpoken: true,
            socialAccounts: true,
          },
        });

      const data = await DoctorPersonalDetailsSchema.parseAsync(
        doctorPersonalDetails
      );

      // Success log
      logOperation("success", {
        name: "createDoctorPersonalDetailsRepository",
        startTimeMs,
        context: {
          operationId,
        },
      });

      return data;
    } catch (error) {
      // Error log
      logOperation("error", {
        name: "createDoctorPersonalDetailsRepository",
        startTimeMs,
        err: error,
        errName: "UnknownRepositoryError",
        context: {
          operationId,
        },
      });

      if (error instanceof Error) {
        throw new OperationError(error.message, { cause: error });
      }

      throw new OperationError("An unexpected error occurred", {
        cause: error,
      });
    }
  }

  async updateDoctorPersonalDetails(
    editData: TCreateOrUpdateDoctorProfileDetail
  ): Promise<TDoctorPersonalDetails> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    // Start log
    logOperation("start", {
      name: "updateDoctorPersonalDetailsRepository",
      startTimeMs,
      context: {
        operationId,
      },
    });

    const {
      languagesSpoken,
      kycAddress,
      communicationAddress,
      socialAccounts,
      operationBy,
      id,
      ...rest
    } = editData;

    if (!id) {
      throw new Error("Failed to update doctor profile.");
    }

    const lang = languagesSpoken.map((lang) => ({
      langCode: lang,
      orgId: rest.orgId,
      createdBy: operationBy,
      updatedBy: operationBy,
    }));

    const kyc = {
      ...kycAddress,
      orgId: rest.orgId,
      // createdBy: operationBy,
      updatedBy: operationBy,
    };

    const comm = {
      ...communicationAddress,
      orgId: rest.orgId,
      // createdBy: operationBy,
      updatedBy: operationBy,
    };

    const social =
      socialAccounts?.map((acc) => ({
        orgId: rest.orgId,
        createdBy: operationBy,
        updatedBy: operationBy,
        platform: acc.platform ?? "",
        url: acc.url ?? "",
      })) ?? [];

    try {
      const profileData = await prismaTelemedicine.$transaction(async (tx) => {
        // Delete many-to-many relations
        await tx.language.deleteMany({
          where: {
            doctorPersonalDetailId: id,
          },
        });

        await tx.socialAccount.deleteMany({
          where: {
            doctorPersonalDetailId: id,
          },
        });

        // update main personal detail
        await tx.doctorPersonalDetail.update({
          where: { id },
          data: {
            ...rest,
            updatedBy: operationBy,
            languagesSpoken: {
              createMany: { data: lang },
            },
            socialAccounts: {
              createMany: {
                data: social,
              },
            },
          },
        });

        // Upsert KYC address (1-to-1)
        await tx.kYCAddress.upsert({
          where: { doctorPersonalDetailId: id },
          create: {
            ...kyc,
            createdBy: operationBy,
            doctorPersonalDetailId: id,
          },
          update: {
            ...kyc,
            updatedBy: operationBy,
          },
        });

        // Upsert Communication address (1-to-1)
        await tx.communicationAddress.upsert({
          where: { doctorPersonalDetailId: id },
          create: {
            ...comm,
            createdBy: operationBy,
            doctorPersonalDetailId: id,
          },
          update: {
            ...comm,
            updatedBy: operationBy,
          },
        });

        // Finally, return full data with nested relations
        const fullProfileData =
          await prismaTelemedicine.doctorPersonalDetail.findUnique({
            where: { id },
            include: {
              communicationAddress: true,
              kycAddress: true,
              languagesSpoken: true,
              socialAccounts: true,
            },
          });

        return fullProfileData;
      });

      const data = await DoctorPersonalDetailsSchema.parseAsync(profileData);

      // Success log
      logOperation("success", {
        name: "updateDoctorPersonalDetailsRepository",
        startTimeMs,
        context: {
          operationId,
        },
      });

      return data;
    } catch (error) {
      // Error log
      logOperation("error", {
        name: "updateDoctorPersonalDetailsRepository",
        startTimeMs,
        err: error,
        errName: "UnknownRepositoryError",
        context: {
          operationId,
        },
      });

      if (error instanceof Error) {
        throw new OperationError(error.message, { cause: error });
      }

      throw new OperationError("An unexpected error occurred", {
        cause: error,
      });
    }
  }

  async createDoctorQualificationDetails(
    createData: TCreateOrUpdateDoctorQualificationDetail
  ): Promise<TDoctorQualifications> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    // Start log
    logOperation("start", {
      name: "createDoctorQualificationDetailsRepository",
      startTimeMs,
      context: {
        operationId,
      },
    });

    const { qualifications, id, operationBy, ...rest } = createData;

    if (id) {
      throw new Error("Failed to create doctor qualifications profile.");
    }

    const qualificationsData = qualifications.map(({ id, ...restData }) => ({
      ...restData,
      orgId: rest.orgId,
      createdBy: operationBy,
      updatedBy: operationBy,
    }));

    try {
      const qualificationData =
        await prismaTelemedicine.doctorQualification.create({
          data: {
            ...rest,
            createdBy: operationBy,
            updatedBy: operationBy,
            qualifications: {
              createMany: {
                data: qualificationsData,
              },
            },
          },
          include: {
            qualifications: true,
          },
        });

      const data = await DoctorQualificationSchema.parseAsync(
        qualificationData
      );

      // Success log
      logOperation("success", {
        name: "createDoctorQualificationDetailsRepository",
        startTimeMs,
        context: {
          operationId,
        },
      });

      return data;
    } catch (error) {
      // Error log
      logOperation("error", {
        name: "createDoctorQualificationDetailsRepository",
        startTimeMs,
        err: error,
        errName: "UnknownRepositoryError",
        context: {
          operationId,
        },
      });

      if (error instanceof Error) {
        throw new OperationError(error.message, { cause: error });
      }

      throw new OperationError("An unexpected error occurred", {
        cause: error,
      });
    }
  }

  async updateDoctorQualificationDetails(
    updateData: TCreateOrUpdateDoctorQualificationDetail
  ): Promise<TDoctorQualifications> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    // Start log
    logOperation("start", {
      name: "updateDoctorQualificationDetailsRepository",
      startTimeMs,
      context: {
        operationId,
      },
    });

    const { qualifications, id, operationBy, ...rest } = updateData;

    if (!id) {
      throw new Error("Failed to update doctor qualifications profile.");
    }

    const qualificationsData = qualifications.map(
      ({ id, ...qualification }) => ({
        ...qualification,
        orgId: rest.orgId,
        createdBy: operationBy,
        updatedBy: operationBy,
      })
    );

    try {
      const qualificationData = await prismaTelemedicine.$transaction(
        async (tx) => {
          // Delete many-to-many relations
          await tx.qualification.deleteMany({
            where: {
              doctorQualificationId: id,
            },
          });

          const qualification = await tx.doctorQualification.update({
            where: {
              id,
            },
            data: {
              ...rest,
              updatedBy: operationBy,
              qualifications: {
                createMany: {
                  data: qualificationsData,
                },
              },
            },
            include: {
              qualifications: true,
            },
          });

          return qualification;
        }
      );

      const data = await DoctorQualificationSchema.parseAsync(
        qualificationData
      );

      // Success log
      logOperation("success", {
        name: "updateDoctorQualificationDetailsRepository",
        startTimeMs,
        context: {
          operationId,
        },
      });

      return data;
    } catch (error) {
      // Error log
      logOperation("error", {
        name: "updateDoctorQualificationDetailsRepository",
        startTimeMs,
        err: error,
        errName: "UnknownRepositoryError",
        context: {
          operationId,
        },
      });

      if (error instanceof Error) {
        throw new OperationError(error.message, { cause: error });
      }

      throw new OperationError("An unexpected error occurred", {
        cause: error,
      });
    }
  }

  async createDoctorWorkDetails(
    createData: TCreateOrUpdateDoctorWorkDetail
  ): Promise<TDoctorWorkDetails> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    // Start log
    logOperation("start", {
      name: "createDoctorWorkDetailsRepository",
      startTimeMs,
      context: {
        operationId,
      },
    });

    const { workingFacilityDetails, id, operationBy, ...rest } = createData;

    const workingFacilityDetailsData =
      workingFacilityDetails?.map(({ id, ...restData }) => ({
        ...restData,
        orgId: rest.orgId,
        createdBy: operationBy,
        updatedBy: operationBy,
      })) ?? [];

    if (id) {
      throw new Error("Failed to create doctor working profile.");
    }

    try {
      const workingDetails = await prismaTelemedicine.doctorWorkDetail.create({
        data: {
          ...rest,
          createdBy: operationBy,
          updatedBy: operationBy,
          workingFacilityDetails: {
            createMany: {
              data: workingFacilityDetailsData,
            },
          },
        },
        include: {
          workingFacilityDetails: true,
        },
      });

      const data = await DoctorWorkDetailsSchema.parseAsync(workingDetails);

      // Success log
      logOperation("success", {
        name: "createDoctorWorkDetailsRepository",
        startTimeMs,
        context: {
          operationId,
        },
      });

      return data;
    } catch (error) {
      // Error log
      logOperation("error", {
        name: "createDoctorWorkDetailsRepository",
        startTimeMs,
        err: error,
        errName: "UnknownRepositoryError",
        context: {
          operationId,
        },
      });

      if (error instanceof Error) {
        throw new OperationError(error.message, { cause: error });
      }

      throw new OperationError("An unexpected error occurred", {
        cause: error,
      });
    }
  }

  async updateDoctorWorkDetails(
    updateData: TCreateOrUpdateDoctorWorkDetail
  ): Promise<TDoctorWorkDetails> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    // Start log
    logOperation("start", {
      name: "editDoctorWorkDetailsRepository",
      startTimeMs,
      context: {
        operationId,
      },
    });

    const { workingFacilityDetails, id, operationBy, ...rest } = updateData;

    if (!id) {
      throw new Error("Failed to update doctor working details profile.");
    }

    const workingFacilityDetailsData =
      workingFacilityDetails?.map(({ id, ...restData }) => ({
        ...restData,
        orgId: rest.orgId,
        createdBy: operationBy,
        updatedBy: operationBy,
      })) ?? [];

    try {
      const doctorWorkingDetails = await prismaTelemedicine.$transaction(
        async (tx) => {
          // Delete many-to-many relations
          await tx.doctorWorkingFacilityDetail.deleteMany({
            where: {
              doctorWorkId: id,
            },
          });

          const workingDetails = await tx.doctorWorkDetail.update({
            where: {
              id,
            },
            data: {
              ...rest,
              updatedBy: operationBy,
              workingFacilityDetails: {
                createMany: {
                  data: workingFacilityDetailsData,
                },
              },
            },
            include: {
              workingFacilityDetails: true,
            },
          });

          return workingDetails;
        }
      );

      const data = await DoctorWorkDetailsSchema.parseAsync(
        doctorWorkingDetails
      );

      // Success log
      logOperation("success", {
        name: "editDoctorWorkDetailsRepository",
        startTimeMs,
        context: {
          operationId,
        },
      });

      return data;
    } catch (error) {
      // Error log
      logOperation("error", {
        name: "editDoctorWorkDetailsRepository",
        startTimeMs,
        err: error,
        errName: "UnknownRepositoryError",
        context: {
          operationId,
        },
      });

      if (error instanceof Error) {
        throw new OperationError(error.message, { cause: error });
      }

      throw new OperationError("An unexpected error occurred", {
        cause: error,
      });
    }
  }

  async createDoctorConcent(
    createData: TCreateOrUpdateDoctorConcent
  ): Promise<TDoctorConcent> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    // Start log
    logOperation("start", {
      name: "createDoctorConcentRepository",
      startTimeMs,
      context: {
        operationId,
      },
    });

    const { id, operationBy, ...rest } = createData;

    if (id) {
      throw new Error("Failed to create doctor concent details.");
    }

    try {
      const doctorConcent = await prismaTelemedicine.doctorConcent.create({
        data: {
          ...rest,
          createdBy: operationBy,
          updatedBy: operationBy,
        },
      });

      const data = await DoctorConcentSchema.parseAsync(doctorConcent);

      // Success log
      logOperation("success", {
        name: "createDoctorConcentRepository",
        startTimeMs,
        context: {
          operationId,
        },
      });

      return data;
    } catch (error) {
      // Error log
      logOperation("error", {
        name: "createDoctorConcentRepository",
        startTimeMs,
        err: error,
        errName: "UnknownRepositoryError",
        context: {
          operationId,
        },
      });

      if (error instanceof Error) {
        throw new OperationError(error.message, { cause: error });
      }

      throw new OperationError("An unexpected error occurred", {
        cause: error,
      });
    }
  }

  async updateDoctorConcent(
    updateData: TCreateOrUpdateDoctorConcent
  ): Promise<TDoctorConcent> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    // Start log
    logOperation("start", {
      name: "updateDoctorConcentRepository",
      startTimeMs,
      context: {
        operationId,
      },
    });

    const { id, operationBy, ...rest } = updateData;

    if (!id) {
      throw new Error("Failed to update doctor concent details.");
    }

    try {
      const doctorConcent = await prismaTelemedicine.doctorConcent.update({
        where: {
          id,
        },
        data: {
          ...rest,
          updatedBy: operationBy,
        },
      });

      const data = await DoctorConcentSchema.parseAsync(doctorConcent);

      // Success log
      logOperation("success", {
        name: "updateDoctorConcentRepository",
        startTimeMs,
        context: {
          operationId,
        },
      });

      return data;
    } catch (error) {
      // Error log
      logOperation("error", {
        name: "updateDoctorConcentRepository",
        startTimeMs,
        err: error,
        errName: "UnknownRepositoryError",
        context: {
          operationId,
        },
      });

      if (error instanceof Error) {
        throw new OperationError(error.message, { cause: error });
      }

      throw new OperationError("An unexpected error occurred", {
        cause: error,
      });
    }
  }

  async submitDoctorFullProfile({
    doctorId,
    orgId,
    operationBy,
    personal,
    qualification,
    work,
    concent,
  }: TSubmitFullDoctorProfile): Promise<TDoctor> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    logOperation("start", {
      name: "submitDoctorFullProfileRepository",
      startTimeMs,
      context: { operationId },
    });

    try {
      const result = await prismaTelemedicine.$transaction(async (tx) => {
        /** -------------------------------------------------------
         * 1. PERSONAL DETAILS
         * ------------------------------------------------------- */
        if (personal.id) {
          const {
            languagesSpoken,
            kycAddress,
            communicationAddress,
            socialAccounts,
            operationBy,
            id,
            ...restPersonal
          } = personal;

          const lang = languagesSpoken.map((lang) => ({
            langCode: lang,
            orgId: restPersonal.orgId,
            createdBy: operationBy,
            updatedBy: operationBy,
          }));

          const kyc = {
            ...kycAddress,
            orgId: restPersonal.orgId,
            // createdBy: operationBy,
            updatedBy: operationBy,
          };

          const comm = {
            ...communicationAddress,
            orgId: restPersonal.orgId,
            // createdBy: operationBy,
            updatedBy: operationBy,
          };

          const social =
            socialAccounts?.map((acc) => ({
              orgId: restPersonal.orgId,
              createdBy: operationBy,
              updatedBy: operationBy,
              platform: acc.platform ?? "",
              url: acc.url ?? "",
            })) ?? [];

          // update
          // Delete many-to-many relations
          await tx.language.deleteMany({
            where: { doctorPersonalDetailId: personal.id },
          });

          await tx.socialAccount.deleteMany({
            where: { doctorPersonalDetailId: personal.id },
          });

          // update main personal detail
          await tx.doctorPersonalDetail.update({
            where: { id },
            data: {
              ...restPersonal,
              updatedBy: operationBy,
              languagesSpoken: {
                createMany: { data: lang },
              },
              socialAccounts: {
                createMany: {
                  data: social,
                },
              },
            },
          });

          // Upsert KYC address (1-to-1)
          await tx.kYCAddress.upsert({
            where: { doctorPersonalDetailId: id },
            create: {
              ...kyc,
              createdBy: operationBy,
              doctorPersonalDetailId: id,
            },
            update: { ...kyc, updatedBy: operationBy },
          });

          await tx.communicationAddress.upsert({
            where: { doctorPersonalDetailId: id },
            create: {
              ...comm,
              createdBy: operationBy,
              doctorPersonalDetailId: id,
            },
            update: {
              ...comm,
              updatedBy: operationBy,
            },
          });
        } else {
          throw new Error("Cannot submit personal details: missing id");
        }

        /** -------------------------------------------------------
         * 2. QUALIFICATIONS
         * ------------------------------------------------------- */
        if (qualification.id) {
          const { id, qualifications, operationBy, ...restQualification } =
            qualification;

          const qualificationsData = qualifications.map(
            ({ id, ...qualification }) => ({
              ...qualification,
              orgId: restQualification.orgId,
              createdBy: operationBy,
              updatedBy: operationBy,
            })
          );

          // Delete many-to-many relations
          await tx.qualification.deleteMany({
            where: { doctorQualificationId: id },
          });

          await tx.doctorQualification.update({
            where: { id },
            data: {
              ...restQualification,
              updatedBy: operationBy,
              qualifications: {
                createMany: {
                  data: qualificationsData,
                },
              },
            },
          });
        } else {
          throw new Error("Cannot submit qualification details: missing id");
        }

        /** -------------------------------------------------------
         * 3. WORK DETAILS
         * ------------------------------------------------------- */
        if (work.id) {
          const { id, workingFacilityDetails, operationBy, ...restWork } = work;

          const workingFacilityDetailsData =
            workingFacilityDetails?.map(({ id, ...restData }) => ({
              ...restData,
              orgId: restWork.orgId,
              createdBy: operationBy,
              updatedBy: operationBy,
            })) ?? [];

          await tx.doctorWorkingFacilityDetail.deleteMany({
            where: { doctorWorkId: id },
          });

          await tx.doctorWorkDetail.update({
            where: { id },
            data: {
              ...restWork,
              updatedBy: operationBy,
              workingFacilityDetails: {
                createMany: {
                  data: workingFacilityDetailsData,
                },
              },
            },
          });
        } else {
          throw new Error("Cannot submit work details: missing id");
        }

        /** -------------------------------------------------------
         * 4. CONCENT (UPSERT)
         * ------------------------------------------------------- */
        const {
          id: concentId,
          operationBy: concentOperationBy,
          ...restConcent
        } = concent;

        if (concentId) {
          await tx.doctorConcent.update({
            where: { id: concentId },
            data: {
              ...restConcent,
              updatedBy: concentOperationBy,
            },
          });
        } else {
          await tx.doctorConcent.create({
            data: {
              ...restConcent,
              doctorId,
              orgId,
              createdBy: concentOperationBy,
              updatedBy: concentOperationBy,
            },
          });
        }

        /** -------------------------------------------------------
         * 5. MARK PROFILE AS COMPLETED
         * ------------------------------------------------------- */
        await tx.doctor.update({
          where: { id: doctorId },
          data: {
            isCompleted: true,
            updatedBy: operationBy,
          },
        });

        /** -------------------------------------------------------
         * 6. FETCH FULL PROFILE
         * ------------------------------------------------------- */
        return tx.doctor.findUnique({
          where: { id: doctorId },
          include: {
            personal: {
              include: {
                kycAddress: true,
                communicationAddress: true,
                languagesSpoken: true,
                socialAccounts: true,
              },
            },
            qualification: {
              include: { qualifications: true },
            },
            workDetail: {
              include: { workingFacilityDetails: true },
            },
            concent: true,
          },
        });
      });

      const parsed = await DoctorSchema.parseAsync(result);

      logOperation("success", {
        name: "submitDoctorFullProfileRepository",
        startTimeMs,
        context: {
          operationId,
        },
      });

      return parsed;
    } catch (error) {
      logOperation("error", {
        name: "submitDoctorFullProfileRepository",
        startTimeMs,
        err: error,
        errName: "UnknownRepositoryError",
        context: {
          operationId,
        },
      });

      if (error instanceof Error) {
        throw new OperationError(error.message, { cause: error });
      }

      throw new OperationError("An unexpected error occurred", {
        cause: error,
      });
    }
  }
}
