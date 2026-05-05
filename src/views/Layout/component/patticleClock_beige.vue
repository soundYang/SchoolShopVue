<template>
  <div ref="containerRef" class="countdown-container" :style="containerStyle">
    <canvas ref="canvasRef" class="countdown-canvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

const props = defineProps({
  width: { type: String, default: '800px' },
  height: { type: String, default: '300px' }
})

const containerStyle = computed(() => ({
  width: props.width,
  maxWidth: '100%',
  height: props.height
}))

const containerRef = ref(null)
const canvasRef = ref(null)

const isMobile = typeof window !== 'undefined' && window.__IS_MOBILE__
const DPR = Math.min(devicePixelRatio || 1, isMobile ? 2 : 3)
const BG = '#f5f0e8'
const FG = '#000000'

let ctx = null
let w = 0
let h = 0
let animationId = null
let timerId = null
let resizeObserver = null
let visibilityObserver = null
let particles = []
let prevText = ''
let isActive = false

const rand = (min, max) => Math.random() * (max - min) + min

const getCountdownStr = () => {
  const now = new Date()
  const target = new Date(now)
  target.setHours(8, 20, 0, 0)
  if (now > target) target.setDate(target.getDate() + 1)
  const diff = Math.max(0, Math.floor((target - now) / 1000))
  const hh = String(Math.floor(diff / 3600)).padStart(2, '0')
  const mm = String(Math.floor((diff % 3600) / 60)).padStart(2, '0')
  const ss = String(diff % 60).padStart(2, '0')
  return `${hh}:${mm}:${ss}`
}

const resize = () => {
  if (!containerRef.value || !canvasRef.value) return
  const rect = containerRef.value.getBoundingClientRect()
  if (!rect.width || !rect.height) return
  const cssW = Math.round(rect.width)
  const cssH = Math.round(rect.height)
  w = cssW * DPR
  h = cssH * DPR
  canvasRef.value.width = w
  canvasRef.value.height = h
  canvasRef.value.style.width = cssW + 'px'
  canvasRef.value.style.height = cssH + 'px'
  ctx = canvasRef.value.getContext('2d', { alpha: false, willReadFrequently: true })
}

const getFontSize = (text) => {
  if (!ctx) return 40 * DPR
  const maxW = w * 0.92
  const maxH = h * 0.7
  let size = Math.min(maxH, maxW / (text.length * 0.55))
  size = Math.max(size, 24 * DPR)
  size = Math.min(size, maxH)
  ctx.save()
  ctx.font = `bold ${size}px "Courier New", monospace`
  while (ctx.measureText(text).width > maxW && size > 16 * DPR) {
    size *= 0.95
    ctx.font = `bold ${size}px "Courier New", monospace`
  }
  ctx.restore()
  return size
}

const samplePixels = (gap) => {
  if (!ctx) return []
  const imageData = ctx.getImageData(0, 0, w, h)
  const { data } = imageData
  const step = Math.max(2, gap)
  const pts = []
  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      const i = (y * w + x) * 4
      if ((data[i] + data[i + 1] + data[i + 2]) / 3 > 200 && data[i + 3] > 200) {
        pts.push({ x, y })
      }
    }
  }
  return pts
}

const getGap = () => {
  const area = w * h
  if (isMobile) return 6
  if (area < 200 * 200 * DPR * DPR) return 3
  if (area < 500 * 500 * DPR * DPR) return 4
  return 6
}

const getParticleSize = () => {
  const area = w * h
  if (isMobile) return { min: 1.2, max: 2.2 }
  if (area < 200 * 200 * DPR * DPR) return { min: 1, max: 2.5 }
  if (area < 500 * 500 * DPR * DPR) return { min: 1.5, max: 3 }
  return { min: 2, max: 4 }
}

const rebuildParticles = () => {
  if (!ctx) return
  const text = getCountdownStr()
  if (text === prevText) return
  prevText = text

  ctx.fillStyle = BG
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = FG
  ctx.textBaseline = 'middle'
  ctx.textAlign = 'center'
  const fontSize = getFontSize(text)
  ctx.font = `bold ${fontSize}px "Courier New", monospace`
  ctx.fillText(text, w / 2, h / 2)

  const gap = getGap()
  const pts = samplePixels(gap)

  ctx.fillStyle = BG
  ctx.fillRect(0, 0, w, h)

  const sizeRange = getParticleSize()
  for (let i = 0; i < pts.length; i++) {
    if (particles[i]) {
      particles[i].tx = pts[i].x
      particles[i].ty = pts[i].y
    } else {
      particles.push({
        x: rand(0, w), y: rand(0, h),
        tx: pts[i].x, ty: pts[i].y,
        r: rand(sizeRange.min, sizeRange.max) * DPR
      })
    }
  }
  if (pts.length < particles.length) particles.length = pts.length
}

const tick = () => {
  if (!ctx || !isActive) return
  ctx.fillStyle = BG
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = FG

  for (const p of particles) {
    const dx = p.tx - p.x
    const dy = p.ty - p.y
    const dist = Math.abs(dx) + Math.abs(dy)
    if (dist > 0.5) {
      const step = Math.min(dist * 0.12, 4)
      const r = step / dist
      p.x += dx * r
      p.y += dy * r
    } else {
      p.x = p.tx
      p.y = p.ty
    }
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
    ctx.fill()
  }

  animationId = requestAnimationFrame(tick)
}

const start = () => {
  if (isActive) return
  isActive = true
  rebuildParticles()
  animationId = requestAnimationFrame(tick)
}

const stop = () => {
  isActive = false
  if (animationId) {
    cancelAnimationFrame(animationId)
    animationId = null
  }
}

const init = () => {
  if (!canvasRef.value || !containerRef.value) return
  resize()
  if (!ctx) return
  timerId = setInterval(rebuildParticles, 1000)
  visibilityObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) start()
    else stop()
  }, { threshold: 0 })
  visibilityObserver.observe(containerRef.value)
  resizeObserver = new ResizeObserver(() => {
    resize()
    prevText = ''
    rebuildParticles()
  })
  resizeObserver.observe(containerRef.value)
  start()
}

const cleanup = () => {
  stop()
  if (timerId) clearInterval(timerId)
  if (resizeObserver) resizeObserver.disconnect()
  if (visibilityObserver) visibilityObserver.disconnect()
  if (ctx) ctx.clearRect(0, 0, w, h)
  particles = []
  prevText = ''
  ctx = null
}

onMounted(() => init())
onUnmounted(() => cleanup())
</script>

<style scoped>
.countdown-container {
  display: block;
  position: relative;
  overflow: hidden;
  background: #f5f0e8;
}
.countdown-canvas {
  display: block;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
