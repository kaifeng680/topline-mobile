/**
 * search 搜索相关的接口
 */
import request from '@/utils/request' // 引入axios

export const getSuggestions = q => {
  return request({
    method: 'GET',
    url: '/app/v1_0/suggestion',
    params: {
      q
    }
  })
}

// 获取搜索结果
export const getSearch = ({
  page,
  pagePage,
  q
}) => {
  return request({
    method: 'GET',
    url: '/app/v1_0/search',
    params: {
      page, // 页数,不传入默认为1
      per_page: pagePage, // 每页数量,不传每页数量由后端决定
      q // 搜索关键词
    }
  })
}
