/**
 * 全局的工具类
 * <pre>
 * 作者:hugh zhuang
 * 邮箱:3378340995@qq.com
 * 日期:2018-07-02-下午3:29:34
 * 版权:广州流辰信息技术有限公司
 * </pre>
 *
 * 可以使用 this.$utils.xx
 *  如: 判断是否为空
 *   this.$utils.isEmpty()
 */
const wd = window

const utils = {

  /**
   * 判断是否为空
   * @param {*} obj 对象
   * @param {*} allowBlank 允许空白
   */
  isEmpty: (obj, allowBlank) => {
    if (utils.isNull(obj)) return true
    if (utils.isArray(obj)) return obj.length === 0
    if (utils.isString(obj)) return (!(allowBlank || obj.length > 0))
    if (utils.isObject(obj)) return utils.isEmptyObject(obj)
    for (var key in obj) if (obj.hasOwnProperty(key)) return false
    return obj === undefined || (!allowBlank ? obj === '' : false)
  },
  /**
   * 判断是否不为空
   * @param {*} obj 对象
   * @param {*} allowBlank 允许空白
   */
  isNotEmpty: (obj, allowBlank) => {
    return !utils.isEmpty(obj, allowBlank)
  },
  /**
   * 是否空对象
   * @param {*} obj
   */
  isEmptyObject(obj) {
    if (!obj) return true
    for (const name in obj) {
      return false
    }
    return true
  },
  /**
   * 是否是对象
   * @param {*} input
   */
  isObject: function(input) {
    return Object.prototype.toString.call(input) === '[object Object]'
  },
  /**
   * 是否是数组
   * @param {*} input
   */
  isArray: function(input) {
    return input instanceof Array || Object.prototype.toString.call(input) === '[object Array]'
  },
  isDate: function(input) {
    return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]'
  },
  isNumber: function(input) {
    return input instanceof Number || Object.prototype.toString.call(input) === '[object Number]'
  },
  isString: function(input) {
    return input instanceof String || Object.prototype.toString.call(input) === '[object String]'
  },
  isBoolean: function(input) {
    return typeof input === 'boolean'
  },
  isFunction: function(input) {
    return typeof input === 'function'
  },
  isNull: function(input) {
    return input === undefined || input === null
  },
  isPlainObject: function(obj) {
    if (obj && Object.prototype.toString.call(obj) === '[object Object]' && obj.constructor === Object && !hasOwnProperty.call(obj, 'constructor')) {
      var key
      for (var k in obj) {
        key = k
      }
      return key === undefined || hasOwnProperty.call(obj, key)
    }
    return false
  },
  /**
   * 随机id
   */
  guid: () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0
      const v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  },
  /**
   * 创建新数据，避免对象引用
   * @param {*} obj
   * @param {*} defVal
   */
  newData(obj, defVal) {
    if (utils.isEmpty(obj)) {
      return defVal || obj
    }
    return JSON.parse(JSON.stringify(obj))
  },

  /**
   * 对于json字符串的转换
   * @param {*} data
   */
  parseData: (data) => {
    if (utils.isEmpty(data)) {
      return {}
    }
    var json = wd.eval('(' + data + ')')
    return json
  },
  evalData: (data) => {
    wd.eval(data)
  },
  toBoolean: (str, defaultValue = false) => {
    if (utils.isEmpty(str)) {
      return defaultValue
    }
    return ['True', 'Yes', 'true', '1', 1, 'yes', 'Y', 'y', 'T', 't', true].includes(str)
  },
  /**
   * Check if two values are loosely equal - that is,
   * if they are plain objects, do they have the same shape?
   */
  looseEqual: (a, b) => {
    if (a === b) return true
    const isObjectA = a !== null && typeof a === 'object'
    const isObjectB = b !== null && typeof b === 'object'
    if (isObjectA && isObjectB) {
      try {
        const isArrayA = Array.isArray(a)
        const isArrayB = Array.isArray(b)
        if (isArrayA && isArrayB) {
          return a.length === b.length && a.every((e, i) => {
            return utils.looseEqual(e, b[i])
          })
        } else if (a instanceof Date && b instanceof Date) {
          return a.getTime() === b.getTime()
        } else if (!isArrayA && !isArrayB) {
          const keysA = Object.keys(a)
          const keysB = Object.keys(b)
          return keysA.length === keysB.length && keysA.every(key => {
            return utils.looseEqual(a[key], b[key])
          })
        } else {
        /* istanbul ignore next */
          return false
        }
      } catch (e) {
      /* istanbul ignore next */
        return false
      }
    } else if (!isObjectA && !isObjectB) {
      return String(a) === String(b)
    } else {
      return false
    }
  },
  /**
   * 动态插入css
   */
  loadStyle: (url) => {
    const link = document.createElement('link')
    link.type = 'text/css'
    link.rel = 'stylesheet'
    link.href = url
    const head = document.getElementsByTagName('head')[0]
    head.appendChild(link)
  },
  /**
   * @description 打开新页面
   * @param {String} url 地址
   */
  open: function(url) {
    var a = document.createElement('a')
    a.setAttribute('href', url)
    a.setAttribute('target', '_blank')
    a.setAttribute('id', 'ibps-open-link')
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(document.getElementById('ibps-open-link'))
  },
  updateUrl: function(url, key) {
    key = (key || 't') + '=' // 默认key是"t",可以传入key自定义
    const reg = new RegExp(key + '\\d+') // 正则：t=1472286066028
    const timestamp = +new Date()
    if (url.indexOf(key) > -1) { // 有时间戳，直接更新
      return url.replace(reg, key + timestamp)
    } else { // 没有时间戳，加上时间戳
      if (url.indexOf('\?') > -1) {
        var urlArr = url.split('\?')
        if (urlArr[1]) {
          return urlArr[0] + '?' + key + timestamp + '&' + urlArr[1]
        } else {
          return urlArr[0] + '?' + key + timestamp
        }
      } else {
        if (url.indexOf('#') > -1) {
          return url.split('#')[0] + '?' + key + timestamp + location.hash
        } else {
          return url + '?' + key + timestamp
        }
      }
    }
  },
  reload: function() {
    wd.location.href = utils.updateUrl(wd.location.href)
  },
  format: (str, args) => {
    if (args.length < 1) {
      return str
    }

    let data = args // 如果模板参数是数组
    if (args.length === 1 && typeof (args) === 'object') {
      // 如果模板参数是对象
      data = args
    }
    for (var key in data) {
      var value = data[key]
      if (undefined !== value) {
        str = str.replace('{' + key + '}', value)
      }
    }
    return str
  },
  flatten: (ary, b, c) => {
    c = c || []
    if (ary) {
      for (var i = 0, e = ary.length; i < e; i++) {
        var f = ary[i]
        if (Array.isArray(f)) {
          utils.flatten(f, b, c)
        } else {
          b && !b(f) || c.push(f)
        }
      }
    }
    return c
  }

}

export default utils
