import request from '@/utils/request'

export function selectOperLog(params) {
  return request({
    url: '/operLogService/selectOperLog',
    method: 'get',
    params: params
  })
}
