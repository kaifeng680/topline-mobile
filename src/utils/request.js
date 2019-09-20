import axios from 'axios'
import JSONbig from 'json-bigint'
// 《使用拦截器统一添加 token》 加载容器
import store from '@/store' // 非组件模块访问容器直接用就可以了
// 创建 axios 实例
// axios.create 的作用是克隆一个 axios 实例，它的作用和 axios 是一样的
// 当然，不仅仅是这个 baseURL，还有例如拦截器等都可以独立
const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn'
})

// 配置处理后端返回的数据中包含超出 JavaScript 安全整数范围问题
request.defaults.transformResponse = [function (data) {
  // 假如data不是标准的JSON格式的字符串
  try {
    // data 数据可能不是标准的 JSON 格式字符串，否则会导致 JSONbig.parse(data) 转换失败报错
    return JSONbig.parse(data)
  } catch (err) {
    // 无法转换的数据直接原样返回
    return data
  }
}]

// 配置 axios
// 请求拦截器
// 响应拦截器
// 。。。。

// 添加请求拦截器
request.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  const { user } = store.state
  if (user) {
  //  配置 token请求头
    config.headers.Authorization = `Bearer ${user.token}`
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
request.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error)
})

// 导出请求对象

export default request
