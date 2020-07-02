import request from '@/utils/request'

export function getFormDataByKey(params) {
  return request({
    url: '/formDefService/getByKey',
    method: 'get',
    params: params
  })
}
// export function getScriptValue(params) {
//   return request({
//     url: '/formDef/getScriptValue',
//     method: 'POST',
//     dataType: 'json',
//     data: params
//   })
// }
