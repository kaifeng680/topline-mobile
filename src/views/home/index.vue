<template>
  <div class="home">
    <!-- 导航栏 -->
    <van-nav-bar  fixed >
     <van-button
      class="search-btn"
      slot="title"
      round
      type="info"
      size="small"
      @click="$router.push('/search')"
     > 搜索</van-button>
    </van-nav-bar>
    <!-- 频道列表 -->
    <van-tabs v-model="active">
      <van-tab v-for="channel in channels " :key="channel.id" :title="channel.name">
        <!-- 下拉刷新组件   -->
        <van-pull-refresh v-model="channel.pullDownLoading" @refresh="onRefresh">
          <!-- 文章列表 -->
          <van-list
            v-model="channel.loading"
            :finished="channel.finished"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <!-- 具体内容 -->
            <van-cell
              v-for="article in channel.articles"
              :key="article.art_id.toString()"
              :title="article.title"
              @click="$router.push({
                name:'article',
                params:{
                  articleId:article.art_id.toString()
                }
              })"
            >
              <div slot="label">
                <van-grid :border="false" :column-num="3">
                  <van-grid-item v-for="(img, index) in article.cover.images" :key="index">
                    <van-image height="80" :src="img" lazy-load />
                  </van-grid-item>
                </van-grid>
                <div class="article-info">
                  <div class="meta">
                    <span>{{ article.aut_name }}</span>
                    <span>{{ article.comm_count }}评论</span>
                    <span>{{ article.pubdate | relativeTime }}</span>
                  </div>
                  <van-icon name="close" />
                </div>
              </div>
            </van-cell>
          </van-list>
        </van-pull-refresh>
      </van-tab>
      <!-- 面包按钮 -->
      <div slot="nav-right" class="wap-nav" @click="isChannelEditShow = true">
        <van-icon name="wap-nav" size="24" />
      </div>
    </van-tabs>
    <!-- 编辑频道弹层 -->
    <van-popup
      v-model="isChannelEditShow"
      round
      position="bottom"
      :style="{ height: '92%' }"
      close-icon-position="top-left"
    >
    <!-- 关闭按钮 -->
    <van-cell icon="cross" :border="false" @click="isChannelEditShow=false"  />
     <!-- 我的频道 -->
        <div>
            <van-cell title="我的频道">
          <van-button type="danger"
            size="mini"
            round
             plain
            @click="isEdit=!isEdit"
            >{{isEdit? '完成':'编辑'}}</van-button>
            </van-cell>
          <van-grid :gutter="10">
            <van-grid-item
            v-for="(channel,index) in channels"
            :key="channel.id"
            :text="channel.name"
            @click="onUserChannelClick(channel,index)"
            >
            <van-icon slot="icon"
            class="close-icon"
             name="close"
            v-show="isEdit"
             ></van-icon>
            </van-grid-item>
          </van-grid>
        </div>
      <!-- /我的频道 -->
      <!-- 频道推荐 -->
        <div>
            <van-cell title="频道推荐">
            </van-cell>
          <van-grid :gutter="10">
            <van-grid-item
              v-for="channel in remainingchannels"
              :key="channel.id"
              :text='channel.name'
              @click="onAddChannel(channel)"
            />
          </van-grid>
        </div>
      <!-- /频道推荐 -->
    </van-popup>
  </div>
</template>

