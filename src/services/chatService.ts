import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  orderBy,
  limit as firestoreLimit, 
  serverTimestamp,
  arrayUnion,
  Timestamp,
  where
} from 'firebase/firestore';
import type { DocumentData } from 'firebase/firestore';
import { db } from '@/libs/firebase';
import type { GeminiMessage } from '@/types/ai';
import type { ChatSession } from '@/types/chat';

export const chatService = {
  // Create new chat session
  async createChat(sessionId: string, initialMessage?: GeminiMessage): Promise<string> {
    try {
      const chatRef = await addDoc(collection(db, 'chats'), {
        sessionId,
        messages: initialMessage ? [{
          role: initialMessage.role,
          content: initialMessage.content,
          timestamp: Date.now(),
          isStarter: initialMessage.isStarter || false
        }] : [],
        createdAt: serverTimestamp(),
        lastUpdated: serverTimestamp()
      });
      return chatRef.id;
    } catch (error) {
      console.error('Error creating chat:', error);
      throw error;
    }
  },

  // Add message to existing chat
  async addMessage(chatId: string, message: GeminiMessage): Promise<void> {
    try {
      const chatRef = doc(db, 'chats', chatId);
      await updateDoc(chatRef, {
        messages: arrayUnion({
          role: message.role,
          content: message.content,
          timestamp: message.timestamp,
          isStarter: message.isStarter || false
        }),
        lastUpdated: serverTimestamp()
      });
    } catch (error) {
      console.error('Error adding message:', error);
      throw error;
    }
  },

  // Get chat by ID
  async getChat(chatId: string): Promise<ChatSession | null> {
    const chatRef = doc(db, 'chats', chatId);
    const chatSnap = await getDoc(chatRef);
    
    if (chatSnap.exists()) {
      const data = chatSnap.data();
      // Convert Firestore timestamps to Unix timestamps in milliseconds
      const messages = data.messages.map((msg: any) => ({
        ...msg,
        timestamp: msg.timestamp?.toMillis() || Date.now()
      }));

      return {
        id: chatSnap.id,
        sessionId: data.sessionId,
        messages,
        createdAt: data.createdAt?.toDate() || new Date(),
        lastUpdated: data.lastUpdated?.toDate() || new Date()
      };
    }
    return null;
  },

  // Get chat by session ID
  async getChatBySessionId(sessionId: string): Promise<ChatSession | null> {
    try {
      //console.log('Querying for session:', sessionId);
      const chatsQuery = query(
        collection(db, 'chats'),
        where('sessionId', '==', sessionId),
        orderBy('createdAt', 'desc'),
        firestoreLimit(1)
      );
      
      const querySnapshot = await getDocs(chatsQuery);
      //console.log('Query results:', querySnapshot.size);
      
      if (querySnapshot.empty) return null;

      const doc = querySnapshot.docs[0];
      const data = doc.data();

      // Ensure messages are properly ordered by timestamp
      const messages = data.messages
        .map((msg: any) => ({
          role: msg.role,
          content: msg.content || '', 
          timestamp: typeof msg.timestamp === 'number' ? msg.timestamp : msg.timestamp?.toMillis?.() || Date.now(),
          isStarter: Boolean(msg.isStarter) 
        }))
        .sort((a: GeminiMessage, b: GeminiMessage) => a.timestamp - b.timestamp);

      //console.log('Processed messages:', messages);

      return {
        id: doc.id,
        sessionId: data.sessionId,
        messages,
        createdAt: data.createdAt?.toDate() || new Date(),
        lastUpdated: data.lastUpdated?.toDate() || new Date()
      };
    } catch (error) {
      console.error('Error getting chat by session ID:', error);
      throw error;
    }
  },

  // Get recent chats
  async getRecentChats(maxResults: number = 10): Promise<ChatSession[]> {
    const chatsQuery = query(
      collection(db, 'chats'),
      orderBy('lastUpdated', 'desc'),
      firestoreLimit(maxResults) 
    );
    
    const querySnapshot = await getDocs(chatsQuery);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ChatSession[]; 
  },

  // Update message in existing chat
  async updateMessage(chatId: string, message: GeminiMessage): Promise<void> {
    try {
      const chatRef = doc(db, 'chats', chatId);
      const chatSnap = await getDoc(chatRef);
      
      if (chatSnap.exists()) {
        const data = chatSnap.data();
        const messages = [...data.messages];
        const messageIndex = messages.findIndex((msg: GeminiMessage) => msg.timestamp === message.timestamp);
        
        if (messageIndex !== -1) {
          messages[messageIndex] = {
            role: message.role,
            content: message.content,
            timestamp: message.timestamp,
            isStarter: message.isStarter || false
          };
        } else {
          messages.push({
            role: message.role,
            content: message.content,
            timestamp: message.timestamp,
            isStarter: message.isStarter || false
          });
        }
        
        // Ensure atomic update
        await updateDoc(chatRef, {
          messages,
          lastUpdated: serverTimestamp()
        });

        // Verify the update with proper typing
        const verifySnap = await getDoc(chatRef);
        const verifyData = verifySnap.data();
        if (!verifyData?.messages?.some((msg: { timestamp: number }) => msg.timestamp === message.timestamp)) {
          throw new Error('Message update verification failed');
        }
      }
    } catch (error) {
      console.error('Error updating message:', error);
      throw error;
    }
  },
};
