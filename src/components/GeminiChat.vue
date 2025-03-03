<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue';
import { useChatStore } from '@/stores/chat';
import { useChatBot } from '@/utils/chatBot';
import type { GeminiMessage } from '@/types/ai';
import MarkdownIt from 'markdown-it';
import { PlusIcon, EllipsisIcon, ArrowUpIcon } from "lucide-vue-next";

const userInput = ref('');
const isLoading = ref(false);
const typingIndicator = ref(false);

const chatStore = useChatStore();
const { streamResponse, generateQuickReplies, isOffTopic, resetOffTopic } = useChatBot(chatStore);

const md = new MarkdownIt({ html: true, breaks: true, linkify: true });

const scrollToBottom = () => {
  const chatContainer = document.querySelector('.overflow-y-auto');
  if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight;
};

const getStarterQuickReplies = () => [
  'Who are you?',
  'Do you accept project commissions?',
  'What services do you offer?',
];

onMounted(async () => {
  await chatStore.initChat();
  
  if (chatStore.messages.length === 0) {
    //console.log('Starting new chat with welcome message');
    const botMessageId = await chatStore.addMessage('model', '', undefined, true);
    typingIndicator.value = true;

    try {
      const streams = streamResponse('', true);
      let fullResponse = '';
      for await (const chunk of streams) {
        fullResponse += chunk + ' ';
        await nextTick(() => {
          chatStore.updateMessage(botMessageId, fullResponse.trim());
          scrollToBottom();
        });
      }
      
      // After streaming completes, update and sync to Firebase with the full response
      await chatStore.updateAndSyncMessage(botMessageId, fullResponse.trim(), getStarterQuickReplies());
      await nextTick(() => scrollToBottom());
    } catch (error) {
      console.error('Starter conversation error:', error);
      chatStore.updateMessage(botMessageId, 'Oops, something went wrong with the starter message!');
      await nextTick(() => scrollToBottom());
    } finally {
      typingIndicator.value = false;
    }
  } else {
    //console.log('Restored existing chat:', chatStore.messages);
    // Ensure each model message has its content rendered properly
    chatStore.messages.forEach(msg => {
      if (msg.role === 'model' && msg.content) {
        // Force a re-render of markdown content
        chatStore.updateMessage(msg.timestamp, msg.content, msg.options);
      }
    });
    await nextTick(() => scrollToBottom());
  }
});

async function sendMessage() {
  if (!userInput.value.trim() || isLoading.value) return;

  const currentInput = userInput.value;
  userInput.value = '';
  isLoading.value = true;

  try {
    if (!chatStore.currentChatId) {
      await chatStore.initChat();
    }
    const userMessageId = await chatStore.addMessage('user', currentInput);
    await nextTick(() => scrollToBottom());

    try {
      const botMessageId = await chatStore.addMessage('model', '');
      typingIndicator.value = true;
      await nextTick(() => scrollToBottom());

      const stream = streamResponse(currentInput);
      let fullResponse = '';

      for await (const chunk of stream) {
        fullResponse += chunk;
        typingIndicator.value = false;
        chatStore.updateMessage(botMessageId, fullResponse.trim());
        scrollToBottom();
      }

      // First update the UI
      chatStore.updateMessage(botMessageId, fullResponse.trim());
      
      // get quick replies
      const chatHistory = chatStore.messages.slice(-5);
      const quickReplies = await generateQuickReplies(chatHistory, currentInput);
      
      // Then update everything to Firebase
      await chatStore.updateAndSyncMessage(botMessageId, fullResponse.trim(), quickReplies);
      
      // Reset states after everything is done
      isLoading.value = false;
      typingIndicator.value = false;

    } catch (error) {
      console.error('Streaming error:', error);
      typingIndicator.value = false;
      isLoading.value = false;
      const lastBotMessage = [...chatStore.messages].reverse().find(m => m.role === 'model');
      const botMessageId = lastBotMessage?.timestamp || 0;
      chatStore.updateMessage(botMessageId, 'Oops, something went wrong!');
      scrollToBottom();
    }
  } catch (error) {
    console.error('Error in sendMessage:', error);
    isLoading.value = false;
    userInput.value = currentInput; // Restore input on error
  }
}

const selectOption = async (option: string) => {
  userInput.value = option.trim().replace(/[.!?]+$/g, '');
  await sendMessage();
  nextTick(() => scrollToBottom());
};

const startNewConversation = async () => {
  if (chatStore.messages.length > 1 && !isOffTopic.value) {
    if (!confirm('Are you sure you want to end this chat and start a new one?')) {
      return;
    }
  }

  await chatStore.endSession(); 
  userInput.value = '';
  resetOffTopic();
  
  const botMessageId = await chatStore.addMessage('model', '', undefined, true);
  typingIndicator.value = true;
  await nextTick(() => scrollToBottom());

  try {
    const stream = streamResponse('', true);
    let fullResponse = '';
    for await (const chunk of stream) {
      fullResponse += chunk + ' ';
      await nextTick(() => {
        chatStore.updateMessage(botMessageId, fullResponse.trim());
        scrollToBottom();
      });
    }

    await chatStore.updateAndSyncMessage(
      botMessageId, 
      fullResponse.trim(), 
      getStarterQuickReplies()
    );
    
    await nextTick(() => scrollToBottom());
  } catch (error) {
    console.error('Starter conversation error:', error);
    chatStore.updateMessage(botMessageId, 'Oops, something went wrong with the starter message!');
    await nextTick(() => scrollToBottom());
  } finally {
    typingIndicator.value = false;
  }
};
</script>