<script>
import { getAllChannels,
  getUserOrDefaultChannels,
  resetUserChannels,
  deleteUserChannel
} from '@/api/channel'
import { getArticles } from '@/api/article'
import { mapState } from 'vuex'
import { getItem, setItem } from '@/utils/storage'
export default {
  name: 'HomeIndex',
  data () {
    return {
      active: 0, // 控制当前激活的标签页
      channels: [], // 频道列表
      allchannels: [], // 全部频道
      isChannelEditShow: false, // 控制编辑频道的编辑和隐藏
      isEdit: false
    }
  },
  // 计算属性
  computed: {
    ...mapState(['user']),
    //  获取到文章列表的active
    currentChannel () {
      // active 是动态的，active 改变也就意味着 currentChannel 也改变了
      return this.channels[this.active]
    },
    /**
     * 获取剩余频道
     */
    remainingchannels () {
      // 剩余频道= 总频道 -我的频道
      const channels = []
      this.allchannels.forEach(channel => {
        /**  如果我的频道不包含当前遍历频道，那它就是剩余的频道
           find 方法：遍历数组，查找满足 item.id === channel.id 的元素，找到就返回该元素
           如果直到遍历结束都没有，则返回 undefined */
        const index = this.channels.findIndex(item => item.id === channel.id)
        if (index === -1) {
          channels.push(channel)
        }
      })
      return channels
    }
  },
  //  钩子函数
  created () {
    this.loadUserOrDefaultChannels()
    this.loadAllchannels() // 获取所有频道
  },
  methods: {
    async loadUserOrDefaultChannels () {
      // 开始没有考虑频道管理的事情,为了简单获取了所有的频道列表
      // const { data } = await getAllChannels()

      // 频道列表业务
      let channels = []
      //  1 如果用户已经登录,则发送请求获得后端储存的用户频道列表
      if (this.user) {
        const { data } = await getUserOrDefaultChannels()
        channels = data.data.channels
      } else {
        //  2 如果没有登录,则查看本地储存如果没有,就返回默认的列表
        const localChannel = getItem('channels')
        // 2.1 如果本地储存有,则获取使用
        if (localChannel) {
          channels = localChannel
        } else {
        // 2.2  如果本地储存没有, 则请求获取默认推荐的列表
          const { data } = await getUserOrDefaultChannels()
          channels = data.data.channels
        }
      }
      //  定制频道的内容数据
      //   channels.forEach(channel => {
      //   channel.articles = [] // 当前频道的文章列表
      //   channel.loading = false // 频道的上拉加载更多的loading 的状态
      //   channel.finished = false //  频道的加载结束的状态
      //   channel.timestamp = null // 用于获取下一页的时间戳
      //   channel.pullDownLoading = false // 用来控制频道的下拉刷新 loading 值
      // })
      channels.forEach(channel => {
        const extendDate = this.extendChannelData()
        // 把 extendData 合并到 channel 中
        Object.assign(channel, extendDate)
      })
      this.channels = channels
    },
    // 获取全部频道信息
    async  loadAllchannels () {
      const { data } = await getAllChannels()
      const channels = data.data.channels
      //  定制频道的内容数据
      //  每个频道初始化一个成员,需要添加articles用来储存文章列表
      //   channels.forEach(channel => {
      //   channel.articles = [] // 当前频道的文章列表
      //   channel.loading = false // 频道的上拉加载更多的loading 的状态
      //   channel.finished = false //  频道的加载结束的状态
      //   channel.timestamp = null // 用于获取下一页的时间戳
      //   channel.pullDownLoading = false // 用来控制频道的下拉刷新 loading 值
      // })
      channels.forEach(channel => {
        const extendDate = this.extendChannelData()
        // 把 extendData 合并到 channel 中
        Object.assign(channel, extendDate)
      })

      this.allchannels = channels
    },
    // 添加频道
    async  onAddChannel (channel) {
      // 已登录：请求保存到后端
      this.channels.push(channel)
      // 持久化
      if (this.user) {
        const channels = []
        // 处理提取要重置的频道列表
        // this.channels.slice(1) 不包括第1个频道（推荐）
        this.channels.slice(1).forEach((item, index) => {
          channels.push({
            id: item.id,
            seq: index + 2
          })
        })
        //  请求重置
        await resetUserChannels(channels)
      } else {
        // 未登录: 本地存储
        setItem('channels', this.channels)
      }
    },
    /**
     * 我的频道中的点击处理函数
     */
    async onUserChannelClick (channel, index) {
      // 如果是编辑状态,删除频道
      if (this.isEdit) {
        // 删除频道
        this.channels.splice(index, 1) // 将数据从视图中移除
        // 持久化
        if (this.user) {
          // 已登录，请求删除
          await deleteUserChannel(channel.id)
        } else {
          // 未登录，删除本地存储
          // 注意：本地存储中的数据无法像操作 js 数据成员一样来修改
          //      如果想要修改，则重新存储实现修改
          setItem('channels', this.channels)
        }
      } else {
        // 非编辑状态,则切换频道
        // 让频道切换至点击的那个频道
        this.active = index
        // 关闭弹层
        this.isChannelEditShow = false
      }
    },
    // 自定义扩展频道数据
    extendChannelData () {
      return {
        articles: [],
        loading: false,
        finished: false,
        timestamp: null,
        pullDownLoading: false
      }
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
    async onRefresh () {
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
.home {
  .van-tabs {
    /deep/ .van-tabs__content {
      margin-bottom: 50px;
      margin-top: 90px;
    }
    /deep/ .van-tabs__wrap {
      position: fixed;
      top: 46px;
      z-index: 2;
      left: 0;
      right: 0;
    }
  }

  .article-info {
    .meta span {
      margin-right: 10px;
    }
  }

  .wap-nav {
    position: sticky;
    right: 0;
    display: flex;
    align-items: center;
    background-color: #fff;
    opacity: 0.8;
  }
  .close-icon{
    position:absolute;
    top:-5px;
    right:-5px;
  }
  .search-btn{
    width: 100%;
    background: #5babfb
  }
}
</style>
