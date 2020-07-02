function iframeReady(iframe, callback) {
  const doc = iframe.contentDocument || iframe.contentWindow.document
  const interval = () => {
    if (iframe.contentWindow.changePath) {
      callback()
    } else {
      setTimeout(() => {
        interval()
      }, 50)
    }
  }

  if (doc.readyState === 'complete') {
    interval()
  } else {
    iframe.onload = interval
  }
}

const ua = navigator.userAgent.toLowerCase()
const isMobile = /ios|iphone|ipod|ipad|android/.test(ua)

const wd = window

const utils = {

  /**
   * 判断是否为空
   * @param {*} val
   */
  isEmpty: (val) => {
    if (val instanceof Array) {
      if (val.length === 0) return true
    } else if (val instanceof Object) {
      if (JSON.stringify(val) === '{}') return true
    } else {
      if (val == null || val === undefined || val === '') return true
      return false
    }
    return false
  },

  /**
   * 判断是否不为空
   * @param {*} val
   */
  isNotEmpty: (val) => {
    return !utils.isEmpty(val)
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

export {
  isMobile,
  iframeReady,
  utils
}
