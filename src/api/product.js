import request from "@/unit/request"

export const ProductGetlistServer = (key) => {
  return request.get(`/product/keyProList?key=${key}`)
}