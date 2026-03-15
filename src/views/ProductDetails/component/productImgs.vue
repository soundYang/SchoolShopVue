<script setup>
import { ref } from 'vue'

// 每个卡片的旋转角度（固定，不随拖拽改变）
const angles = ref([-54, -36, -18, 0, 18, 36, 54])
// 卡片图片 URL 数组
const imgArr = ref([
  'https://ts1.tc.mm.bing.net/th/id/OIP-C.mLgsKUt2hr9SMN7z1p2gbQHaHa?w=193&h=193&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2',
  'https://ts1.tc.mm.bing.net/th/id/OIP-C.NPPgmyKBlOsgcxdEvtnSKQHaE7?w=193&h=135&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2',
  'https://ts1.tc.mm.bing.net/th/id/OIP-C.9ZLYrEyksY-IRCv__3NPOgHaE7?w=193&h=135&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2',
  'https://ts1.tc.mm.bing.net/th/id/OIP-C.CURShhYrcwIwsWk2hVqwiwHaE7?w=193&h=135&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2',
  'https://tse1-mm.cn.bing.net/th/id/OIP-C.vMGYqnTNeBdM5vuy0A8wAwHaFj?w=244&h=184&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3',
  'https://tse2-mm.cn.bing.net/th/id/OIP-C.kR1H5yNaoTOQw7C6ZZtFDwHaE7?w=303&h=202&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3'

])

// 容器悬停状态（用于扇形展开动画）
const hovered = ref(false)

// 记录当前被拖拽的图片索引
let dragIndex = null


// 拖拽开始：记录被拖拽图片的索引
const handleDragStart = (index, event) => {
  dragIndex = index
  event.dataTransfer.setData('text/plain', index.toString())
  event.dataTransfer.effectAllowed = 'move'
}

// 拖拽结束：清理状态
const handleDragEnd = () => {
  dragIndex = null
}

// 放置处理：只交换图片数据
const handleDrop = (targetIndex, event) => {
  event.preventDefault()
  if (dragIndex === null || dragIndex === targetIndex) return

  const newImgs = [...imgArr.value]
  ;[newImgs[dragIndex], newImgs[targetIndex]] = [newImgs[targetIndex], newImgs[dragIndex]]
  imgArr.value = newImgs

  dragIndex = null
}
</script>

<template>
  <div
    class="container"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
    @dragover.prevent
    @drop.prevent
  >
    <div
      v-for="(img, index) in imgArr"
      :key="index"
      class="card"
      :style="{
        transform: hovered
          ? `rotate(${angles[index]}deg) translate(0px, -8px)`
          : 'rotate(0deg) translate(0px, -8px)'
      }"
      @dragover.prevent
      @drop.prevent="handleDrop(index, $event)"
    >
      <img
        class="proImg"
        :src="img"
        alt="商品图片"
        draggable="true"
        @dragstart="handleDragStart(index, $event)"
        @dragend="handleDragEnd"
      />
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  position: relative;
  user-select: none;
}

.card {
  position: absolute;
  height: 392px;
  width: 264px;
  background-color: #ebebeb;
  border: 5px solid #ffffff;
  border-bottom: 40px solid #ffffff;
  left: 50%;
  top: 50%;
  translate: -50% -50%;
  border-radius: 8%;
  box-shadow: #c7c7c7 -2px 2px 4px;
  transform-origin: bottom left;
  scale: 1;
  transition-duration: 200ms;
  transition-property: transform, scale;
}

.card:hover {
  scale: 1.1;
}

.proImg {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 20px;
  cursor: grab; /* 图片区域可拖拽 */
}

.proImg:active {
  cursor: grabbing;
}
</style>