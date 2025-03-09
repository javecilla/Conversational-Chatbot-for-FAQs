<script setup lang="ts">
defineProps<{
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}>();
</script>

<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="transform scale-95 opacity-0"
    enter-to-class="transform scale-100 opacity-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="transform scale-100 opacity-100"
    leave-to-class="transform scale-95 opacity-0"
  >
    <div v-if="isOpen" class="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl p-6 w-[80%] max-w-md mx-4">
        <p class="text-gray-800 mb-6">{{ message }}</p>
        <div class="flex justify-center gap-3">
          <button
            @click="onCancel"
            class="px-4 py-2 text-white bg-gray-700 rounded-xl hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="onConfirm"
            class="px-4 py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>
