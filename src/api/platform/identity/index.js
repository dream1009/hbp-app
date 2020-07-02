import request from '@/utils/request'

export function getData(params) {
  return request({
    url: '/identityService/getNextIdByAlias',
    method: 'get',
    params: params
  })
}
