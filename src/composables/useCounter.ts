import { ref } from 'vue';

export function useCounter(initialValue: number = 0) {
  const count = ref(initialValue);

  function increment() {
    count.value++;
  }

  function decrement() {
    count.value--;
  }

  return { count, increment, decrement };
}