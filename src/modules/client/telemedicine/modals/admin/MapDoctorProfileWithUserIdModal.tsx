"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { useServerAction } from "zsa-react";

import {
  getUserForDoctorProfileMapping,
  mapDoctorProfile,
} from "../../server-actions/admin-actions";
import { useAdminModalStore } from "../../stores/admin-modal-store";
import { useEffect, useState } from "react";

type UserOption = {
  id: string;
  name: string;
  email: string;
  username: string | null;
};

export function MapDoctorProfileModal() {
  const { isOpen, type, onClose, doctorProfileId, orgId } =
    useAdminModalStore();

  const isModalOpen = isOpen && type === "mapDoctor";

  const [users, setUsers] = useState<UserOption[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  /* -------------------------------- Fetch users -------------------------------- */

  const {
    execute: fetchUsers,
    isPending: isFetching,
    isError,
  } = useServerAction(getUserForDoctorProfileMapping, {
    onSuccess({ data }) {
      setUsers(data);
    },
    onError({ err }) {
      toast.error("Failed to load users", {
        description: err?.message,
      });
    },
  });

  useEffect(() => {
    (async () => {
      if (isModalOpen && orgId) {
        console.log("Executing", orgId);
        await fetchUsers({ orgId });
      }
    })();
  }, [isModalOpen, orgId, fetchUsers]);

  /* -------------------------------- Map profile -------------------------------- */

  const { execute: mapProfile, isPending: isMapping } = useServerAction(
    mapDoctorProfile,
    {
      onSuccess() {
        toast.success("Doctor profile mapped successfully");
        handleClose();
      },
      onError({ err }) {
        toast.error("Mapping failed", {
          description: err?.message,
        });
      },
    }
  );

  function handleClose() {
    setSelectedUserId(null);
    setUsers([]);
    onClose();
  }

  async function handleMap() {
    if (!selectedUserId || !doctorProfileId || !orgId) {
      toast.error("Missing information");
      return;
    }

    await mapProfile({
      id: doctorProfileId,
      userId: selectedUserId,
      orgId,
    });
  }

  /* ---------------------------------- UI ---------------------------------- */

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Map Doctor Profile</DialogTitle>
          <DialogDescription>
            Select a user account to associate with this doctor profile.
          </DialogDescription>
        </DialogHeader>

        {/* User Select */}
        <div className="grid gap-3">
          <Select
            disabled={isFetching}
            onValueChange={(v) => setSelectedUserId(v)}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={isFetching ? "Loading users..." : "Select a user"}
              />
            </SelectTrigger>
            <SelectContent>
              {users.length === 0 && !isFetching && (
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  No users available
                </div>
              )}
              {users.map((u) => (
                <SelectItem key={u.id} value={u.id}>
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {u.name ?? u.username ?? "Unnamed User"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {u.email}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {isError && <p className="pt-2">error</p>}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" size="sm" disabled={isMapping}>
              Cancel
            </Button>
          </DialogClose>

          <Button
            size="sm"
            disabled={!selectedUserId || isMapping}
            onClick={handleMap}
          >
            {isMapping ? (
              <>
                Mapping <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              </>
            ) : (
              <>
                Map User <UserPlus className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
