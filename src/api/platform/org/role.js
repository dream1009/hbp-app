import request from '@/utils/request'

export function getRoleById(params) {
  return request({
    url: '/roleService/loadById',
    method: 'get',
    params: params
  })
}

export function queryBySubSysIdOrName(params) {
  return request({
    url: '/roleService/queryBySubSysIdOrName',
    method: 'post',
    dataType: 'json',
    data: params
  })
}
