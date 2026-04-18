"use client";

import DataTable from "@/modules/shared/components/table/data-table";
import { doctorsProfileListTableColumn } from "./doctors-profile-list-table-column";
import type { ZSAError } from "zsa";
import { TDoctorDatas } from "@/modules/shared/entities/models/telemedicine/doctorProfile";
import { useServerAction } from "zsa-react";
import {
  createDoctorInitialProfile,
  seedAgentDoctors,
} from "../../../server-actions/doctorProfile-actions";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
import { Bot, Loader2, Plus } from "lucide-react";
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
  const openModal = useAdminModalStore((state) => state.onOpen);

  const { execute, isPending, isSuccess } = useServerAction(
    createDoctorInitialProfile,
  );

  const { execute: executeSeed, isPending: isSeedPending } = useServerAction(
    seedAgentDoctors,
    {
      onSuccess({ data }) {
        const { created, skipped } = data;
        if (created.length > 0) {
          toast.success("Agent doctors created", {
            description: `Created: ${created.join(", ")}${skipped.length > 0 ? ` · Already existed: ${skipped.join(", ")}` : ""}`,
          });
        } else {
          toast.info("Agent doctors already exist", {
            description: `${skipped.join(", ")} already set up for this organisation.`,
          });
        }
      },
      onError() {
        toast.error("Failed to create agent doctors", {
          description: "Please try again.",
        });
      },
    },
  );

  const handleSeedAgentDoctors = async () => {
    if (!user.currentOrgId) {
      toast.warning("No Organisation Found", {
        description: "Join an organisation to continue.",
      });
      return;
    }
    await executeSeed({ orgId: user.currentOrgId, createdBy: user.id });
  };

  if (isPending) {
    return (
      <div className="w-full grid place-content-center">
        <div className="flex items-center gap-2">
          <Loader2 className="animate-spin size-6" />
          <span>Initiating create doctor...</span>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="w-full grid place-content-center mt-10">
        <div className="flex items-center gap-2">
          <Loader2 className="animate-spin size-6" />
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
          <div className="flex items-center gap-2 self-end">
            <Button
              size="sm"
              variant="outline"
              onClick={handleSeedAgentDoctors}
              disabled={isSeedPending}
            >
              {isSeedPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Bot />
              )}
              {isSeedPending ? "Creating..." : "Create Agent Doctors"}
            </Button>
            <Button
              size="sm"
              onClick={() => openModal({ type: "addDoctorByHPR" })}
            >
              <Plus />
              Add Doctor by HPR
            </Button>
          </div>
        </div>
        <DataTable
          columns={doctorsProfileListTableColumn(user.currentOrgId)}
          data={doctorDatas?.doctorDatas ?? []}
          dataSize={doctorDatas?.total}
          label="All Doctor Profiles"
          addLabelName="Add Doctor profile"
          error={(!doctorDatas && error?.message) || null}
          fallbackText={
            (error && error.message) ||
            (doctorDatas?.doctorDatas?.length === 0 && "No Doctor profiles") ||
            undefined
          }
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
