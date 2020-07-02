import request from '@/utils/request'

export function getData() {
  return request({
    url: '/areaService/getPickerData',
    method: 'get'
  })
}

