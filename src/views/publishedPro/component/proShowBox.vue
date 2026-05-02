<script setup>
import { computed, inject } from 'vue'
import router from '@/router'
import { getImageUrl } from '@/unit/getImagerUrl'

const props = defineProps({
  product: {
    type: Object,
    required: true,
    default: () => ({})
  }
})

// 状态文本映射
const statusText = computed(() => {
  const map = { 0: '待审核', 1: '在售', 2: '下架', 3: '违规' }
  return map[props.product.shopStatus] || '在售'
})

// 状态样式类
const statusClass = computed(() => ({
  pending: props.product.shopStatus === 0,
  selling: props.product.shopStatus === 1,
  soldOut: props.product.shopStatus === 2,
  violation: props.product.shopStatus === 3
}))

// 商品图片（取第一张）
const coverImage = computed(() => {
  const images = props.product.shopImg
  return images?.length > 0 ? images[0] : ''
})

// 地址信息
const addressInfo = computed(() => {
  const addr = props.product.publishAddress
  if (!addr) return null
  return {
    receiver: addr.receiver || '未填写',
    phone: addr.phone || '未填写',
    detail: addr.detail || '未知地址'
  }
})

// 标签数组
const typeTags = computed(() => props.product.shopType || [])

// 注入方法
const updateProStatus = inject('updateProStatus')
const deletePro = inject('deletePro')

const onUpdateStatus = () => {
  updateProStatus(props.product._id, props.product.shopStatus === 1 ? 2 : 1)
}

const onDelete = () => {
  deletePro(props.product._id)
}

const goToDetail = () => {
  router.push({ name: 'productDetail', params: { id: props.product._id } })
}
</script>

<template>
  <div class="product-card">
    <div class="card-inner">
      <!-- 图片区域 -->
      <div class="image-area">
        <div class="image-wrapper">
          <img :src="getImageUrl(coverImage)" :alt="product.shopName" />
        </div>
        <div class="status-badge" :class="statusClass">
          {{ statusText }}
        </div>
      </div>

      <!-- 内容区域 -->
      <div class="content-area">
        <div class="title-row">
          <h3 class="product-name">{{ product.shopName }}</h3>
          <div class="price-main">¥{{ product.shopPrice }}</div>
        </div>

        <p class="description">{{ product.shopMsg || '暂无描述' }}</p>

        <!-- 标签组 -->
        <div v-if="typeTags.length" class="tags">
          <span v-for="tag in typeTags" :key="tag" class="tag">{{ tag }}</span>
          <span v-if="product.isBlindBox" class="tag blind-box">盲盒</span>
        </div>

        <!-- 原价信息 -->
        <div v-if="product.shopActualValue && product.shopActualValue !== product.shopPrice" class="original-price-row">
          <span class="label">价值</span>
          <span class="value">¥{{ product.shopActualValue }}</span>
        </div>

        <!-- 地址卡片 -->
        <div v-if="addressInfo" class="address-card">
          <div class="address-line">
            <span class="address-label">收货人:</span> {{ addressInfo.receiver }}
          </div>
          <div class="address-line">
            <span class="address-label">手机号:</span> {{ addressInfo.phone }}
          </div>
          <div class="address-line address-detail">
            <span class="address-label">地址:</span> {{ addressInfo.detail }}
          </div>
        </div>

        <!-- 操作按钮组 -->
        <div class="actions">
          <button class="action-btn view-btn" @click="goToDetail">
            查看
          </button>
          <button class="action-btn delete-btn" @click="onDelete">
            删除
          </button>
          <button class="action-btn status-btn" @click="onUpdateStatus">
            {{ product.shopStatus === 2 ? '上架' : '下架' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 整体卡片容器 */
.product-card {
  background: white;
  border-radius: 8px;
  border: 2px solid var(--main-color);
  box-shadow: 3px 3px var(--main-color);
  overflow: hidden;
  transition: transform 0.3s;
  margin-bottom: 20px;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 4px 4px var(--main-color);
}

/* 卡片内部结构 */
.card-inner {
  display: flex;
  gap: 15px;
  padding: 15px;
}

/* 图片区域 */
.image-area {
  position: relative;
  flex-shrink: 0;
  width: 100px;
  height: 100px;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #ddd;
}

.image-wrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.product-card:hover .image-wrapper img {
  transform: scale(1.05);
}

/* 状态徽章 */
.status-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  white-space: nowrap;
  border: 1px solid #ddd;
}

.status-badge.selling {
  background: #4caf50;
  color: white;
  border-color: #4caf50;
}

.status-badge.soldOut {
  background: #9e9e9e;
  color: white;
  border-color: #9e9e9e;
}

.status-badge.pending {
  background: #ff9800;
  color: white;
  border-color: #ff9800;
}

.status-badge.violation {
  background: #f44336;
  color: white;
  border-color: #f44336;
}

/* 内容区域 */
.content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.title-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 8px;
}

.product-name {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
  color: var(--font-color);
  line-height: 1.4;
}

.price-main {
  font-size: 18px;
  font-weight: bold;
  color: #ff5858;
}

.description {
  margin: 0;
  font-size: 14px;
  color: var(--font-color-sub);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  background: #f0f0f0;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  color: var(--font-color);
  border: 1px solid #ddd;
}

.tag.blind-box {
  background: #e1bee7;
  color: #6a1b9a;
  border-color: #ce93d8;
}

.original-price-row {
  font-size: 12px;
  color: var(--font-color-sub);
  display: flex;
  gap: 6px;
  align-items: baseline;
}

.original-price-row .label {
  opacity: 0.7;
}

.original-price-row .value {
  text-decoration: line-through;
}

/* 地址卡片 */
.address-card {
  background: #f8f8f8;
  border-radius: 8px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  border: 1px solid #ddd;
}

.address-line {
  font-size: 12px;
  color: var(--font-color);
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.address-label {
  font-weight: bold;
  min-width: 50px;
  flex-shrink: 0;
}

.address-detail {
  line-height: 1.3;
}

/* 操作按钮 */
.actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 5px;
}

.action-btn {
  padding: 6px 16px;
  border: 2px solid var(--main-color);
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 2px 2px var(--main-color);
  background: white;
  color: var(--font-color);
}

.action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 3px 3px var(--main-color);
}

.view-btn:hover {
  background: #f0f0f0;
}

.delete-btn {
  border-color: #f44336;
  color: #f44336;
}

.delete-btn:hover {
  background: #f44336;
  color: white;
}

.status-btn {
  border-color: #ff9800;
  color: #ff9800;
}

.status-btn:hover {
  background: #ff9800;
  color: white;
}

/* 响应式布局 */
@media (max-width: 560px) {
  .card-inner {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 15px;
  }
  
  .image-area {
    width: 120px;
    height: 120px;
  }
  
  .title-row {
    justify-content: center;
  }
  
  .actions {
    justify-content: center;
  }
  
  .address-card {
    text-align: left;
    width: 100%;
  }
}
</style>