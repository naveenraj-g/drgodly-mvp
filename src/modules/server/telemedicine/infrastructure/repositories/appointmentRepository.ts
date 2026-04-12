import { injectable } from "inversify";
import { IAppointmentRepository } from "../../application/repositories/appointmentRepository.interface";
import { randomUUID } from "crypto";
import { logOperation } from "../../../../shared/utils/server-logger/log-operation";
import { OperationError } from "../../../../shared/entities/errors/commonError";
import { prismaTelemedicine } from "../../../prisma/prisma";
import {
  AppointmentSchema,
  AppointmentsSchema,
  GetAppointmentByIdsSchema,
  IntakeAppointmentSchema,
  TAppointment,
  TAppointments,
  TBookAppointment,
  TBookIntakeAppointment,
  TCancelAppointment,
  TGetAppointmentByIds,
  TIntakeAppointment,
  TRescheduleAppointment,
} from "../../../../shared/entities/models/telemedicine/appointment";

injectable();
export class AppointmentRepository implements IAppointmentRepository {
  constructor() {}

  async getAppointmentsForDoctor(
    doctorId: string,
    orgId: string
  ): Promise<TAppointments> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    // Start log
    logOperation("start", {
      name: "getAppointmentForDoctorRepository",
      startTimeMs,
      context: {
        operationId,
      },
    });

