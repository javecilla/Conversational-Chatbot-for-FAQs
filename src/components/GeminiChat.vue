<script setup lang="ts">
import { ref } from 'vue';
import { useAI } from '@/composables/useAI';
import { useChatStore } from '@/stores/chat';

const userInput = ref('');
const isLoading = ref(false);

const chatStore = useChatStore();
const { gemini } = useAI();

async function sendMessage() {
  if (!userInput.value.trim() || isLoading.value) return;

  isLoading.value = true;
  chatStore.addMessage('user', userInput.value);

  try {
    const response = await gemini(userInput.value);
    chatStore.addMessage('model', response);
    userInput.value = '';
  } catch (error) {
    chatStore.addMessage('model', 'Oops, something went wrong!');
  } finally {
    isLoading.value = false;
  }
}

const selectOption = (option: string) => {
  chatStore.addMessage('user', option);
}
</script>

<template>
  <div class="p-4 max-w-2xl mx-auto">
    <!-- Chat container -->
    <div class="space-y-6 mb-4 max-h-[600px] overflow-y-auto">
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
          <div v-if="msg.role !== 'user'" class="text-sm font-medium text-gray-600 mb-1">
            Gemini AI
          </div>

          <!-- Message bubble -->
          <div
            :class="[
              'p-4 rounded-2xl max-w-[85%]',
              msg.role === 'user' 
                ? 'ml-auto bg-purple-500 text-white' 
                : 'bg-gray-100'
            ]"
          >
            <!-- Text content -->
            <div :class="msg.role === 'user' ? 'text-white' : 'text-gray-800'">
              {{ msg.content }}
            </div>

            <!-- Option buttons -->
            <div v-if="msg.options" class="flex flex-wrap gap-2 mt-3">
              <button
                v-for="option in msg.options"
                :key="option"
                class="px-4 py-2 rounded-full border border-purple-200 text-purple-600 hover:bg-purple-50 transition-colors text-sm"
                @click="selectOption(option)"
              >
                {{ option }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Input form -->
    <form @submit.prevent="sendMessage" class="space-y-4">
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
        {{ isLoading ? 'Thinking...' : 'Send' }}
      </button>
    </form>
  </div>
</template>

