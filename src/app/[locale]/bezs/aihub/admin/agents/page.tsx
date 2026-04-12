import { redirect } from "@/i18n/navigation";
import AgentsTable from "@/modules/client/aihub/components/admin/agents/AgentsTable";
import KnowledgeBaseTable from "@/modules/client/aihub/components/admin/knowledge-base/KnowledgeBaseTable";
import { KnowledgeBase, Agent } from "@/modules/client/aihub/types/admin/admin";
import { getServerSession } from "@/modules/server/auth/get-session";
import { getLocale } from "next-intl/server";

async function AgentsPage() {
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

  const mockAgents: Agent[] = [
    {
      id: "1",
      name: "General Assistant",
      description: "A versatile AI assistant for general queries and tasks",
      endpoint: "https://api.example.com/agent/general",
      topP: 0.9,
      topK: 40,
      temperature: 0.7,
      maxTokens: 2048,
      knowledgeBaseIds: ["kb1"],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "2",
      name: "Code Expert",
      description: "Specialized in programming and technical assistance",
      endpoint: "https://api.example.com/agent/code",
      topP: 0.85,
      topK: 50,
      temperature: 0.3,
      maxTokens: 4096,
      knowledgeBaseIds: ["kb2"],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "3",
      name: "Data Analyst",
      description: "Analytics and data visualization expert",
      endpoint: "https://api.example.com/agent/analytics",
      topP: 0.8,
      topK: 30,
      temperature: 0.5,
      maxTokens: 2048,
      knowledgeBaseIds: ["kb3"],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  return (
    <div className="space-y-8 w-full">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Agents</h1>
        <p className="text-sm">
          Manage your AI agents and their configurations
        </p>
      </div>
      <AgentsTable agents={mockAgents} error={null} />
    </div>
  );
}

export default AgentsPage;
