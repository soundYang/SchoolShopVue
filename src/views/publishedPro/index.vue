<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useProductStore } from '@/stores'
import { storeToRefs } from 'pinia'
import proShowBox from './component/proShowBox.vue'
import { ProductUpdateStatusServer, ProductDeleteServer } from '@/api/product'

const productStore = useProductStore()
const { SellProduct, sellTotal } = storeToRefs(productStore)

// 分页状态
const currentPage = ref(1)
const pageSize = ref(3) // 每页3条

// 总页数
const totalPages = computed(() => Math.ceil(sellTotal.value / pageSize.value))

// 加载商品列表
const loadProducts = async () => {
  await productStore.getSellProductList({
    page: currentPage.value,
    pageSize: pageSize.value
  })
}

// 切换页码
const changePage = (page) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
}

// 监听页码变化，重新加载数据
watch(currentPage, () => {
  loadProducts()
})

// 初始加载
onMounted(() => {
  loadProducts()
})

// 更新商品状态
const updateProStatus = async (id, status) => {
  await ProductUpdateStatusServer({ id, status })
  await loadProducts()
  if (SellProduct.value.length === 0 && currentPage.value > 1) {
    currentPage.value--
  }
}

// 删除商品
const deletePro = async (id) => {
  await ProductDeleteServer(id)
  await loadProducts()
  if (SellProduct.value.length === 0 && currentPage.value > 1) {
    currentPage.value--
  }
}

// 通过 provide 传递给子组件
import { provide } from 'vue'
provide('updateProStatus', updateProStatus)
provide('deletePro', deletePro)

defineOptions({
  name: 'publishedPage'
})
</script>

<template>
  <div class="box">
    <ReturnPage />
    <div class="title">
      已发布商品列表<br />
      <span>List of Published Products</span>
    </div>

    <ul v-if="SellProduct.length" class="proBox">
      <li v-for="item in SellProduct" :key="item._id">
        <proShowBox :product="item" />
      </li>
    </ul>
    <div v-else class="empty-tip">暂无商品数据</div>

    <!-- 分页组件 -->
    <div class="pagination" v-if="sellTotal > 0">
      <!-- 上一页按钮：箭头初始隐藏在左侧外部，悬停时从右向左滑入 -->
      <button class="cta prev" :disabled="currentPage === 1" @click="changePage(currentPage - 1)">
        <span class="hover-underline-animation">上一页</span>
      </button>

      <!-- 页码信息 -->
      <div class="page-info-wrapper">
        <span class="page-info">第 {{ currentPage }} / {{ totalPages }} 页</span>
        <span class="total-info">共 {{ sellTotal }} 条</span>
      </div>

      <!-- 下一页按钮：箭头初始隐藏在右侧外部，悬停时从左向右滑入 -->
      <button class="cta next" :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)">
        <span class="hover-underline-animation">下一页</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.box {
  --input-focus: #2d8cf0;
  --font-color: #000;
  --font-color-sub: #666;
  --bg-color: #fff;
  --main-color: #000;
  padding: 20px;
  background: var(--mg-white);
  display: flex;
  flex-direction: column;
  gap: 20px;
  border: var(--mg-border);
  box-shadow: var(--mg-shadow);
  width: 100%;
  min-height: 100vh;
  font-family: var(--mg-font);
}

.title {
  color: var(--font-color);
  font-weight: 900;
  font-size: 20px;
  margin-bottom: 25px;
}

.title span {
  color: var(--font-color-sub);
  font-weight: 600;
  font-size: 17px;
}

.proBox {
  display: flex;
  flex-direction: column;
  row-gap: 30px;
}

.empty-tip {
  text-align: center;
  color: var(--font-color-sub);
  padding: 40px 0;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 32px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: var(--mg-border-light);
}

.cta {
  position: relative;
  border: none;
  background: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0;
  transition: all 0.2s ease;
  overflow: visible;
}

.cta:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.cta span {
  padding-bottom: 7px;
  letter-spacing: 4px;
  font-size: 14px;
  text-transform: uppercase;
  font-weight: 500;
  color: var(--font-color);
  font-family: var(--mg-font);
}

.cta::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 8px;
  height: 8px;
  border-top: 2px solid var(--font-color);
  border-right: 2px solid var(--font-color);
  transition: transform 0.3s ease;
  transform-origin: center;
}

.next::after {
  right: -24px;
  transform: translateY(-50%) rotate(45deg) translateX(-12px);
}
.next:hover:not(:disabled)::after {
  transform: translateY(-50%) rotate(45deg) translateX(0);
}

.prev::after {
  left: -24px;
  transform: translateY(-50%) rotate(-135deg) translateX(12px);
}
.prev:hover:not(:disabled)::after {
  transform: translateY(-50%) rotate(-135deg) translateX(0);
}

.hover-underline-animation {
  position: relative;
  padding-bottom: 20px;
}

.hover-underline-animation:after {
  content: "";
  position: absolute;
  width: 100%;
  transform: scaleX(0);
  height: 2px;
  bottom: 0;
  left: 0;
  background-color: var(--main-color);
  transform-origin: bottom right;
  transition: transform 0.25s ease-out;
}

.next:hover:not(:disabled) .hover-underline-animation:after {
  transform: scaleX(1);
  transform-origin: bottom left;
}

.prev .hover-underline-animation:after {
  transform-origin: bottom left;
}
.prev:hover:not(:disabled) .hover-underline-animation:after {
  transform: scaleX(1);
  transform-origin: bottom right;
}

.page-info-wrapper {
  display: flex;
  gap: 16px;
  background: var(--mg-gray);
  padding: 6px 16px;
  font-size: 14px;
  color: var(--font-color);
  border: var(--mg-border-light);
}

.page-info,
.total-info {
  font-weight: 500;
  letter-spacing: 0.5px;
}

.page-info {
  border-right: var(--mg-border-light);
  padding-right: 16px;
}

[data-device="mobile"] .box {
  padding: 12px;
  gap: 12px;
  border-radius: 0;
  border: none;
  box-shadow: none;
}

[data-device="mobile"] .title {
  font-size: 16px;
  margin-bottom: 16px;
}

[data-device="mobile"] .title span {
  font-size: 14px;
}

[data-device="mobile"] .proBox {
  row-gap: 16px;
}

[data-device="mobile"] .pagination {
  gap: 16px;
  flex-wrap: wrap;
}

[data-device="mobile"] .cta span {
  font-size: 12px;
  letter-spacing: 2px;
}

[data-device="mobile"] .page-info-wrapper {
  gap: 8px;
  padding: 4px 12px;
  font-size: 12px;
}

[data-device="mobile"] .page-info {
  padding-right: 8px;
}
</style>
