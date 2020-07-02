import request from '@/utils/request'
// 退款
export function refound(data) {
  return request({
    url: '/refoundService/refound',
    method: 'post',
    mask: true,
    data: data
  })
}
