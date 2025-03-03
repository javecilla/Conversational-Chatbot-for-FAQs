// /src/types/ai.ts
export interface GeminiMessage {
  role: 'user' | 'model';
  content: string;
  timestamp: number;
  isStarter?: boolean;
}

// For Pinia state only - extends GeminiMessage with UI-specific options
export interface GeminiMessageWithOptions extends GeminiMessage {
  options?: string[];
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