"use client";

import DataTable from "@/modules/shared/components/table/data-table";
import { IAppointmentTableProps } from "./types";
import { appointmentColumn } from "./appointmentColumn";
import { EmptyState } from "@/modules/shared/components/EmptyState";
import { AlertCircle, CalendarPlus } from "lucide-react";

const APPOINTMENT_STATUS = [
  "PENDING",
  "SCHEDULED",
  "CANCELLED",
  "COMPLETED",
  "RESCHEDULED",
];

function AppointmentsTable({ appointments, error }: IAppointmentTableProps) {
  if (error) {
    return (
      <EmptyState
        icon={<AlertCircle />}
        title="Error"
        description="Something went wrong. Please try again later."
        buttonLabel="Reload"
        error={error}
      />
    );
  }

  if (!appointments || appointments?.length === 0) {
    return (
      <EmptyState
        icon={<CalendarPlus />}
        title="No Appointments Yet"
        description="You have no scheduled appointments."
        error={error}
      />
    );
  }

  return (
    <DataTable
      columns={appointmentColumn}
      data={appointments ?? []}
      dataSize={appointments?.length ?? 0}
      label={"Your Appointments"}
      filterField="status"
      isAddButton={false}
      filterValues={APPOINTMENT_STATUS}
      fallbackText={
        (appointments?.length === 0 && "No Appointments Found") ||
        "No Appointments"
      }
    />
  );
}

export default AppointmentsTable;
