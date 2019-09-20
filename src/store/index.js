import Vue from 'vue'
import Vuex from 'vuex'
import { getItem, setItem } from '@/utils/storage' // 本地储存模块

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 初始化的时候从本地存储获取数据，没有就是 null
    user: getItem('user')
  },
  mutations: {
    //  用于修改state
    // 登录成功后,调用mutation 将token 放到 Vue容器里
    setUser (state, user) {
      state.user = user
      // 储存数据时把数据也放在本地储存中
      setItem('user', state.user)
    }
  },
  actions: {

  }
})
