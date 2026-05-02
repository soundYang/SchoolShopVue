<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  deadline: {
    type: Number,
    required: true
  },
  size: {
    type: String,
    default: 'medium'
  }
})

const emit = defineEmits(['timeout'])

const now = ref(Date.now())
let timer = null

const diffMs = computed(() => Math.max(0, props.deadline - now.value))

const remaining = computed(() => {
  const totalSec = Math.floor(diffMs.value / 1000)
  const minutes = Math.floor(totalSec / 60)
  const seconds = totalSec % 60
  return {
    minutes: minutes.toString().padStart(2, '0'),
    seconds: seconds.toString().padStart(2, '0'),
    totalSec
  }
})

const isExpired = computed(() => diffMs.value <= 0)

const startTimer = () => {
  timer = setInterval(() => {
    now.value = Date.now()
    if (diffMs.value <= 0) {
      clearInterval(timer)
      timer = null
      emit('timeout')
    }
  }, 1000)
}

onMounted(() => {
  startTimer()
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
})
</script>

<template>
  <div v-if="!isExpired" class="countdown" :class="size">
    <span class="label">剩余支付时间</span>
    <span class="time-display">
      <span class="time-block">{{ remaining.minutes }}</span>
      <span class="colon">:</span>
      <span class="time-block">{{ remaining.seconds }}</span>
    </span>
  </div>
  <div v-else class="countdown expired" :class="size">
    <span class="label">支付已超时</span>
  </div>
</template>

<style scoped>
.countdown {
  display: flex;
  align-items: center;
  gap: 8px;
}

.label {
  color: #aaa;
}

.time-display {
  display: flex;
  align-items: center;
  gap: 2px;
}

.time-block {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #ff5858;
  color: white;
  border-radius: 4px;
  font-weight: bold;
  font-family: 'Roboto Mono', monospace;
}

.colon {
  color: #ff5858;
  font-weight: bold;
}

.countdown.medium .time-block {
  width: 28px;
  height: 28px;
  font-size: 14px;
}

.countdown.medium .colon {
  font-size: 14px;
}

.countdown.medium .label {
  font-size: 12px;
}

.countdown.small .time-block {
  width: 22px;
  height: 22px;
  font-size: 12px;
}

.countdown.small .colon {
  font-size: 12px;
}

.countdown.small .label {
  font-size: 11px;
}

.countdown.expired .label {
  color: #ff5858;
}
</style>
