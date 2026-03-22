// 获取图片完整 URL
export const getImageUrl = (path) => {
  if (!path) return ''
  // 如果已经是完整 URL 则直接返回
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  // 否则拼接基础地址
  return `${import.meta.env.VITE_IMAGE_BASE_URL}${path}`
}