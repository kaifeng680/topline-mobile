/**
 * 用户相关请求模块
 * 两个好处：
 *  便于开发和维护
 *  便于重用
 * 一个原则：
 *  仅封装请求操作，不关心任何其它业务逻辑，例如操作视图，修改DOM等，更不关心交互
 *  这样做了以后，就不要再在组件中出现任何直接请求了，建议全部都这样搞
 */
import request from '@/utils/request' // 引入axios
// 请求的参数属于参数结构
export const login = ({ mobile, code }) => {
  return request({
    method: 'POST',
    url: '/app/v1_0/authorizations',
    data: {
      mobile,
      code
    }
  })
}
