import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './style/index.less' // 引入login页面样式

// 验证规则
import { ValidationProvider
  , extend,
  ValidationObserver } from 'vee-validate'
import * as rules from 'vee-validate/dist/rules' // 加载所有验证规则
import zhCN from 'vee-validate/dist/locale/zh_CN'

// 按需注册 Vant 组件
import {
  Button,
  Cell,
  CellGroup,
  NavBar,
  Field,
  Toast,
  Tabbar,
  TabbarItem,
  Tab,
  Tabs,
  List,
  PullRefresh
} from 'vant'
Vue
  .use(Button)
  .use(Cell)
  .use(CellGroup)
  .use(NavBar)
  .use(Field)
  .use(Toast)
  .use(Tabbar)
  .use(TabbarItem)
  .use(Tab)
  .use(Tabs)
  .use(List)
  .use(PullRefresh)

for (let rule in rules) {
  extend(rule, {
    ...rules[rule], // add the rule
    message: zhCN.messages[rule] // add its message
  })
}
// 规则:有内置的先用内置的
extend('phone', {
  validate (value) {
    return /^1\d{10}$/.test(value)
  },

  message: '必须为手机号'
})

Vue.component('ValidationProvider', ValidationProvider)
Vue.component('ValidationObserver', ValidationObserver)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
