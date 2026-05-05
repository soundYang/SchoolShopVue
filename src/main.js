import { createApp } from 'vue'
import pinia from '@/stores/index'
import { lazyPlugin } from '@/directives/index'
import { startBlindBoxScheduler } from './unit/clierBlindeBox' // 启动盲盒定时任务
import ReturnPage from '@/component/ReturnPage.vue'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.config.globalProperties.$imageBaseUrl = import.meta.env.VITE_IMAGE_BASE_URL

app.component('ReturnPage', ReturnPage)

app.use(pinia)
app.use(router)
app.use(lazyPlugin)

// 启动盲盒自动清除调度器（每天 8:20 清除本地存储）
startBlindBoxScheduler()

app.mount('#app')

