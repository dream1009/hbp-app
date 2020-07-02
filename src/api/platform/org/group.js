import request from '@/utils/request'

export function queryGroups(params) {
  return request({
    url: '/groupService/findAll',
    method: 'get',
    dataType: 'json'
  })
}

export function getGroupById(params) {
  return request({
    url: '/groupService/loadById',
    method: 'get',
    params: params
  })
}
