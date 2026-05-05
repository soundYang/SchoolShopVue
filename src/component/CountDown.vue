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
  color: var(--mg-black);
  font-family: var(--mg-font);
  font-size: 13px;
  font-weight: 600;
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
  background: var(--mg-black);
  color: var(--mg-white);
  font-weight: 700;
  font-family: var(--mg-font-mono);
  border: 2px solid var(--mg-black);
}

.countdown.medium .time-block {
  width: 44px;
  height: 44px;
  font-size: 22px;
}

.countdown.medium .colon {
  font-size: 22px;
  font-weight: 700;
}

.countdown.medium .label {
  font-size: 14px;
}

.countdown.small .time-block {
  width: 36px;
  height: 36px;
  font-size: 18px;
}

.countdown.small .colon {
  font-size: 18px;
  font-weight: 700;
}

.countdown.small .label {
  font-size: 12px;
}

.colon {
  color: var(--mg-black);
  font-weight: 700;
}

.countdown.expired .label {
  color: var(--mg-black);
  font-weight: 700;
}
</style>
