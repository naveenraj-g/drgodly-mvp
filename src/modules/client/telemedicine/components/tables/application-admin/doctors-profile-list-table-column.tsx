import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { adminModalStore } from "../../../stores/admin-modal-store";
import { TanstackTableColumnSorting } from "@/modules/shared/components/table/tanstack-table-column-sorting";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
  Edit,
  Ellipsis,
  PencilLine,
  Trash2,
  TriangleAlert,
  UserCog,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { TDoctor } from "@/modules/shared/entities/models/telemedicine/doctorProfile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const doctorsProfileListTableColumn = (
  t: (key: string) => string,
  orgId?: string | null
): ColumnDef<TDoctor>[] => [
  {
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return (
        <TanstackTableColumnSorting
          label="Doctor Id"
          column={column}
          isSorted={isSorted}
        />
      );
    },
    accessorKey: "doctorId",
  },
  {
    header: "Profile Type",
    accessorKey: "isABDMDoctorProfile",
    cell: ({ row }) => {
      const isABDMDoctorProfile: boolean = row.getValue("isABDMDoctorProfile");
      return <span>{isABDMDoctorProfile ? "ABDM" : "Custom"}</span>;
    },
  },
  {
    header: "Status",
    accessorKey: "isCompleted",
    cell: ({ row }) => {
      const isCompleted: boolean = row.getValue("isCompleted");
      return (
        <Badge
          className={cn(
            isCompleted ? "bg-green-600 text-white" : "bg-orange-500 text-white"
          )}
        >
          {isCompleted ? "Completed" : "Pending"}
        </Badge>
      );
    },
  },
  {
    header: "Map User",
    accessorKey: "userId",
    cell: ({ row, getValue }) => {
      const openModal = adminModalStore((state) => state.onOpen);
      const userId = getValue();

      return userId ? (
        <span>User Mapped</span>
      ) : (
        <Button
          size="icon-sm"
          onClick={() =>
            openModal({
              type: "mapDoctor",
              doctorProfileId: row.original.id,
              orgId,
            })
          }
        >
          <UserCog />
        </Button>
      );
    },
  },
  {
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return (
        <TanstackTableColumnSorting
          label="Speciality"
          column={column}
          isSorted={isSorted}
        />
      );
    },
    id: "speciality",
    accessorFn: (row) => row.personal?.speciality ?? "",
    cell: ({ getValue }) => {
      const speciality = getValue<string>();
      return <span>{speciality || "Not Specified"}</span>;
    },
  },
  {
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return (
        <TanstackTableColumnSorting
          label={t("table.columns.createdAt")}
          column={column}
          isSorted={isSorted}
        />
      );
    },
    accessorKey: "createdAt",
    cell: ({ row }) => {
      const openModal = adminModalStore((state) => state.onOpen);
      const joinedDate: Date = row.getValue("createdAt");

      const id = row.original.id;

      return (
        <div className="flex items-center justify-between gap-4">
          {format(joinedDate, "do 'of' MMM, yyyy")}
          <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer">
              <Ellipsis className="font-medium" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="left">
              {/* <DropdownMenuItem className="cursor-pointer">
                <Eye />
                View
              </DropdownMenuItem> */}
              <DropdownMenuItem className="cursor-pointer">
                <Link
                  href={`/bezs/telemedicine/admin/manage-doctors/edit?id=${id}`}
                  className="flex items-center gap-2"
                >
                  <PencilLine />
                  {t("table.actions.edit")}
                </Link>
              </DropdownMenuItem>
              {/* <DropdownMenuSeparator /> */}
              <DropdownMenuItem
                className="space-x-2 cursor-pointer"
                onClick={() =>
                  openModal({
                    type: "deleteDoctorProfile",
                    doctorProfileId: id,
                  })
                }
              >
                <div className="flex items-center gap-2">
                  <Trash2 />
                  {t("table.actions.delete")}
                </div>
                <TriangleAlert className="text-rose-600" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
