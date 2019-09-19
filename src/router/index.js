import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/login' // 引入登录组件
Vue.use(VueRouter)

const router = new VueRouter({
  // 配置路由表
  routes: [{
    name: 'login',
    path: '/login',
    component: Login
  }]
})

export default router
