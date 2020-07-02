import request from '@/utils/request'

export function getTypeList(params) {
  return request({
    url: '/typeService/listJson',
    method: 'get',
    params: params
  })
}

export function getTypes(params) {
  return request({
    url: '/typeService/getTypes',
    method: 'get',
    params: params
  })
}

export function getByCatKeyPid(params) {
  return request({
    url: '/typeService/getByCatKeyPid',
    method: 'get',
    params: params
  })
}

export function getType(params) {
  return request({
    url: '/typeService/getType',
    method: 'get',
    params: params
  })
}

