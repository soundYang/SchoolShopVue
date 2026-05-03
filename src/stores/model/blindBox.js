import { defineStore } from "pinia"
import { ref, computed } from "vue"
import { BlindBoxGetAllServer } from "@/api/blindBox"
import { useUserStore } from "./user"

export const useBlindBoxStore = defineStore("blindBox", () => {
  const blindBox = ref([])
  const blindBoxOpen = ref(true)
  const blindBoxCount = ref(0)
  // 移除 lastClearDate 全局 ref，改用 computed 或方法基于当前用户
  const userStore = useUserStore()

  // 获取当前用户专属的 lastClearDate 键名
  const getUserLastClearKey = () => {
    const userId = userStore.userId || 'guest'
    return `blindBox_lastClearDate_${userId}`
  }

  // 获取当前用户上次清除的日期
  const getLastClearDate = () => {
    const key = getUserLastClearKey()
    return localStorage.getItem(key)
  }

  // 设置当前用户上次清除的日期
  const setLastClearDate = (date) => {
    const key = getUserLastClearKey()
    if (date) {
      localStorage.setItem(key, date)
    } else {
      localStorage.removeItem(key)
    }
  }

  const getBlindBox = async () => {
    const res = await BlindBoxGetAllServer()

    if (res.open === false) {
      blindBoxOpen.value = false
      blindBoxCount.value = res.count || 0
      blindBox.value = []
      return
    }

    blindBoxOpen.value = true
    const boxes = res.data
    const current = Array.isArray(blindBox.value) ? blindBox.value : []
    boxes.forEach(box => {
      const existing = current.find(b => b._id === box._id)
      if (existing) {
        if (existing.orderId) box.orderId = existing.orderId
        if (existing.isRevealed) {
          box.isRevealed = existing.isRevealed
          box.orderId = existing.orderId || box.orderId
        }
      }
    })
    blindBox.value = boxes
  }

  const setBlindBoxOrderId = (boxId, orderId) => {
    if (!Array.isArray(blindBox.value)) return
    const item = blindBox.value.find(item => item._id === boxId)
    if (item) {
      item.orderId = orderId
    }
  }

  const setBlindBoxRevealed = (boxId) => {
    if (!Array.isArray(blindBox.value)) return
    const item = blindBox.value.find(item => item._id === boxId)
    if (item) {
      item.isRevealed = true
    }
  }

  // 清除盲盒数据（用于退出登录，但不影响其他用户记录）
  const clearBlindBox = () => {
    localStorage.removeItem('blindBox')   // 清除持久化数据
    blindBox.value = []                   // 重置状态
    // 注意：不清除 lastClearDate，因为那是其他用户的记录，我们只清除自己的盲盒数据
  }

  // 检查今天是否已清除（基于当前用户）
  const shouldClearToday = () => {
    const today = new Date().toISOString().split('T')[0]
    const lastDate = getLastClearDate()
    return lastDate !== today
  }

  // 记录今天已清除
  const markClearedToday = () => {
    const today = new Date().toISOString().split('T')[0]
    setLastClearDate(today)
  }

  // 重置当前用户的清除日期（可选，用于手动重置）
  const resetClearDate = () => {
    setLastClearDate(null)
  }

  return {
    blindBox,
    blindBoxOpen,
    blindBoxCount,
    getBlindBox,
    setBlindBoxOrderId,
    setBlindBoxRevealed,
    clearBlindBox,
    shouldClearToday,
    markClearedToday,
    resetClearDate
  }
}, {
  persist: true,
  key: "blindBox",
})
