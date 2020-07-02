/**
 * 和服务端进行交互
 *  它封装了全局 request拦截器、respone拦截器、统一的错误处理、统一做了超时，baseURL设置等
 * <pre>
 * 作者:hugh zhuang
 * 邮箱:3378340995@qq.com
 * 日期:2015-11-02-下午3:29:34
 * 版权:广州流辰信息技术有限公司
 * </pre>
 */
import axios from 'axios'
import { Dialog, Toast } from 'vant'
import router from '@/router' // 路由
import store from '@/store'
import i18n from '@/utils/i18n' // Internationalization 国际化
import { getToken, getLoginFree, getRedirectApi } from '@/utils/auth'
import { getApi } from '@/utils/url'
import utils from '@/utils'
import { showFullScreenLoading,
  tryHideFullScreenLoading } from './loading'
import qs from 'qs'
import vueBridgeWebView from './bridgeWebview'
// 加载动画
//const BASE_URL = process.env.VUE_APP_BASE_API
const BASE_URL = window.config.BASE_URL
const TIMEOUT = window.config.TIME_OUT// 请求timeout 时间
const TOKEN_KEY = process.env.VUE_APP_TOKEN_KEY
const ANONYMOUS_API_KEY = process.env.VUE_APP_ANONYMOUS_API_KEY
const API_KEY = process.env.VUE_APP_API_KEY
const LOGIN_FREE_FLAG = process.env.VUE_APP_LOGIN_FREE
/**
 * 创建axios实例
 */
const service = axios.create({
  baseURL: BASE_URL, // api的base_url
  timeout: TIMEOUT, // request timeout
  withCredentials: true, //  跨域安全策略
  headers: {
    'Content-Type': 'charset=utf-8'
  }
})

/**
 * 请求(request)拦截器
 *
 *  get 请求  统一参数放在params里面 // 后台对应只有@RequestParam
 *      // `params` 是即将与请求一起发送的 URL 参数
 *     // 必须是一个无格式对象(plain object)或 URLSearchParams 对象
 *  post 请求 统一参数放在data里面    // json 格式 后台对应@RequestBody ,其他 后台对应@RequestParam
 *   === // `data` 是作为请求主体被发送的数据
 *     // 只适用于这些请求方法 'PUT', 'POST', 和 'PATCH'
 *    // 在没有设置 `transformRequest` 时，必须是以下类型之一：
 *    // - string, plain object, ArrayBuffer, ArrayBufferView, URLSearchParams
 *     // - 浏览器专属：FormData, File, Blob
 *     // - Node 专属： Stream
 *   ==// `params`  这个同get 但要注意  后台对应@RequestParam 请求的头是 application/x-www-form-urlencoded 用 qs.stringify 去构造数据
 */
service.interceptors.request.use(config => {
  config.isLoading = utils.isEmpty(config.isLoading) ? true : config.isLoading
  if (config.isLoading) {
    showFullScreenLoading({
      mask: config.mask || false,
      duration: TIMEOUT,
      message: i18n.t(config.loadingText || 'loading')
    })
  }

  // 处理前缀,匿名接口加入匿名前缀
  let prefix = API_KEY
  if (config.anonymous) {
    prefix = ANONYMOUS_API_KEY || ''
  }
  config.baseURL = getApi(config.baseURL, getRedirectApi())
  config.baseURL += prefix

  // 处理token
  if (getToken()) {
    config.headers[TOKEN_KEY] = getToken() // 让每个请求携带token-- ['X-Token']为自定义key
  }
  // 是否免登录
  if (getLoginFree()) {
    config.headers[LOGIN_FREE_FLAG] = getLoginFree()
  }

  // 处理请求头,这个是个坑了 请求的头是 application/x-www-form-urlencoded 用 qs.stringify 去构造数据
  if (config.method === 'post') {
    if (config.dataType === 'json') { // json 格式 后台对应@RequestBody
      config.headers['Content-Type'] = 'application/json'
    } else if (config.dataType === 'file') { // 附件处理
      config.headers['Content-Type'] = 'multipart/form-data'
    } else { // 后台对应@RequestParam
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
      config.data = qs.stringify(config.data)
    }
    config.headers.post['Content-Type'] = config.headers['Content-Type']
  }
  return config
}, error => {
  tryHideFullScreenLoading()
  // Do something with request error
  console.error('request' + error) // for error
  Promise.reject(error)
})

/**
 * 响应(respone)拦截器
 */
service.interceptors.response.use(response => {
  tryHideFullScreenLoading()
  if (response.config.responseType === 'arraybuffer') { // buffer 数据
    return response
  }
  const data = response.data
  // state为非200是抛错
  const state = data.state
  if (state !== 200) {
    // 6020201:非法的token;6020202:其他客户端登录了;6020203:Token 过期了;
    if (state === 6020201 || state === 6020102 || state === 6020203) {
      if (!router.history.current.name) {
        router.push({ path: '/login' })
        return
      }
      if (router.history.current.name === 'login') {
        return
      }
      Dialog.confirm({
        title: i18n.t('error.logout.title'),
        message: i18n.t('error.logout.message'),
        confirmButtonText: i18n.t('error.logout.confirmButtonText'),
        cancelButtonText: i18n.t('error.logout.cancelButtonText'),
        showCancelButton: false
      }).then(() => {
        store.dispatch('fedLogOut').then(() => {
          utils.reload()// 为了重新实例化vue-router对象 避免bug
        })
        // router.push({ path: '/login' })
        vueBridgeWebView.callHandler('getLogOut', '', (callbackData) => {
        })
        return
      })
    } else { // 错误处理
      if (state === 2) { // 警告自己处理
        const err = new Error(data.message, data.cause)
        err.state = state
        err.cause = data.cause
        return Promise.reject(err)
      } else {
        let message = ''
        const hasKey = i18n.te('error.state.' + state)// 错误编码
        if (hasKey) {
          message = i18n.t('error.state.' + state)
        } else if (utils.isNotEmpty(data.message)) {
          message = utils.isNotEmpty(data.cause) ? i18n.t('error.messageCause', {
            message: data.message,
            cause: data.cause
          }) : i18n.t('error.message', {
            message: data.message
          })
        } else if (utils.isNotEmpty(data.cause)) {
          message = i18n.t('error.cause', {
            cause: data.cause
          })
        } else {
          message = data.message || i18n.t('error.unknown', {
            result: state
          })
        }

        Dialog.alert({
          message: `<div class="lc-error-messsage">${message}</div>`
        })
      }
      const err = new Error(data.message)
      err.state = state
      err.cause = data.cause
      return Promise.reject(err)
    }
  } else {
    return data
  }
},
// 异常处理
error => {
  tryHideFullScreenLoading()
  console.error('err' + error) // for error
  if (error && error.response) {
    error.message = i18n.t('error.' + error.response.status, {
      url: error.response.config.url
    })
  } else {
    error.state = 500
    error.message = i18n.t('error.network') // '服务器君开小差了，请稍后再试'
  }
  Toast({
    message: error.message || i18n.t('error.network'),
    type: 'fail',
    duration: 5 * 1000
  })
  return Promise.reject(error)
}
)

export default service
