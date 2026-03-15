import { createApp } from 'vue'
import pinia from '@/stores/index'
import { lazyPlugin } from '@/directives/index'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(lazyPlugin)

app.mount('#app')
