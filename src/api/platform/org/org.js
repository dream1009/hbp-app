import request from '@/utils/request'

export function queryByParentIdOrName(params) {
  return request({
    url: '/orgService/queryByParentIdOrName',
    method: 'post',
    dataType: 'json',
    data: params
  })
}

export function queryByParentId(params) {
  return request({
    url: '/orgService/queryByParentId',
    method: 'post',
    dataType: 'json',
    data: params
  })
}

export function getOrgById(params) {
  return request({
    url: '/orgService/loadById',
    method: 'get',
    params: params
  })
}
