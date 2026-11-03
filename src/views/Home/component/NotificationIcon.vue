<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNotificationStore, useUserStore } from '@/stores'
import { storeToRefs } from 'pinia'

const router = useRouter()
const userStore = useUserStore()
const { token } = storeToRefs(userStore)
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

// 系统通知详情弹窗
const showDetailDialog = ref(false)
const currentNotification = ref(null)

// 点击单条通知：有 orderId 则跳转订单详情，否则弹窗显示通知内容
const handleItemClick = (item) => {
  notificationStore.markAsRead(item._id)
  showPopup.value = false
  if (item.orderId) {
    router.push(`/orderDetail?id=${item.orderId}`)
  } else {
    currentNotification.value = item
    showDetailDialog.value = true
  }
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
  if (token.value) {
    startPolling()
  }
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

    <!-- 系统通知详情弹窗 -->
    <Teleport to="body">
      <Transition name="dialog">
        <div v-if="showDetailDialog" class="dialog-overlay" @click.self="showDetailDialog = false">
          <div class="dialog-box">
            <div class="dialog-header">
              <span class="dialog-title">{{ currentNotification?.title }}</span>
              <button class="dialog-close" @click="showDetailDialog = false">&times;</button>
            </div>
            <div class="dialog-body">
              <p class="dialog-message">{{ currentNotification?.msg }}</p>
            </div>
            <div class="dialog-footer">
              <span class="dialog-time">发送时间：{{ formatTime(currentNotification?.createdAt) }}</span>
              <button class="dialog-btn" @click="showDetailDialog = false">我知道了</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
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
  color: var(--mg-black);
}

.notification-icon.has-unread {
  color: var(--mg-black);
}

.badge {
  position: absolute;
  top: -6px;
  right: -10px;
  min-width: 18px;
  height: 18px;
  line-height: 18px;
  text-align: center;
  background: var(--mg-black);
  color: var(--mg-white);
  font-size: 11px;
  padding: 0 4px;
  font-weight: bold;
  border: 2px solid var(--mg-black);
}

.notification-popup {
  position: absolute;
  top: calc(100% + 10px);
  left: 0;
  width: 380px;
  max-width: calc(100vw - 24px);
  max-height: 480px;
  background: var(--mg-white);
  border: var(--mg-border);
  box-shadow: var(--mg-shadow);
  overflow: hidden;
  z-index: 200;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px 12px;
  border-bottom: var(--mg-border-light);
}

.popup-title {
  font-size: 16px;
  font-weight: bold;
  color: var(--mg-black);
  font-family: var(--mg-font);
}

.mark-all-btn {
  background: var(--mg-white);
  border: var(--mg-border-light);
  color: var(--mg-black);
  font-size: 12px;
  padding: 4px 12px;
  cursor: pointer;
  font-family: var(--mg-font);
  box-shadow: var(--mg-shadow-sm);
}

.mark-all-btn:hover {
  transform: translate(-1px, -1px);
  box-shadow: var(--mg-shadow);
}

.mark-all-btn:active {
  transform: translate(1px, 1px);
  box-shadow: none;
}

.popup-body {
  max-height: 400px;
  overflow-y: auto;
}

.popup-empty {
  text-align: center;
  color: var(--mg-black);
  padding: 40px 20px;
  font-size: 14px;
  font-family: var(--mg-font);
}

.notification-item {
  display: flex;
  gap: 12px;
  padding: 14px 20px;
  cursor: pointer;
  border-bottom: 1px solid var(--mg-black);
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-item:hover {
  background: var(--mg-gray);
}

.notification-item.unread {
  background: var(--mg-gray);
}

.item-dot {
  width: 10px;
  height: 10px;
  flex-shrink: 0;
  margin-top: 5px;
  border: 2px solid var(--mg-black);
}

.item-content {
  flex: 1;
  min-width: 0;
}

.item-title {
  font-size: 14px;
  font-weight: bold;
  color: var(--mg-black);
  margin-bottom: 4px;
  font-family: var(--mg-font);
}

.item-message {
  font-size: 12px;
  color: var(--mg-black);
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 4px;
  font-family: var(--mg-font);
}

.item-time {
  font-size: 11px;
  color: var(--mg-black);
  font-family: var(--mg-font-mono);
}

.popup-enter-active,
.popup-leave-active {
  transition: all 0.25s ease;
}

.popup-enter-from,
.popup-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.dialog-box {
  background: var(--mg-white);
  width: 380px;
  max-width: 90vw;
  border: var(--mg-border);
  box-shadow: var(--mg-shadow);
  overflow: hidden;
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 0;
}

.dialog-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--mg-black);
  font-family: var(--mg-font);
}

.dialog-close {
  background: none;
  border: var(--mg-border-light);
  font-size: 20px;
  color: var(--mg-black);
  cursor: pointer;
  padding: 0 6px;
  line-height: 1;
  font-family: var(--mg-font-mono);
}

.dialog-close:hover {
  background: var(--mg-black);
  color: var(--mg-white);
}

.dialog-body {
  padding: 16px 24px;
}

.dialog-message {
  font-size: 15px;
  color: var(--mg-black);
  line-height: 1.8;
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  font-family: var(--mg-font);
}

.dialog-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px 20px;
}

.dialog-time {
  font-size: 12px;
  color: var(--mg-black);
  font-family: var(--mg-font-mono);
}

.dialog-btn {
  background: var(--mg-black);
  color: var(--mg-white);
  border: var(--mg-border-light);
  padding: 8px 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  font-family: var(--mg-font);
  box-shadow: var(--mg-shadow-sm);
}

.dialog-btn:hover {
  transform: translate(-1px, -1px);
  box-shadow: var(--mg-shadow);
}

.dialog-btn:active {
  transform: translate(1px, 1px);
  box-shadow: none;
}

.dialog-enter-active {
  animation: dialog-in 0.25s ease-out;
}
.dialog-leave-active {
  animation: dialog-in 0.2s ease-in reverse;
}

@keyframes dialog-in {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

[data-device="mobile"] .notification-wrapper {
  margin-left: 4px;
}
[data-device="mobile"] .notification-icon {
  font-size: 18px;
}
[data-device="mobile"] .badge {
  min-width: 14px;
  height: 14px;
  line-height: 14px;
  font-size: 9px;
  top: -5px;
  right: -8px;
  padding: 0 3px;
}
[data-device="mobile"] .notification-popup {
  position: fixed;
  top: 56px;
  left: 12px;
  right: 12px;
  width: auto;
  max-width: none;
}
[data-device="mobile"] .popup-enter-from,
[data-device="mobile"] .popup-leave-to {
  transform: translateY(-8px);
}
</style>
