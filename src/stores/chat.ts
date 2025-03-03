import { defineStore } from 'pinia';
import type { GeminiMessage } from '@/types/ai';
import type { ChatState } from '@/types/chat';
import { chatService } from '@/services/chatService';

const SESSION_ID_KEY = 'chat_session_id';

export const useChatStore = defineStore('chat', {
  state: (): ChatState => ({
    messages: [],
    currentChatId: null,
    sessionId: null,
  }),

  actions: {
    generateSessionId() {
      return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    },

    async initChat(forceNew: boolean = false) {
      try {
        const existingSessionId = localStorage.getItem(SESSION_ID_KEY);
        //console.log('Existing session ID:', existingSessionId);

        if (!forceNew && existingSessionId) {
          //console.log('Attempting to restore session:', existingSessionId);
          const existingChat = await chatService.getChatBySessionId(existingSessionId);
          
          if (existingChat && existingChat.messages.length > 0) {
            //console.log('Found existing chat with messages:', existingChat);
            this.sessionId = existingSessionId;
            this.currentChatId = existingChat.id;
            this.messages = existingChat.messages;
            return this.currentChatId;
          }
          //console.log('No valid chat found for session:', existingSessionId);
        }
        
        this.sessionId = this.generateSessionId();
        localStorage.setItem(SESSION_ID_KEY, this.sessionId);
        //console.log('Generated new session:', this.sessionId);
        
        this.messages = []; // Clear messages before creating new chat
        this.currentChatId = await chatService.createChat(this.sessionId);
        
        return this.currentChatId;
      } catch (error) {
        console.error('Error initializing chat:', error);
        return null;
      }
    },

    async addMessage(role: 'user' | 'model', content: string, options?: string[], isStarter: boolean = false) {
      const message = {
        role,
        content,
        timestamp: Date.now(),
        isStarter,
        ...(options && { options }) // Only include options in Pinia state
      };

      this.messages.push(message);

      if (this.currentChatId) {
        // Strip options when saving to Firebase
        const { options: _, ...firebaseMessage } = message;
        await chatService.addMessage(this.currentChatId, firebaseMessage);
      }

      return message.timestamp;
    },

    async loadChat(chatId: string) {
      const chat = await chatService.getChat(chatId);
      if (chat) {
        this.currentChatId = chat.id;
        this.messages = chat.messages;
      }
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
    getMessageByTimestamp(timestamp: number): GeminiMessage | undefined {
      let message = this.messages.find((m: GeminiMessage) => m.timestamp === timestamp);
      if (!message) {
        const tolerance = 5 * 60 * 1000; // 5-minute tolerance in milliseconds
        const targetTime = new Date(timestamp).getTime();
        message = this.messages.reduce((closest, current) => {
          const currentDiff = Math.abs(current.timestamp - targetTime);
          const closestDiff = closest ? Math.abs(closest.timestamp - targetTime) : Infinity;
          return currentDiff < closestDiff && currentDiff <= tolerance ? current : closest;
        }, undefined as GeminiMessage | undefined);
      }
      return message;
    },

    async endSession() {
      this.currentChatId = null;
      this.messages = [];
      this.sessionId = this.generateSessionId();
      localStorage.setItem(SESSION_ID_KEY, this.sessionId); 
      
      // Start fresh chat session
      return this.initChat(true);
    },

    async updateAndSyncMessage(timestamp: number, content: string, options?: string[]) {
      // Update local state
      this.updateMessage(timestamp, content, options);

      // Find the message to sync
      const message = this.messages.find(m => m.timestamp === timestamp);
      if (message && this.currentChatId) {
        try {
          // Update in Firebase - only send the fields that Firebase expects
          await chatService.updateMessage(this.currentChatId, {
            role: message.role,
            content: content,
            timestamp: message.timestamp,
            isStarter: message.isStarter || false
          });
        } catch (error) {
          console.error('Error syncing message update to Firebase:', error);
        }
      }
    },
  },
});