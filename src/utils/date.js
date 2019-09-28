/**
 *相对时间模块
 */
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn' // 按需加载
import rTime from 'dayjs/plugin/relativeTime' // 相对时间插件
dayjs.locale('zh-cn') // 全局使用中文语言
dayjs.extend(rTime) // 配置使用相对时间插件

// 处理相对时间的函数
export const relativeTime = time => {
  return dayjs().from(dayjs(time)) // 返回距离现在的相对时间
}
export const formatDate = date => {
  // 日期格式化参考文档：https://github.com/iamkun/dayjs/blob/dev/docs/zh-cn/API-reference.md#%E6%A0%BC%E5%BC%8F%E5%8C%96
  return dayjs(date).format('YYYY-MM-DD')
}
