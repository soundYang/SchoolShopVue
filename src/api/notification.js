import request from '@/unit/request'

// 获取通知列表（分页）
export const NotificationGetListServer = ({ page = 1, pageSize = 20, unreadOnly = false } = {}) => {
  return request.get('/notification/list', {
    params: { page, pageSize, unreadOnly },
    noLoading: true,
    noAuthRedirect: true
  })
}

// 获取未读通知数量
export const NotificationGetUnreadCountServer = () => {
  return request.get('/notification/unreadCount', { noLoading: true, noAuthRedirect: true })
}

// 标记单条通知为已读
export const NotificationReadServer = (id) => {
  return request.put(`/notification/read/${id}`, null, { noLoading: true })
}

// 标记全部通知为已读
export const NotificationReadAllServer = () => {
  return request.put('/notification/readAll', null, { noLoading: true })
}
