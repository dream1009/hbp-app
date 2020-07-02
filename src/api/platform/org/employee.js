import request from '@/utils/request'

export function getUserDetail() {
  return request({
    url: '/employeeService/get',
    method: 'get'
  })
}

export function getUserList(params) {
  return request({
    url: '/employeeService/listJson',
    method: 'post',
    dataType: 'json',
    data: params
  })
}

export function getUserById(params) {
  return request({
    url: '/userService/loadById',
    method: 'get',
    params: params
  })
}

export function queryByOrgIdOrName(params) {
  return request({
    url: '/employeeService/queryByOrgIdOrName',
    method: 'post',
    dataType: 'json',
    data: params
  })
}
