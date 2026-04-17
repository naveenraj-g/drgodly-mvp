import { getTelemedicineInjection } from "../../../di/container";
import {
  TIntakeAppointment,
  TBookConsultationAppointmentUseCase,
} from "../../../../../shared/entities/models/telemedicine/appointment";

const get24HrTime = () => {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

export async function bookConsultationAppointmentUseCase(
  createData: TBookConsultationAppointmentUseCase
): Promise<TIntakeAppointment> {
  const appointmentRepository = getTelemedicineInjection("IAppointmentRepository");
  const idResolverRepository = getTelemedicineInjection("IIdResolverRepository");

  const { patientUserId, ...rest } = createData;

  if (!rest.orgId) throw new Error("Organization is required");

  const [doctorId, patientId] = await Promise.all([
    idResolverRepository.resolveDoctorIdByUserIdAndOrgId("INTAKE", rest.orgId),
    idResolverRepository.resolvePatientIdByUserIdAndOrgId(patientUserId, rest.orgId),
  ]);

  if (!doctorId) throw new Error("Doctor not found");
  if (!patientId) throw new Error("Patient not found");

  const payload = {
    ...rest,
    appointmentDate: new Date(),
    time: get24HrTime(),
    doctorId,
    patientId,
    virtualRoomId: null,
    status: "COMPLETED" as const,
    type: "AI Consultation",
    price: null,
    priceCurrency: null,
    userId: patientUserId,
    note: null,
    appointmentMode: "VIRTUAL" as const,
  };

  return await appointmentRepository.bookConsultationAppointment(payload);
}
