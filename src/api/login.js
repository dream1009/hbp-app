import request from '@/utils/request'

/**
 *登录
 * @param {*} params
 */
export function login(params) {
  return request({
    url: '/loginService/appLogin',
    anonymous: true,
    mask: true,
    method: 'post',
    data: params
  })
}

/**
 * 后台登出
 */
export function logout() {
  return request({
    url: '/loginService/logout',
    anonymous: true,
    method: 'post'
  })
}

export function getCaptcha() {
  return request({
    url: '/login/getCaptcha',
    anonymous: true,
    method: 'get'
  })
}

/**
 * 微信登录
 * @param {*} params
 */
export function wcLogin(params) {
  return request({
    url: '/loginService/wcLogin',
    anonymous: true,
    mask: true,
    method: 'post',
    data: params
  })
}
/**
 * 免登录
 * @param {*} params
 */
export function apiToken4Free(params) {
  return request({
    url: '/loginService/apiToken4Free',
    anonymous: true,
    mask: true,
    method: 'post',
    data: params
  })
}

/**
 * 根据 userid 获取 token（钉钉登录专用）
 */
export function apiToken4DingTalk(params) {
  const { userid = '' } = params
  const reUrl = `/loginService/apiToken4DingTalk?userid=${userid}`
  return request({
    url: reUrl,
    anonymous: true,
    mask: true,
    method: 'get'
  })
}
