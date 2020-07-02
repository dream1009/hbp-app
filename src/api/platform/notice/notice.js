import request from '@/utils/request'

export function noticeList(params) {
  return request({
    url: '/newsService/list',
    method: 'post',
    dataType: 'json',
    data: params
  })
}

export function getNotice(params) {
  return request({
    url: '/newsService/getNews',
    method: 'get',
    params: params
  })
}

export function removeNotice(params) {
  return request({
    url: '/newsService/removeNews',
    method: 'get',
    params: params
  })
}

export function saveNotice(params) {
  return request({
    url: '/newsService/saveNews',
    method: 'post',
    data: params
  })
}
