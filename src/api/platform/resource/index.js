// 首页菜单资源
// import i18n from '@/utils/i18n' // Internationalization 国际化
import request from '@/utils/request'

export function getMenus() {
  return request({
    url: '/appResourcesService/getMenuData'
  })
}

export function getInfoCount() {
  return request({
    url: '/bpmService/getInfoCount'
  })
}
