// composables/useToast.js
import { ref } from 'vue'

const toastState = ref({
  visible: false,
  text: ''
})

let timer = null

export function useToast() {
  const showToast = (msg, duration = 3000) => {
    if (timer) clearTimeout(timer)
    toastState.value.text = msg
    toastState.value.visible = true
    timer = setTimeout(() => {
      toastState.value.visible = false
    }, duration)
  }

  return {
    toastState,
    showToast
  }
}   
export { toastState }