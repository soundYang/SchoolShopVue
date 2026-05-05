<script setup>
import { ref } from 'vue'
import { useInfiniteScroll } from '@vueuse/core'
import selectCom from './component/selectCom.vue'
import shopCard from '@/component/shopCard.vue'
import { LabelGetlistServer } from '@/api/label'
import { ProductGetByLabelServer, ProductGetAllServer } from '@/api/product'
import { safeArray } from '@/unit/safeArray'

defineOptions({ name: "allProductPage" })

// 标签数据
const mainLabelList = ref([])
const getLabelList = async () => {
  const res = await LabelGetlistServer('mainLabel')
  const raw = Array.isArray(res.data) ? res.data[0] : res.data
  mainLabelList.value = safeArray(raw?.items)
  mainLabelList.value.unshift('全部')
}
getLabelList()

// 当前选中标签索引（0 表示“全部”）
const count = ref(0)

// 分页相关
const productList = ref([])
const page = ref(1)
const pageSize = 20
const loading = ref(false)
const finished = ref(false)

// 核心加载函数
const fetchData = async (reset = false) => {
  if (reset) {
    productList.value = []
    page.value = 1
    finished.value = false
  }
  if (loading.value || finished.value) return

  loading.value = true
  try {
    let res
    if (count.value === 0) {
      // 全部商品
      res = await ProductGetAllServer(page.value, pageSize)
    } else {
      const label = mainLabelList.value[count.value]
      res = await ProductGetByLabelServer(label, page.value, pageSize)
    }

    const newData = res.data || []
    productList.value = [...productList.value, ...newData]

    // 判断是否还有更多
    if (newData.length < pageSize) {
      finished.value = true
    } else {
      page.value++
    }
  } catch (error) {
    console.error('加载失败', error)
  } finally {
    loading.value = false
  }
}

// 加载更多（滚动触发）
const loadMore = () => fetchData(false)

// 重置并加载第一页（标签切换时调用）
const resetAndLoad = () => fetchData(true)

// 初始化
resetAndLoad()

// 标签切换处理
const updateValue = (checked, index) => {
  if (!checked) return
  count.value = index
  resetAndLoad()
  // 窗口滚动回到顶部
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 无限滚动监听（直接监听 window）
useInfiniteScroll(
  window,
  loadMore,
  { distance: 10 } // 距离底部 10px 时触发
)
</script>

<template>
  <div>
    <!-- 标签栏 -->
    <div class="header">
      <selectCom
        v-for="(item, index) in mainLabelList"
        :key="item"
        :model-value="index === count"
        @update:modelValue="(checked) => updateValue(checked, index)"
      >
        {{ item }}
      </selectCom>
    </div>

    <!-- 页面主体：自然流式布局，由窗口控制滚动 -->
    <div class="body" :class="{ 'no-scroll': productList.length === 0 }">
      <div v-if="productList.length" class="proBoxWrapper">
        <div class="proBox">
          <shopCard
            v-for="item in productList"
            :key="item._id"
            :product="item"
          />
        </div>
      </div>

      <!-- 加载状态提示 -->
      <div v-if="loading && !finished" class="loading-more">加载中...</div>
      <div v-if="finished" class="no-more">没有更多了</div>
    </div>
  </div>
</template>

<style scoped>
:global(body) {
  overflow: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  background: var(--mg-white);
  color: var(--mg-black);
}
:global(body::-webkit-scrollbar) {
  display: none;
}

.header {
  padding: 160px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 30px;
  margin-left: -50px;
}

.body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 50vh;
}

.proBoxWrapper {
  display: flex;
  justify-content: center;
  width: 100%;
}

.proBox {
  display: flex;
  flex-wrap: wrap;
  gap: 60px;
  width: 1200px;
  justify-content: flex-start;
}

.noPro {
  text-align: center;
  font-size: 50px;
  font-family: var(--mg-font);
  color: var(--mg-black);
  margin-top: 100px;
}

.loading-more,
.no-more {
  text-align: center;
  padding: 20px;
  color: var(--mg-black);
  font-family: var(--mg-font);
}

[data-device="mobile"] .header {
  padding: 80px 16px 20px;
  flex-wrap: wrap;
  gap: 12px;
  margin-left: 0;
}

[data-device="mobile"] .proBox {
  width: 100%;
  gap: 12px;
  justify-content: center;
}

[data-device="mobile"] .body {
  padding: 12px;
}

[data-device="mobile"] .noPro {
  font-size: 24px;
  margin-top: 40px;
}
</style>
