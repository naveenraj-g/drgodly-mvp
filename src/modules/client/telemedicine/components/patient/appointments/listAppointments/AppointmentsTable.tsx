"use client";

import DataTable from "@/modules/shared/components/table/data-table";
import { IAppointmentTableProps } from "./types";
import { appointmentColumn } from "./appointmentColumn";
import { usePatientModalStore } from "@/modules/client/telemedicine/stores/patient-modal-store";
import { EmptyState } from "@/modules/shared/components/EmptyState";
import { AlertTriangle, CalendarPlus, Plus } from "lucide-react";

const APPOINTMENT_STATUS = [
  "PENDING",
  "SCHEDULED",
  "CANCELLED",
  "COMPLETED",
  "RESCHEDULED",
];

function AppointmentsTable({ appointments, error }: IAppointmentTableProps) {
  const openModal = usePatientModalStore((state) => state.onOpen);

  if (error) {
    return (
      <EmptyState
        icon={<AlertTriangle className="text-destructive" />}
        title="An Unexpected Error Occurred!"
        description={error.message || "Please try again later."}
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
        description="You have no scheduled appointments. Create a new one to get started."
        buttonLabel="Book Appointment"
        buttonIcon={<Plus />}
        buttonOnClick={() => {
          openModal({
            type: "bookAppointment",
          });
        }}
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
      addLabelName={"Book Appointment"}
      searchField="doctor"
      filterField="status"
      filterValues={APPOINTMENT_STATUS}
      fallbackText={
        (appointments?.length === 0 && "No Appointments Found") ||
        "create appointment"
      }
      openModal={() => {
        openModal({
          type: "bookAppointment",
        });
      }}
    />
  );
}

export default AppointmentsTable;
