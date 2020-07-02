import request from '@/utils/request'

export function myTasks(params) {
  return request({
    url: '/bpmCustService/myTasks',
    method: 'post',
    dataType: 'json',
    isLoading: false,
    data: params
  })
}

export function myCompleted(params) {
  return request({
    url: '/bpmCustService/myCompleted',
    method: 'post',
    dataType: 'json',
    isLoading: false,
    data: params
  })
}

export function myHandled(params) {
  return request({
    url: '/bpmCustService/myHandled',
    method: 'post',
    dataType: 'json',
    isLoading: false,
    data: params
  })
}

export function myRequest(params) {
  return request({
    url: '/bpmCustService/myRequest',
    method: 'post',
    dataType: 'json',
    isLoading: false,
    data: params
  })
}

export function myDraft(params) {
  return request({
    url: '/bpmCustService/myDrafts',
    method: 'post',
    dataType: 'json',
    isLoading: false,
    data: params
  })
}

export function myRevoke(params) {
  return request({
    url: '/bpmCustService/myRevoke',
    method: 'post',
    dataType: 'json',
    isLoading: false,
    data: params
  })
}

export function myTaskChange(params) {
  return request({
    url: '/bpmTaskChangeService/listJson',
    method: 'post',
    dataType: 'json',
    data: params
  })
}

export function taskChangeDetail(params) {
  return request({
    url: '/bpmTaskChangeService/get',
    method: 'get',
    dataType: 'json',
    params: params
  })
}

export function setStatus(params) {
  return request({
    url: '/bpmTaskChangeService/setStatus',
    method: 'post',
    data: params
  })
}

export function defList(params) {
  return request({
    url: '/bpmService/defList',
    method: 'post',
    dataType: 'json',
    isLoading: false,
    data: params
  })
}

/**
 * 流程任务获取表单数据
 * @param {*} params
 */
export function getTaskFormData(params) {
  return request({
    url: '/bpmService/getFormData',
    method: 'get',
    params: params
  })
}

/**
 * 启动或草稿获取表单数据
 * @param {*} params
 */
export function getFormDataForInst(params) {
  return request({
    url: '/bpmService/getFormDataForInst',
    method: 'get',
    params: params
  })
}

/**
 * 流程实例获取表单数据
 * @param {*} params
 */
export function getInstFormData(params) {
  return request({
    url: '/bpmService/getInstForm',
    method: 'get',
    params: params
  })
}

/**
 * 审批历史
 * @param {*} params
 */
export function getOpinions(params) {
  return request({
    url: '/bpmService/opinions',
    method: 'get',
    params: params
  })
}
/**
 * 节点审批历史
 * @param {*} params
 */
export function getNodeApproval(params) {
  return request({
    url: '/bpmService/getNodeApproval',
    method: 'get',
    params: params
  })
}
/**
 * 审批流程图
 * @param {*} params
 */
export function getFlowDiagram(params) {
  return request({
    url: '/bpmImgService/getFlowDiagram',
    method: 'get',
    params: params
  })
}
/**
 * 获取同意反对需要的操作信息
 * @param  {[type]} params
 */
export function toAgree(params) {
  return request({
    url: '/bpmTaskService/toAgree',
    method: 'get',
    params: params
  })
}

/**
 * 获取驳回上一步需要的操作信息
 * @param  {[type]} params
 */
export function toRejectToPrevious(params) {
  return request({
    url: '/bpmTaskService/toRejectToPrevious',
    method: 'get',
    params: params
  })
}

/**
 * 获取驳回发起人需要的操作信息
 * @param  {[type]} params
 */
export function toRejectToStart(params) {
  return request({
    url: '/bpmTaskService/toRejectToStart',
    method: 'get',
    params: params
  })
}

/**
 * 获取驳回需要的操作信息
 * @param  {[type]} params
 */
export function toReject(params) {
  return request({
    url: '/bpmTaskService/toReject',
    method: 'get',
    params: params
  })
}

/**
 * 获取转办需要的操作信息
 * @param  {[type]} params
 */
export function toDelegate(params) {
  return request({
    url: '/bpmTaskChangeService/toDelegate',
    method: 'get',
    params: params
  })
}

/**
 * 获取补签需要的操作信息
 * @param  {[type]} params
 */
export function toAddSignTask(params) {
  return request({
    url: '/bpmTaskService/toAddSignTask',
    method: 'get',
    params: params
  })
}

/**
 * 流程收藏
 * @param  {[type]} params
 */
export function saveFavorites(params) {
  return request({
    url: '/bpmService/saveFavorites',
    method: 'post',
    data: params
  })
}
/**
 * 取消流程收藏
 * @param  {[type]} params
 */
export function removeFavorites(params) {
  return request({
    url: '/bpmService/removeFavorites',
    method: 'post',
    data: params
  })
}

/**
 * 流程收藏列表
 * @param  {[type]} params
 */
export function getFavoriteList(params) {
  return request({
    url: '/bpmService/getFavoriteList',
    method: 'post',
    dataType: 'json',
    data: params
  })
}
