import request from "@/unit/request"

// 根据关键字获取商品列表
export const ProductGetlistServer = (key) => {
  return request.get('/product/keyProList', { params: { key } })
}

// 获取单个用户发布的商品列表
export const productGetUserListServer = (id, page = 1, pageSize = 10) => {
  const params = { page, pageSize }
  if (id) {
    params.id = id
  }
  return request.get(`/product/getUserProducts`, { params })
}

// 获取单个商品
export const ProductGetOneServer = (id) => {
  return request.get('/product/getPro', { params: { id } })
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

// 修改商品状态
export const ProductUpdateStatusServer = ({id, status}) => {
  return request.post('product/updatePro', {
    _id: id,
    shopStatus: status
   })
}


// 删除商品
export const ProductDeleteServer = (_id) => {

  return request.delete('/product/delPro',{
    params:{
      _id
    }
  })
}

// 模糊搜索
export const ProductSearchServer = ({keyword , page = 1, pageSize = 20}) => {
  return request.post('/product/searchPro',{
    keyword,
    page,
    pageSize
  })
}
