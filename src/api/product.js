import request from "@/unit/request"

// 获取商品列表
export const ProductGetlistServer = (key) => {
  return request.get(`/product/keyProList?key=${key}`)
}

// 获取单个用户的商品列表
export const productGetUserListServer = (page = 1, pageSize = 10) => {
  return request.get(`/product/getUserProducts`,{
    page,
    pageSize
  })
}

// 获取单个商品
export const ProductGetOneServer = (id) => {
  return request.get(`/product/getPro?id=${id}`)
}