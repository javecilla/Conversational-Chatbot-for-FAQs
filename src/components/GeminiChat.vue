// /src/components/GeminiChat.vue
<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue'; 
import { useChatStore } from '@/stores/chat';
import { useChatBot } from '@/utils/chatBot';
import type { GeminiMessage } from '@/types/ai';
import MarkdownIt from 'markdown-it'; // Import markdown-it

const userInput = ref('');
const isLoading = ref(false);
const typingIndicator = ref(false);

const chatStore = useChatStore();
const { streamResponse, generateQuickReplies } = useChatBot(chatStore);

// Initialize markdown parser - remove require() call
const md = new MarkdownIt({
  html: true, // Allow HTML in Markdown
  breaks: true, // Convert newlines to <br>
  linkify: true, // Autoconvert URL-like text to links
});

// Method to scroll chat container to the bottom
const scrollToBottom = () => {
  const chatContainer = document.querySelector('.overflow-y-auto');
  if (chatContainer) {
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }
};

// Reset chat store on mount to ensure a fresh session
onMounted(async () => {
  chatStore.resetMessages();
  console.log('Chat Store initialized, messages:', chatStore.messages);

  // Start with a bot greeting
  //const starterMessage = 'Hello, I am Javecilla ChatBot. How can I assist you? 😊';
  const botMessageId = chatStore.addMessage('model', '', undefined, true);
  typingIndicator.value = true;
  await nextTick(() => scrollToBottom());

  try {
    const stream = streamResponse('', true); //empty prompt and flag isStart as true for first conversation
    let fullResponse = '';

    for await (const chunk of stream) {
      console.log('Starter chunk:', chunk);
      fullResponse += chunk + ' ';
      await nextTick(() => {
        chatStore.updateMessage(botMessageId, fullResponse.trim());
        scrollToBottom();
      });
    }

    const starterQuickReplies = ['Who are you?', 'Do you accept project commissions?', 'What services do you offer?'];
    console.log('Starter quick replies hardcoded:', starterQuickReplies);
    chatStore.updateMessage(botMessageId, fullResponse.trim(), starterQuickReplies);

    await nextTick(() => scrollToBottom());
  } catch (error) {
    console.error('Starter conversation error:', error);
    chatStore.updateMessage(botMessageId, 'Oops, something went wrong with the starter message!');
    await nextTick(() => scrollToBottom());
  } finally {
    typingIndicator.value = false;
  }
});

async function sendMessage() {
  if (!userInput.value.trim() || isLoading.value) return;

  isLoading.value = true;
  const userMessageId = chatStore.addMessage('user', userInput.value);
  console.log('User message added, ID:', userMessageId);
  await nextTick(() => scrollToBottom());

  try {
    await nextTick();
    const botMessageId = chatStore.addMessage('model', '');
    typingIndicator.value = true;
    await nextTick(() => scrollToBottom());

    const stream = streamResponse(userInput.value as string); // Explicit type assertion
    let fullResponse = '';

    for await (const chunk of stream) {
      console.log('Received chunk:', chunk);
      fullResponse += chunk + ' ';
      typingIndicator.value = false;
      await nextTick(() => {
        chatStore.updateMessage(botMessageId, fullResponse.trim());
        scrollToBottom();
      });
    }

    const chatHistory = chatStore.messages.slice(-5);
    const quickReplies = await generateQuickReplies(chatHistory, userInput.value);
    console.log('Quick replies generated:', quickReplies);
    if (quickReplies.length > 0) {
      chatStore.updateMessage(botMessageId, fullResponse.trim(), quickReplies);
    }

    console.log('Full response streamed:', fullResponse.trim());
    userInput.value = '';
  } catch (error) {
    console.error('Streaming error:', error);
    typingIndicator.value = false;
    const lastBotMessage = [...chatStore.messages].reverse().find((m: GeminiMessage) => m.role === 'model');
    const botMessageId = lastBotMessage?.timestamp || 0;
    chatStore.updateMessage(botMessageId, 'Oops, something went wrong!');
    console.log('Error updated bot message, ID:', botMessageId);
    await nextTick(() => scrollToBottom());
  } finally {
    isLoading.value = false;
  }
}

