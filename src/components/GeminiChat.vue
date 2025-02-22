<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue'; // Added onMounted for initialization
import { useChatStore } from '@/stores/chat';
import { useChatBot } from '@/utils/chatBot';
import type { GeminiMessage } from '@/types/ai'; // Import GeminiMessage type

const userInput = ref('');
const isLoading = ref(false);
const typingIndicator = ref(false); // Keep typing indicator

const chatStore = useChatStore();
const { streamResponse, generateQuickReplies } = useChatBot(chatStore); // Pass chatStore to useChatBot

// Method to scroll chat container to the bottom
const scrollToBottom = () => {
  const chatContainer = document.querySelector('.overflow-y-auto');
  if (chatContainer) {
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }
};

// Reset chat store on mount to ensure a fresh session
onMounted(async () => {
  chatStore.resetMessages(); // Ensure messages start empty on page load
  console.log('Chat Store initialized, messages:', chatStore.messages);

  // Start with a bot greeting
  const starterMessage = 'Hello, I am Javecilla ChatBot. How can I assist you?';
  const botMessageId = chatStore.addMessage('model', '', undefined, true); // Pass undefined for options, true for isStarter
  typingIndicator.value = true; // Show typing indicator
  await nextTick(() => scrollToBottom()); // Scroll after adding bot message

  try {
    const stream = streamResponse(starterMessage, true); // Pass isStarter flag to streamResponse
    let fullResponse = '';

    // Stream the starter message
    for await (const chunk of stream) {
      console.log('Starter chunk:', chunk);
      fullResponse += chunk + ' ';
      await nextTick(() => {
        chatStore.updateMessage(botMessageId, fullResponse.trim());
        scrollToBottom(); // Scroll after each chunk update
      });
    }

    // Hardcode starter quick replies for the initial conversation
    const starterQuickReplies = ['Who are you?', 'What’s your background?', 'What services do you offer?'];
    console.log('Starter quick replies hardcoded:', starterQuickReplies); // Debug starter quick replies
    chatStore.updateMessage(botMessageId, fullResponse.trim(), starterQuickReplies); // Update with hardcoded options

    await nextTick(() => scrollToBottom()); // Scroll to show suggestions
  } catch (error) {
    console.error('Starter conversation error:', error);
    chatStore.updateMessage(botMessageId, 'Oops, something went wrong with the starter message!');
    await nextTick(() => scrollToBottom()); // Scroll after error update
  } finally {
    typingIndicator.value = false; // Hide typing indicator
  }
});

async function sendMessage() {
  if (!userInput.value.trim() || isLoading.value) return;

  isLoading.value = true;
  const userMessageId = chatStore.addMessage('user', userInput.value); // Add user message
  console.log('User message added, ID:', userMessageId);
  await nextTick(() => scrollToBottom()); // Scroll after adding user message

  try {
    await nextTick(); // Ensure user message is rendered
    const botMessageId = chatStore.addMessage('model', ''); // Start with empty bot message (no isStarter)
    typingIndicator.value = true; // Show typing indicator
    await nextTick(() => scrollToBottom()); // Scroll after adding bot message

    const stream = streamResponse(userInput.value);
    let fullResponse = '';

    // Stream chunks and update the bot message progressively
    for await (const chunk of stream) {
      console.log('Received chunk:', chunk);
      fullResponse += chunk + ' ';
      typingIndicator.value = false; // Hide typing indicator as response starts
      await nextTick(() => {
        chatStore.updateMessage(botMessageId, fullResponse.trim());
        scrollToBottom(); // Scroll after each chunk update
      });
    }

    // Add quick reply options after the response, using the current user question
    const chatHistory = chatStore.messages.slice(-5); // Last 5 messages for context
    const quickReplies = await generateQuickReplies(chatHistory, userInput.value); // Await the Promise
    console.log('Quick replies generated:', quickReplies); // Debug quick replies
    if (quickReplies.length > 0) {
      chatStore.updateMessage(botMessageId, fullResponse.trim(), quickReplies); // Update with options
    }

    console.log('Full response streamed:', fullResponse.trim());
    userInput.value = '';
  } catch (error) {
    console.error('Streaming error:', error);
    typingIndicator.value = false; // Hide typing indicator on error
    const botMessageId = chatStore.messages.findLast((m: GeminiMessage) => m.role === 'model')?.timestamp || 0;
    chatStore.updateMessage(botMessageId, 'Oops, something went wrong!');
    console.log('Error updated bot message, ID:', botMessageId);
    await nextTick(() => scrollToBottom()); // Scroll after error update
  } finally {
    isLoading.value = false;
  }
}

const selectOption = async (option: string) => {
  // Set userInput to the selected option to simulate user typing
  userInput.value = option.trim().replace(/[.!?]+$/g, ''); // Normalize input
  console.log('Selected option:', userInput.value);  
  await sendMessage(); // Trigger sendMessage with the selected option
  nextTick(() => scrollToBottom()); // Scroll after the bot responds
};
</script>

<template>
  <div class="p-4 max-w-6xl mx-auto">
    <!-- Chat container -->
    <div class="space-y-6 mb-4 max-h-[600px] w-[700px] overflow-y-auto">
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
          <!-- Bot name for assistant messages -->
          <div v-if="msg.role !== 'user'" class="text-sm text-start font-medium text-gray-600 mb-1">
            BOT (Javecilla)
          </div>

          <!-- Message bubble -->
          <div
            :class="[
              'p-4 rounded-2xl max-w-[85%] text-start',
              msg.role === 'user' 
                ? 'ml-auto bg-purple-500 text-white' 
                : (msg.isStarter ? 'bg-[#b4a7d6]' : 'bg-gray-100') // Conditional background for starter message
            ]"
          >
            <!-- Text content or Typing Indicator -->
            <div :class="msg.role === 'user' ? 'text-white' : 'text-gray-800'">
              <!-- Show typing indicator for bot messages if typing -->
              <span v-if="msg.role === 'model' && !msg.content && typingIndicator">
                Bot is typing
                <span class="typing-dots">...</span>
              </span>
              <!-- Show actual content if present -->
              <span v-else>{{ msg.content }}</span>
            </div>
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
</style>