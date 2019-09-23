<template>
  <div class="login">
  <!-- 导航栏 -->
<van-nav-bar
  title="登录"
/>
<!-- ValidationProvider是验证插件提供的一个全局组件
 rules= secret是验证的规则
 v-slot={errors} 获取验证相关的参数
 errors[0] 用来获取验证失败的消息
  -->

    <!-- 验证示例代码 只能验证一个 -->
<!-- <ValidationProvider rules="required|email"  name='手机号'    v-slot="{ errors }">
  <input v-model="user.mobile" type="text">
  <span>{{ errors[0] }}</span>
</ValidationProvider> -->

 <!-- 登录表单
 ValidationObserver 会渲染成form表单
 可以通过ref 调用这个组件的方法 :validate 来进行 js 验证
 -->
<ValidationObserver tag="form" ref="loginForm">
  <!-- 需要验证的组件用 ValidationProvider 包裹起来
  在其上面配置相对的验证规则-->
  <ValidationProvider tag="div" name="手机号" rules="required|phone" v-slot="{ errors }">
  <van-field
       v-model="user.mobile"
        required
        clearable
        label="手机"
        placeholder="请输入手机号"
        :error-message="errors[0]" />
  </ValidationProvider>
  <ValidationProvider tag="div" name="验证码" rules="required" v-slot="{ errors }">
      <van-field
         v-model="user.code"
        type="password"
        label="验证码"
        placeholder="请输入验证码"
        required
          :error-message="errors[0]"
      />
  </ValidationProvider>
</ValidationObserver>

       <div class="login-btn">
           <van-button  type='info'  :loading="isLoginLoading"  @click="onLogin"    >登录</van-button>
       </div>
  </div>
</template>

<script>
import { login } from '@/api/user'

export default {
  name: 'LoginIndex',
  data () {
    return {
      user: {
        mobile: '',
        code: ''
      },
      isLoginLoading: false // 控制登录按钮的 loading 的状态
    }
  },
  methods: {
    async onLogin () {
      // 获取表单数据
      // 发送请求
      try {
        // 表单验证
        const isValid = await this.$refs.loginForm.validate()
        // 验证失败,则什么都不做
        if (!isValid) {
          return
        }
        // 验证通过提交表单
        this.isLoginLoading = true
        const res = await login(this.user)
        // 把返回的token 保存到vuex容器里
        this.$store.commit('setUser', res.data.data)
        this.$toast.success('登录成功!')
        this.$router.push('/')
      } catch (err) {
        if (err.response && err.response.status === 400) {
          this.$toast.fail('手机号或验证码错误')
        }
      }
      this.isLoginLoading = false // 不管登录成功与否都需要修改成false
    }
  }
}

</script>

<style  lang='less' scoped >
.login-btn{
    padding: 20px;
  .van-button{
      width: 100%;
  }
}
</style>