const selectOption = async (option: string) => {
  userInput.value = option.trim().replace(/[.!?]+$/g, '');
  console.log('Selected option:', userInput.value);
  await sendMessage();
  nextTick(() => scrollToBottom());
};
</script>

<template>
  <div class="p-4 max-w-6xl mx-auto">
    <!-- Chat container - update space-y value -->
    <div class="space-y-3 mb-4 max-h-[600px] w-[700px] overflow-y-auto"> <!-- Changed from space-y-6 to space-y-2 -->
      <div v-for="msg in chatStore.messages" :key="msg.timestamp" class="flex items-start gap-3">
        <!-- Bot avatar for assistant messages -->
        <div v-if="msg.role !== 'user'" class="flex-shrink-0">
          <div class="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2a8 8 0 0 1 8 8v1h2v3h-2v1a8 8 0 0 1-16 0v-1H2v-3h2v-1a8 8 0 0 1 8-8z" />
              <path d="M9 12h.01" />
              <path d="M15 12h.01" />
            </svg>
          </div>
        </div>

        <!-- Message content -->
        <div class="flex-1">
          <!-- Bot name and timestamp for assistant messages -->
          <div v-if="msg.role !== 'user'" class="text-sm text-start font-medium text-gray-600 mb-1 flex items-center">
            BOT (Javecilla) -
            <span class="text-gray-600 text-sm ml-2">
              {{ new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
            </span>
          </div>

          <!-- Timestamp for user messages -->
          <div v-if="msg.role === 'user'" class="text-gray-600 text-sm text-right mb-1">
            {{ new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
          </div>

          <!-- Message bubble with Markdown rendering -->
          <div
            :class="[
              'py-2 px-5 rounded-2xl max-w-[85%] text-start break-words',
              msg.role === 'user'
                ? 'ml-auto bg-purple-500 text-white'
                : (msg.isStarter ? 'bg-[#b4a7d6]' : 'bg-gray-100')
            ]"
          >
            <!-- Typing Indicator (outside v-html) -->
            <div v-if="msg.role === 'model' && !msg.content && typingIndicator" class="text-gray-800 py-2 px-1 ">
              Bot is typing
              <span class="typing-dots">...</span>
            </div>

            <!-- Render Markdown content -->
            <div
              :class="msg.role === 'user' ? 'text-white' : 'text-gray-800'"
              v-html="md.render(msg.content || '')"
            ></div>
          </div>

          <!-- Quick Reply Buttons for bot messages -->
          <div v-if="msg.role === 'model' && msg.options" class="flex flex-wrap gap-2 mt-3">
            <button
              v-for="option in msg.options"
              :key="option"
              class="px-4 py-2 bg-transparent rounded-full border border-purple-200 text-white hover:scale-[1.01] hover:border-purple-600 transition-colors text-sm"
              @click="selectOption(option)"
            >
              {{ option }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Input form -->
    <form @submit.prevent="sendMessage" class="space-y-4 w-auto">
      <textarea
        v-model="userInput"
        class="w-full p-4 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        placeholder="Type your message..."
        rows="3"
        :disabled="isLoading"
      />
      <button
        type="submit"
        :disabled="isLoading || !userInput.trim()"
        class="w-full px-4 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 disabled:opacity-50 disabled:hover:bg-purple-500 transition-colors font-medium"
      >
        {{ isLoading ? 'Typing...' : 'Send' }}
      </button>
    </form>
  </div>
</template>

<style scoped>
.typing-dots {
  display: inline-block;
  animation: blink 1.5s infinite;
}

@keyframes blink {
  0% { opacity: 0.2; }
  20% { opacity: 1; }
  100% { opacity: 0.2; }
}

/* Markdown styles */
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
/* Add list styles */
:deep(ul) {
  list-style-type: disc;
  margin-left: 20px;
  padding-left: 0;
}
:deep(li) {
  margin-bottom: 5px;
}
/* Add ordered list styles */
:deep(ol) {
  list-style-type: decimal;
  margin-left: 20px;
  padding-left: 0;
}
:deep(ol li) {
  margin-bottom: 5px;
}
</style>