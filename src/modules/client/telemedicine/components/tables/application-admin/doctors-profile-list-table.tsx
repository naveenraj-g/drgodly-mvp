"use client";

import DataTable from "@/modules/shared/components/table/data-table";
import { doctorsProfileListTableColumn } from "./doctors-profile-list-table-column";
import type { ZSAError } from "zsa";
import { useTranslations } from "next-intl";
import { TDoctorDatas } from "@/modules/shared/entities/models/telemedicine/doctorProfile";
import { useServerAction } from "zsa-react";
import { createDoctorInitialProfile } from "../../../server-actions/doctorProfile-actions";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminModalStore } from "../../../stores/admin-modal-store";

type TUser = {
  id: string;
  name: string;
  username?: string | null;
  currentOrgId?: string | null;
  email: string;
};

type IAppsListTable = {
  doctorDatas: TDoctorDatas | null;
  error: ZSAError | null;
  user: TUser;
};

export const DoctorsProfileListTable = ({
  doctorDatas,
  error,
  user,
}: IAppsListTable) => {
  const router = useRouter();
  const t = useTranslations("admin.manageApps");
  const openModal = useAdminModalStore((state) => state.onOpen);

  const { execute, isPending, isSuccess } = useServerAction(
    createDoctorInitialProfile
  );

  if (isPending) {
    return (
      <div className="w-full grid place-content-center">
        <div className="flex items-center gap-2">
          <Loader2 className="animate-spin size-6" />{" "}
          <span>Initiating create doctor...</span>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="w-full grid place-content-center mt-10">
        <div className="flex items-center gap-2">
          <Loader2 className="animate-spin size-6" />{" "}
          <span>Redirecting to doctor profile creation...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8 w-full">
        <div className="flex justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold">Manage Doctors</h1>
            <p className="text-sm">
              Manage Telemedicine doctors and their profiles
            </p>
          </div>
          <Button
            size="sm"
            className="self-end"
            onClick={() => openModal({ type: "addDoctorByHPR" })}
          >
            <Plus />
            Add Doctor by HPR
          </Button>
        </div>
        <DataTable
          columns={doctorsProfileListTableColumn(t, user.currentOrgId)}
          data={doctorDatas?.doctorDatas ?? []}
          dataSize={doctorDatas?.total}
          label="All Doctor Profiles"
          addLabelName="Add Doctor profile"
          //   searchField="name"
          error={(!doctorDatas && error?.message) || null}
          fallbackText={
            (error && error.message) ||
            (doctorDatas?.doctorDatas?.length === 0 && "No Doctor profiles") ||
            undefined
          }
          //   filterField="type"
          //   filterValues={typeFilteredData}
          openModal={async () => {
            if (!user.currentOrgId) {
              toast.warning("No Organization Found", {
                description: "Join in an organization to continue.",
              });
              return;
            }

            const [data, error] = await execute({
              orgId: user.currentOrgId,
              createdBy: user.id,
              isABDMDoctorProfile: false,
            });

            if (!error && data) {
              router.push({
                pathname: "/bezs/telemedicine/admin/manage-doctors/create",
                query: { id: data.id },
              });
            }
          }}
        />
      </div>
    </>
  );
};
