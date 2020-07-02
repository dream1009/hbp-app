import request from '@/utils/request'

export function queryByParentId(params) {
  return request({
    url: '/positionService/queryByParentId',
    method: 'post',
    dataType: 'json',
    data: params
  })
}

export function getPositionById(params) {
  return request({
    url: '/positionService/loadById',
    method: 'get',
    params: params
  })
}
/**
 * 获取制定用户岗位列表
 * @param {*} params
 */
export function getPositionByUserId(params) {
  return request({
    url: '/positionService/findByUserId',
    method: 'get',
    params: params
  })
}
