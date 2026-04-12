import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDoctorModalStore } from "@/modules/client/telemedicine/stores/doctor-modal-store";
import { TService } from "@/modules/shared/entities/models/telemedicine/service";
import { TSharedUser } from "@/modules/shared/types";
import type { Row } from "@tanstack/react-table";
import {
  Clock,
  Ellipsis,
  PencilLine,
  Stethoscope,
  Trash2,
  TriangleAlert,
  Video,
} from "lucide-react";
import React from "react";

type TServiceCardProps = {
  row: Row<TService>;
  user: TSharedUser;
};

function ServicesCard({ row, user }: TServiceCardProps) {
  const openModal = useDoctorModalStore((state) => state.onOpen);
  const data = row.original;

  return (
    <Card
      key={data.id}
      className="flex flex-col transition-all hover:shadow-md"
    >
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <CardTitle className="flex justify-between items-center w-full">
          <div>
            <p className="text-lg font-semibold line-clamp-1">{data.name}</p>
            {data.priceAmount && data.priceCurrency && (
              <p className="font-bold text-lg whitespace-nowrap">
                {data.priceCurrency} {data.priceAmount}
              </p>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon-sm" variant="ghost" className="self-start">
                <Ellipsis className="font-medium" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="left">
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() =>
                  openModal({
                    type: "editService",
                    serviceData: data,
                    userId: user.id,
                    orgId: user.orgId,
                  })
                }
              >
                <PencilLine />
                Edit
              </DropdownMenuItem>
              {/* <DropdownMenuSeparator /> */}
              <DropdownMenuItem
                className="space-x-2 cursor-pointer"
                onClick={() =>
                  openModal({
                    type: "deleteService",
                    serviceId: data.id,
                    userId: user.id,
                    orgId: user.orgId,
                  })
                }
              >
                <div className="flex items-center gap-2">
                  <Trash2 />
                  Delete
                </div>
                <TriangleAlert className="text-rose-600" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="flex items-center text-sm text-muted-foreground mb-4">
          <Clock className="mr-2 h-4 w-4" />
          {data.duration} minutes
        </div>
        <p
          className="text-sm text-muted-foreground line-clamp-2 mb-4"
          title={data.description ?? undefined}
        >
          {data.description || "No description provided."}
        </p>
        <div className="flex flex-wrap gap-2 mt-auto">
          {data.supportedModes.includes("INPERSON") && (
            <Badge variant="secondary" className="gap-1">
              <Stethoscope className="h-3 w-3" /> In-Person
            </Badge>
          )}
          {data.supportedModes.includes("VIRTUAL") && (
            <Badge variant="secondary">
              <Video className="h-3 w-3" /> Virtual
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default ServicesCard;
