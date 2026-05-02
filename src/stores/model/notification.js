import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  NotificationGetListServer,
  NotificationGetUnreadCountServer,
  NotificationReadServer,
  NotificationReadAllServer
} from '@/api/notification'

// 通知状态管理
export const useNotificationStore = defineStore('notification', () => {
  // 通知列表数据
  const list = ref([])
  // 通知总数
  const total = ref(0)
  // 未读通知数量（用于角标显示）
  const unreadCount = ref(0)
  // 列表加载状态
  const loading = ref(false)

  // 获取通知列表
  const fetchList = async ({ page = 1, pageSize = 20, unreadOnly = false } = {}) => {
    loading.value = true
    try {
      const res = await NotificationGetListServer({ page, pageSize, unreadOnly })
      list.value = res.data || []
      total.value = res.total || 0
    } catch (error) {
      console.error('获取通知列表失败:', error)
    } finally {
      loading.value = false
    }
  }

  // 仅获取未读通知数量
  const fetchUnreadCount = async () => {
    try {
      const res = await NotificationGetUnreadCountServer()
      unreadCount.value = res.data?.count || 0
    } catch (error) {
      console.error('获取未读通知数失败:', error)
    }
  }

  // 标记单条通知为已读
  const markAsRead = async (id) => {
    try {
      await NotificationReadServer(id)
      const item = list.value.find(n => n._id === id)
      if (item && !item.isRead) {
        item.isRead = true
        unreadCount.value = Math.max(0, unreadCount.value - 1)
      }
    } catch (error) {
      console.error('标记已读失败:', error)
    }
  }

  // 全部标记为已读
  const markAllAsRead = async () => {
    try {
      await NotificationReadAllServer()
      list.value.forEach(n => { n.isRead = true })
      unreadCount.value = 0
    } catch (error) {
      console.error('全部标记已读失败:', error)
    }
  }

  return {
    list,
    total,
    unreadCount,
    loading,
    fetchList,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead
  }
})
