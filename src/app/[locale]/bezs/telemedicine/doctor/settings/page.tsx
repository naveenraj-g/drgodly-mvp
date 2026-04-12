import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { BriefcaseMedical, CalendarClock, UserCog } from "lucide-react";

function SettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Settings</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <Link href="bezs/telemedicine/doctor/settings/profile">
            <CardHeader>
              <CardTitle className="inline-flex items-center gap-2">
                <UserCog className="size-4.5" /> Profile
              </CardTitle>
              <CardDescription>
                Update your name, photo, and password.
              </CardDescription>
            </CardHeader>
          </Link>
        </Card>

        <Card>
          <Link href="bezs/telemedicine/doctor/settings/availability">
            <CardHeader>
              <CardTitle className="inline-flex items-center gap-2">
                <CalendarClock className="size-4.5" /> Availability
              </CardTitle>
              <CardDescription>
                Set your working days and time slots.
              </CardDescription>
            </CardHeader>
          </Link>
        </Card>
        <Card>
          <Link href="bezs/telemedicine/doctor/settings/services">
            <CardHeader>
              <CardTitle className="inline-flex items-center gap-2">
                <BriefcaseMedical className="size-4.5" /> Services
              </CardTitle>
              <CardDescription>
                Define consultation types, duration, and pricing.
              </CardDescription>
            </CardHeader>
          </Link>
        </Card>
      </div>
    </div>
  );
}

export default SettingsPage;
