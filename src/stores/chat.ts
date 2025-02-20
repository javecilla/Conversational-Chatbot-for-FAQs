import { defineStore } from 'pinia';

interface Message {
  role: 'user' | 'model';
  content: string;
  timestamp: number;
  options?: string[];
}

export const useChatStore = defineStore('chat', {
  state: () => ({
    messages: [] as Message[]
  }),

  actions: {
    addMessage(role: 'user' | 'model', content: string, options?: string[]) {
      this.messages.push({
        role,
        content,
        timestamp: Date.now(),
        options
      });
    }
  }
});