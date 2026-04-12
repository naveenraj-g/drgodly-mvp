import { ZSAError } from "zsa";
import { Endpoint, KnowledgeBase, Agent } from "./admin";
import { TSharedUser } from "@/modules/shared/types";

export interface IEndpointsProps {
  endpoints: Endpoint[] | null;
  error: ZSAError | null;
  user: TSharedUser;
}

export type TEndpoint = Endpoint;

export interface IKnowledgeBaseProps {
  knowledgeBase: KnowledgeBase[] | null;
  error: ZSAError | null;
  user: TSharedUser;
}

export type TKnowledgeBase = KnowledgeBase;

export interface IAgentsProps {
  agents: Agent[] | null;
  error: ZSAError | null;
  user: TSharedUser;
}

export type TAgent = Agent;
