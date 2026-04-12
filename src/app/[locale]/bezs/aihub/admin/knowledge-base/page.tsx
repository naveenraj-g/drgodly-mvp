import { redirect } from "@/i18n/navigation";
import KnowledgeBaseTable from "@/modules/client/aihub/components/admin/knowledge-base/KnowledgeBaseTable";
import { KnowledgeBase } from "@/modules/client/aihub/types/admin/admin";
import { getServerSession } from "@/modules/server/auth/get-session";
import { getLocale } from "next-intl/server";

async function KnowledgeBasePage() {
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

  const mockKnowledgeBases: KnowledgeBase[] = [
    {
      id: "kb1",
      name: "General Knowledge",
      description: "Common knowledge and FAQs",
      documentCount: 150,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "kb2",
      name: "Technical Documentation",
      description: "Programming guides and API docs",
      documentCount: 320,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "kb3",
      name: "Analytics Resources",
      description: "Data analysis templates and guides",
      documentCount: 85,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  return (
    <div className="space-y-8 w-full">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Knowledge Base</h1>
        <p className="text-sm">Manage knowledge bases for your AI agents</p>
      </div>
      <KnowledgeBaseTable
        knowledgeBase={mockKnowledgeBases}
        error={null}
        user={user}
      />
    </div>
  );
}

export default KnowledgeBasePage;
