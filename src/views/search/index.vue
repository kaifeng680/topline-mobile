<template>
  <div class="search">
  <!-- 搜索框 -->
 <form action="/">
  <van-search
    v-model="searchText"
    placeholder="请输入搜索关键词"
    show-action
    @search="onSearch(searchText)"
    @cancel="onCancel"
  />
  </form>
  <!-- /搜索框 -->
   <!-- 联想建议 -->
<van-cell-group v-if="searchText">
  <van-cell
   icon="search"
   v-for="item in suggestions"
   :key="item"
   @click="onSearch(item)"
   >
   <!-- 如果绑定的数据中有html标签 则当成字符串处理  如果要渲染出来需要 v-html-->
   <!--
      如果这里是 {{}} 绑定，那建议使用过滤器来处理渲染成其它内容，不影响数据本身
      但是，过滤器只能用于 {{}}、v-bind
      实现方式：使用函数就可以了
        -->
   <div slot="title" v-html="highLight(item)"></div>
   </van-cell>
</van-cell-group>
   <!-- /联想建议 -->
   <!-- 历史纪录 -->
 <van-cell-group v-else>
    <van-cell title="历史纪录" >
      <template     v-if="isDeleteShow">
      <span style="margin:10px"  @click="searchHistories=[]" > 全部删除 </span>
      <span  @click="isDeleteShow=false" > 完成</span>
      </template>
      <!-- 使用 right-icon 插槽来自定义右侧图标 -->
      <van-icon
        v-else
        slot="right-icon"
        name="delete"
        style="line-height: inherit;"
          @click="isDeleteShow=true"
      />
    </van-cell>
     <van-cell v-for="(item,index) in searchHistories"
     :key="item"
     :title="item"
      @click="onSearch(item)" >
        <van-icon
        slot="right-icon"
        name="close"
        style="line-height: inherit;"
        v-show="isDeleteShow"
        @click="searchHistories.splice(index,1)"
      />

     </van-cell>
  </van-cell-group>
   <!-- /历史纪录 -->
  </div>
</template>

<script>
import { getSuggestions } from '@/api/search'
import { getItem, setItem } from '@/utils/storage'
import { debounce } from 'lodash'

export default {
  name: 'SearchIndex',
  data () {
    return {
      searchText: '',
      suggestions: [],
      isDeleteShow: false,
      searchHistories: getItem('search-histories') || [] // 搜索历史纪录
    }
  },
  // 监视属性
  // 只有在当前页面才可以监视
  watch: {
    // 当文本框发生变化时要执行的函数
    // async searchText (newValue)
    // 默认执行方式：立即执行，且立即执行
    // 函数防抖完成 debounce（函数，时间）
    searchText: debounce(async function (newValue) {
    // 判断非空
      if (!newValue.length) {
        return
      }
      // 请求数据
      const { data } = await getSuggestions(newValue)

      const options = data.data.options

      // 处理
      // options.forEach((item,index)=>{
      //   //  /newValue/ 这样是吧newvalue 当字符串使用了
      //   // 正则表达式两种创建方式
      //   // 方式1 /xxx/
      //   // 方式2 new RegExp('字符串匹配')
      //   const reg = new RegExp(newValue,'gi')
      //   options[index] = item.replace( reg ,`<span style='color:red'>${newValue}</span>` )
      // })

      this.suggestions = options
    }, 1000),
    searchHistories (newValue) {
      // 当数据发生改变，重新保存到本地存储
      setItem('search-histories', newValue)
    }
  },
  methods: {
    onSearch (q) {
    // 跳转到搜索页面
      if (!q.trim().length) {
        return
      }

      // 记录历史记录
      const searchHistories = this.searchHistories

      const index = searchHistories.findIndex(item => {
        // 忽略空格、大小写
        return item.trim().toLowerCase() === q.trim().toLowerCase()
      })

      // 如果已存在,则将其移除
      if (index !== -1) {
        searchHistories.splice(index, 1)
      }
      // 在添加到顶部
      searchHistories.unshift(q)
      // 监视不是立即发生的，只有等函数执行完才去判断数据有没有改变

      // 虽然通过监视数据来处理数据的持久化 但是这里要手动储存一下这个数据
      // 因为后面的函数会执行跳转，页面跳转会销毁当前页面(事件，watch，生命周期都被干掉了)
      // 然后在加载新的页面

      setItem('search-histories', searchHistories)

      // 跳转到搜索结果页面
      // 路由跳转，会先销毁当前页面，然后在加载新的页面
      this.$router.push({
        name: 'search-result',
        params: {
          q
        }
      })
    },
    onCancel () {},
    highLight (str) {
      const reg = new RegExp(this.searchText, 'gi')
      return str.replace(reg, `<span style='color:red'>${this.searchText}</span>`)
    }
  }
}
</script>

<style>
</style>
