import request from '@/utils/request'

export function getByKey(params) {
  return request({
    url: '/dataTemplateService/getByKey',
    method: 'get',
    params: params
  })
}

export function getById(params) {
  return request({
    url: '/dataTemplateService/getById',
    method: 'get',
    params: params
  })
}

export function queryDataJson(params) {
  return request({
    url: '/dataTemplateService/queryDataJson',
    method: 'post',
    dataType: 'json',
    isLoading: false,
    data: params
  })
}

export function queryDataTableJson(params) {
  return request({
    url: '/dataTemplateService/queryDataTableJson',
    method: 'post',
    isLoading: false,
    data: params
  })
}

export function getDataById(params) {
  return request({
    url: '/dataTemplateService/getDataById',
    method: 'get',
    params: params
  })
}

/**
 * 获取联动数据
 * @param {*} params
 */
export function getLinkDataByKey(params) {
  return request({
    url: '/dataTemplateService/getLinkDataByKey',
    method: 'get',
    params: params
  })
}

/**
 * 获取表单数据
 * @param {*} params
 */
export function getFormData(params) {
  return request({
    url: '/dataTemplateService/getFormData',
    method: 'get',
    params: params
  })
}

/**
 * 保存表单数据
 * @param {*} params
 */
export function saveFormData(params) {
  return request({
    url: '/dataTemplateService/saveFormData',
    method: 'post',
    mask: true,
    loadingText: 'saving',
    data: params
  })
}

/**
 * 删除表单数据
 * @param {*} params
 */
export function removeFormData(params) {
  return request({
    url: '/dataTemplateService/removeFormData',
    method: 'post',
    mask: true,
    data: params
  })
}

