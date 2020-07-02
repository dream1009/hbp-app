import request from '@/utils/request'

/**
 * 启动流程
 * @param {*} params
 */
export function startFlow(params) {
  return request({
    url: '/bpmService/start',
    method: 'post',
    mask: true,
    data: params
  })
}

/**
 * 保存草稿
 * @param {*} params
 */
export function saveDraft(params) {
  return request({
    url: '/bpmService/saveDraft',
    method: 'post',
    mask: true,
    data: params
  })
}

/**
 * 锁定任务
 * @param {*} params
 */
export function lock(params) {
  return request({
    url: '/bpmService/lock',
    method: 'get',
    mask: true,
    params: params
  })
}

/**
 * 解锁任务
 * @param {*} params
 */
export function unlock(params) {
  return request({
    url: '/bpmService/unlock',
    method: 'get',
    mask: true,
    params: params
  })
}

/**
 * 处理任务
 * @param  {[type]} data 参数对象
 */
export function complete(data) {
  return request({
    url: '/bpmService/complete',
    method: 'post',
    mask: true,
    data: data
  })
}

/**
 * 终止流程
 * @param  {[type]} data 参数对象
 */
export function stopProcess(data) {
  return request({
    url: '/bpmService/stopProcess',
    method: 'post',
    mask: true,
    data: data
  })
}

/**
 * 挂起流程
 * @param {*} params
 */
export function suspendProcess(params) {
  return request({
    url: '/bpmService/suspendProcess',
    method: 'get',
    mask: true,
    params: params
  })
}

/**
 * 恢复流程
 * @param {*} params
 */
export function recoverProcess(params) {
  return request({
    url: '/bpmService/recoverProcess',
    method: 'get',
    mask: true,
    params: params
  })
}

/**
 * 批量挂起流程
 * @param {*} params
 */
export function batchSuspendProcess(params) {
  return request({
    url: '/bpmService/batchSuspendProcess',
    method: 'post',
    mask: true,
    data: params
  })
}

/**
 * 批量恢复流程
 * @param {*} params
 */
export function batchRecoverProcess(params) {
  return request({
    url: '/bpmService/batchRecoverProcess',
    method: 'post',
    mask: true,
    data: params
  })
}

/**
 * 批量处理任务
 * @param  {[type]} data 参数对象
 */
export function completeBatch(data) {
  return request({
    url: '/bpmService/completeBatch',
    method: 'post',
    mask: true,
    data: data
  })
}

/**
 * 保存转办信息
 * @param  {[type]} data 参数对象
 */
export function doAddSignTask(data) {
  return request({
    url: '/bpmService/doAddSignTask',
    method: 'post',
    mask: true,
    data: data
  })
}

/**
 * 补签
 * @param  {[type]} data 参数对象
 */
export function saveTaskChange(data) {
  return request({
    url: '/bpmTaskChangeService/save',
    method: 'post',
    mask: true,
    data: data
  })
}
