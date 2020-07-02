import request from '@/utils/request'

export function getUserInfo() {
  return request({
    url: '/userService/loadUser',
    method: 'get'
  })
}

export function dialogUserJson4Org(data) {
  return request({
    url: '/userService/dialogUserJson4Org',
    method: 'post',
    dataType: 'json',
    data: data
  })
}

export function dialogUserJson4Post(data) {
  return request({
    url: '/userService/dialogUserJson4Post',
    method: 'post',
    dataType: 'json',
    data: data
  })
}

export function dialogUserJson4Role(data) {
  return request({
    url: '/userService/dialogUserJson4Role',
    method: 'post',
    dataType: 'json',
    data: data
  })
}

export function dialogUserJson4Group(data) {
  return request({
    url: '/userService/dialogUserJson4Group',
    method: 'post',
    dataType: 'json',
    data: data
  })
}

export function changePwd(data) {
  return request({
    url: '/userMgrService/changePassword',
    method: 'post',
    data: data
  })
}
