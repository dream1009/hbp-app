import request from '@/utils/request'

export function findAll() {
  return request({
    url: '/subSysService/getAllSubSys',
    method: 'get'
  })
}
