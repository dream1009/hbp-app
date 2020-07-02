import request from '@/utils/request'

/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(data) {
  return request({
    url: '/bpmCommonStatmentService/query',
    method: 'post',
    dataType: 'json',
    data: data
  })
}
