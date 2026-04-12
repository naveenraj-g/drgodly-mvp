"use client";

import { Calendar, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { TSharedUser } from "@/modules/shared/types";
import { useDoctorModalStore } from "@/modules/client/telemedicine/stores/doctor-modal-store";

export function EmptyService({ user }: { user: TSharedUser }) {
  const openModal = useDoctorModalStore((state) => state.onOpen);

  return (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Calendar />
        </EmptyMedia>
        <EmptyTitle>No services created yet</EmptyTitle>
        <EmptyDescription>
          Get started by creating your first appointment service. You can offer
          in-person or virtual consultations.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button
          onClick={() => {
            openModal({
              type: "addService",
              userId: user.id,
              orgId: user.orgId,
            });
          }}
        >
          <Plus />
          Create Service
        </Button>
      </EmptyContent>
    </Empty>
  );
}
