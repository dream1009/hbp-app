
import request from '@/utils/request'

/**
 * 获取脚本
 * @param {*} params
 */
export function closeBillList(params) {
  return request({
    url: '/workOperService/closeWorkList',
    method: 'post',
    mask: true,
    data: params
  })
}
