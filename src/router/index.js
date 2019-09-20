import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/login' // 引入登录组件
import Tabbar from '@/views/tabbar'
import Home from '@/views/home'

Vue.use(VueRouter)

const router = new VueRouter({
  // 配置路由表
  routes: [{
    name: 'login',
    path: '/login',
    component: Login
  },
  {
    path: '/',
    component: Tabbar,
    children: [
      {
        name: 'home',
        path: '', // 默认子路由
        component: Home
      }
    ]
  }
  ]
})

export default router
