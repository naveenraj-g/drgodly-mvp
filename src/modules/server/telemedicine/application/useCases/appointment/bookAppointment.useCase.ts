import { getTelemedicineInjection } from "../../../di/container";
import {
  TBookAppointmentUseCase,
  TAppointment,
} from "../../../../../shared/entities/models/telemedicine/appointment";

const DAY_NAMES = [
  "SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY",
  "THURSDAY", "FRIDAY", "SATURDAY",
] as const;

const toMins = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

const generateRoomId = () =>
  `room_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

export async function bookAppointmentUseCase(
  createData: TBookAppointmentUseCase,
  fhirEncounterId?: number,
  fhirAppointmentId?: number,
): Promise<TAppointment> {
  const appointmentRepository = getTelemedicineInjection("IAppointmentRepository");
  const idResolverRepository = getTelemedicineInjection("IIdResolverRepository");
  const doctorServiceRepository = getTelemedicineInjection("IDoctorServiceRepository");
  const weeklyAvailabilityRepository = getTelemedicineInjection("IDoctorWeeklyAvailabilityRepository");

  const { patientUserId, doctorUserId, serviceId, ...rest } = createData;

  if (rest.appointmentMode === "INTAKE") {
    throw new Error("Intake appointments are not supported");
  }

  if (!rest.orgId) throw new Error("Organization is required");

  const [doctorId, patientId] = await Promise.all([
    idResolverRepository.resolveDoctorIdByUserIdAndOrgId(doctorUserId, rest.orgId),
    idResolverRepository.resolvePatientIdByUserIdAndOrgId(patientUserId, rest.orgId),
  ]);

  if (!doctorId) throw new Error("Doctor not found");
  if (!patientId) throw new Error("Patient not found");

  const service = await doctorServiceRepository.getDoctorServiceByIds(
    serviceId, doctorId, rest.orgId,
  );
  if (!service) throw new Error("Service not found");

  if (!service.supportedModes.includes(rest.appointmentMode)) {
    throw new Error("Appointment mode not supported for this service");
  }

  // ── Availability checks ────────────────────────────────────────────────────

  const appointmentDate = new Date(rest.appointmentDate);
  const dayOfWeek = DAY_NAMES[appointmentDate.getDay()];

  const weeklyAvailabilities = await weeklyAvailabilityRepository
    .getDoctorWeeklyAvailability(rest.orgId, doctorId);

  // 1. Day must be enabled
  const dayAvail = weeklyAvailabilities.find(
    (w) => w.dayOfWeek === dayOfWeek && w.isEnabled,
  );
  if (!dayAvail || dayAvail.slots.length === 0) {
    throw new Error(`Doctor is not available on ${dayOfWeek.charAt(0) + dayOfWeek.slice(1).toLowerCase()}s`);
  }

  // 2. Requested time must fall within a slot window
  const reqMins = toMins(rest.time);
  const inWindow = dayAvail.slots.some(
    (s) => reqMins >= toMins(s.start) && reqMins < toMins(s.end),
  );
  if (!inWindow) {
    throw new Error(`${rest.time} is outside the doctor's available hours`);
  }

  // 3. Slot must not already be booked
  await appointmentRepository.assertSlotAvailable(
    rest.orgId, doctorId, appointmentDate, rest.time,
  );

  // ── Book ───────────────────────────────────────────────────────────────────

  const virtualRoomId =
    rest.appointmentMode === "VIRTUAL" ? generateRoomId() : null;

  const payload = {
    ...rest,
    doctorId,
    patientId,
    virtualRoomId,
    status: "PENDING" as const,
    type: service.name,
    price: service.priceAmount,
    priceCurrency: service.priceCurrency,
    userId: patientUserId,
  };

  return appointmentRepository.bookAppointment(payload, fhirEncounterId, fhirAppointmentId);
}
