import fecha from '@/utils/fecha'
import i18n from '@/lang' // Internationalization 国际化

/**
 * 以复数表示
 * @param {*} time
 * @param {*} label
 */
const pluralize = (time, label) => {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}

export const timeAgo = (time) => {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}

export const timeDuration = (time) => {
  const day = (time / 1000 / 60 / 60 / 24) << 0
  const hour = (time / 1000 / 60 / 60) % 24 << 0
  const min = (time / 1000 / 60) % 60 << 0
  const sec = Math.round((time / 1000) % 60)
  const result = []

  if (day) {
    result.push(day + '天')
  }
  if (hour) {
    result.push(hour + '时')
  }
  if (min) {
    result.push(min + '分')
  }
  if (!isNaN(sec) && sec) {
    result.push(sec + '秒')
  }
  return result.join('')
}

/**
 * 预设格式
 * @param {*} time
 * @param {*} cFormat
 */
export const parseFormatDate = (time, cFormat) => {
  let d = fecha.parse(time, cFormat || 'yyyy-MM-dd')
  if (d) return d
  var dateFormat = ['yyyy-MM-dd HH:mm:ss', 'yyyy-MM-dd', 'HH:mm:ss', 'HH:mm']
  for (let i = 0; i < dateFormat.length; i++) {
    d = fecha.parse(time, dateFormat[i])
    if (d) return d
  }
  return
}

/**
 * 日期格式
 * @param {*} time
 * @param {*} cFormat
 */
export const parseDate = (time, cFormat) => {
  if (!time || time === '') {
    return
  }
  return parseFormatDate(time, cFormat)
}

/**
 * 日期格式
 * @param {*} time
 * @param {*} cFormat
 */
export const formatDate = (time, cFormat) => {
  if (!time || time === '') {
    return ''
  }
  let d
  if (!isNaN(time)) {
    d = new Date(time)
  } else {
    d = parseFormatDate(time, cFormat)
  }
  return fecha.format(d, cFormat)
}

/**
 * 时间格式
 * @param {*} time 格式化的时间，【字符串、数字】
 * @param {*} cFormat
 */
export const formatTime = (time, cFormat) => {
  if (!time || time === '') {
    return ''
  }
  let d
  if (!isNaN(time)) {
    d = new Date(time)
  } else {
    d = parseFormatDate(time, cFormat)
  }
  /* const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return i18n.t('filters.now')
  } else if (diff < 3600) { // less 1 hour
    return i18n.t('filters.minutesAgo', { time: Math.ceil(diff / 60) })
  } else if (diff < 3600 * 24) {
    return i18n.t('filters.hourAgo', { time: Math.ceil(diff / 3600) })
  } else if (diff < 3600 * 24 * 2) {
    return i18n.t('filters.yesterday')
  } else if (diff < 3600 * 24 * 3) {
    return i18n.t('filters.beforeYesterday')
  }*/
  if (cFormat) {
    return fecha.format(d, cFormat)
  } else {
    return fecha.format(d, i18n.t('filters.formatDate'))
  }
}

/**
 * Formates file size.
 *
 * @param {Number|String} size
 */
export const formatFileSize = (size) => {
  const units = ['Byte', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const threshold = 1024
  size = Number(size)
  const i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(threshold))
  return `${(size / Math.pow(threshold, i)).toFixed(2) * 1} ${units[i]}`
}

/**
 * html 转 value
 * @param {*} val
 */
export const html2Text = (val) => {
  const div = document.createElement('div')
  div.innerHTML = val
  return div.textContent || div.innerText
}

/**
 * 千分位
 */
export const toThousandslsFilter = (num) => {
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

export const sexFilter = (sex) => {
  if (sex === 'male') {
    return '男'
  } else if (sex === 'female') {
    return '女'
  } else {
    return '未设置'
  }
}
