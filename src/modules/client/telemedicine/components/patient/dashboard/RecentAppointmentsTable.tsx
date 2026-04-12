"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { TableComp } from "./Table";
import { TableCell, TableRow } from "@/components/ui/table";
import { ProfileAvatar } from "@/modules/shared/components/ProfileAvatar";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { AppointmentStatusIndicator } from "../../AppointmentStatusIndicator";
import { TAppointments } from "@/modules/shared/entities/models/telemedicine/dashboard";

interface DataProps {
  data: TAppointments;
}

const columns = [
  { header: "Info", key: "name" },
  {
    header: "Date",
    key: "appointment_date",
    className: "",
  },
  {
    header: "Time",
    key: "time",
    className: "",
  },
  {
    header: "Doctor",
    key: "doctor",
    className: "",
  },
  {
    header: "Status",
    key: "status",
    className: "",
  },
];

export const RecentAppointmentsTable = ({ data }: DataProps) => {
  const renderRow = (item: TAppointments[number]) => {
    return (
      <TableRow key={item?.id}>
        <TableCell>
          <div className="flex items-center gap-2 2xl:gap-3 py-2">
            <ProfileAvatar imgUrl={null} name={item?.patient?.personal?.name} />
            <div>
              <h3 className="font-bold">{item?.patient?.personal?.name}</h3>
              <span className="text-xs capitalize">
                {item?.patient.personal?.gender.toLowerCase()}
              </span>
            </div>
          </div>
        </TableCell>
        <TableCell>{format(item?.appointmentDate, "dd-MMM-yyyy")}</TableCell>
        <TableCell>{item?.time}</TableCell>
        <TableCell>
          <div className="flex items-center gap-2 2xl:gap-3 py-2">
            <ProfileAvatar
              imgUrl={null}
              name={item?.doctor?.personal?.fullName}
            />
            <div>
              <h3 className="font-bold">{item?.doctor?.personal?.fullName}</h3>
              {/* <span className="text-xs capitalize">
                {item?.doctor?.specialization}
              </span> */}
              <span className="text-xs capitalize">
                {item?.patient.personal?.gender.toLowerCase()}
              </span>
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
