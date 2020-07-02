import request from '@/utils/request'

export function getQrCodeUrl(params) {
  return request({
    url: '/payController/getWXandZFBqrCodeUrl',
    method: 'get',
    params: params
  })
}
