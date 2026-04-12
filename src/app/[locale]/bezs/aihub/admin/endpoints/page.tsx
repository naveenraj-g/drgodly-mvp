import { redirect } from "@/i18n/navigation";
import EndpointsTable from "@/modules/client/aihub/components/admin/endpoints/EndpointsTable";
import { Endpoint } from "@/modules/client/aihub/types/admin/admin";
import { getServerSession } from "@/modules/server/auth/get-session";
import { getLocale } from "next-intl/server";

async function EndpointsPage() {
  const session = await getServerSession();
  const locale = await getLocale();

  if (!session || !session.session.activeOrganizationId) {
    redirect({ href: "/signin", locale });
    return;
  }

  const user = {
    id: session.user.id,
    name: session.user.name,
    username: session.user.username,
    email: session.user.email,
    orgId: session.session.activeOrganizationId,
  };

  const mockEndpoints: Endpoint[] = [
    {
      id: "ep1",
      name: "Production API",
      url: "https://api.example.com/v1",
      description: "Main production endpoint",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "ep2",
      name: "Staging API",
      url: "https://staging-api.example.com/v1",
      description: "Testing and staging environment",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  return (
    <div className="space-y-8 w-full">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Endpoints</h1>
        <p className="text-sm">Manage API endpoints for custom agents</p>
      </div>
      <EndpointsTable endpoints={mockEndpoints} error={null} user={user} />
    </div>
  );
}

export default EndpointsPage;
