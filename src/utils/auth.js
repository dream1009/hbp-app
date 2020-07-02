
/**
 * cookie 缓存的数据
 * 缓存token
 */
import Cookies from 'js-cookie'
import Storage from '@/utils/storage'

const TOKEN_KEY = 'IBPS-ADMIN-TOKEN'
const isApp = process.env.VUE_APP_IS_APP
/**
 * 获取token
 */
export function getToken() {
  if (isApp) {
    return Storage.get(TOKEN_KEY)
  } else {
    return Cookies.get(TOKEN_KEY)
  }
}
/**
 * 设置token
 */
export function setToken(token, optins) {
  if (isApp) {
    token = token || getQueryString('token')
    return Storage.set(TOKEN_KEY, token, 'session')
  } else {
    return Cookies.set(TOKEN_KEY, token, optins)
  }
}
/**
 * 删除token
 */
export function removeToken() {
  if (isApp) {
    return Storage.remove(TOKEN_KEY)
  } else {
    return Cookies.remove(TOKEN_KEY)
  }
}
/**
 * 删除appParams
 */
export function removeAppParams() {
  if (isApp) {
    Storage.remove('firstTimeFlag')
    Storage.remove('terminal')
    Storage.remove('backApp')
  } else {
    Cookies.remove('firstTimeFlag')
    Cookies.remove('terminal')
    Cookies.remove('backApp')
  }
}
export function setTitleHide(val) {
  return Storage.set('navBarHide', val, 'session')
}
export function getTitleHide() {
  return  Storage.get('navBarHide')
}
function setHomePage(val) {
  return Storage.set('homePage', val, 'session')
}
export function getHomePage() {
  return  Storage.get('homePage')
}
function setFirstTimeFlag(val) {
  return Storage.set('firstTimeFlag', val, 'session')
}
export function getFirstTimeFlag() {
  return  Storage.get('firstTimeFlag')
}
export function getTerminal() {
  return Storage.get('terminal')
}
export function setTerminal(val) {
  return Storage.set('terminal', val, 'session')
}
export function setAppParams(to) {
  setToken(to.query.token)
  setFirstTimeFlag('false')
  setHomePage(to.path)
  // 操作完成是否返回app
  const isBackApp = to.query['backApp']
  const isHideTitle = to.query['hideTitle']
  const redirectApi = to.query['redirectApi']
  if (isBackApp && isBackApp === 'true') {
    setNeedBackApp(isBackApp)
  }
  if (isHideTitle && isHideTitle === 'true') {
    setTitleHide(isHideTitle)
  }
  if (redirectApi) {
    setRedirectApi(redirectApi)
  }
}
/**
 * 设置redirectApi
 */
export function setRedirectApi(value) {
  if (isApp) {
    return Storage.set('redirectApi', value, 'session')
  }
}
export function getRedirectApi() {
  if (isApp) {
    return Storage.get('redirectApi')
  }
}
/**
 * 设置是否返回外勤app标识
 */
export function setNeedBackApp(value) {
  if (isApp) {
    return Storage.set('back_app', value, 'session')
  }
}
export function getNeedBackApp() {
  if (isApp) {
    return Storage.get('back_app')
  }
}
/**
 * 设置是否免登录标识
 */
export function setLoginFree(value) {
  if (isApp) {
    return Storage.set('Login_free', value, 'session')
  }
}
export function getLoginFree() {
  if (isApp) {
    return Storage.get('Login_free')
  }
}
export function setChangeFilter(changeFilter) {
  return Storage.set('changeFilter', changeFilter, 'session')
}
export function getChangeFilter() {
  if (isApp) {
    return Storage.get('changeFilter')
  }
}
export function getQueryString(name) {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  const r = window.location.search.substr(1).match(reg)
  if (r != null) {
    return unescape(r[2])
  }
  return null
}
