/**
 * 缓存处理
 * 存储到localStorage中，避免刷新页面数据丢失
 * <pre>
 * 作者:hugh zhuang
 * 邮箱:3378340995@qq.com
 * 日期:2015-11-02-下午3:29:34
 * 版权:广州流辰信息技术有限公司
 * </pre>
 */
import Utils from '@/utils';
const storage = {
  /**
   * 存储localStorage
   */
  set: (key, value, type, datetime) => {
    const obj = {
      dataType: typeof value,
      value: value,
      type: type,
      datetime: datetime || new Date().getTime()
    }
    if (type) window.sessionStorage.setItem(key, JSON.stringify(obj))
    else window.localStorage.setItem(key, JSON.stringify(obj))
  },
  /**
   * 获取localStorage
   */
  get: (key, defaultValue) => {
    let obj = {}
    let value
    obj = window.localStorage.getItem(key)
    if (Utils.isEmpty(obj)) obj = window.sessionStorage.getItem(key)
    if (Utils.isEmpty(obj)) return defaultValue
    obj = JSON.parse(obj)
    if (obj.dataType === 'string') {
      value = obj.value
    } else if (obj.dataType === 'number') {
      value = Number(obj.value)
    } else if (obj.dataType === 'boolean') {
      value = Boolean(obj.value)
    } else if (obj.dataType === 'object') {
      value = obj.value
    }
    return value
  },
  /**
   * 删除localStorage
   */
  remove: key => {
    window.sessionStorage.removeItem(key)
    window.localStorage.removeItem(key)
  },
  /**
   * 清空localStorage
   */
  clear: () => {
    window.sessionStorage.clear()
    window.localStorage.clear()
  }
}

export default storage
