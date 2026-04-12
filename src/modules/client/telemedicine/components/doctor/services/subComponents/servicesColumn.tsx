import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TanstackTableColumnSorting } from "@/modules/shared/components/table/tanstack-table-column-sorting";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Ellipsis, PencilLine, Trash2, TriangleAlert } from "lucide-react";
import { TService } from "@/modules/shared/entities/models/telemedicine/service";
import { doctorModalStore } from "@/modules/client/telemedicine/stores/doctor-modal-store";
import { TSharedUser } from "@/modules/shared/types";

export const manageServicesColumn = (
  user: TSharedUser
): ColumnDef<TService>[] => [
  {
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return (
        <TanstackTableColumnSorting
          label={"Name"}
          column={column}
          isSorted={isSorted}
        />
      );
    },
    accessorKey: "name",
  },
  {
    header: "Description",
    accessorKey: "description",
    cell: ({ row }) => {
      const description = row.original.description;
      return (
        <p
          className="truncate max-w-[180px] xl:max-w-[280px] 2xl:max-w-[400px]"
          title={description ?? undefined}
        >
          {description ? description : "N/A"}
        </p>
      );
    },
  },
  {
    header: "Duration",
    accessorKey: "duration",
    cell: ({ row }) => {
      const duration = row.original.duration;
      return <div>{duration} min</div>;
    },
  },
  {
    header: "Currency",
    accessorKey: "priceCurrency",
    cell: ({ row }) => {
      const currency = row.original.priceCurrency;
      return <p>{currency ? currency : "N/A"}</p>;
    },
  },
  {
    header: "Amount",
    accessorKey: "priceAmount",
    cell: ({ row }) => {
      const amount = row.original.priceAmount;
      return <p>{amount ? amount : "N/A"}</p>;
    },
  },
  {
    header: "Supported Modes",
    accessorKey: "supportedModes",
    cell({ row }) {
      const supportedModes = row.original.supportedModes;
      return (
        <div>
          {supportedModes.map((mode) => (
            <span
              key={mode}
              className="bg-slate-200 text-slate-700 px-2 py-1 rounded-md mr-2"
            >
              {mode}
            </span>
          ))}
        </div>
      );
    },
  },
  {
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return (
        <TanstackTableColumnSorting
          label={"Created At"}
          column={column}
          isSorted={isSorted}
        />
      );
    },
    accessorKey: "createdAt",
    cell: ({ row }) => {
      const openModal = doctorModalStore((state) => state.onOpen);
      const data = row.original;
      const joinedDate: Date = row.getValue("createdAt");

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
        </div>
      );
    },
  },
];
