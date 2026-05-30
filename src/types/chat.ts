export type ChatRole = 'user' | 'assistant';
export type OllamaRole = ChatRole | 'system';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
}

export interface OllamaMessage {
  role: OllamaRole;
  content: string;
}

export interface ChatSettings {
  model: string;
  customModels: string[];
  systemPrompt: string;
  temperature: number;
}

export interface SendChatMessageParams {
  model: string;
  messages: ChatMessage[];
  systemPrompt: string;
  temperature: number;
}

export interface OllamaChatResponse {
  message?: {
    role: OllamaRole;
    content: string;
  };
  error?: string;
}
