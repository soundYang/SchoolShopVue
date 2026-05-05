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
    <div v-if="proList">
      <div v-if="proList?.length" class="list-wrapper">
        <div class="list" ref="listRef">
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
    <!-- 通过访问查询时不允许观看 -->
    <h1 v-else class="noPro">暂无访问权力</h1>
  </div>
</template>

<style scoped>
.proListBox {
  width: 1000px;
  margin-top: 40px;
  padding: 30px;
  height: 300px;
  font-family: var(--mg-font);
  position: relative;
  box-sizing: border-box;
}
.proListBox::before {
  content: '';
  display: block;
  width: 100%;
  height: 2px;
  background: var(--mg-black);
  position: absolute;
  bottom: 0;
  left: 0;
}
.title {
  color: var(--mg-black);
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
  background: var(--mg-black);
  border-radius: 4px;
}
.list::-webkit-scrollbar-track {
  background: var(--mg-gray);
  border-radius: 4px;
}
.noPro {
  text-align: center;
  line-height: 200px;
  color: var(--mg-black);
}
</style>