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

/**
 * 关注用户
 */
export const followUser = userId => {
  return request({
    method: 'POST',
    url: '/app/v1_0/user/followings',
    data: {
      target: userId
    }
  })
}

/**
 * 取消关注用户
 */
export const unFollowUser = userId => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/user/followings/${userId}`
  })
}
/**
 * 获取用户自己信息
 */
export const getSelf = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/user'
  })
}

/**
 * 获取用户个人资料
 */
export const getProfile = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/user/profile'
  })
}

/**
 * 更新用户头像
 */
export const updateUserPhoto = file => {
  const formData = new FormData()
  formData.append('photo', file)
  // 请求头中的 Content-Type
  //    application/json  axios会自动设置，传递普通 JavaScript 对象即可
  //    multipart/form-data 传递 FormData，axios 也会自动设置
  return request({
    method: 'PATCH',
    url: '/app/v1_0/user/photo',
    // application/json
    // data: {}

    // multipart/form-data
    // 注意：一般上传文件的接口都会要求请求头的 Content-Type 是 multipart/form-data
    data: formData
  })
}
/**
 * 更新用户基本信息
 */
export const updateUserProfile = ({
  name,
  gender,
  birthday
}) => {
  return request({
    method: 'PATCH',
    url: '/app/v1_0/user/profile',
    data: {
      name, // 昵称
      gender, // 性别
      birthday // 生日
    }
  })
}
