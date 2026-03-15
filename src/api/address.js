import request from "@/unit/request"

// 获取地址列表
export const AddressGetListServer = () =>{
  return request.get('/address/list')
}

// 添加地址
export const AddressAddServer = (data) =>{
  return request.post('/address/add', data)
}

// 删除地址
export const AddressDeleteServer = (id) =>{
  return request.delete(`/address/del?addressId=${id}`)
}

// 修改地址
export const AddressUpdateServer = (data) =>{
  return request.post('/address/update', data)
}