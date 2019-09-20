/**
 * 封装一个操作本地储存的模块
 */

// 读取本地储存
export const getItem = name => {
  return JSON.parse(window.localStorage.getItem(name))
}

// 储存到本地
export const setItem = (name, data) => {
  return window.localStorage.setItem(name, JSON.stringify(data))
}

// 删除本地储存
export const removeItem = name => {
  window.localStorage.removeItem(name)
}
