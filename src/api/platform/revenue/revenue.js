import request from '@/utils/request'

// 拆表
export function chaibiaoHT(data) {
  return request({
    url: '/revenue/chaibiaoHT',
    method: 'post',
    mask: true,
    data: data
  })
}

// 换表
export function huanbiaoHT(data) {
  return request({
    url: '/revenue/huanbiaoHT',
    method: 'post',
    mask: true,
    data: data
  })
}

// 装表
export function zhuangbiaoHT(data) {
  return request({
    url: '/revenue/zhuangbiaoHT',
    method: 'post',
    mask: true,
    data: data
  })
}

// 移表
export function yibiaoHT(data) {
  return request({
    url: '/revenue/yibiaoHT',
    method: 'post',
    mask: true,
    data: data
  })
}

// 移表
export function waterNatureHT(data) {
  return request({
    url: '/revenue/waterNatureHT',
    method: 'post',
    mask: true,
    data: data
  })
}

// 拆表营收校验
export function chaibiaoVerify(data) {
  return request({
    url: '/revenue/chaibiaoVerify',
    method: 'post',
    mask: true,
    data: data
  })
}

// 换表营收校验
export function huanbiaoVerify(data) {
  return request({
    url: '/revenue/huanbiaoVerify',
    method: 'post',
    mask: true,
    data: data
  })
}

export function updateDataByBusKeyAndValue(data) {
  return request({
    url: '/workOperService/updateDataByBusKeyAndValue',
    method: 'post',
    mask: true,
    data: data
  })
}

// 调用营收接口
export function waterMeterBack(data) {
  return request({
    url: '/revenue/waterMeterBack',
    method: 'post',
    mask: true,
    data: data
  })
}

// 身份验证
export function checkIdCard(data) {
  return request({
    url: '/revenue/checkIdCard',
    method: 'post',
    mask: true,
    data: data
  })
}

// 人口数调整回传
export function peopleBack(data) {
  return request({
    url: '/revenue/peopleBack',
    method: 'post',
    mask: true,
    data: data
  })
}

// 查询开票数据
export function invoiceData(data) {
  return request({
    url: '/revenue/selectInvoiceDataBySbbh',
    method: 'post',
    mask: true,
    data: data
  })
}

export function selectYHXXBySShuiBiaoBH(data) {
  return request({
    url: '/revenue/selectYHXXBySShuiBiaoBH',
    method: 'post',
    mask: true,
    data: data
  })
}

export function arrearsInformation(data) {
  return request({
    url: '/revenue/arrearsInformation',
    method: 'post',
    mask: true,
    data: data
  })
}

export function createBill(data) {
  return request({
    url: '/workOperService/createBillUserService',
    method: 'post',
    mask: true,
    data: data
  })
}

/**
 * 查询水表状态
 * @param data
 */
export function queryWaterMeterState(data) {
  return request({
    url: '/revenue/queryWaterMeterState',
    method: 'post',
    mask: true,
    data: data
  })
}
