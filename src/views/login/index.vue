<template>
  <div class="login">
    <div class="login-top">
      <h1>{{ $t('platform') }}</h1>
    </div>
    <h2 class="login-label">
      {{ $t('login.username') }}
    </h2>
    <van-field
      v-model="loginForm.username"
      v-validate="{ required: true}"
      :placeholder="$t('login.usernamePlaceholder')"
      :error="errors.has('username')"
      autocapitalize="off"
      autocorrect="off"
      clearable
      autofocus
      left-icon="user"
      name="username"
      @keyup.enter.native="handleLogin"
    />

    <h2 class="login-label">
      {{ $t('login.password') }}
    </h2>
    <van-field
      v-model="loginForm.password"
      v-validate="{ required: true}"
      :type="passwordType"
      :placeholder="$t('login.passwordPlaceholder')"
      :error="errors.has('password')"
      clearable
      left-icon="lock"
      name="password"
      @keyup.enter.native="handleLogin"
    >
      <van-icon
        slot="icon"
        :name="passwordType=='password'?'password-not-view':'password-view'"
        @click="showPassword"
      />
    </van-field>
    <h2 class="login-label">
      {{ $t('login.seccode') }}
    </h2>
    <van-field
      v-model="code"
      v-validate="{ required: true}"
      :placeholder="$t('login.code')"
      :error="errors.has('code')"
      clearable
      left-icon="home"
      name="code"
      @keyup.enter.native="handleLogin"
    >
      <van-button slot="button" type="primary" size="small" @click="createCode">{{checkCode}}</van-button>
    </van-field>

    <van-cell>
      <van-button
        type="primary"
        block
        @click.native="handleLogin"
      >
        {{ $t('login.logIn') }}
      </van-button>
    </van-cell>
    <div class="copyright">
      <a href="javascript:void(0)" @click="goHome()">{{ $t('company') }}</a>©{{ $t('login.copyright') }}
    </div>
  </div>
</template>

<script>
import store from '@/store' // store
import { setToken, setLoginFree } from '@/utils/auth'
const loginForm = process.env.NODE_ENV === 'development'
  ? {
    username: 'admin',
    password: '1'
  } : {
    username: '',
    password: ''
  }
export default {
  data() {
    return {
      passwordType: 'password',
      loginForm: {
        username: loginForm.username,
        password: loginForm.password
      },
      redirect: undefined,
      checkCode: '发送验证码',
      code: ''
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    let token = store.getters.token
    let path = '/'
    if (token) {
      path = '/dashboard'
      this.$router.push({ path: path })
    }
    token = this.getQueryString('token')
    const account = this.getQueryString('account')
    if (token) {
      setToken(token)
      setLoginFree(account)
      this.$store.dispatch('loginByToken', token).then(() => {
        if (this.redirect) {
          path = '/dashboard'
        }
        this.$router.push({ path: path })
      }).catch((e) => {
      })
    }
    this.createCode()
  },
  methods: {
    createCode() {
      let code = ''
      const codeLength = 4 // 验证码的长度
      const random = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
        'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'] // 随机数
      for (let i = 0; i < codeLength; i++) { // 循环操作
        const index = Math.floor(Math.random() * 36) // 取得随机数的索引（0~35）
        code += random[index] // 根据索引取得随机数加到code上
      }
      this.checkCode = code // 把code值赋给验证码
    },
    goHome() {
      window.location.href = 'http://www.ecitychina.com'
    },
    showPassword() {
      this.passwordType === ''
        ? (this.passwordType = 'password')
        : (this.passwordType = '')
    },
    handleLogin() {
      this.$validator.validateAll().then((result) => {
        if (result) {
          if (this.code !== this.checkCode) {
            this.$toast('验证码错误、注意大写字母')
            this.createCode()
            return
          }
          this.createCode()
          this.$store.dispatch('loginByUsername', this.loginForm).then(() => {
            let path = '/'
            if (this.redirect) {
              path = '/dashboard'
            }
            this.$router.push({ path: path })
          }).catch((e) => {
          })
        } else {
          this.$toast('请输入用户名、密码和验证码')
          this.createCode()
        }
      })
    },
    getQueryString(name) {
      const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
      const r = window.location.search.substr(1).match(reg)
      if (r != null) {
        return unescape(r[2])
      }
      return null
    }
  }
}
</script>

<style lang="scss" scoped>
.login{
  .login-top {
    padding-top:40px;
    text-align: center;
    .logo-icon {
      font-size: 60px;
      color: #3598dc;
    }
  }
  .login-label{
    margin: 0;
    font-weight: 500;
    font-size: 16px;
    color: #999;
    padding: 15px;
  }
  .copyright{
    position: absolute;
    left: 15px;
    right: 15px;
    display: table-cell;
    vertical-align: middle;
    text-align: center;
    bottom: 5px;
    font-weight: 400;
    font-size: 12px;
    color: #999;
  }
}
</style>
