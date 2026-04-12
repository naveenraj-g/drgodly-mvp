import { getTelemedicineInjection } from "../../../di/container";
import {
  TBookAppointmentUseCase,
  TAppointment,
} from "../../../../../shared/entities/models/telemedicine/appointment";

const generateRoomId = () =>
  `room_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

export async function bookAppointmentUseCase(
  createData: TBookAppointmentUseCase
): Promise<TAppointment> {
  const appointmentRepository = getTelemedicineInjection(
    "IAppointmentRepository"
  );
  const idResolverRepository = getTelemedicineInjection(
    "IIdResolverRepository"
  );
  const doctorServiceRepository = getTelemedicineInjection(
    "IDoctorServiceRepository"
  );

  const { patientUserId, doctorUserId, serviceId, ...rest } = createData;

  if (rest.appointmentMode === "INTAKE") {
    throw new Error("Intake appointments are not supported");
  }

  if (!rest.orgId) throw new Error("Organization is required");

  const [doctorId, patientId] = await Promise.all([
    idResolverRepository.resolveDoctorIdByUserIdAndOrgId(
      doctorUserId,
      rest.orgId
    ),
    idResolverRepository.resolvePatientIdByUserIdAndOrgId(
      patientUserId,
      rest.orgId
    ),
  ]);

  if (!doctorId) throw new Error("Doctor not found");
  if (!patientId) throw new Error("Patient not found");

  const service = await doctorServiceRepository.getDoctorServiceByIds(
    serviceId,
    doctorId,
    rest.orgId
  );
  if (!service) throw new Error("Service not found");

  if (!service.supportedModes.includes(rest.appointmentMode)) {
    throw new Error("Appointment mode not supported");
  }

  // [MANDATORY]: check scheduling conflicts before booking
  // await appointmentRepository.assertAvailability({
  //   orgId: rest.orgId,
  //   doctorId,
  //   start: rest.startsAt,
  //   durationMins: service.duration,
  // });

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

  const data = await appointmentRepository.bookAppointment(payload);

  return data;
}
