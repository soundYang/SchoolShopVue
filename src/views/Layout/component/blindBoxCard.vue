<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBlindBoxStore } from '@/stores/model/blindBox'
import { BlindBoxRevealServer } from '@/api/blindBox'
import { formatPrice } from '@/unit/format'
import blindBoxIcon from '@/assets/盲盒.png'

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

const isOpened = ref(false)
const isContentRevealed = ref(false)
const showLightning = ref(false)
const showShockwave = ref(false)
const showInk = ref(false)
const animationPlayed = ref(false)
const particlesRef = ref(null)

const price = ref(props.blindBox.randomPrice)
const lable = ref(props.blindBox.label)

const tierName = computed(() => {
  const p = price.value
  if (p === 0.99) return '★ GOLD ★'
  if (p === 6.99 || p === 9.99) return '★ PURPLE ★'
  if (p === 19.9 || p === 39.9) return '★ BLUE ★'
  if (p === 69.9) return '★ GREEN ★'
  return ''
})

const tierColorMap = computed(() => {
  const p = price.value
  if (p === 0.99) return { c1: '#fbbf24', c2: '#b45309' }
  if (p === 6.99 || p === 9.99) return { c1: '#B223FB', c2: '#4A08B4' }
  if (p === 19.9 || p === 39.9) return { c1: '#236BFB', c2: '#0872B4' }
  if (p === 69.9) return { c1: '#22c55e', c2: '#15803d' }
  return { c1: '#888', c2: '#555' }
})

const createParticles = () => {
  if (!particlesRef.value) return
  const container = particlesRef.value
  container.innerHTML = ''
  const colors = ['#111', '#555', tierColorMap.value.c1, tierColorMap.value.c2]
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div')
    p.className = 'particle'
    const angle = Math.random() * Math.PI * 2
    const dist = 40 + Math.random() * 110
    p.style.setProperty('--tx', Math.cos(angle) * dist + 'px')
    p.style.setProperty('--ty', Math.sin(angle) * dist + 'px')
    p.style.left = '50%'
    p.style.top = '50%'
    p.style.width = (2 + Math.random() * 4) + 'px'
    p.style.height = p.style.width
    p.style.background = colors[Math.floor(Math.random() * colors.length)]
    p.style.animationDelay = (Math.random() * 0.1) + 's'
    container.appendChild(p)
    requestAnimationFrame(() => p.classList.add('active'))
  }
}

const triggerAnimation = () => {
  if (animationPlayed.value) return
  animationPlayed.value = true

  showLightning.value = true

  setTimeout(() => { showShockwave.value = true }, 80)
  setTimeout(() => { createParticles() }, 120)
  setTimeout(() => { showInk.value = true }, 160)
  setTimeout(() => { isOpened.value = true }, 350)
  setTimeout(() => { isContentRevealed.value = true }, 400)

  setTimeout(() => {
    showLightning.value = false
    showShockwave.value = false
    showInk.value = false
  }, 1200)
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
      router.push(`/shopOrder?blindBoxId=${props.blindBox._id}&price=${price.value}&label=${encodeURIComponent(lable.value)}`)
    }
    return
  }
  if (animationPlayed.value) return

  blindBoxStore.setBlindBoxRevealed(props.blindBox._id)
  BlindBoxRevealServer(props.blindBox._id).catch(() => {})
  price.value = props.blindBox.randomPrice
  lable.value = props.blindBox.label
  triggerAnimation()
}

onMounted(() => {
  if (props.blindBox.isRevealed) {
    triggerAnimation()
  }
})
</script>

