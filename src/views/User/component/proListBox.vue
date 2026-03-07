<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import userProCardCom from './userProCardCom.vue'

defineProps({ 
  proList: Array,
  title: String
})

const listRef = ref(null)

function handleWheel(e) {
  e.preventDefault()
  if (listRef.value) {
    listRef.value.scrollLeft += e.deltaY
  }
}

onMounted(() => {
  const listEl = listRef.value
  if (listEl) {
    listEl.addEventListener('wheel', handleWheel, { passive: false })
  }
})

onUnmounted(() => {
  const listEl = listRef.value
  if (listEl) {
    listEl.removeEventListener('wheel', handleWheel)
  }
})
</script>

<template>
  <div class="proListBox">
    <h2 class="title">{{ title }}</h2>
    <div v-if="proList?.length" class="list-wrapper">
      <div class="list" ref="listRef">
        <!-- 测试用红块，记得替换为实际组件 -->
        <userProCardCom
          style="flex-shrink: 0;" 
          v-for="item in proList" 
          :key="item._id"
          :product="item"
        />
      </div>
    </div>
    <h1 v-else class="noPro">暂无{{ title }}</h1>
  </div>
</template>

<style scoped>
.proListBox {
  width: 1000px;
  margin-top: 40px;
  padding: 30px;
  height: 300px;
  font-family: '方正舒体';
  position: relative;
  box-sizing: border-box; /* 确保 padding 不影响实际内容宽度 */
}
.proListBox::before {
  content: '';
  display: block;
  width: 100%;
  height: 1px;
  box-shadow: 0 0 15px 5px rgba(255, 255, 255, 0.6);
  position: absolute;
  bottom: 0;
  left: 0;
}
.title {
  color: white;
}
.list {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 10px;
  scrollbar-width: thin;
  -webkit-overflow-scrolling: touch;
}
.list::-webkit-scrollbar {
  height: 8px;
}
.list::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}
.list::-webkit-scrollbar-track {
  background: transparent;
}
.noPro {
  text-align: center;
  line-height: 200px;
}
.list {
  /* 保留原有滚动能力，但隐藏滚动条 */
  overflow-x: auto;          /* 必须保留，否则无法滚动 */
  overflow-y: hidden;
  scrollbar-width: none;     /* Firefox 隐藏滚动条 */
  -ms-overflow-style: none;  /* IE 和 Edge 旧版隐藏滚动条 */
}

/* Chrome, Safari, 新版 Edge 隐藏滚动条 */
.list::-webkit-scrollbar {
  display: none;
}
</style>