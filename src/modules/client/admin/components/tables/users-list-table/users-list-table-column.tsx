import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { adminModalStore } from "@/modules/client/admin/stores/admin-modal-store";
import { TanstackTableColumnSorting } from "@/modules/shared/components/table/tanstack-table-column-sorting";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Ellipsis, PencilLine, Trash2, TriangleAlert } from "lucide-react";
import { TUser } from "./users-list-table";

export const usersListTableColumn: ColumnDef<TUser>[] = [
  {
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return (
        <TanstackTableColumnSorting
          label="Name"
          column={column}
          isSorted={isSorted}
        />
      );
    },
    accessorKey: "name",
  },
  {
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return (
        <TanstackTableColumnSorting
          label="User Name"
          column={column}
          isSorted={isSorted}
        />
      );
    },
    accessorKey: "username",
  },
  {
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return (
        <TanstackTableColumnSorting
          label="Email"
          column={column}
          isSorted={isSorted}
        />
      );
    },
    accessorKey: "email",
  },
  {
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return (
        <TanstackTableColumnSorting
          label="Role"
          column={column}
          isSorted={isSorted}
        />
      );
    },
    accessorKey: "role",
  },
  {
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return (
        <TanstackTableColumnSorting
          label="Joined"
          column={column}
          isSorted={isSorted}
        />
      );
    },
    accessorKey: "createdAt",
    cell: ({ row }) => {
      const openModal = adminModalStore((state) => state.onOpen);
      const orgData = row.original;

      const user = {
        id: orgData.id,
        name: orgData.name,
        username: orgData.username,
        role: orgData.role,
      };

      const joinedDate: Date = row.getValue("createdAt");

      return (
        <div className="flex items-center justify-between gap-4">
          {format(joinedDate, "do 'of' MMM, yyyy")}
          <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer">
              <Ellipsis className="font-medium" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="left">
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() =>
                  openModal({
                    type: "editUser",
                    user,
                  })
                }
              >
                <PencilLine />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="space-x-2 cursor-pointer"
                onClick={() =>
                  openModal({
                    type: "deleteUser",
                    user,
                  })
                }
              >
                <div className="flex items-center gap-2 text-destructive">
                  <Trash2 className="text-inherit" />
                  Delete
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
