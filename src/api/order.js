import request from '@/unit/request'

export const OrderGetlistServer = ({ page, pageSize, role, status }) =>
  request.post(`/order/list`, {
    page: page || 1,
    pageSize: pageSize || 10,
    role,
    status
})