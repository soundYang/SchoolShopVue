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
  console.log(props.blindBox);

  if (props.blindBox.isRevealed) {
    const orderId = getOrderId()
    console.log(orderId);
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
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 35px -8px rgba(0, 0, 0, 0.5);
  transition: box-shadow 0.2s ease;
  cursor: pointer;
}

.glass-card:hover {
  box-shadow: 0 25px 40px -8px rgba(0, 0, 0, 0.6);
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
  border-radius: 12px 100px 40px 12px;
}

.card-frost-center {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  background-color: transparent;
  z-index: 2;
  border-radius: inherit;
  transition: backdrop-filter 0.5s ease, -webkit-backdrop-filter 0.5s ease;
}

.card-frost-center.no-frost {
  backdrop-filter: blur(0px);
  -webkit-backdrop-filter: blur(0px);
}

.spinner {
  width: 140px;
  height: 140px;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.box-image {
  width: 130px;
  height: 130px;
  object-fit: contain;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  filter: drop-shadow(0 8px 20px rgba(245, 158, 11, 0.5));
  transition: transform 0.3s ease, border-color 0.3s ease;
}

.glass-card:hover .box-image {
  transform: scale(1.08);
  border-color: rgba(255, 255, 255, 0.4);
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
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  background-color: rgba(249, 250, 251, 0.1);
  border-radius: 16px;
  color: #ffffff;
  font-family: 'Courier New', monospace, monospace;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.7);
  pointer-events: auto;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-sizing: border-box;
  transition: backdrop-filter 0.5s ease, -webkit-backdrop-filter 0.5s ease, background-color 0.5s ease;
}

.frost-panel-full.fade-blur {
  backdrop-filter: blur(0px);
  -webkit-backdrop-filter: blur(0px);
  background-color: transparent;
}

.frost-panel-full .title {
  font-size: 24px;
  font-weight: 700;
  line-height: 1.2;
}

.frost-panel-full .sub {
  font-size: 14px;
  color: #ffffff;
  margin-top: 4px;
  font-weight: 600;
}

.frost-panel-full .year {
  margin-top: auto;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #ffffff;
  letter-spacing: 1px;
  font-weight: 600;
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
  border-radius: 16px;
}

.card-highlight::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0) 60%);
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
