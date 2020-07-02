import request from '@/utils/request'

export function queryChargeState(params) {
  return request({
    url: '/workOperService/queryChargeState',
    method: 'post',
    mask: true,
    data: params
  })
}

export function batchStartCustomizeProcess(params) {
  return request({
    url: '/workOperService/batchStartCustomizeProcess',
    method: 'post',
    mask: true,
    data: params
  })
}
