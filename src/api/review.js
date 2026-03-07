import request from "@/unit/request"

export const ReviewGetlistServer = ({page, pageSize, sellerId, productId, userId}) =>
  request.get(`/review/list`, {
    params:{
      page: page || 1,
      pageSize: pageSize || 10,
      sellerId,
      productId,
      userId
    }
})