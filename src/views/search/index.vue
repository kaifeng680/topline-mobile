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
<van-cell-group>
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
 <van-cell-group>
    <van-cell title="历史纪录" >
      <span style="margin:10px"> 全部删除 </span>
      <span> 完成</span>
      <!-- 使用 right-icon 插槽来自定义右侧图标 -->
      <van-icon
        slot="right-icon"
        name="delete"
        style="line-height: inherit;"
      />
    </van-cell>
     <van-cell v-for="value in 5" :key="value" title="hello" >
        <van-icon
        slot="right-icon"
        name="close"
        style="line-height: inherit;"
      />

     </van-cell>
  </van-cell-group>
   <!-- /历史纪录 -->
  </div>
</template>

<script>
import { getSuggestions } from '@/api/search'

export default {
  name: 'SearchIndex',
  data () {
    return {
      searchText: '',
      suggestions: []
    }
  },
  // 监视属性
  watch: {
    async searchText (newValue) {
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
    }
  },
  methods: {
    onSearch (q) {
    // 跳转到搜索页面
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
