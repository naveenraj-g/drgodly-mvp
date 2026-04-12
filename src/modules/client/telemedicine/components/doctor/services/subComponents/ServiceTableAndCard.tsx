"use client";

import DataTable from "@/modules/shared/components/table/data-table";
import { manageServicesColumn } from "./servicesColumn";
import { useDoctorModalStore } from "@/modules/client/telemedicine/stores/doctor-modal-store";
import { IServiceProps } from "../types";
import ServicesCard from "./ServicesCard";

function ServiceTableAndCard({ services, error, user }: IServiceProps) {
  const openModal = useDoctorModalStore((state) => state.onOpen);

  return (
    <DataTable
      columns={manageServicesColumn(user)}
      data={services ?? []}
      dataSize={services?.length ?? 0}
      label={"Services"}
      addLabelName={"Add Service"}
      searchField="name"
      error={(!services && error?.message) || null}
      fallbackText={
        (error && error.message) ||
        (services?.length === 0 && "No Services Found") ||
        undefined
      }
      defaultView="card"
      cardRender={(row) => <ServicesCard row={row} user={user} />}
      openModal={() => {
        openModal({
          type: "addService",
          userId: user.id,
          orgId: user.orgId,
        });
      }}
    />
  );
}

export default ServiceTableAndCard;