<template>
  <div class="blindbox-card" :style="{ height: isOpened ? '380px' : '380px' }" @click="handleClick" v-if="blindBox._id">
    <div class="card-wrapper" :class="{ opened: isOpened }">
      <!-- 正面：统一黑白漫画风 -->
      <div class="card-front">
        <div class="manga-bg"></div>
        <div class="manga-dots"></div>
        <div class="manga-question">?</div>
        <div class="manga-corner tl"></div>
        <div class="manga-corner tr"></div>
        <div class="manga-corner bl"></div>
        <div class="manga-corner br"></div>
        <div class="manga-stripe"></div>
        <div class="front-icon">
          <img :src="blindBoxIcon" alt="盲盒" />
        </div>
        <div class="front-label">MYSTERY BOX</div>
        <div class="front-sub">— 点击揭晓 —</div>
      </div>

      <!-- 背面：通体品质色 -->
      <div
        class="card-back"
        :style="bgImage
          ? { backgroundImage: `url(${bgImage})`, backgroundSize: '100% 100%', backgroundPosition: 'center' }
          : { background: bgGradient || `linear-gradient(145deg, ${tierColorMap.c1}, ${tierColorMap.c2})` }
        "
      >
        <div class="back-content" :class="{ revealed: isContentRevealed }">
          <div class="back-icon">
            <img :src="blindBoxIcon" alt="盲盒" />
          </div>
          <div class="back-category">{{ lable }}</div>
          <div class="back-price">¥{{ formatPrice(price) }}</div>
          <div class="back-buy-hint">— 点击购买 —</div>
        </div>
        <div class="back-tier">{{ tierName }}</div>
      </div>
    </div>

    <!-- 动画叠加层 -->
    <div class="lightning" :class="{ active: showLightning }"></div>
    <div class="shockwave" :class="{ active: showShockwave }"></div>
    <div class="particles" ref="particlesRef"></div>
    <div class="ink-splat ink-1" :class="{ active: showInk }"></div>
    <div class="ink-splat ink-2" :class="{ active: showInk }"></div>
  </div>
</template>

<style scoped>
.blindbox-card {
  position: relative;
  width: 260px;
  height: 380px;
  cursor: pointer;
  perspective: 1200px;
  user-select: none;
  flex-shrink: 0;
  transition: height 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.card-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform-style: preserve-3d;
}

.card-wrapper.opened {
  transform: rotateY(180deg);
}

/* ===== 正面：黑白漫画风 ===== */
.card-front,
.card-back {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  overflow: hidden;
  border: 4px solid #111;
}

.card-front {
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* 速度线 */
.manga-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}
.manga-bg::before {
  content: '';
  position: absolute;
  width: 250%;
  height: 250%;
  top: -75%;
  left: -75%;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 5px,
    rgba(0,0,0,0.05) 5px,
    rgba(0,0,0,0.05) 6px
  );
  animation: mangaLines 4s linear infinite;
}
@keyframes mangaLines {
  0% { transform: translateY(0); }
  100% { transform: translateY(-25px); }
}

/* 网点 */
.manga-dots {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  background-image: radial-gradient(circle, rgba(0,0,0,0.12) 1px, transparent 1px);
  background-size: 4px 4px;
}

/* 问号 */
.manga-question {
  position: absolute;
  font-size: 130px;
  font-weight: 900;
  color: #111;
  opacity: 0.05;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) skewX(-10deg);
  pointer-events: none;
  font-family: 'Impact', 'Arial Black', sans-serif;
  z-index: 1;
}

/* 四角装饰 */
.manga-corner {
  position: absolute;
  width: 30px;
  height: 30px;
  border-color: #111;
  border-style: solid;
  z-index: 3;
}
.manga-corner.tl { top: 8px; left: 8px; border-width: 4px 0 0 4px; }
.manga-corner.tr { top: 8px; right: 8px; border-width: 4px 4px 0 0; }
.manga-corner.bl { bottom: 8px; left: 8px; border-width: 0 0 4px 4px; }
.manga-corner.br { bottom: 8px; right: 8px; border-width: 0 4px 4px 0; }

/* 黑白斜纹条 */
.manga-stripe {
  position: absolute;
  bottom: 50px;
  left: 0;
  right: 0;
  height: 4px;
  z-index: 2;
  background: repeating-linear-gradient(
    90deg,
    #111 0px, #111 5px,
    transparent 5px, transparent 10px
  );
}

/* 正面图标 */
.front-icon {
  width: 115px;
  height: 115px;
  z-index: 2;
  margin-bottom: 8px;
  position: relative;
}
.front-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.front-label {
  font-size: 14px;
  font-weight: 800;
  color: #111;
  letter-spacing: 4px;
  text-transform: uppercase;
  z-index: 2;
  font-family: 'Impact', sans-serif;
}

