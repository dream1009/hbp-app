import request from '@/utils/request'

export function getInfo(params) {
  return request({
    url: '/attachmentService/getInfo',
    method: 'get',
    params: params
  })
}

export function uploadFile(file) {
  const data = new FormData() // 创建form对象
  data.append('file', file)
  return request({
    url: '/uploadService/uploadFile',
    method: 'post',
    dataType: 'file',
    loadingText: 'saving',
    data: data
  })
}

export function listJson(params) {
  return request({
    url: '/attachmentService/listJsonByUser',
    method: 'post',
    dataType: 'json',
    data: params
  })
}

export function getImage(params) {
  return request({
    url: '/attachmentService/getImage',
    responseType: 'arraybuffer',
    isLoading: false,
    method: 'get',
    params
  })
}

export function getFile(params) {
  return request({
    url: '/attachmentService/getFile',
    responseType: 'arraybuffer',
    isLoading: false,
    method: 'get',
    params
  })
}