    try {
      const appointements = await prismaTelemedicine.appointment.findMany({
        where: {
          doctorId,
          orgId,
          isDoctorDeleted: false,
        },
        orderBy: {
          appointmentDate: "asc",
        },
        omit: {
          doctorId: true,
          patientId: true,
        },
        include: {
          appointmentActual: {
            omit: {
              createdAt: true,
              createdBy: true,
              updatedAt: true,
              updatedBy: true,
            },
          },
          patient: {
            omit: {
              id: true,
              patientId: true,
              isABHAPatientProfile: true,
              isCompleted: true,
              createdAt: true,
              updatedAt: true,
              updatedBy: true,
              createdBy: true,
            },
            include: {
              personal: {
                select: {
                  name: true,
                  orgId: true,
                  id: true,
                  gender: true,
                },
              },
            },
          },
          doctor: {
            omit: {
              doctorId: true,
              id: true,
              isABDMDoctorProfile: true,
              registrationNumber: true,
              registrationProvider: true,
              isCompleted: true,
              createdAt: true,
              updatedAt: true,
              updatedBy: true,
              createdBy: true,
            },
            include: {
              personal: {
                select: {
                  fullName: true,
                  orgId: true,
                  id: true,
                  gender: true,
                },
              },
            },
          },
        },
      });

      const data = await AppointmentsSchema.parseAsync(appointements);

      // Success log
      logOperation("success", {
        name: "getAppointmentForDoctorRepository",
        startTimeMs,
        context: {
          operationId,
        },
      });

      return data;
    } catch (error) {
      // Error log
      logOperation("error", {
        name: "getAppointmentForDoctorRepository",
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

  async getAppointmentsForPatient(
    patientId: string,
    orgId: string
  ): Promise<TAppointments> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    // Start log
    logOperation("start", {
      name: "getAppointmentForPatientRepository",
      startTimeMs,
      context: {
        operationId,
      },
    });

    try {
      const appointements = await prismaTelemedicine.appointment.findMany({
        where: {
          patientId,
          orgId,
          isPatientDeleted: false,
          appointmentMode: {
            not: "INTAKE",
          },
        },
        orderBy: [{ appointmentDate: "asc" }, { time: "asc" }],
        omit: {
          doctorId: true,
          patientId: true,
        },
        include: {
          appointmentActual: {
            omit: {
              createdAt: true,
              createdBy: true,
              updatedAt: true,
              updatedBy: true,
              intakeConversation: true,
              virtualConversation: true,
            },
          },
          patient: {
            omit: {
              id: true,
              patientId: true,
              isABHAPatientProfile: true,
              isCompleted: true,
              createdAt: true,
              updatedAt: true,
              updatedBy: true,
              createdBy: true,
            },
            include: {
              personal: {
                select: {
                  name: true,
                  orgId: true,
                  id: true,
                  gender: true,
                },
              },
            },
          },
          doctor: {
            omit: {
              doctorId: true,
              id: true,
              isABDMDoctorProfile: true,
              registrationNumber: true,
              registrationProvider: true,
              isCompleted: true,
              createdAt: true,
              updatedAt: true,
              updatedBy: true,
              createdBy: true,
            },
            include: {
              personal: {
                select: {
                  fullName: true,
                  orgId: true,
                  id: true,
                  gender: true,
                },
              },
            },
          },
        },
      });

      const data = await AppointmentsSchema.parseAsync(appointements);

      // Success log
      logOperation("success", {
        name: "getAppointmentForPatientRepository",
        startTimeMs,
        context: {
          operationId,
        },
      });

      return data;
    } catch (error) {
      // Error log
      logOperation("error", {
        name: "getAppointmentForPatientRepository",
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

  async bookAppointment(
    appointmentData: TBookAppointment
  ): Promise<TAppointment> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    // Start log
    logOperation("start", {
      name: "bookAppointmentRepository",
      startTimeMs,
      context: {
        operationId,
      },
    });

    const { userId, intakeId, ...rest } = appointmentData;

    try {
      const appointment = await prismaTelemedicine.$transaction(async (tx) => {
        const doctorAppointment = await tx.appointment.create({
          data: {
            ...rest,
            createdBy: userId,
            updatedBy: userId,
          },
          include: {
            appointmentActual: {
              omit: {
                createdAt: true,
                createdBy: true,
                updatedAt: true,
                updatedBy: true,
                intakeConversation: true,
                virtualConversation: true,
              },
            },
            patient: {
              omit: {
                createdAt: true,
                updatedAt: true,
                updatedBy: true,
                createdBy: true,
              },
              include: {
                personal: {
                  select: {
                    name: true,
                    orgId: true,
                    id: true,
                    gender: true,
                  },
                },
              },
            },
            doctor: {
              omit: {
                doctorId: true,
                id: true,
                isABDMDoctorProfile: true,
                registrationNumber: true,
                registrationProvider: true,
                isCompleted: true,
                createdAt: true,
                updatedAt: true,
                updatedBy: true,
                createdBy: true,
              },
              include: {
                personal: {
                  select: {
                    fullName: true,
                    orgId: true,
                    id: true,
                    gender: true,
                  },
                },
              },
            },
          },
        });

        if (intakeId) {
          await tx.preAppointmentMap.create({
            data: {
              intakeAppointmentId: intakeId,
              followUpAppointmentId: doctorAppointment.id,
            },
          });
        }

        return doctorAppointment;
      });

      const data = await AppointmentSchema.parseAsync(appointment);

      // Success log
      logOperation("success", {
        name: "bookAppointmentRepository",
        startTimeMs,
        context: {
          operationId,
        },
      });

      return data;
    } catch (error) {
      // Error log
      logOperation("error", {
        name: "bookAppointmentRepository",
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

  async bookIntakeAppointment(
    appointmentData: TBookIntakeAppointment
  ): Promise<TIntakeAppointment> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    // Start log
    logOperation("start", {
      name: "bookIntakeAppointment",
      startTimeMs,
      context: {
        operationId,
      },
    });

    const { userId, orgId, intakeConversation, intakeReport, ...rest } =
      appointmentData;

    try {
      const appointment = await prismaTelemedicine.appointment.create({
        data: {
          ...rest,
          orgId,
          createdBy: userId,
          updatedBy: userId,
          appointmentActual: {
            create: {
              orgId,
              intakeConversation,
              intakeReport,
            },
          },
        },
        select: {
          id: true,
        },
      });

      const data = await IntakeAppointmentSchema.parseAsync(appointment);

      // Success log
      logOperation("success", {
        name: "bookIntakeAppointment",
        startTimeMs,
        context: {
          operationId,
        },
      });

      return data;
    } catch (error) {
      // Error log
      logOperation("error", {
        name: "bookIntakeAppointment",
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

  async rescheduleAppointment(
    rescheduleData: TRescheduleAppointment,
    status: "RESCHEDULED" | "PENDING"
  ): Promise<TAppointment> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    // Start log
    logOperation("start", {
      name: "rescheduleAppointmentRepository",
      startTimeMs,
      context: {
        operationId,
      },
    });

    const {
      userId,
      appointmentId,
      actorType,
      orgId,
      fromDate,
      fromTime,
      ...rest
    } = rescheduleData;

    try {
      const appointmentData = await prismaTelemedicine.$transaction(
        async (tx) => {
          const appointement = await prismaTelemedicine.appointment.update({
            where: {
              id: appointmentId,
              orgId,
            },
            data: {
              updatedBy: userId,
              status,
              ...rest,
            },
            include: {
              appointmentActual: {
                omit: {
                  createdAt: true,
                  createdBy: true,
                  updatedAt: true,
                  updatedBy: true,
                  intakeConversation: true,
                  virtualConversation: true,
                },
              },
              patient: {
                omit: {
                  createdAt: true,
                  updatedAt: true,
                  updatedBy: true,
                  createdBy: true,
                },
                include: {
                  personal: {
                    select: {
                      name: true,
                      orgId: true,
                      id: true,
                      gender: true,
                    },
                  },
                },
              },
              doctor: {
                omit: {
                  doctorId: true,
                  id: true,
                  isABDMDoctorProfile: true,
                  registrationNumber: true,
                  registrationProvider: true,
                  isCompleted: true,
                  createdAt: true,
                  updatedAt: true,
                  updatedBy: true,
                  createdBy: true,
                },
                include: {
                  personal: {
                    select: {
                      fullName: true,
                      orgId: true,
                      id: true,
                      gender: true,
                    },
                  },
                },
              },
            },
          });

          await tx.appointmentAudit.create({
            data: {
              actorType,
              kind: "RESCHEDULED",
              orgId: appointement.orgId,
              appointmentId: appointement.id,
              actorId: userId,
              createdBy: userId,
              fromDate,
              fromTime,
              toDate: rest.appointmentDate,
              toTime: rest.time,
            },
          });

          return appointement;
        }
      );

      const data = await AppointmentSchema.parseAsync(appointmentData);

      // Success log
      logOperation("success", {
        name: "rescheduleAppointmentRepository",
        startTimeMs,
        context: {
          operationId,
        },
      });

      return data;
    } catch (error) {
      // Error log
      logOperation("error", {
        name: "rescheduleAppointmentRepository",
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

  async getAppointmentForOnlineConsultation(
    appointmentId: string,
    orgId: string
  ): Promise<TAppointment | null> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    // Start log
    logOperation("start", {
      name: "getAppointmentForOnlineConsultationRepository",
      startTimeMs,
      context: {
        operationId,
      },
    });

    try {
      const appointement = await prismaTelemedicine.appointment.findUnique({
        where: {
          appointment_id_orgId_unique: {
            id: appointmentId,
            orgId: orgId,
          },
        },
        omit: {
          doctorId: true,
          patientId: true,
        },
        include: {
          appointmentActual: {
            omit: {
              createdAt: true,
              createdBy: true,
              updatedAt: true,
              updatedBy: true,
              intakeConversation: true,
              virtualConversation: true,
            },
          },
          patient: {
            omit: {
              id: true,
              patientId: true,
              isABHAPatientProfile: true,
              isCompleted: true,
              createdAt: true,
              updatedAt: true,
              updatedBy: true,
              createdBy: true,
            },
            include: {
              personal: {
                select: {
                  name: true,
                  orgId: true,
                  id: true,
                  gender: true,
                },
              },
            },
          },
          doctor: {
            omit: {
              doctorId: true,
              id: true,
              isABDMDoctorProfile: true,
              registrationNumber: true,
              registrationProvider: true,
              isCompleted: true,
              createdAt: true,
              updatedAt: true,
              updatedBy: true,
              createdBy: true,
            },
            include: {
              personal: {
                select: {
                  fullName: true,
                  orgId: true,
                  id: true,
                  gender: true,
                },
              },
            },
          },
        },
      });

      if (!appointement) {
        logOperation("success", {
          name: "getAppointmentForOnlineConsultationRepository",
          startTimeMs,
          context: {
            operationId,
          },
        });

        return null;
      }

      const data = await AppointmentSchema.parseAsync(appointement);

      // Success log
      logOperation("success", {
        name: "getAppointmentForOnlineConsultationRepository",
        startTimeMs,
        context: {
          operationId,
        },
      });

      return data;
    } catch (error) {
      // Error log
      logOperation("error", {
        name: "getAppointmentForOnlineConsultationRepository",
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

  async getAppointmentByIds(
    appointmentId: string,
    orgId: string
  ): Promise<TGetAppointmentByIds | null> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    // Start log
    logOperation("start", {
      name: "getAppointmentByIdsRepository",
      startTimeMs,
      context: {
        operationId,
      },
    });

    try {
      const appointment = await prismaTelemedicine.appointment.findUnique({
        where: {
          appointment_id_orgId_unique: {
            id: appointmentId,
            orgId,
          },
        },
        select: {
          id: true,
          orgId: true,
          patientId: true,
          doctorId: true,
          appointmentDate: true,
          time: true,
          status: true,
          isDoctorDeleted: true,
          isPatientDeleted: true,
          type: true,
          appointmentMode: true,
        },
      });

      if (!appointment) {
        return null;
      }

      const data = await GetAppointmentByIdsSchema.parseAsync(appointment);

      // Success log
      logOperation("success", {
        name: "getAppointmentByIdsRepository",
        startTimeMs,
        context: {
          operationId,
        },
      });

      return data;
    } catch (error) {
      // Error log
      logOperation("error", {
        name: "getAppointmentByIdsRepository",
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

  async cancelAppointment(
    cancelData: TCancelAppointment
  ): Promise<TAppointment> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    // Start log
    logOperation("start", {
      name: "cancelAppointmentRepository",
      startTimeMs,
      context: {
        operationId,
      },
    });

    const { userId, appointmentId, actorType, orgId, cancelReason } =
      cancelData;

    try {
      const appointmentData = await prismaTelemedicine.$transaction(
        async (tx) => {
          const appointement = await tx.appointment.update({
            where: {
              appointment_id_orgId_unique: {
                id: appointmentId,
                orgId,
              },
            },
            data: {
              updatedBy: userId,
              status: "CANCELLED",
              cancelReason,
              cancelledBy: actorType,
            },
            include: {
              appointmentActual: {
                omit: {
                  createdAt: true,
                  createdBy: true,
                  updatedAt: true,
                  updatedBy: true,
                  intakeConversation: true,
                  virtualConversation: true,
                },
              },
              patient: {
                omit: {
                  createdAt: true,
                  updatedAt: true,
                  updatedBy: true,
                  createdBy: true,
                },
                include: {
                  personal: {
                    select: {
                      name: true,
                      orgId: true,
                      id: true,
                      gender: true,
                    },
                  },
                },
              },
              doctor: {
                omit: {
                  doctorId: true,
                  id: true,
                  isABDMDoctorProfile: true,
                  registrationNumber: true,
                  registrationProvider: true,
                  isCompleted: true,
                  createdAt: true,
                  updatedAt: true,
                  updatedBy: true,
                  createdBy: true,
                },
                include: {
                  personal: {
                    select: {
                      fullName: true,
                      orgId: true,
                      id: true,
                      gender: true,
                    },
                  },
                },
              },
            },
          });

          await tx.appointmentAudit.create({
            data: {
              actorType: actorType,
              kind: "CANCELLED",
              orgId: appointement.orgId,
              appointmentId: appointement.id,
              actorId: userId,
              createdBy: userId,
              reason: cancelReason,
            },
          });

          return appointement;
        }
      );

      const data = await AppointmentSchema.parseAsync(appointmentData);

      // Success log
      logOperation("success", {
        name: "cancelAppointmentRepository",
        startTimeMs,
        context: {
          operationId,
        },
      });

      return data;
    } catch (error) {
      // Error log
      logOperation("error", {
        name: "cancelAppointmentRepository",
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

  async confirmAppointment(
    appointmentId: string,
    userId: string,
    orgId: string
  ): Promise<TAppointment> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    // Start log
    logOperation("start", {
      name: "confirmAppointmentRepository",
      startTimeMs,
      context: {
        operationId,
      },
    });

    try {
      const appointmentData = await prismaTelemedicine.$transaction(
        async (tx) => {
          const appointement = await tx.appointment.update({
            where: {
              appointment_id_orgId_unique: {
                id: appointmentId,
                orgId,
              },
            },
            data: {
              updatedBy: userId,
              status: "SCHEDULED",
            },
            include: {
              appointmentActual: {
                omit: {
                  createdAt: true,
                  createdBy: true,
                  updatedAt: true,
                  updatedBy: true,
                  intakeConversation: true,
                  virtualConversation: true,
                },
              },
              patient: {
                omit: {
                  createdAt: true,
                  updatedAt: true,
                  updatedBy: true,
                  createdBy: true,
                },
                include: {
                  personal: {
                    select: {
                      name: true,
                      orgId: true,
                      id: true,
                      gender: true,
                    },
                  },
                },
              },
              doctor: {
                omit: {
                  doctorId: true,
                  id: true,
                  isABDMDoctorProfile: true,
                  registrationNumber: true,
                  registrationProvider: true,
                  isCompleted: true,
                  createdAt: true,
                  updatedAt: true,
                  updatedBy: true,
                  createdBy: true,
                },
                include: {
                  personal: {
                    select: {
                      fullName: true,
                      orgId: true,
                      id: true,
                      gender: true,
                    },
                  },
                },
              },
            },
          });

          await tx.appointmentAudit.create({
            data: {
              actorType: "DOCTOR",
              kind: "SCHEDULED",
              orgId: appointement.orgId,
              appointmentId: appointement.id,
              actorId: userId,
              createdBy: userId,
            },
          });

          return appointement;
        }
      );

      const data = await AppointmentSchema.parseAsync(appointmentData);

      // Success log
      logOperation("success", {
        name: "confirmAppointmentRepository",
        startTimeMs,
        context: {
          operationId,
        },
      });

      return data;
    } catch (error) {
      // Error log
      logOperation("error", {
        name: "confirmAppointmentRepository",
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

  async deleteAppointment(
    appointmentId: string,
    orgId: string,
    userId: string,
    actorType: "PATIENT" | "DOCTOR"
  ): Promise<string> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    // Start log
    logOperation("start", {
      name: "deleteAppointmentRepository",
      startTimeMs,
      context: {
        operationId,
      },
    });

    try {
      const appointmentData = await prismaTelemedicine.$transaction(
        async (tx) => {
          const appointement = await tx.appointment.update({
            where: {
              appointment_id_orgId_unique: {
                id: appointmentId,
                orgId,
              },
            },
            data: {
              updatedBy: userId,
              ...(actorType === "PATIENT"
                ? { isPatientDeleted: true }
                : actorType === "DOCTOR"
                ? { isDoctorDeleted: true }
                : {}),
            },
          });

          await tx.appointmentAudit.create({
            data: {
              actorType: actorType,
              kind: "DELETED",
              orgId: appointement.orgId,
              appointmentId: appointement.id,
              actorId: userId,
              createdBy: userId,
            },
          });

          return appointement.id;
        }
      );

      // Success log
      logOperation("success", {
        name: "deleteAppointmentRepository",
        startTimeMs,
        context: {
          operationId,
        },
      });

      return appointmentData;
    } catch (error) {
      // Error log
      logOperation("error", {
        name: "deleteAppointmentRepository",
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
