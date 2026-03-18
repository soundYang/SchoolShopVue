import { defineStore } from "pinia"
import { ref } from "vue"
import { UserGetInfoServer } from "@/api/user"

export const useUserStore = defineStore("user",() => { 
  const Account = ref({})
  const token = ref("")
  const putUser = async () => {
    const res = await UserGetInfoServer()
    Account.value = res.data
  }
  const setUser = (user) => {
    Account.value = user
  }

  const setToken = (value) => {
    token.value = value
  }

  const clearUser = () => {
    Account.value = {}
    token.value = ""
  }

  return { Account, setUser, putUser, token, setToken, clearUser }
},{
  persist: ['user'],
  key: 'school_user'
})