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
  height: props.height
}))

const containerRef = ref(null)
const canvasRef = ref(null)

let ctx = null
let animationId = null
let timerInterval = null
let resizeObserver = null
let particles = []
let currentText = null

// 获取 body 的实际背景色（支持 rgb / rgba / 渐变则取第一个颜色，简单处理）
const getBodyBackgroundColor = () => {
  const bg = getComputedStyle(document.body).backgroundColor
  // 如果是透明或渐变等，默认使用黑色背景
  if (bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent') return '#000000'
  return bg
}

// 计算亮度 (0-255)，用于决定粒子颜色
const getLuminance = (rgbColor) => {
  let r, g, b
  if (rgbColor.startsWith('rgb')) {
    const match = rgbColor.match(/\d+/g)
    if (match) {
      r = parseInt(match[0])
      g = parseInt(match[1])
      b = parseInt(match[2])
    } else {
      return 128
    }
  } else {
    // 十六进制简化处理
    const hex = rgbColor.replace('#', '')
    r = parseInt(hex.substring(0, 2), 16)
    g = parseInt(hex.substring(2, 4), 16)
    b = parseInt(hex.substring(4, 6), 16)
  }
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

// 根据背景色返回粒子颜色（深色背景用白，浅色背景用黑）
const getParticleColor = () => {
  const bgColor = getBodyBackgroundColor()
  const luminance = getLuminance(bgColor)
  return luminance < 128 ? '#ffffff' : '#000000'
}

const getRandom = (min, max) => Math.random() * (max - min) + min

class Particle {
  constructor(canvasWidth, canvasHeight, sizeRange) {
    this.size = getRandom(sizeRange.min, sizeRange.max) * devicePixelRatio
    this.x = getRandom(0, canvasWidth)
    this.y = getRandom(0, canvasHeight)
    this.targetX = this.x
    this.targetY = this.y
  }

  draw(context, color) {
    context.beginPath()
    context.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    context.fillStyle = color
    context.fill()
  }

  setTarget(tx, ty) {
    this.targetX = tx
    this.targetY = ty
  }

  updatePosition() {
    const dx = this.targetX - this.x
    const dy = this.targetY - this.y
    const distance = Math.hypot(dx, dy)
    if (distance < 0.5) {
      this.x = this.targetX
      this.y = this.targetY
      return
    }
    let step = distance * 0.12
    if (step > 5) step = 5
    const angle = Math.atan2(dy, dx)
    this.x += Math.cos(angle) * step
    this.y += Math.sin(angle) * step
  }
}

// 根据画布尺寸动态计算粒子大小范围、采样间隔
const getAdaptiveParams = (canvasWidth, canvasHeight) => {
  const area = canvasWidth * canvasHeight
  let particleSizeMin, particleSizeMax, sampleGap
  if (area < 200 * 200) {
    particleSizeMin = 1
    particleSizeMax = 2.5
    sampleGap = 3
  } else if (area < 500 * 500) {
    particleSizeMin = 1.5
    particleSizeMax = 3.5
    sampleGap = 4
  } else {
    particleSizeMin = 2
    particleSizeMax = 5
    sampleGap = 6
  }
  return { particleSizeRange: { min: particleSizeMin, max: particleSizeMax }, sampleGap }
}

const getNextTargetTime = () => {
  const now = new Date()
  const target = new Date(now)
  target.setHours(8, 20, 0, 0)
  if (now > target) target.setDate(target.getDate() + 1)
  return target
}

const getCountdownString = () => {
  const now = new Date()
  let target = getNextTargetTime()
  let diffMs = target - now
  if (diffMs <= 0) {
    const nextTarget = new Date(now)
    nextTarget.setDate(now.getDate() + 1)
    nextTarget.setHours(8, 20, 0, 0)
    diffMs = nextTarget - now
  }
  const totalSeconds = Math.floor(diffMs / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

const updateCanvasSize = () => {
  if (!containerRef.value || !canvasRef.value) return
  const container = containerRef.value
  const canvas = canvasRef.value
  const rect = container.getBoundingClientRect()
  const width = rect.width
  const height = rect.height
  if (width === 0 || height === 0) return
  canvas.width = width * devicePixelRatio
  canvas.height = height * devicePixelRatio
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`
  ctx = canvas.getContext('2d', { willReadFrequently: true })
}

const getOptimalFontSize = (text, maxWidth, maxHeight) => {
  if (!ctx) return 40 * devicePixelRatio
  let fontSize = Math.min(maxHeight * 0.5, maxWidth / (text.length * 0.6))
  fontSize = Math.max(fontSize, 30 * devicePixelRatio)
  fontSize = Math.min(fontSize, maxHeight * 0.7)
  ctx.save()
  let testSize = fontSize
  let testFont = `bold ${testSize}px 'Roboto Mono', monospace`
  ctx.font = testFont
  let metrics = ctx.measureText(text)
  while (metrics.width > maxWidth * 0.9 && testSize > 20 * devicePixelRatio) {
    testSize *= 0.95
    testFont = `bold ${testSize}px 'Roboto Mono', monospace`
    ctx.font = testFont
    metrics = ctx.measureText(text)
  }
  ctx.restore()
  return testSize
}

const getWhitePixelPoints = (sampleGap) => {
  if (!ctx || !canvasRef.value) return []
  const canvas = canvasRef.value
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const { data, width, height } = imageData
  const gap = Math.max(2, Math.floor(sampleGap / devicePixelRatio))
  const points = []
  for (let y = 0; y < height; y += gap) {
    for (let x = 0; x < width; x += gap) {
      const idx = (y * width + x) * 4
      const brightness = (data[idx] + data[idx + 1] + data[idx + 2]) / 3
      if (brightness > 200 && data[idx + 3] > 200) points.push({ x, y })
    }
  }
  return points
}

const updateParticlesTargets = () => {
  if (!ctx || !canvasRef.value) return
  const newText = getCountdownString()
  if (currentText === newText) return
  currentText = newText
  const canvas = canvasRef.value
  const { sampleGap } = getAdaptiveParams(canvas.width, canvas.height)

  // 绘制文字并采样
  ctx.fillStyle = getBodyBackgroundColor()
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = getParticleColor()
  ctx.textBaseline = 'middle'
  ctx.textAlign = 'center'
  const fontSize = getOptimalFontSize(newText, canvas.width, canvas.height)
  ctx.font = `bold ${fontSize}px 'Roboto Mono', monospace`
  ctx.fillText(newText, canvas.width / 2, canvas.height / 2)

  const targetPoints = getWhitePixelPoints(sampleGap)

  // 清空背景（动画每帧会重绘，这里清空避免残留）
  ctx.fillStyle = getBodyBackgroundColor()
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // 调整粒子数量并分配目标位置
  for (let i = 0; i < targetPoints.length; i++) {
    const { x, y } = targetPoints[i]
    if (particles[i]) {
      particles[i].setTarget(x, y)
    } else {
      const { particleSizeRange } = getAdaptiveParams(canvas.width, canvas.height)
      const newParticle = new Particle(canvas.width, canvas.height, particleSizeRange)
      newParticle.setTarget(x, y)
      particles.push(newParticle)
    }
  }
  if (targetPoints.length < particles.length) particles.splice(targetPoints.length)
}

const animate = () => {
  if (!ctx || !canvasRef.value) return
  const canvas = canvasRef.value
  // 每帧获取当前 body 背景色并清空
  const bgColor = getBodyBackgroundColor()
  ctx.fillStyle = bgColor
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  const particleColor = getParticleColor()
  for (const p of particles) {
    p.updatePosition()
    p.draw(ctx, particleColor)
  }
  animationId = requestAnimationFrame(animate)
}

const resetParticlesAndTargets = () => {
  particles = []
  currentText = null
  if (ctx && canvasRef.value) updateParticlesTargets()
}

const startTimer = () => {
  timerInterval = setInterval(() => {
    updateParticlesTargets()
  }, 1000)
}

const initResizeObserver = () => {
  if (!containerRef.value) return
  resizeObserver = new ResizeObserver(() => {
    updateCanvasSize()
    resetParticlesAndTargets()
  })
  resizeObserver.observe(containerRef.value)
}

const init = () => {
  if (!canvasRef.value || !containerRef.value) return
  updateCanvasSize()
  if (!ctx) return
  resetParticlesAndTargets()
  animate()
  startTimer()
  initResizeObserver()
}

const cleanup = () => {
  if (animationId) cancelAnimationFrame(animationId)
  if (timerInterval) clearInterval(timerInterval)
  if (resizeObserver) resizeObserver.disconnect()
  if (ctx && canvasRef.value) ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
  particles = []
  currentText = null
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
  border-radius: 8px;
}
.countdown-canvas {
  display: block;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>