import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
        { path: '/productDetails', name: 'productDetails', component: () => import('@/views/ProductDetails/index.vue') },
        { path: '/user', name: 'user', component: () => import('@/views/User/index.vue') },
        { path: '/productManagement', name: 'productManagement', component: () => import('@/views/productManagement/index.vue') },
        { path: '/allProduct', name: 'allProduct', component: () => import('@/views/allProduct/index.vue') },
        { path: '/productDetail/:id', name: 'productDetail', component: () => import('@/views/ProductDetails/index.vue') }
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

export default router
