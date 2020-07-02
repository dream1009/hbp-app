import request from '@/utils/request'

/**
 * 出库
 * @param data
 */
export function outStock(data) {
  return request({
    url: '/materielService/outStock',
    method: 'post',
    mask: true,
    data: data
  })
}

/**
 * 退库
 * @param data
 */
export function cancelStock(data) {
  return request({
    url: '/materielService/cancelStock',
    method: 'post',
    mask: true,
    data: data
  })
}

/**
 * 退库
 * @param data
 */
export function signature(data) {
  return request({
    url: '/materielService/signature',
    method: 'post',
    mask: true,
    data: data
  })
}

/**
 * 生成退库单，并保存数据当前表单数据
 * @param data
 */
export function generateCancelStockBillAndSave(data) {
  return request({
    url: '/materielService/generateCancelStockBillAndSave',
    method: 'post',
    mask: true,
    data: data
  })
}

/**
 * 校验领料流程是否存在
 * @param data
 */
export function verifyReceProcess(data) {
  return request({
    url: '/materielService/verifyReceProcess',
    method: 'post',
    mask: true,
    data: data
  })
}
