import { defineStore } from "pinia"
import { ref } from "vue"

export const useUserStore = defineStore("user",() => { 
  const user = ref({})

  const setUser = (user) => {
    user.value = user
  }

  return { user, setUser }
})