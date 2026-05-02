import request from '@/unit/request'

// 创建订单
export const OrderCreateServer = ({sellerId, productId, deliverAddress, isBlindBox, unitPrice, quantity}) => {
  return request.post('/order/create', {
     sellerId,
     productId,
     deliverAddress,
     isBlindBox,
     unitPrice,
     quantity
  })
}

// 获取购买的订单列表（买家）
export const OrderGetBoughtServer = ({ page = 1, pageSize = 10, status } = {}) => {
  return request.get('/order/bought', {
    params: { page, pageSize, status }
  })
}

// 获取卖出的订单列表（卖家）
export const OrderGetSoldServer = ({ page = 1, pageSize = 10, status } = {}) => {
  return request.get('/order/sold', {
    params: { page, pageSize, status }
  })
}

// 获取订单列表（自动根据 role 选择购买/卖出）
export const OrderGetlistServer = ({ page = 1, pageSize = 10, role = 'buyer', status } = {}) => {
  const endpoint = role === 'seller' ? '/order/sold' : '/order/bought'
  return request.get(endpoint, {
    params: { page, pageSize, status }
  })
}

// 获取盲盒订单列表（买家）
export const OrderGetBlindBoxServer = ({ page = 1, pageSize = 10, status } = {}) => {
  return request.get('/order/blindBox', {
    params: { page, pageSize, status }
  })
}

// 获取单个订单
export const OrderGetOneServer = (id) => {
  return request.get('/order/OneOrd', {
    params: { id }
  })
}

// 更新订单状态（支付、发货等）
export const OrderUpdateStatusServer = (orderId, newStatus) => {
  return request.put('/order/updateStatus', { orderId, newStatus })
}

// 取消/删除订单
export const OrderDeleteServer = (id) => {
  return request.delete('/order/del', {
    params: { id }
  })
}

// 取消订单（可填原因，支持买家/卖家）
export const OrderCancelServer = (orderId, reason = '') => {
  return request.post('/order/cancel', { orderId, reason })
}

// 退款申请（买家，仅非盲盒且已付款待发货）
export const OrderRefundServer = (orderId, reason = '') => {
  return request.post('/order/refund', { orderId, reason })
}

// 支付订单
export const OrderPayServer = (orderId) => {
  return OrderUpdateStatusServer(orderId, 1)
}

// 更新订单收货地址
export const OrderUpdateAddressServer = (orderId, deliverAddress) => {
  return request.put('/order/updateAddress', { orderId, deliverAddress })
}
