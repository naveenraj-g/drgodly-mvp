"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { TGetDashboardAppointmentsDataControllerOutput } from "@/modules/server/telemedicine/interface-adapters/controllers/dashboard";
import { TSharedUser } from "@/modules/shared/types";
import { Briefcase, BriefcaseBusiness, BriefcaseMedical } from "lucide-react";
import { ZSAError } from "zsa";
import { StatCard } from "./StatCard";
import { AppoinmentChart } from "./AppointmentCard";
import { RecentAppointmentsTable } from "./RecentAppointmentsTable";
import { StatSummaryChart } from "./StatSummaryChart";

interface IPatientDashboardProps {
  dashboardData: TGetDashboardAppointmentsDataControllerOutput | null;
  error: ZSAError | null;
  user: TSharedUser;
}

function PatientDashboard({
  dashboardData,
  error,
  user,
}: IPatientDashboardProps) {
  if (error || !dashboardData) {
    return <div>Error: {error?.message || "Failed to get data."}</div>;
  }

  const { appointmentCounts, last5Records, monthlyData, totalAppointments } =
    dashboardData;

  const patientData = last5Records?.[0]?.patient;

  const cardData = [
    {
      title: "appointments",
      value: totalAppointments,
      icon: Briefcase,
      className: "bg-blue-600/15 dark:bg-blue-600/25",
      iconClassName: "bg-blue-600/25 text-blue-600",
      note: "Total appointments",
    },
    {
      title: "cancelled",
      value: appointmentCounts?.CANCELLED,
      icon: Briefcase,
      className: "bg-rose-600/15 dark:bg-rose-600/25",
      iconClassName: "bg-rose-600/25 text-rose-600",
      note: "Cancelled Appointments",
    },
    {
      title: "pending",
      value: appointmentCounts?.PENDING + appointmentCounts?.SCHEDULED,
      icon: BriefcaseBusiness,
      className: "bg-yellow-600/15 dark:bg-yellow-600/25",
      iconClassName: "bg-yellow-600/25 text-yellow-600",
      note: "Pending Appointments",
    },
    {
      title: "completed",
      value: appointmentCounts?.COMPLETED,
      icon: BriefcaseMedical,
      className: "bg-emerald-600/15 dark:bg-emerald-600/25",
      iconClassName: "bg-emerald-600/25 text-emerald-600",
      note: "Successfully appointments",
    },
  ];

  return (
    <div className="xl:grid rounded-xl xl:grid-cols-[2.5fr_1fr] xl:gap-6 w-full space-y-6 xl:space-y-0">
      {/* Left */}
      <div className="w-full">
        <Card className="rounded-xl mb-8 space-y-4 p-4">
          <div className="flex flex-wrap gap-2 items-center justify-between">
            <h1 className="text-lg xl:text-2xl font-semibold">
              Welcome {patientData?.personal?.name || user?.name}
            </h1>

            <div className="space-x-2">
              <Button size="sm">{new Date().getFullYear()}</Button>
              <Button size="sm" variant="outline" className="hover:underline">
                <Link href="/bezs/telemedicine/patient/profile">
                  View Profile
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 3xl:grid-cols-4 gap-4">
            {cardData.map((item, index) => (
              <StatCard key={index} {...item} />
            ))}
          </div>
        </Card>

        <div className="h-[500px]">
          <AppoinmentChart data={monthlyData} />
        </div>

        <div className="rounded-xl mt-8">
          <RecentAppointmentsTable data={last5Records} />
        </div>
      </div>
      {/* Right */}
      <div className="w-full">
        <Card className="w-full xxs:h-[420px] mb-8 p-4">
          <StatSummaryChart
            data={appointmentCounts}
            total={totalAppointments}
          />
        </Card>

        {/* <AvailableDoctors data={avaliableDoctor} /> */}
        {/* <PatientRatingContainer /> */}
      </div>
    </div>
  );
}

export default PatientDashboard;
