import { redirect } from "@/i18n/navigation";
import Chat from "@/modules/client/aihub/components/Chat";
import { getServerSession } from "@/modules/server/auth/get-session";
import { getLocale } from "next-intl/server";

async function ChatPage() {
  const session = await getServerSession();
  const locale = await getLocale();

  if (!session || !session.session.activeOrganizationId) {
    redirect({ href: "/login", locale });
    return;
  }

  const user = {
    id: session.user.id,
    name: session.user.name,
    username: session.user.username,
    email: session.user.email,
    orgId: session.session.activeOrganizationId,
  };

  return (
    <div>
      <Chat user={user} />
    </div>
  );
}

export default ChatPage;
