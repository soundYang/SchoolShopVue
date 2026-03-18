import request from "@/unit/request"

/**
 * 根据关键字获取标签列表
 * mainLabel        大类
 * attributeLabel   属性
 * hotLabel         热门
 */
export const LabelGetlistServer = (key) =>
  request.get(`/label/field`, { params: { fieldName: key } })

// 获取所有标签
export const LabelGetAllServer = () => request.get(`/label`)