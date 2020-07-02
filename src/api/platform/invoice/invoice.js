import request from '@/utils/request'

export function invoiceHandle(params) {
  return request({
    url: '/invoiceService/invoiceHandle',
    method: 'post',
    mask: true,
    data: params
  })
}
