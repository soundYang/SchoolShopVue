import request from "@/unit/request"

// 根据关键字获取商品列表
export const ProductGetlistServer = (key) => {
  return request.get(`/product/keyProList?key=${key}`)
}

// 获取单个用户发布的商品列表
export const productGetUserListServer = (id, page = 1, pageSize = 10) => {
  return request.get(`/product/getUserProducts`,{
    page,
    pageSize,
    id
  })
}

// 获取单个商品
export const ProductGetOneServer = (id) => {
  return request.get(`/product/getPro?id=${id}`)
}

// 根据商品标签获得商品
export const ProductGetByLabelServer = (label, page = 1, pageSize = 20 ) => {
  return request.post('product/tagSearch',{
    params:{
      tags: label,
      page,
      pageSize
    }
  })
}

// 获取所有商品
export const ProductGetAllServer = (page = 1, pageSize = 20 ) => {
  return request.get(`product/getAllPro`,{
      params:{
        page,
        pageSize
      }
    }
  )
}
// 发布商品（使用 FormData）
export const ProductPublishServer = (formData) => {
  return request.post('/product/create', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}