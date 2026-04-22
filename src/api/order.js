import request from '@/unit/request'

// 创建订单
export const OrderCreateServer = ({sellerId, productId, deliverAddress, isBlindBox, unitPrice, quantity}) => {
  request.post('/order/create', {
     sellerId, 
     productId,
     deliverAddress,
     isBlindBox,
     unitPrice,
     quantity
  })
}

// 获取订单列表
export const OrderGetlistServer = ({ page, pageSize, role, status }) =>
  request.post(`/order/list`, {
    page: page || 1,
    pageSize: pageSize || 10,
    role,
    status
})