"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "@/i18n/navigation";
import { TGetAppsByOrgIdControllerOutput } from "@/modules/server/shared/app/interface-adapters/controllers";
import { useSearchParams } from "next/navigation";
import { ZSAError } from "zsa";
import { useEffect } from "react";
import { updateQueryParam } from "@/modules/shared/utils/updateQueryParam";

interface IAppSelectProps {
  apps: TGetAppsByOrgIdControllerOutput | null;
  defaultValue: string;
  error?: ZSAError | null;
}

function AppSelect({ apps, defaultValue, error }: IAppSelectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const app = searchParams?.get("app");

  useEffect(() => {
    const app = searchParams?.get("app");
    if (app) return;

    if (!apps || apps.length === 0) {
      updateQueryParam("app", "no-apps", searchParams!, router);
      return;
    }
    updateQueryParam("app", defaultValue, searchParams!, router);
  }, [apps, defaultValue]);

  function onAppChange(value: string) {
    updateQueryParam("app", value, searchParams!, router);
  }

  return (
    <Select defaultValue={app || defaultValue} onValueChange={onAppChange}>
      <SelectTrigger className="w-[180px] cursor-pointer">
        <SelectValue placeholder="Select a app" />
      </SelectTrigger>
      <SelectContent>
        {error || !apps || apps.length === 0 ? (
          <SelectItem value="no-apps">
            {error?.message || "No apps found"}
          </SelectItem>
        ) : null}
        {apps?.map((app) => {
          if (app.slug === "admin") return null;
          return (
            <SelectItem key={app.id} value={app.slug}>
              {app.name}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}

export default AppSelect;
