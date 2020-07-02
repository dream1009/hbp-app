import request from '@/utils/request'

export function normalPassJson(params) {
  return request({
    url: '/bpmInstHisService/normalPassJson',
    method: 'post',
    dataType: 'json',
    isLoading: true,
    data: params
  })
}

export function normalPassJsonByScriptValue(params) {
  return request({
    url: '/bpmInstHisService/normalPassJsonByScriptValue',
    method: 'post',
    dataType: 'json',
    isLoading: true,
    data: params
  })
}

