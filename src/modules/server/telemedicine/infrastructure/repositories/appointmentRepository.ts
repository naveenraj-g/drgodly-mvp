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
  TBookConsultationAppointment,
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
    orgId: string,
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
          intakeMapping: {
            select: {
              followUpAppointmentId: true,
              followUpAppointment: {
                select: {
                  id: true,
                  type: true,
                  status: true,
                  appointmentDate: true,
                  time: true,
                  appointmentMode: true,
                  doctor: {
                    select: {
                      userId: true,
                      personal: { select: { fullName: true } },
                    },
                  },
                },
              },
            },
          },
          followUpMapping: {
            select: {
              intakeAppointmentId: true,
              intakeAppointment: {
                select: {
                  id: true,
                  type: true,
                  status: true,
                  appointmentDate: true,
                  time: true,
                  appointmentMode: true,
                  appointmentActual: {
                    select: {
                      intakeConversation: true,
                      intakeReport: true,
                      virtualConversation: true,
                      doctorReport: true,
                      fullReport: true,
                    },
                  },
                  doctor: {
                    select: {
                      userId: true,
                      personal: { select: { fullName: true } },
                    },
                  },
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

  async getDashboardAppointmentsForDoctor(
    doctorId: string,
    orgId: string,
  ): Promise<TAppointments> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    logOperation("start", {
      name: "getDashboardAppointmentsForDoctorRepository",
      startTimeMs,
      context: { operationId },
    });

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    try {
      const appointments = await prismaTelemedicine.appointment.findMany({
        where: {
          doctorId,
          orgId,
          isDoctorDeleted: false,
          appointmentDate: { gte: todayStart, lte: todayEnd },
        },
        orderBy: { time: "asc" },
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
          intakeMapping: {
            select: {
              followUpAppointmentId: true,
              followUpAppointment: {
                select: {
                  id: true,
                  type: true,
                  status: true,
                  appointmentDate: true,
                  time: true,
                  appointmentMode: true,
                  doctor: {
                    select: {
                      userId: true,
                      personal: { select: { fullName: true } },
                    },
                  },
                },
              },
            },
          },
          followUpMapping: {
            select: {
              intakeAppointmentId: true,
              intakeAppointment: {
                select: {
                  id: true,
                  type: true,
                  status: true,
                  appointmentDate: true,
                  time: true,
                  appointmentMode: true,
                  appointmentActual: {
                    select: {
                      intakeConversation: true,
                      intakeReport: true,
                      virtualConversation: true,
                      doctorReport: true,
                      fullReport: true,
                    },
                  },
                  doctor: {
                    select: {
                      userId: true,
                      personal: { select: { fullName: true } },
                    },
                  },
                },
              },
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

      const aiConsult = appointments.find((a) => a.type === "AI Consultation");
      if (aiConsult) {
        console.log(
          "[getDashboardAppointmentsForDoctor] AI Consultation appointmentActual:",
          JSON.stringify(aiConsult.appointmentActual, null, 2),
        );
      }

      const data = await AppointmentsSchema.parseAsync(appointments);

      logOperation("success", {
        name: "getDashboardAppointmentsForDoctorRepository",
        startTimeMs,
        context: { operationId },
      });

      return data;
    } catch (error) {
      logOperation("error", {
        name: "getDashboardAppointmentsForDoctorRepository",
        startTimeMs,
        err: error,
        errName: "UnknownRepositoryError",
        context: { operationId },
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
    orgId: string,
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
            },
          },
          intakeMapping: {
            select: {
              followUpAppointmentId: true,
              followUpAppointment: {
                select: {
                  id: true,
                  type: true,
                  status: true,
                  appointmentDate: true,
                  time: true,
                  appointmentMode: true,
                  doctor: {
                    select: {
                      userId: true,
                      personal: { select: { fullName: true } },
                    },
                  },
                },
              },
            },
          },
          followUpMapping: {
            select: {
              intakeAppointmentId: true,
              intakeAppointment: {
                select: {
                  id: true,
                  type: true,
                  status: true,
                  appointmentDate: true,
                  time: true,
                  appointmentMode: true,
                  doctor: {
                    select: {
                      userId: true,
                      personal: { select: { fullName: true } },
                    },
                  },
                },
              },
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

      const aiConsultPatient = appointements.find((a) => a.type === "AI Consultation");
      if (aiConsultPatient) {
        console.log(
          "[getAppointmentsForPatient] AI Consultation appointmentActual:",
          JSON.stringify(aiConsultPatient.appointmentActual, null, 2),
        );
      }

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
    appointmentData: TBookAppointment,
    fhirEncounterId?: number,
    fhirAppointmentId?: number,
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
            ...(fhirEncounterId && { fhirEncounterId }),
            ...(fhirAppointmentId && { fhirAppointmentId }),
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
    appointmentData: TBookIntakeAppointment,
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

  async bookConsultationAppointment(
    appointmentData: TBookConsultationAppointment,
  ): Promise<TIntakeAppointment> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    logOperation("start", {
      name: "bookConsultationAppointment",
      startTimeMs,
      context: { operationId },
    });

    const { userId, orgId, virtualConversation, fullReport, ...rest } =
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
              virtualConversation,
              fullReport: fullReport ?? null,
            },
          },
        },
        select: { id: true },
      });

      const data = await IntakeAppointmentSchema.parseAsync(appointment);

      logOperation("success", {
        name: "bookConsultationAppointment",
        startTimeMs,
        context: { operationId },
      });

      return data;
    } catch (error) {
      logOperation("error", {
        name: "bookConsultationAppointment",
        startTimeMs,
        err: error,
        errName: "UnknownRepositoryError",
        context: { operationId },
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
    status: "RESCHEDULED" | "PENDING",
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
        },
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
    orgId: string,
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
    orgId: string,
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
    cancelData: TCancelAppointment,
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
        },
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
    orgId: string,
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
        },
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

  async completeConsultation(
    appointmentId: string,
    userId: string,
    orgId: string,
    doctorReport?: any,
  ): Promise<TAppointment> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    logOperation("start", {
      name: "completeConsultationRepository",
      startTimeMs,
      context: { operationId },
    });

    try {
      const appointmentData = await prismaTelemedicine.$transaction(
        async (tx) => {
          const appointment = await tx.appointment.update({
            where: { appointment_id_orgId_unique: { id: appointmentId, orgId } },
            data: { status: "COMPLETED", updatedBy: userId },
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
                    select: { name: true, orgId: true, id: true, gender: true },
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

          await tx.appointmentActual.upsert({
            where: { appointmentId },
            create: { appointmentId, orgId, doctorReport: doctorReport ?? null },
            update: { doctorReport: doctorReport ?? null, updatedBy: userId },
          });

          return appointment;
        },
      );

      const data = await AppointmentSchema.parseAsync(appointmentData);

      logOperation("success", {
        name: "completeConsultationRepository",
        startTimeMs,
        context: { operationId },
      });

      return data;
    } catch (error) {
      logOperation("error", {
        name: "completeConsultationRepository",
        startTimeMs,
        err: error,
        errName: "UnknownRepositoryError",
        context: { operationId },
      });

      if (error instanceof Error) {
        throw new OperationError(error.message, { cause: error });
      }

      throw new OperationError("An unexpected error occurred", {
        cause: error,
      });
    }
  }

  async getPreviousCompletedReport(
    patientId: string,
    orgId: string,
    excludeAppointmentId: string,
  ): Promise<any> {
    const appointment = await prismaTelemedicine.appointment.findFirst({
      where: {
        patientId,
        orgId,
        status: "COMPLETED",
        id: { not: excludeAppointmentId },
        appointmentActual: { is: { doctorReport: { not: null } } },
      },
      orderBy: { appointmentDate: "desc" },
      select: { appointmentActual: { select: { doctorReport: true } } },
    });
    return appointment?.appointmentActual?.doctorReport ?? null;
  }

  async deleteAppointment(
    appointmentId: string,
    orgId: string,
    userId: string,
    actorType: "PATIENT" | "DOCTOR",
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
        },
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
