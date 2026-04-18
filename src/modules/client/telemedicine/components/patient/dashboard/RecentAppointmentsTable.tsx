"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { TableComp } from "./Table";
import { TableCell, TableRow } from "@/components/ui/table";
import { ProfileAvatar } from "@/modules/shared/components/ProfileAvatar";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { AppointmentStatusIndicator } from "../../AppointmentStatusIndicator";
import { TAppointments } from "@/modules/shared/entities/models/telemedicine/dashboard";
import { Brain, ArrowRight } from "lucide-react";

interface DataProps {
  data: TAppointments;
}

const columns = [
  { header: "Patient", key: "name" },
  { header: "Type", key: "type" },
  { header: "Date", key: "appointment_date" },
  { header: "Time", key: "time" },
  { header: "Doctor / Agent", key: "doctor" },
  { header: "Status", key: "status" },
];

function AppointmentTypeBadge({
  mode,
  doctorUserId,
  isFollowUp,
  hasFollowUp,
}: {
  mode: string;
  doctorUserId?: string | null;
  isFollowUp: boolean;
  hasFollowUp: boolean;
}) {
  if (mode === "INTAKE") {
    return (
      <div className="flex flex-col gap-1">
        <Badge variant="secondary" className="w-fit gap-1 text-xs">
          <Brain className="size-3" /> AI Intake
        </Badge>
        {hasFollowUp && (
          <Badge variant="outline" className="w-fit gap-1 text-xs text-green-600 border-green-300">
            <ArrowRight className="size-3" /> Has Follow-up
          </Badge>
        )}
      </div>
    );
  }
  if (doctorUserId === "AIDOCTOR") {
    return (
      <Badge className="w-fit gap-1 text-xs bg-violet-100 text-violet-700 hover:bg-violet-100 dark:bg-violet-900 dark:text-violet-300">
        <Brain className="size-3" /> AI Consultation
      </Badge>
    );
  }
  return (
    <div className="flex flex-col gap-1">
      <Badge variant="outline" className="w-fit text-xs">
        {mode === "VIRTUAL" ? "Virtual" : "In-Person"}
      </Badge>
      {isFollowUp && (
        <Badge variant="outline" className="w-fit gap-1 text-xs text-blue-600 border-blue-300">
          <ArrowRight className="size-3 rotate-180" /> Follow-up
        </Badge>
      )}
    </div>
  );
}

export const RecentAppointmentsTable = ({ data }: DataProps) => {
  const renderRow = (item: TAppointments[number]) => {
    const isFollowUp = !!item.followUpMapping;
    const hasFollowUp = !!item.intakeMapping;
    const isAiAgent =
      item.appointmentMode === "INTAKE" || item.doctor.userId === "AIDOCTOR";

    const doctorLabel = isAiAgent
      ? "AI Assistant"
      : item.doctor.personal?.fullName ?? "—";

    return (
      <TableRow key={item?.id}>
        <TableCell>
          <div className="flex items-center gap-2 2xl:gap-3 py-2">
            <ProfileAvatar imgUrl={null} name={item?.patient?.personal?.name} />
            <div>
              <h3 className="font-bold">{item?.patient?.personal?.name}</h3>
              <span className="text-xs capitalize">
                {item?.patient.personal?.gender?.toLowerCase()}
              </span>
            </div>
          </div>
        </TableCell>

        <TableCell>
          <AppointmentTypeBadge
            mode={item.appointmentMode}
            doctorUserId={item.doctor.userId}
            isFollowUp={isFollowUp}
            hasFollowUp={hasFollowUp}
          />
        </TableCell>

        <TableCell>{format(item?.appointmentDate, "dd-MMM-yyyy")}</TableCell>

        <TableCell>{item?.time}</TableCell>

        <TableCell>
          <div className="flex items-center gap-2 2xl:gap-3 py-2">
            {isAiAgent ? (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
                <Brain className="size-4" />
              </div>
            ) : (
              <ProfileAvatar imgUrl={null} name={item?.doctor?.personal?.fullName} />
            )}
            <div>
              <h3 className="font-bold">{doctorLabel}</h3>
            </div>
          </div>
        </TableCell>

        <TableCell>
          <AppointmentStatusIndicator status={item?.status} />
        </TableCell>
      </TableRow>
    );
  };

  return (
    <Card className="rounded-xl p-4">
      <CardTitle>
        <div className="flex justify-between items-center flex-wrap gap-2">
          <h1 className="text-lg font-semibold">Recent Appointments</h1>
          <Button asChild variant="outline" size="sm">
            <Link href="/bezs/telemedicine/patient/appointments">View All</Link>
          </Button>
        </div>
      </CardTitle>
      <CardDescription>
        <TableComp columns={columns} renderRow={renderRow} data={data} />
      </CardDescription>
    </Card>
  );
};
