import request from '@/utils/request'

/**
 * 查询工单信息
 * @param params
 */
export function getWorkOrderById(params) {
  return request({
    url: '/rateService/getWorkOrderById',
    anonymous: true,
    method: 'get',
    params: params
  })
}

/**
 * 上传工单评分数据
 * @param params
 */
export function updateRateDataById(params) {
  return request({
    url: '/rateService/updateRateDataById',
    anonymous: true,
    method: 'post',
    data: params
  })
}

/**
 * 照片上传
 * @param file
 */
export function uploadFile(file) {
  const data = new FormData() // 创建form对象
  data.append('file', file)
  return request({
    url: '/rateService/uploadFile',
    anonymous: true,
    method: 'post',
    dataType: 'file',
    data: data
  })
}

export function getImage(params) {
  return request({
    url: '/rateService/getImage',
    anonymous: true,
    responseType: 'arraybuffer',
    isLoading: false,
    method: 'get',
    params
  })
}
