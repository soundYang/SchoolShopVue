import { createRouter, createWebHashHistory } from 'vue-router'
import { useUserStore } from '@/stores'

// 需要登录才能访问的路由白名单
const authRequiredPages = [
  '/user', '/shopOrder', '/pay', '/orderDetail',
  '/myOrder', '/postPro', '/publishedPro', '/productManagement'
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/layout'
    },
    { path: '/',
      name: 'home',
      component: () => import('@/views/Home/index.vue'),
      children: [
        { path: '/layout', name: 'layout', component: () => import('@/views/Layout/index.vue') },
        { path: '/search', name: 'search', component: () => import('@/views/Search/index.vue') },
        { path: '/user', name: 'user', component: () => import('@/views/User/index.vue') },
        { path: '/allProduct', name: 'allProduct', component: () => import('@/views/allProduct/index.vue') },
        { path: '/productDetail/:id', name: 'productDetail', component: () => import('@/views/ProductDetails/index.vue') },
        { path: '/shopOrder', name:'shopOrder', component: () => import('@/views/shopOrder/index.vue')},
        { path: '/pay', name:'payPage',component: () => import('@/views/pay/index.vue')},
        { path: '/orderDetail', name:'orderDetail',component: () => import('@/views/orderDetail/index.vue')},
        {
          path: '/productManagement',
          name: 'productManagement',
          component: () => import('@/views/productManagement/index.vue'),
          children:[
            { path: '/myOrder', name: 'myOrder', component: () => import('@/views/myOrder/index.vue') },
            { path: '/postPro', name: 'postPro', component: () => import('@/views/postPro/index.vue') },
            { path: '/publishedPro', name: 'publishedPro', component: () => import('@/views/publishedPro/index.vue') }
          ],
          redirect: '/myOrder'
        },
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login/index.vue')
    }
  ],
  scrollBehavior(to, from, savedPosition){
    return { top: 0 }
  }
})

// 路由拦截：未登录跳转登录页
router.beforeEach((to) => {
  const userStore = useUserStore()
  const token = userStore.token
  if (authRequiredPages.includes(to.path)) {
    if (!token) {
      return '/login'
    }
  }
})

export default router
