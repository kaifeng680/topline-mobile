import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/login' // 引入登录组件
import Tabbar from '@/views/tabbar'
import Home from '@/views/home'
import Search from '@/views/search' // 搜索页
import SearchResult from '@/views/search-result'
import Article from '@/views/article'
import My from '@/views/my'
import User from '@/views/user'
Vue.use(VueRouter)

const router = new VueRouter({
  // 配置路由表
  routes: [{
    name: 'login',
    path: '/login',
    component: Login
  },
  { // 搜索页面
    name: 'search',
    path: '/search',
    component: Search
  },
  { // 搜索页面
    name: 'user',
    path: '/user',
    component: User
  },
  {
    name: 'search-result',
    path: '/search/:q',
    component: SearchResult
  },
  { // 文章列表
    name: 'article',
    path: '/article/:articleId',
    component: Article
  },
  { // home页面
    path: '/',
    component: Tabbar,
    children: [
      {
        name: 'home',
        path: '', // 默认子路由
        component: Home
      }, {
        name: 'my',
        path: '/my', // 默认子路由
        component: My
      }
    ]
  }
  ]
})

export default router