.front-sub {
  font-size: 11px;
  color: #888;
  letter-spacing: 2px;
  z-index: 2;
  margin-top: 6px;
}

/* ===== 背面 ===== */
.card-back {
  transform: rotateY(180deg);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 20px;
  position: relative;
  background-repeat: no-repeat;
  height: 100%;
}
.card-back::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle at 20% 30%, rgba(255,255,255,0.1) 0%, transparent 50%);
  pointer-events: none;
}

.back-content {
  position: relative;
  z-index: 2;
  text-align: center;
  width: 100%;
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}
.back-content.revealed {
  animation: contentIn 0.6s 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
@keyframes contentIn {
  0% { opacity: 0; transform: translateY(20px) scale(0.95); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}

.back-icon {
  width: 100px;
  height: 100px;
  margin: 0 auto 10px;
}
.back-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 0 6px rgba(255,255,255,0.3));
}

.back-category {
  display: inline-block;
  background: rgba(255,255,255,0.2);
  backdrop-filter: blur(4px);
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  padding: 4px 16px;
  letter-spacing: 2px;
  border-radius: 2px;
  margin-top: 8px;
  border: 1px solid rgba(255,255,255,0.15);
}

.back-price {
  font-size: 28px;
  font-weight: 700;
  color: #fff;
  font-family: 'Courier New', monospace;
  margin-top: 10px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.15);
}

.back-buy-hint {
  font-size: 11px;
  color: rgba(255,255,255,0.7);
  letter-spacing: 2px;
  margin-top: 12px;
}

.back-tier {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  padding: 8px;
  background: rgba(0,0,0,0.15);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 3px;
  z-index: 2;
  backdrop-filter: blur(2px);
}

/* ===== 闪电 ===== */
.lightning {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 10;
  opacity: 0;
}
.lightning.active {
  animation: lightningFlash 0.5s ease-out forwards;
}
@keyframes lightningFlash {
  0% { opacity: 0; }
  3% { opacity: 1; background: rgba(255,255,255,0.95); }
  6% { opacity: 0; background: transparent; }
  10% { opacity: 1; background: rgba(255,255,255,0.7); }
  13% { opacity: 0; background: transparent; }
  18% { opacity: 0.5; background: rgba(255,255,255,0.4); }
  22% { opacity: 0; background: transparent; }
  100% { opacity: 0; }
}

/* ===== 冲击波 ===== */
.shockwave {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  border: 3px solid #111;
  z-index: 9;
  pointer-events: none;
  opacity: 0;
  transform: translate(-50%, -50%);
}
.shockwave.active {
  animation: shockwaveAnim 0.6s ease-out forwards;
}
@keyframes shockwaveAnim {
  0% { width: 0; height: 0; opacity: 0.8; border-width: 4px; }
  100% { width: 460px; height: 460px; opacity: 0; border-width: 1px; }
}

/* ===== 粒子 ===== */
.particles {
  position: absolute;
  inset: 0;
  z-index: 8;
  pointer-events: none;
  overflow: hidden;
}
:deep(.particle) {
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  opacity: 0;
}
:deep(.particle.active) {
  animation: particleBurst 0.7s ease-out forwards;
}
@keyframes particleBurst {
  0% { opacity: 1; transform: translate(0, 0) scale(1); }
  100% { opacity: 0; transform: translate(var(--tx), var(--ty)) scale(0); }
}

/* ===== 墨水爆点 ===== */
.ink-splat {
  position: absolute;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: #111;
  z-index: 11;
  pointer-events: none;
  opacity: 0;
}
.ink-splat.ink-1 { top: 25%; left: 20%; }
.ink-splat.ink-2 { bottom: 35%; right: 15%; }
.ink-splat.active {
  animation: inkSplat 0.45s ease-out forwards;
}
@keyframes inkSplat {
  0% { width: 0; height: 0; opacity: 0.7; }
  40% { width: 55px; height: 55px; opacity: 0.4; }
  100% { width: 80px; height: 80px; opacity: 0; }
}

/* hover */
.blindbox-card:hover .card-front {
  box-shadow: inset 0 0 0 2px #111;
}
</style>
