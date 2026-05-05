import { getTelemedicineInjection } from "../../../di/container";
import {
  TAppointment,
  TRescheduleAppointmentUseCase,
} from "../../../../../shared/entities/models/telemedicine/appointment";

const DAY_NAMES = [
  "SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY",
  "THURSDAY", "FRIDAY", "SATURDAY",
] as const;

const toMins = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

export async function rescheduleAppointmentUseCase(
  rescheduleData: TRescheduleAppointmentUseCase,
): Promise<TAppointment> {
  const appointmentRepository = getTelemedicineInjection("IAppointmentRepository");
  const idResolverRepository = getTelemedicineInjection("IIdResolverRepository");
  const weeklyAvailabilityRepository = getTelemedicineInjection("IDoctorWeeklyAvailabilityRepository");

  const { userId, appointmentId, orgId, ...rest } = rescheduleData;

  if (!orgId) throw new Error("Organization is required");

  const appointment = await appointmentRepository.getAppointmentByIds(appointmentId, orgId);
  if (!appointment) throw new Error("Appointment not found");

  if (appointment.status === "CANCELLED" || appointment.status === "COMPLETED") {
    throw new Error("Appointment cannot be rescheduled");
  }

  const [patientId, doctorId] = await Promise.all([
    idResolverRepository.resolvePatientIdByUserIdAndOrgId(userId, orgId),
    idResolverRepository.resolveDoctorIdByUserIdAndOrgId(userId, orgId),
  ]);

  const isPatient = !!patientId && patientId === appointment.patientId;
  const isDoctor = !!doctorId && doctorId === appointment.doctorId;

  if (!isPatient && !isDoctor) {
    throw new Error("You are not allowed to reschedule this appointment.");
  }

  // ── Availability checks (real doctor appointments only) ────────────────────
  // Skip for INTAKE mode (AI intake) — those have no weekly availability.
  const apptDoctorId = appointment.doctorId;
  if (apptDoctorId && appointment.appointmentMode !== "INTAKE") {
    const appointmentDate = new Date(rest.appointmentDate);
    const dayOfWeek = DAY_NAMES[appointmentDate.getDay()];

    const weeklyAvailabilities = await weeklyAvailabilityRepository
      .getDoctorWeeklyAvailability(orgId, apptDoctorId);

    // Only enforce if the doctor has availability configured
    if (weeklyAvailabilities.length > 0) {
      // 1. Day must be enabled
      const dayAvail = weeklyAvailabilities.find(
        (w) => w.dayOfWeek === dayOfWeek && w.isEnabled,
      );
      if (!dayAvail || dayAvail.slots.length === 0) {
        throw new Error(
          `Doctor is not available on ${dayOfWeek.charAt(0) + dayOfWeek.slice(1).toLowerCase()}s`,
        );
      }

      // 2. Requested time must fall within a slot window
      const reqMins = toMins(rest.time);
      const inWindow = dayAvail.slots.some(
        (s) => reqMins >= toMins(s.start) && reqMins < toMins(s.end),
      );
      if (!inWindow) {
        throw new Error(`${rest.time} is outside the doctor's available hours`);
      }

      // 3. Slot must not already be booked (exclude the current appointment)
      await appointmentRepository.assertSlotAvailable(
        orgId, apptDoctorId, appointmentDate, rest.time,
      );
    }
  }

  // ── Reschedule ─────────────────────────────────────────────────────────────

  const isPending = appointment.status === "PENDING" && isPatient;
  const status = !isPending ? "RESCHEDULED" : "PENDING";
  const actorType: "PATIENT" | "DOCTOR" = isDoctor ? "DOCTOR" : "PATIENT";

  return appointmentRepository.rescheduleAppointment(
    {
      userId,
      actorType,
      orgId,
      appointmentId,
      fromDate: appointment.appointmentDate,
      fromTime: appointment.time,
      ...rest,
    },
    status,
  );
}
