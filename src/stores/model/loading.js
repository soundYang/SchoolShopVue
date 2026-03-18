import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLoadingStore = defineStore('loading', () => {
  const count = ref(0)
  const isLoading = ref(false)

  function show() {
    count.value++
    isLoading.value = true
  }

  function hide() {
    count.value--
    if (count.value <= 0) {
      count.value = 0
      isLoading.value = false
    }
  }

  return { count, isLoading, show, hide }
})