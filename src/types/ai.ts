// /src/types/ai.ts
export interface GeminiMessage {
  role: 'user' | 'model';
  content: string;
  timestamp: number;
  options?: string[];
  isStarter?: boolean; 
}

export interface GeminiContent {
  parts: readonly { text: string }[];
}

export interface GeminiResponse {
  candidates: readonly {
    content: { parts: readonly { text: string }[]; role: string };
    finishReason: string;
  }[];
}