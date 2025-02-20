<script setup lang="ts">
import { useCounter } from '@/composables/useCounter'

defineProps<{ msg: string }>()

const { count, increment, decrement } = useCounter(0)
</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <div class="flex items-center gap-4 justify-center">
      <button type="button" @click="decrement">-</button>
      <span class="text-xl">count is {{ count }}</span>
      <button type="button" @click="increment">+</button>
    </div>
    <p class="mt-4">
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank"
      >create-vue</a
    >, the official Vue + Vite starter
  </p>
  <p>
    Learn more about IDE Support for Vue in the
    <a
      href="https://vuejs.org/guide/scaling-up/tooling.html#ide-support"
      target="_blank"
      >Vue Docs Scaling up Guide</a
    >.
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
