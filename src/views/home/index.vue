<template>
  <div class="home">
     <!-- 导航栏 -->
     <van-nav-bar title="首页"/>
     <!-- 频道列表 -->
     <van-tabs v-model="active">
  <van-tab
   v-for="channel in channels "
   :key="channel.id"
   :title="channel.name">
   <!-- 下拉刷新组件   -->
  <van-pull-refresh v-model="channel.pullDownLoading" @refresh="onRefresh">
   <!-- 文章列表 -->
  <van-list
  v-model="channel.loading"
  :finished="channel.finished"
  finished-text="没有更多了"
  @load="onLoad"
>
  <van-cell
    v-for="article in channel.articles"
    :key="article.art_id.toString()"
    :title="article.title"
  />
</van-list>
</van-pull-refresh>
</van-tab>
</van-tabs>

  </div>
</template>

<script>
import { getAllChannels } from '@/api/channel'
import { getArticles } from '@/api/article'
export default {
  name: 'HomeIndex',
  data () {
    return {
      active: 0, // 控制当前激活的标签页
      channels: [] // 频道列表
    }
  },
  // 计算属性
  computed: {
  //  获取到文章列表的active
    currentChannel () {
      // active 是动态的，active 改变也就意味着 currentChannel 也改变了
      return this.channels[this.active]
    }
  },

  created () {
    this.loadAllChannels()
  },
  methods: {
    // 获得频道列表
    async loadAllChannels () {
      const { data } = await getAllChannels()
      //  定制频道的内容数据
      data.data.channels.forEach(channel => {
        channel.articles = [] // 当前频道的文章列表
        channel.loading = false // 频道的上拉加载更多的loading 的状态
        channel.finished = false //  频道的加载结束的状态
        channel.timestamp = null // 用于获取下一页的时间戳
        channel.pullDownLoading = false // 用来控制频道的下拉刷新 loading 值
      })
      this.channels = data.data.channels
    },
    async onLoad () {
    // 1. 请求加载文章列表
      const currentChannel = this.currentChannel
      const { data } = await getArticles({
        channelId: currentChannel.id,
        // 第一页传递最新的时间戳
        // 下一页数据传递上一页返回数据结果中的 pre_timestamp
        timestamp: currentChannel.timestamp || Date.now(),
        withTop: 1
      })

      const { pre_timestamp: preTimestamp, results } = data.data

      // 2. 将得到的文章列表添加到当前的频道中 articles 中
      currentChannel.articles.push(...results)

      //  3. 本次的 onLoad 数据加载完毕,
      currentChannel.loading = false

      // 4. 判断数据是否还有下一次数据
      if (!preTimestamp) {
        currentChannel.finished = true
      } else {
        // 还有数据，将本次得到的 preTimestamp 存储到当前频道，用于加载下一页数据
        currentChannel.timestamp = preTimestamp
      }
    },
    //  下拉 刷新时间
    async  onRefresh () {
      const currentChannel = this.currentChannel
      // 1. 请求加载文章列表
      const { data } = await getArticles({
        channelId: currentChannel.id,
        timestamp: Date.now(),
        withTop: 1
      })
      // 2. 将得到的文章数据添加到当前的频道中, aritcles (顶部) 中
      currentChannel.articles.unshift(...data.data.results)
      // 3.  关闭当前频道下拉刷新的loading 的状态
      currentChannel.pullDownLoading = false
      // 4. 给出提示消息
      this.$toast('刷新成功')
    }
  }

}
</script>

<style lang='less' scoped>

</style>
