"use client";

import DataTable from "@/modules/shared/components/table/data-table";
import { useAdminModalStore } from "@/modules/client/admin/stores/admin-modal-store";
import { usersListTableColumn } from "./users-list-table-column";

export type TUser = {
  id: string;

  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;

  username: string;
  displayUsername: string;

  role: string;

  twoFactorEnabled: boolean;

  banned: boolean;
  banReason: string | null;
  banExpires: string | null;

  keycloakUserid: string | null;
  currentOrgId: string | null;

  createdAt: string;
  updatedAt: string;
};

type IUsersListTable = {
  usersData: TUser[] | null;
  total: number;
};

export const UsersListTable = ({ usersData, total }: IUsersListTable) => {
  const openModal = useAdminModalStore((state) => state.onOpen);

  return (
    <>
      <div className="space-y-8 w-full">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Manage Users</h1>
          <p className="text-sm">
            Manage users and their account permissions here.
          </p>
        </div>
        <DataTable
          columns={usersListTableColumn}
          data={usersData ?? []}
          dataSize={total}
          label="All Users"
          addLabelName={"Add Users"}
          searchField="name"
          fallbackText={
            (usersData?.length === 0 && "No users found") || undefined
          }
          openModal={() =>
            openModal({
              type: "addUser",
            })
          }
        />
      </div>
    </>
  );
};
