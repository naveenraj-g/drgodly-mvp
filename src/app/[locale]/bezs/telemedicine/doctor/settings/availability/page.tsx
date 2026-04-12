import DefaultWeeklyAvailability from "@/modules/client/telemedicine/components/doctor/availability/doctorWeeklyAvailability";
import { getDoctorWeeklyAvailability } from "@/modules/client/telemedicine/server-actions/doctorWeeklyAvailability-action";
import { getServerSession } from "@/modules/server/auth/get-session";

async function DoctorAvailabilitySettings() {
  const session = await getServerSession();

  if (!session || !session.session.activeOrganizationId) {
    throw new Error("UNAUTHORIZED");
  }

  const user = {
    id: session.user.id,
    name: session.user.name,
    username: session.user.username,
    email: session.user.email,
    orgId: session.session.activeOrganizationId,
  };

  const [data, error] = await getDoctorWeeklyAvailability({
    orgId: user.orgId,
    userId: user.id,
  });

  return (
    <div>
      <DefaultWeeklyAvailability data={data} user={user} error={error} />
    </div>
  );
}

export default DoctorAvailabilitySettings;

/* 
model DoctorDefaultAvailability {
  id        String   @id @default(uuid())
  doctorId  String
  dayOfWeek Int      // 0-6 (Sun-Sat)
  sessions  Json     // list of time ranges
}


model DoctorDateOverride {
  id        String   @id @default(uuid())
  doctorId  String
  date      Date      // specific date
  isHoliday Boolean   @default(false)
  sessions  Json?     // optional custom sessions
}


{
  date: "2025-11-19",
  isHoliday: false,
  sessions: [
    { from: "09:00", to: "13:00" },
    { from: "15:00", to: "18:00" }
  ]
}

*/
