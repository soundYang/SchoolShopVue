<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBlindBoxStore } from '@/stores/model/blindBox'
import { BlindBoxRevealServer } from '@/api/blindBox'
import { formatPrice } from '@/unit/format'

const router = useRouter()
const blindBoxStore = useBlindBoxStore()

const props = defineProps({
  bgGradient: {
    type: String,
  },
  bgShapeColor: {
    type: String,
    default: '#3a2e1f'
  },
  blindBox: {
    type: Object
  },
  bgImage: {
    type: String,
    default: ''
  }
})

const isFlashing = ref(false)
const isFading = ref(false)
const animationPlayed = ref(false)

const price = ref(props.blindBox.randomPrice)
const lable = ref(props.blindBox.label)

const triggerAnimation = (orderId) => {
  if (animationPlayed.value) return
  animationPlayed.value = true
  isFlashing.value = true
  setTimeout(() => {
    isFlashing.value = false
    isFading.value = true
    setTimeout(() => {
      if (orderId) {
        router.push(`/orderDetail?id=${orderId}`)
      }
    }, 800)
  }, 500)
}

const getOrderId = () => {
  return props.blindBox.orderId || blindBoxStore.blindBox?.find(b => b._id === props.blindBox._id)?.orderId
}

const handleClick = async () => {
  if (props.blindBox.isRevealed) {
    const orderId = getOrderId()
    if (orderId) {
      router.push(`/orderDetail?id=${orderId}`)
    } else {
      try {
        const res = await BlindBoxRevealServer(props.blindBox._id)
        if (res.data && res.data.orderId) {
          blindBoxStore.setBlindBoxOrderId(props.blindBox._id, res.data.orderId)
          router.push(`/orderDetail?id=${res.data.orderId}`)
        }
      } catch (error) {
        console.error('创建订单失败:', error)
      }
    }
    return
  }
  if (animationPlayed.value) return

  price.value = props.blindBox.randomPrice
  lable.value = props.blindBox.label
  blindBoxStore.setBlindBoxRevealed(props.blindBox._id)
  triggerAnimation()
}

onMounted(() => {
  if (props.blindBox.isRevealed) {
    triggerAnimation()
  }
})
</script>

<template>
  <div class="glass-demo-container">
    <div
      class="glass-card"
      @click="handleClick"
      v-if="blindBox._id"
    >
      <div class="card-bg-layer" :style="{ backgroundImage: bgImage ? `url(${bgImage})` : bgGradient, backgroundSize: 'cover', backgroundPosition: 'center' }">
        <div class="card-bg-shape" :style="{ backgroundColor: bgImage ? 'rgba(0,0,0,0.3)' : bgShapeColor }"></div>
      </div>

      <div
        class="card-frost-center"
        :class="{ 'no-frost': isFading }"
      >
        <div class="spinner">
          <img src="@/assets/盲盒.png" alt="盲盒" class="box-image" />
        </div>
      </div>

      <div class="card-content">
        <div
          class="frost-panel-full"
          :class="{ 'fade-blur': isFading }"
        >
          <span class="title">{{ !isFading ? '???' : lable }}</span>
          <span class="sub">{{ !isFading ? '???' : `¥${formatPrice(price)}` }}</span>
          <div class="year">
            <span>store</span>
          </div>
        </div>
      </div>

      <div
        class="card-highlight"
        :class="{ flash: isFlashing }"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.glass-card {
  position: relative;
  width: 200px;
  height: 300px;
  border: var(--mg-border);
  overflow: hidden;
  box-shadow: var(--mg-shadow);
  transition: box-shadow 0.2s ease;
  cursor: pointer;
  background: var(--mg-white);
}

.glass-card:hover {
  transform: translate(-2px, -2px);
  box-shadow: var(--mg-shadow-hover);
}

.card-bg-layer {
  position: absolute;
  inset: 0;
  padding: 4px;
  z-index: 1;
}

.card-bg-shape {
  width: 100%;
  height: 100%;
}

.card-frost-center {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--mg-white);
  z-index: 2;
  transition: opacity 0.5s ease;
}

.card-frost-center.no-frost {
  opacity: 0;
}

.spinner {
  width: 140px;
  height: 140px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.box-image {
  width: 130px;
  height: 130px;
  object-fit: contain;
  border: var(--mg-border-light);
  transition: transform 0.3s ease;
}

.glass-card:hover .box-image {
  transform: scale(1.08);
}

.card-content {
  position: absolute;
  inset: 0;
  display: flex;
  z-index: 3;
  pointer-events: none;
}

.frost-panel-full {
  width: 100%;
  height: 100%;
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  background-color: var(--mg-white);
  color: var(--mg-black);
  font-family: var(--mg-font-display);
  pointer-events: auto;
  border: var(--mg-border-light);
  box-sizing: border-box;
  transition: opacity 0.5s ease;
}

.frost-panel-full.fade-blur {
  opacity: 1;
}

.frost-panel-full .title {
  font-size: 24px;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.frost-panel-full .sub {
  font-size: 14px;
  color: var(--mg-black);
  margin-top: 4px;
  font-weight: 600;
  font-family: var(--mg-font-mono);
}

.frost-panel-full .year {
  margin-top: auto;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: var(--mg-black);
  letter-spacing: 1px;
  font-weight: 600;
  border-top: var(--mg-border-light);
  padding-top: 8px;
}

.card-highlight {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
  overflow: hidden;
}

.card-highlight::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at 30% 30%, rgba(255, 215, 0, 0.35) 0%, rgba(255, 215, 0, 0) 60%);
  opacity: 0;
  transform: translateY(-30%) rotate(15deg);
}

.card-highlight.flash::after {
  animation: highlightFlash 0.3s ease-out forwards;
}

@keyframes highlightFlash {
  0% {
    transform: translateY(-100%) rotate(15deg) scale(1);
    opacity: 0;
  }
  10% {
    opacity: 0.8;
  }
  30% {
    transform: translateY(-20%) rotate(10deg) scale(1.2);
    opacity: 0.8;
  }
  70% {
    transform: translateY(50%) rotate(0deg) scale(1.2);
    opacity: 0.6;
  }
  100% {
    transform: translateY(150%) rotate(-5deg) scale(1);
    opacity: 0;
  }
}

.frost-panel-full span {
  user-select: none;
}
</style>
