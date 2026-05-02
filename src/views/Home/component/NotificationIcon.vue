<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNotificationStore } from '@/stores'
import { storeToRefs } from 'pinia'

const router = useRouter()
const notificationStore = useNotificationStore()
// 从 Store 中解出响应式的通知列表和未读数量
const { list, unreadCount } = storeToRefs(notificationStore)

// 弹层显示/隐藏状态
const showPopup = ref(false)
// 弹层 DOM 引用，用于点击外部关闭
const popupRef = ref(null)
// 未读数量轮询定时器
let pollTimer = null
// 通知列表轮询定时器
let listTimer = null

// 手动刷新通知列表
const refreshList = async () => {
  await notificationStore.fetchList({ page: 1, pageSize: 20 })
}

// 点击图标切换弹层
const togglePopup = () => {
  showPopup.value = !showPopup.value
  if (showPopup.value) {
    refreshList()
  }
}

// 点击弹层外部区域关闭弹层
const handleClickOutside = (e) => {
  if (popupRef.value && !popupRef.value.contains(e.target)) {
    showPopup.value = false
  }
}

// 全部标记为已读
const handleMarkAllRead = () => {
  notificationStore.markAllAsRead()
}

// 点击单条通知：标记已读并跳转到订单详情
const handleItemClick = (item) => {
  notificationStore.markAsRead(item._id)
  showPopup.value = false
  router.push(`/orderDetail?id=${item.orderId}`)
}

// 格式化通知时间为相对时间（刚刚/N分钟前/N小时前/日期）
const formatTime = (time) => {
  if (!time) return ''
  const date = new Date(time)
  const now = new Date()
  const diff = now - date
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
  return date.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 通知类型映射表（类型标签 + 颜色）
const notificationTypeMap = {
  new_order: { label: '新订单', color: '#ff9800' },
  order_paid: { label: '已付款', color: '#4caf50' },
  order_shipped: { label: '已发货', color: '#2196f3' },
  order_cancelled: { label: '已取消', color: '#f44336' },
  order_refunded: { label: '已退款', color: '#9c27b0' }
}

// 启动轮询：每30秒查未读数量，每60秒刷新列表
const startPolling = () => {
  notificationStore.fetchUnreadCount()
  pollTimer = setInterval(() => {
    notificationStore.fetchUnreadCount()
  }, 30000)
  refreshList()
  listTimer = setInterval(() => {
    refreshList()
  }, 60000)
}

// 停止所有轮询定时器
const stopPolling = () => {
  if (pollTimer) {
    clearInterval(pollTimer)
    pollTimer = null
  }
  if (listTimer) {
    clearInterval(listTimer)
    listTimer = null
  }
}

onMounted(() => {
  startPolling()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  stopPolling()
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div
    class="notification-wrapper"
  >
    <div class="icon-container" @click.stop="togglePopup">
      <i class="iconfont icon-tongzhi notification-icon" :class="{ 'has-unread': unreadCount > 0 }"></i>
      <span v-if="unreadCount > 0" class="badge">{{ unreadCount > 99 ? '99+' : unreadCount }}</span>
    </div>

    <Transition name="popup">
      <div v-if="showPopup" ref="popupRef" class="notification-popup">
        <div class="popup-header">
          <span class="popup-title">通知</span>
          <button
            v-if="unreadCount > 0"
            class="mark-all-btn"
            @click.stop="handleMarkAllRead"
          >
            全部已读
          </button>
        </div>

        <div class="popup-body">
          <div v-if="!list.length" class="popup-empty">暂无通知</div>
          <div
            v-for="item in list"
            v-else
            :key="item._id"
            class="notification-item"
            :class="{ unread: !item.isRead }"
            @click.stop="handleItemClick(item)"
          >
            <div class="item-dot" :style="{ background: notificationTypeMap[item.type]?.color || '#999' }"></div>
            <div class="item-content">
              <div class="item-title">{{ item.title }}</div>
              <div class="item-message">{{ item.message }}</div>
              <div class="item-time">{{ formatTime(item.createdAt) }}</div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.notification-wrapper {
  position: relative;
  display: inline-flex;
  margin-left: 12px;
}

.icon-container {
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.notification-icon {
  font-size: 24px;
  transition: color 0.3s, text-shadow 0.3s;
}

.notification-icon:hover {
  color: #FAC921;
}

/* 有未读通知时图标发光 */
.notification-icon.has-unread {
  color: #FAC921;
  text-shadow: 0 0 8px rgba(250, 201, 33, 0.6), 0 0 16px rgba(250, 201, 33, 0.3);
  animation: glow-icon 2s infinite;
}

@keyframes glow-icon {
  0%, 100% {
    text-shadow: 0 0 8px rgba(250, 201, 33, 0.6), 0 0 16px rgba(250, 201, 33, 0.3);
  }
  50% {
    text-shadow: 0 0 12px rgba(250, 201, 33, 0.9), 0 0 24px rgba(250, 201, 33, 0.5);
  }
}

.badge {
  position: absolute;
  top: -6px;
  right: -10px;
  min-width: 18px;
  height: 18px;
  line-height: 18px;
  text-align: center;
  background: #f44336;
  color: white;
  font-size: 11px;
  border-radius: 9px;
  padding: 0 4px;
  font-weight: bold;
  box-shadow: 0 0 6px rgba(244, 67, 54, 0.6);
  animation: pulse-badge 2s infinite;
}

/* 红色角标呼吸脉冲动画 */
@keyframes pulse-badge {
  0%, 100% {
    box-shadow: 0 0 6px rgba(244, 67, 54, 0.6);
  }
  50% {
    box-shadow: 0 0 14px rgba(244, 67, 54, 0.9);
  }
}

.notification-popup {
  position: absolute;
  top: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%);
  width: 380px;
  max-height: 480px;
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  z-index: 200;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px 12px;
  border-bottom: 1px solid #444;
}

.popup-title {
  font-size: 16px;
  font-weight: bold;
  color: #fff;
}

.mark-all-btn {
  background: transparent;
  border: 1px solid #FAC921;
  color: #FAC921;
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.mark-all-btn:hover {
  background: #FAC921;
  color: #333;
}

.popup-body {
  max-height: 400px;
  overflow-y: auto;
}

.popup-empty {
  text-align: center;
  color: #888;
  padding: 40px 20px;
  font-size: 14px;
}

.notification-item {
  display: flex;
  gap: 12px;
  padding: 14px 20px;
  cursor: pointer;
  transition: background 0.2s;
  border-bottom: 1px solid #333;
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

/* 未读通知有浅色高亮背景 */
.notification-item.unread {
  background: rgba(250, 201, 33, 0.05);
}

.item-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 5px;
}

.item-content {
  flex: 1;
  min-width: 0;
}

.item-title {
  font-size: 14px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 4px;
}

.item-message {
  font-size: 12px;
  color: #aaa;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 4px;
}

.item-time {
  font-size: 11px;
  color: #666;
}

/* 弹层出现/消失过渡动画 */
.popup-enter-active,
.popup-leave-active {
  transition: all 0.25s ease;
}

.popup-enter-from,
.popup-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-8px);
}
</style>
