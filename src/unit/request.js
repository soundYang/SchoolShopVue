import axios from 'axios'
import { useToast } from '@/composables/useToast'
import { useUserStore, useLoadingStore } from '@/stores'
import { storeToRefs } from 'pinia'
import router from '@/router'          

const { showToast } = useToast()
let loadingStore

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 5000
})

// 添加请求拦截器
request.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    loadingStore = useLoadingStore()
    loadingStore.show()
    const { Account, token } = storeToRefs(useUserStore())
    if(token.value){
      config.headers.Authorization = `Bearer ${token.value}`
    }

    // 如果数据是 FormData，不要设置 Content-Type，让浏览器自动设置
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type']
    }
    
    return config
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  });

// 添加响应拦截器
request.interceptors.response.use(function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    loadingStore.hide()
    response.data.msg && showToast(response.data.msg)
    if(response.data.code === 200){
      return response.data
    }
    return Promise.reject(response.data)
  }, function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    loadingStore.hide()
    if(error.response.data.code === 401){
      router.replace('/login')
      showToast('登录过期')
    }
    
    return Promise.reject(error);
})

export default request