<script setup>
import { ref, watch } from 'vue'
import { getImageUrl } from '@/unit/getImagerUrl'

const props = defineProps({
  shopImg: {
    type: Array,
    default: () => []   // 默认为空数组，防止 undefined
  }
})

// 图片 URL 列表（可写，用于拖拽交换）
const imgUrls = ref([])

// 根据 props.shopImg 生成图片 URL 列表
const updateImgUrls = () => {
  if (!Array.isArray(props.shopImg) || props.shopImg.length === 0) {
    imgUrls.value = []
  } else {
    imgUrls.value = props.shopImg.map(path => getImageUrl(path))
  }
}

// 初始化
updateImgUrls()

// 监听父组件传入的 shopImg 变化（例如异步加载完成后）
watch(() => props.shopImg, updateImgUrls, { immediate: true })

// 每个卡片的旋转角度（固定，不随拖拽改变）
const angles = ref([-54, -36, -18, 0, 18, 36, 54])

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

// 放置处理：交换图片顺序（仅修改本地 imgUrls，不影响父组件数据）
const handleDrop = (targetIndex, event) => {
  event.preventDefault()
  if (dragIndex === null || dragIndex === targetIndex) return

  const newList = [...imgUrls.value]
  // 交换两个元素
  ;[newList[dragIndex], newList[targetIndex]] = [newList[targetIndex], newList[dragIndex]]
  imgUrls.value = newList

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
    <!-- 无图片时显示提示 -->
    <div v-if="!imgUrls.length" class="no-images">
      暂无商品图片
    </div>

    <div
      v-for="(img, index) in imgUrls"
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
  cursor: grab;
}

.proImg:active {
  cursor: grabbing;
}

.no-images {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #999;
  font-size: 18px;
}

[data-device="mobile"] .card {
  height: 196px;
  width: 132px;
  border-width: 3px;
  border-bottom-width: 20px;
  border-radius: 6%;
}

[data-device="mobile"] .proImg {
  border-radius: 10px;
}

[data-device="mobile"] .no-images {
  font-size: 14px;
}
</style>