<template>
  <div class="p-4 max-w-6xl mx-auto h-100">
    <div class="relative space-y-3 mb-4 max-h-[600px] w-[700px] overflow-y-auto">
      <div v-for="msg in chatStore.messages" :key="msg.timestamp" class="flex items-start gap-3">
        <div v-if="msg.role !== 'user'" class="flex-shrink-0">
          <div class="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5 text-purple-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M12 2a8 8 0 0 1 8 8v1h2v3h-2v1a8 8 0 0 1-16 0v-1H2v-3h2v-1a8 8 0 0 1 8-8z" />
              <path d="M9 12h.01" />
              <path d="M15 12h.01" />
            </svg>
          </div>
        </div>
        <div class="flex-1">
          <div
            v-if="msg.role !== 'user'"
            class="text-sm text-start font-medium text-gray-600 mb-1 flex items-center"
          >
            BOT (Javecilla) -
            <span class="text-gray-600 text-sm ml-2">
              {{ new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
            </span>
          </div>
          <div v-if="msg.role === 'user'" class="text-gray-600 text-sm text-right mb-1">
            {{ new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
          </div>
          <div
            :class="[
              'py-2 px-5 rounded-2xl max-w-[85%] text-start break-words',
              msg.role === 'user'
                ? 'ml-auto bg-purple-500 text-white'
                : msg.isStarter
                  ? 'bg-[#b4a7d6]'
                  : 'bg-gray-100',
            ]"
          >
            <div
              v-if="msg.role === 'model' && !msg.content && typingIndicator"
              class="text-gray-800 py-2 px-1"
            >
              Bot is typing
              <span class="typing-dots">...</span>
            </div>
            <div
              :class="msg.role === 'user' ? 'text-white' : 'text-gray-800'"
              v-html="md.render(msg.content || '')"
            ></div>
          </div>
          <div v-if="msg.role === 'model' && msg.options" class="flex flex-wrap gap-2 mt-3">
            <button
              v-for="option in msg.options"
              :key="option"
              class="px-4 py-2 bg-transparent rounded-xl border border-purple-200 text-white hover:scale-[1.01] hover:border-purple-600 transition-colors text-sm"
              @click="selectOption(option)"
            >
              {{ option }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <form @submit.prevent="sendMessage" class="relative w-full flex flex-col bg-gray-800 rounded-xl p-2">
      <div class="flex flex-col flex-grow min-h-[20px]">
        <textarea
          v-model="userInput"
          class="w-full p-2 border-none bg-transparent text-white resize-none focus:ring-0 focus:outline-none flex-grow min-h-[50px]"
          placeholder="Ask anything..."
          rows="2"
          :disabled="isLoading || isOffTopic"
        />
      </div>
      <div class="flex items-center justify-between gap-4 pt-2 pb-1 px-2 mt-1">
        <button
          @click="startNewConversation"
          type="button"
          class="flex items-center justify-center px-4 py-2 bg-gray-700 rounded-xl hover:bg-gray-600 transition-colors text-white"
          :class="{ 'animate-pulse': isOffTopic }"
          title="Start a new conversation"
        >
          <PlusIcon class="w-5 h-5 text-white forced-icon mr-1" stroke-width="1.5" />
          New 
        </button>
        <button
          type="submit"
          :disabled="isLoading || !userInput.trim() || isOffTopic"
          class="flex items-center justify-center px-6 py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 disabled:opacity-50 transition-colors"
        >
          {{ isLoading ? 'Sending...' : 'Send' }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.forced-icon {
  width: 20px !important;
  height: 20px !important;
  stroke: white !important;
  display: block !important;
}
.typing-dots {
  display: inline-block;
  animation: blink 1.5s infinite;
}
@keyframes blink {
  0% { opacity: 0.2; }
  20% { opacity: 1; }
  100% { opacity: 0.2; }
}
:deep(p) {
  margin: 0.5em 0;
}
:deep(strong) {
  font-weight: bold;
}
:deep(em) {
  font-style: italic;
}
:deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 1em 0;
}
:deep(th, td) {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}
:deep(th) {
  background-color: #f2f2f2;
}
:deep(ul) {
  list-style-type: disc;
  margin-left: 20px;
  padding-left: 0;
}
:deep(li) {
  margin-bottom: 5px;
}
:deep(ol) {
  list-style-type: decimal;
  margin-left: 20px;
  padding-left: 0;
}
:deep(ol li) {
  margin-bottom: 5px;
}

textarea {
  overflow-y: auto;
  max-height: 200px; /* Limit maximum height */
}

/* Make sure buttons don't shrink */
button {
  flex-shrink: 0;
}
</style>