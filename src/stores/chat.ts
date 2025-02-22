// /src/stores/chat.ts
import { defineStore } from 'pinia';
import type { GeminiMessage } from '@/types/ai';

export const useChatStore = defineStore('chat', {
  state: () => ({
    messages: [] as GeminiMessage[],
  }),

  actions: {
    addMessage(role: 'user' | 'model', content: string, options?: string[], isStarter: boolean = false) {
      const message: GeminiMessage = {
        role,
        content,
        timestamp: Date.now(),
        options,
        isStarter, // Add isStarter flag
      };
      this.messages.push(message);
      return message.timestamp; // Ensure unique timestamps
    },
    updateMessage(timestamp: number, content: string, options?: string[]) {
      const message = this.messages.find((m: GeminiMessage) => m.timestamp === timestamp);
      if (message) {
        message.content = content;
        if (options !== undefined) message.options = options; // Update options if provided
      }
    },
    resetMessages() {
      this.messages = [];
    },
  },
});