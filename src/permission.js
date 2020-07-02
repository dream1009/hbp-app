import router from './router' // 路由
import store from './store' // store
import { getToken, getFirstTimeFlag, setAppParams } from '@/utils/auth' // 验权
import { getQueryString, validataWechat } from '@/utils/url' // 验权
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css' // Progress 进度条样式
// import Utils from '@/utils'
import I18n from '@/utils/i18n'

NProgress.configure({
  // NProgress Configuration 进度条配置
  showSpinner: false // 进度环
})

const isWechatLogin = process.env.VUE_APP_IS_WECHAT_LOGIN
const isOfficialAccount = process.env.VUE_APP_IS_OFFICIAL_ACCOUNT
const isDingTalkLogin = process.env.VUE_APP_IS_DINGTALK_LOGIN

const whiteList = ['/login', '/authredirect', '/rate', '/msg2task'] // 不重定向白名单

router.beforeEach(function(to, from, next) {
  NProgress.start() // start progress bar
  I18n.setTitle(to.name, to.params.title || to.meta.title) // 设置标题
  if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
    next()
  }
  if (!getFirstTimeFlag()) {
    setAppParams(to)
  }
  if (getToken()) { //  从cookie 获取用户token
    if (to.path === '/login' && store.getters.fullname) { // 登录
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      if (!store.getters.fullname) {
        store.dispatch('getUserInfo').then(res => { // 拉取用户信息
          next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
        }).catch(() => {
          NProgress.done() // 结束Progress
          store.dispatch('fedLogOut').then(() => {
            next({ path: '/' })
          })
        })
      } else {
        next()
      }
    }
  } else {
    const isWechat = validataWechat()
    if (isWechat && isWechatLogin && !from.name) {
      const redirect = getQueryString('redirect')
      const code = getQueryString('code')
      if (isOfficialAccount) { // 公众号模式
        store.dispatch('loginByWechatForOfficialAccount', { code: code }).then(res => { // 拉取用户信息
          if (redirect && redirect !== 'login') {
            next({ path: redirect })
          } else {
            next()
          }
        }).catch(() => {
          NProgress.done() // 结束Progress
          if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
            next()
          }
        })
      } else {
        store.dispatch('loginByWechat', { code: code }).then(res => { // 拉取用户信息
          if (redirect && redirect !== 'login') {
            next({ path: redirect })
          } else {
            next()
          }
        }).catch(() => {
          NProgress.done() // 结束Progress
          if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
            next()
          } else {
            next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
          }
        })
      }
    } else if (isDingTalkLogin && isDingTalkLogin === 'true') {
      store.dispatch('dingdLogin').then(res => {
        console.log(res)
        next()
      }).catch(() => {
        NProgress.done() // 结束Progress
        if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
          next()
        } else {
          next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
        }
      })
    } else {
      if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
        next()
      } else {
        next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
        NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
      }
    }
  }
})

router.afterEach(function(to) {
  NProgress.done() // 结束Progress
  store.commit('UPDATE_LOADING_STATUS', { isLoading: false })
  if (process.env.NODE_ENV === 'production') {
    // ga && ga('set', 'page', to.fullPath)
    // ga && ga('send', 'pageview')
  }
})
