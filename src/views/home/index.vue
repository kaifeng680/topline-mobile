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
     <!-- 文章列表 -->
  <van-list
  v-model="loading"
  :finished="finished"
  finished-text="没有更多了"
  @load="onLoad"
>
  <van-cell
    v-for="item in channel.articles"
    :key="item"
    :title="item"
  />
</van-list>
</van-tab>
</van-tabs>

  </div>
</template>

<script>
import { getAllChannels } from '@/api/channel'
export default {
  name: 'HomeIndex',
  data () {
    return {
      active: 2, // 控制当前激活的标签页
      channels: [], // 频道列表
      list: [],
      loading: false,
      finished: false
    }
  },
  // 计算属性
  computed: {
  //  获取到文章列表的active
    currentChannel () {
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
      // 为每个频道初始化一个成员,articles 用来储存该频道的文章列表
      data.data.channels.forEach(channel => {
        channel.articles = []
      })
      this.channels = data.data.channels
    },
    onLoad () {
      // 异步更新数据
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          // 将数据添加到当前频道的,文章列表中
          // this.list.push(this.list.length + 1);
          const articles = this.currentChannel.articles
          articles.push(articles.length + 1)
        }
        // 加载状态结束
        this.loading = false

        // 数据全部加载完成
        if (this.list.length >= 20) {
          this.finished = true
        }
      }, 500)
    }
  }

}
</script>

<style lang='less' scoped>

</style>
