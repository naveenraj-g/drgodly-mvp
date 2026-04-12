"server-only";

import { headers } from "next/headers";

export const getAppSlugServerOnly = async () => {
  const hdrs = headers();
  const pathName = (await hdrs).get("x-pathname") || "";
  const splittedPathName = pathName.split("/").filter(Boolean);
  const appSlug = splittedPathName[1];
  return { appSlug };
};
