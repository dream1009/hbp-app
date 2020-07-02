/**
 * 实现全局的请求 loading
 * 参考文章
 * https://www.jianshu.com/p/c66adc327553
 * 参考代码 https://github.com/woodccc/axios-global-loading-demo/blob/master/frontend/src/api/axiosInitHelper.js
 */
import LcToast from '@/components/Toast'
import _ from 'lodash'

let needLoadingRequestCount = 0
let loading

/**
 * 加载
 * @param {*} config
 */
function startLoading(config = {}) {
  loading = LcToast.loading({
    mask: config.mask || false,
    forbidClick: config.forbidClick || true,
    duration: config.duration,
    message: config.message
  })
}

/**
 * 清除loaing
 */
function clearLoading() {
  loading.clear()
}

const tryClearLoading = () => {
  if (needLoadingRequestCount === 0) {
    clearLoading()
  }
}

export function showFullScreenLoading(config) {
  if (needLoadingRequestCount === 0) {
    startLoading(config)
  }
  needLoadingRequestCount++
}

export function tryHideFullScreenLoading() {
  if (needLoadingRequestCount <= 0) return
  needLoadingRequestCount--
  if (needLoadingRequestCount === 0) {
    _.debounce(tryClearLoading, 100)()
  }
}
