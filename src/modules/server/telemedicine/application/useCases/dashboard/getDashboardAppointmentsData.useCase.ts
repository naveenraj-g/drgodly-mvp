import { getSharedInjection } from "@/modules/server/shared/di/container";
import { TGetDashboardAppointmentsDataUseCasePayload } from "../../../../../shared/entities/models/telemedicine/dashboard";
import { getTelemedicineInjection } from "../../../di/container";
import { processAppointments } from "./utils";

export async function getDashboardAppointmentsDataUseCase(
  payload: TGetDashboardAppointmentsDataUseCasePayload
) {
  const patientDashboardRepository = getTelemedicineInjection(
    "IDashboardRepository"
  );
  const idResolverRepository = getTelemedicineInjection(
    "IIdResolverRepository"
  );
  const userService = getSharedInjection("IUserService");

  const isUserAvailableAndInOrg = await userService.getUsersByIdAndOrgId(
    payload.userId,
    payload.orgId
  );

  if (!isUserAvailableAndInOrg) {
    throw new Error("User not found");
  }

  const patientId = await idResolverRepository.resolvePatientIdByUserIdAndOrgId(
    payload.userId,
    payload.orgId
  );

  const doctorId = await idResolverRepository.resolveDoctorIdByUserIdAndOrgId(
    payload.userId,
    payload.orgId
  );

  if (!patientId && !doctorId) {
    throw new Error("User not found");
  }

  if (patientId && doctorId) {
    throw new Error("User is both a patient and a doctor");
  }

  const patientDashboardData =
    await patientDashboardRepository.getDashboardAppointmentsData({
      orgId: payload.orgId,
      patientId,
      doctorId,
    });
  const { appointmentCounts, monthlyData } = await processAppointments(
    patientDashboardData
  );
  const last5Records = patientDashboardData.slice(0, 5);

  return {
    appointmentCounts,
    last5Records,
    totalAppointments: patientDashboardData.length,
    monthlyData,
  };
}

export type TGetDashboardAppointmentsDataUseCaseReturnType = Awaited<
  ReturnType<typeof getDashboardAppointmentsDataUseCase>
>;
