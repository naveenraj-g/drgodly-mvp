export interface Agent {
  id: string;
  name: string;
  description: string;
  endpoint: string;
  topP: number;
  topK: number;
  temperature: number;
  maxTokens: number;
  knowledgeBaseIds: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface KnowledgeBase {
  id: string;
  name: string;
  description: string;
  documentCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Endpoint {
  id: string;
  name: string;
  url: string;
  description: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
