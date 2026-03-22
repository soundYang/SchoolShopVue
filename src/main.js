import { createApp } from 'vue'
import pinia from '@/stores/index'
import { lazyPlugin } from '@/directives/index'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.config.globalProperties.$imageBaseUrl = import.meta.env.VITE_IMAGE_BASE_URL

app.use(pinia)
app.use(router)
app.use(lazyPlugin)

app.mount('#app')
