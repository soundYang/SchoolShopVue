<script setup>
import { ref, provide, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import { useInfiniteScroll } from '@vueuse/core'  // 引入无限滚动钩子

import { ProductSearchServer } from '@/api/product'

import shopCard from '@/component/shopCard.vue'
import minSearch from './component/minSearch.vue'

defineOptions({
  name: 'SearchDetail'
})

const route = useRoute()
const { showToast } = useToast()
const router = useRouter()

// 数据状态
const searchList = ref([])          // 商品列表
const total = ref(0)                // 总条数
const searchMessage = ref('')       // 搜索关键词

// 分页相关状态
const currentPage = ref(1)          // 当前页码
const pageSize = 20                 // 每页条数
const hasMore = ref(true)           // 是否还有更多数据
const loading = ref(false)          // 是否正在加载

// 获取搜索列表（支持追加模式）
const getSerchList = async (isAppend = false) => {
  const keyword = route.query.key
  if (!keyword) return

  // 如果正在加载，避免重复请求
  if (loading.value) return

  loading.value = true
  try {
    const res = await ProductSearchServer({
      keyword: keyword.trim(),
      page: currentPage.value,
      pageSize: pageSize
    })

    const newData = res.data
    total.value = res.total

    if (isAppend) {
      // 追加数据
      searchList.value = [...searchList.value, ...newData]
    } else {
      // 替换数据（首次加载或切换关键词）
      searchList.value = newData
    }

    // 判断是否还有更多数据
    hasMore.value = searchList.value.length < total.value
  } catch (error) {
    console.error('获取搜索结果失败', error)
    showToast('加载失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 重置状态并重新加载（关键词变化时调用）
const resetAndSearch = () => {
  // 重置分页状态
  currentPage.value = 1
  hasMore.value = true
  searchList.value = []
  // 重新加载第一页（非追加模式）
  getSerchList(false)
}

// 加载更多（滚动到底部时调用）
const loadMore = () => {
  if (!hasMore.value || loading.value) return
  currentPage.value++
  getSerchList(true) // 追加模式
}

// 监听路由参数变化，重置数据并同步输入框
watch(() => route.query.key, (newKey) => {
  if (newKey) {
    searchMessage.value = newKey          // 更新输入框显示
    resetAndSearch()                       // 重置并重新搜索
  }
}, { immediate: true })                   // immediate 保证首次加载时执行

// 搜索跳转方法
const goSearchPage = () => {
  if (searchMessage.value.trim() === '') {
    return showToast('请输入搜索内容')
  }
  router.push({
    path: '/search',
    query: {
      key: searchMessage.value
    }
  })
}

// 提供给子组件的方法
const putMsg = () => {
  searchMessage.value = route.query.key || ''
}

provide('putMsg', putMsg)
provide('key', route.query.key)
provide('goSearchPage', goSearchPage)

// 无限滚动绑定
const targetRef = ref(null) // 绑定滚动容器
useInfiniteScroll(
  targetRef,
  () => {
    // 滚动到底部时触发加载更多
    loadMore()
  },
  { distance: 100 } // 距离底部 100px 时触发
)
</script>

<template>
  <div class="box" ref="targetRef">
    <ReturnPage />
    <!-- 搜索栏 -->
    <div class="searchBox">
      
      <minSearch class="searchCom" v-model:searchMessage="searchMessage" />

    </div>

    <!-- 搜索结果 -->
    <div v-if="searchList.length" class="shopBox">
      <shopCard
        v-for="item in searchList"
        :key="item.id"
        :product="item"
      />
    </div>

    <!-- 加载状态提示 -->
    <div v-if="loading" class="loading-tip">加载中...</div>
    <div v-else-if="!hasMore && searchList.length" class="end-tip">已加载全部内容</div>
    <h1 v-else-if="!searchList.length && !loading" class="promptMsg">暂无数据</h1>
  </div>
</template>

<style scoped>
.box {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow-y: auto;          /* 允许滚动，用于无限滚动监听 */
  max-height: 100vh;         /* 可调整，或由父级控制高度 */
  padding-top: 80px;         /* 为 fixed 头部留出空间，避免返回按钮被遮挡 */
}

.shopBox {
  width: 80%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding: 100px;
  gap: 80px;
  margin-top: -70px;
}

.promptMsg {
  text-align: center;
  font-size: 20px;
  color: #666;
  padding: 100px;
}

.searchBox {
  margin-top: 20px;
  width: 80%;
  padding: 70px;
}

.loading-tip,
.end-tip {
  text-align: center;
  font-size: 14px;
  color: #999;
  padding: 20px 0;
}
</style>