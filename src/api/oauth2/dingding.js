import axios from 'axios'
import * as dd from 'dingtalk-jsapi'
import { dingTalkParams } from '@/constants/dingding'

/**
 * 获取钉钉授权码
 */

export function getDingTalkCord() {
  const corpId = dingTalkParams.CORPID
  return new Promise(resolve => {
    dd.ready(() => {
      dd.runtime.permission.requestAuthCode({
        corpId,
        onSuccess: (info) => {
          resolve(info.code)
        }
      })
    })
  })
}

/**
 * appkey 和 appSecret 获取 token
 */

export function getDingTalkToken() {
  const appkey = dingTalkParams.APP_KEY
  const appsecret = dingTalkParams.APP_SECRET
  const baseUrl = dingTalkParams.BASE_API
  const data = {
    appkey,
    appsecret
  }

  // 这个地方不使用系统封装的 request ，因为要使用钉钉 api 进行转发
  return axios.get(baseUrl + '/gettoken', {
    params: data
  })
}

/**
 * 获取钉钉用户的 userid
 * @param {object} params
 * @param {string} params.token 通过钉钉 appkey 和 appscret 获取的 token
 * @param {string} params.code 钉钉授权码
 */
export function getUserId(params) {
  const baseUrl = dingTalkParams.BASE_API
  const data = {
    access_token: params.token,
    code: params.code
  }
  return axios.get(baseUrl + '/user/getuserinfo', {
    params: data
  })
}

/**
 * 获取钉钉用户详情
 * @param {object} params 参数
 * @param {String} params.token 通过钉钉 appkey 和 appscret 获取的 token
 * @param {string} params.userid 钉钉用户 id
 */
export function getUserInfos(params) {
  const baseUrl = dingTalkParams.BASE_API
  const data = {
    access_token: params.token,
    userid: params.userid
  }

  return axios.get(baseUrl + '/user/get', {
    params: data
  })
}
