/*
  Using GROK (X AI)
*/

export interface GrokMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface GrokChoice {
  message: {
    content: string;
  };
}

export interface GrokResponse {
  choices: GrokChoice[];
}

/*
  Using Gemini (Google AI)
*/

export interface GeminiContent {
  parts: readonly { text: string }[];
}

export interface GeminiResponse {
  candidates: readonly {
    content: { parts: readonly { text: string }[]; role: string };
    finishReason: string;
  }[];
}
