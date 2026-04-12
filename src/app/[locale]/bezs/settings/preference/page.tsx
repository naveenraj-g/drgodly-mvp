import { UserPreferences } from "@/modules/client/bezs/components/settings/userPreference";
import { getUserPreference } from "@/modules/client/bezs/server-actions/userPreference-actions";
import { getServerSession } from "@/modules/server/auth/get-session";

export default async function BezsPreferencePage() {
  const session = await getServerSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const [data, error] = await getUserPreference({ userId: session.user.id });

  return (
    <>
      <UserPreferences preference={data} error={error} />
    </>
  );
}
