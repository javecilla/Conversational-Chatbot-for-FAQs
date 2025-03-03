import type { GeminiMessage, GeminiMessageWithOptions } from '@/types/ai';

export interface ChatSession {
  id: string;
  sessionId: string;
  messages: GeminiMessage[];
  createdAt: Date;
  lastUpdated: Date;
}

export interface ChatState {
  messages: GeminiMessageWithOptions[]; // UI state includes options
  currentChatId: string | null;
  sessionId: string | null;
}