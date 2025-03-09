<script setup lang="ts">
import ChatButton from './components/ChatButton.vue';
</script>

<template>
  <div>
    <Suspense>
      <!-- <GeminiChat /> -->
      <template #fallback>
        <div class="p-4 text-center text-gray-500">Loading...</div>
      </template>
    </Suspense>
    <ChatButton />
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
