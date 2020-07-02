import request from '@/utils/request'

export function getTreeDataByScriptValue(params) {
  return request({
    url: '/entityService/getTreeDataByScriptValue',
    method: 'post',
    data: params
  })
}
