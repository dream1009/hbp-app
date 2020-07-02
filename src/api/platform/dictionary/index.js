import request from '@/utils/request'

export function getData(params) {
  return request({
    url: '/dictionaryService/getDicByType',
    method: 'get',
    params: params
  })
}
export function getDatas(params) {
  return request({
    url: '/dictionaryService/getDicByTypes',
    method: 'get',
    params: params
  })
}
