import { useBlindBoxStore } from '@/stores'

let timer = null

function getDelayUntilNext820() {
  const now = new Date()
  const target = new Date()
  target.setHours(8, 20, 0, 0)
  if (now >= target) {
    return 0
  }
  return target.getTime() - now.getTime()
}

function scheduleClear() {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }

  const delay = getDelayUntilNext820()
  const store = useBlindBoxStore()

  if (delay === 0) {
    // 已过 8:20
    if (store.shouldClearToday()) {
      store.clearBlindBox()         // 清除盲盒数据
      store.markClearedToday()      // 标记今日已清除
    }
    // 计算到明天 8:20
    const now = new Date()
    const tomorrow = new Date()
    tomorrow.setDate(now.getDate() + 1)
    tomorrow.setHours(8, 20, 0, 0)
    const nextDelay = tomorrow.getTime() - now.getTime()
    timer = setTimeout(() => {
      if (store.shouldClearToday()) {
        store.clearBlindBox()
        store.markClearedToday()
      }
      scheduleClear()
    }, nextDelay)
  } else {
    timer = setTimeout(() => {
      if (store.shouldClearToday()) {
        store.clearBlindBox()
        store.markClearedToday()
      }
      scheduleClear()
    }, delay)
  }
}

export function startBlindBoxScheduler() {
  scheduleClear()
}

export function stopBlindBoxScheduler() {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
}