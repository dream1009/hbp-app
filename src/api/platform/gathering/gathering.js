import request from '@/utils/request'
/**
 * 支付二维码链接
 * @param {*} data
 */
export function payToQRCode(data) {
  return request({
    url: '/gatheringService/payToQRCode',
    method: 'post',
    mask: true,
    data: data
  })
}
/**
 * 订单状态
 * @param {*} data
 */
export function payToOrderState(data) {
  return request({
    url: '/gatheringService/queryGatheringState',
    method: 'post',
    mask: true,
    data: data
  })
}

/**
 * 微信、支付宝支付成功后调用更新订单状态
 * @param {*} data
 */
export function insertLogByXJ(data) {
  return request({
    url: '/gatheringService/insertLogByXJ',
    method: 'post',
    mask: true,
    data: data
  })
}

/**
 * 订单状态
 * @param {*} data
 */
export function updateToLogAndPayment(data) {
  return request({
    url: '/gatheringService/updateToLogAndPayment',
    method: 'post',
    mask: true,
    data: data
  })
}
