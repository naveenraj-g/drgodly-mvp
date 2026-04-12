import { TanstackTableColumnSorting } from "@/modules/shared/components/table/tanstack-table-column-sorting";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { TRbac } from "@/modules/shared/entities/models/admin/rbac";
import { RbacUnmap } from "../../rbac/rbac-unmap";

export const RbacListColumn = (
  t: (key: string) => string
): ColumnDef<TRbac>[] => [
  {
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return (
        <TanstackTableColumnSorting
          label={t("columns.organization")}
          column={column}
          isSorted={isSorted}
        />
      );
    },
    accessorKey: "organization",
    cell: ({ row }) => {
      const orgData: {
        name: string;
        id: string;
      } = row.getValue("organization");

      return orgData?.name;
    },
  },
  {
    header: t("columns.user"),
    accessorKey: "user",
    filterFn: (row, columnId, filterValue) => {
      const userData: {
        name: string;
        id: string;
        email: string;
        username: string | null;
      } = row.getValue("user");
      return userData.name
        .toLowerCase()
        .includes((filterValue as string).toLowerCase());
    },
    cell: ({ row }) => {
      const userData: {
        name: string;
        id: string;
        email: string;
        username: string | null;
      } = row.getValue("user");
      return (
        <p className="truncate max-w-[250px] xl:max-w-[450px] 2xl:max-w-full">
          {userData?.name} (@{userData?.username})
        </p>
      );
    },
  },
  {
    header: t("columns.role"),
    accessorKey: "role",
    filterFn: (row, columnId, filterValue) => {
      const roleData: {
        name: string;
        id: string;
      } = row.getValue("role");
      return roleData.name === filterValue;
    },
    cell: ({ row }) => {
      const roleData: {
        name: string;
        id: string;
      } = row.getValue("role");
      return roleData.name;
    },
  },
  {
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return (
        <TanstackTableColumnSorting
          label={"Login Redirect URL"}
          column={column}
          isSorted={isSorted}
        />
      );
    },
    accessorKey: "defaultRedirectUrl",
    cell: ({ row }) => {
      return <p className="truncate">{row.getValue("defaultRedirectUrl")}</p>;
    },
  },
  {
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return (
        <TanstackTableColumnSorting
          label={t("columns.createdAt")}
          column={column}
          isSorted={isSorted}
        />
      );
    },
    accessorKey: "createdAt",
    cell: ({ row }) => {
      const joinedDate: Date = row.getValue("createdAt");
      return format(joinedDate, "do 'of' MMM, yyyy");
    },
  },
  {
    header: t("columns.action"),
    id: "action",
    cell: ({ row }) => {
      const orgId = row.original.organizationId;
      const roleId = row.original.roleId;
      const userId = row.original.userId;

      return <RbacUnmap orgId={orgId} roleId={roleId} userId={userId} />;
    },
  },
];
