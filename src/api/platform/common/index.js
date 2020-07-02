import request from '@/utils/request'
import { formatParams } from '@/utils/params'

/**
 * 获取脚本
 * @param {*} params
 */
export function getScriptValue(params) {
  return request({
    url: '/commonService/getScriptValue',
    method: 'post',
    dataType: 'json',
    data: formatParams(params)
  })
}

/**
 * 获取系统时间戳,避免本地修改系统时间
 */
export function getSystemTimestamp() {
  return request({
    url: '/commonService/getSystemTimestamp',
    method: 'get'
  })
}

/**
 * 启动定制化流程
 * @param data
 */
export function startCustomizeProcess(data) {
  return request({
    url: '/workOperService/startCustomizeProcess',
    method: 'post',
    mask: true,
    data: data
  })
}
/**
 * 完成流程
 * @param data
 */
export function completeProcess(data) {
  return request({
    url: '/workOperService/completeProcess',
    method: 'post',
    mask: true,
    data: data
  })
}
