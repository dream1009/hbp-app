
/**
 * 自定义校验规则
 * <pre>
 * 作者:hugh zhuang
 * 邮箱:3378340995@qq.com
 * 日期:2018-09-10-下午3:29:34
 * 版权:广州流辰信息技术有限公司
 * </pre>
 */
import { Validator } from 'vee-validate'
import FormOptions from '../constants/formoptions'
import Utils from '@/utils'
import i18n from '@/lang' // Internationalization 国际化
import fecha from '@/utils/fecha'

// 最少项
Validator.extend('min_mum', {
  getMessage: (field, [ref]) => {
    return i18n.t('validate.min_mum', { item: ref })
  },
  validate: (value, [ref]) => {
    if (Utils.isEmpty(ref)) { return true }
    let arrayValue = []
    let itemNum = 0
    const item = parseInt(ref, 10)
    if (Utils.isNotEmpty(value)) {
      if (Array.isArray(value)) {
        arrayValue = value
      } else {
        arrayValue = value.split(',')
      }
      itemNum = arrayValue.length
    }
    return itemNum >= item
  }
})
// 最多项
Validator.extend('max_mum', {
  getMessage: (field, [ref]) => {
    return i18n.t('validate.max_mum', { item: ref })
  },
  validate: (value, [ref]) => {
    if (Utils.isEmpty(ref)) { return true }
    let arrayValue = []
    let itemNum = 0
    const item = parseInt(ref, 10)
    if (Utils.isNotEmpty(value)) {
      if (Array.isArray(value)) {
        arrayValue = value
      } else {
        arrayValue = value.split(',')
      }
      itemNum = arrayValue.length
    }
    return itemNum <= item
  }
})
// 正则表达式
Validator.extend('regexp', {
  getMessage: (field, [type, regex, msg, flags]) => {
    if (FormOptions.t.DATA_FORMAT[type]) {
      return i18n.t('validate.' + type)
    }
    if (!msg) {
      return i18n.t('validate.invalid')
    }
    return msg
  },
  validate: (value, [type, regex, msg, flags]) => {
    if (FormOptions.t.DATA_FORMAT[type]) {
      regex = FormOptions.t.DATA_FORMAT[type]
    }
    if (regex instanceof RegExp) {
      return regex.test(value)
    }

    return new RegExp(regex, flags).test(String(value))
  }
})

// 设置时间差
function setDataInterval(curDate, d, interval, type) {
  const isBefore = type === 'before'
  d = isBefore ? -d : d
  var i = 0
  if (interval === 'y') { // 年
    curDate.setFullYear(curDate.getFullYear() + d)
  } else if (interval === 'm') { // 月
    curDate.setMonth(curDate.getMonth() + d)
    i = 1
  } else if (interval === 'd') { // 日
    curDate.setDate(curDate.getDate() + d)
    i = 2
  } else if (interval === 'h') { // 时
    curDate.setHours(curDate.getHours() + d)
    i = 3
  } else if (interval === 'mi') { // 分
    curDate.setMinutes(curDate.getMinutes() + d)
    i = 4
  } else if (interval === 's') { // 秒
    curDate.setSeconds(curDate.getSeconds() + d)
    i = 5
  }
  if (i < 1) {
    isBefore ? curDate.setMonth(0) : curDate.setMonth(11)
  }
  if (i < 2) {
    isBefore ? curDate.setDate(1) :	curDate.setDate(getCurrentMonthLast(curDate))
  }
  if (i < 3) {
    isBefore ?	curDate.setHours(0) : curDate.setHours(23)
  } if (i < 4) {
    isBefore ? curDate.setMinutes(0) :	curDate.setMinutes(59)
  }
  if (i < 5) {
    isBefore ?	curDate.setSeconds(0) : curDate.setSeconds(59)
  }
  return curDate
}

/**
 * 这个月最后一天
 * @param {*} date
 */
function getCurrentMonthLast(date) {
  var currentMonth = date.getMonth()
  var nextMonth = ++currentMonth
  var nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1)
  var oneDay = 1000 * 60 * 60 * 24
  return new Date(nextMonthFirstDay - oneDay)
}

function getCurDate(datefmt) {
  return fecha.parse(fecha.format(new Date(), datefmt), datefmt)
}

function getDateTime(value, format = 'yyyy-MM-dd hh:mm:ss') {
  return fecha.parse(value, format).getTime()
}
// 日期范围
var errMessage
Validator.extend('start_end_date', {
  getMessage: (field, fieldOptions) => {
    return errMessage
  },
  validate: (value, fieldOptions) => {
    if (Utils.isEmpty(value)) {
      return true
    }
    var datefmt = fieldOptions['datefmt'] || 'yyyy-MM-dd hh:mm:ss'
    var curValDate = fecha.parse(value, datefmt)
    // 验证值是否是日期
    if (curValDate === null) {
      errMessage = '不是有效的日期格式'
      return false
    }
    var curValTime = curValDate.getTime()
    var	startType = fieldOptions['start_date_type']
    var endType = fieldOptions['end_date_type']
    var startDate // 开始时间
    var startTime// 开始时间时间戳
    var endDate// 结束时间
    var endTime // 结束时间时间戳
    if (startType === 'specific') { // 特定时间
      startDate = fieldOptions['start_date']
    } else if (startType === 'today') {
      startDate = fecha.format(new Date(), datefmt)
    } else if (startType === 'before') {
      let curDate = getCurDate(datefmt)// 当前日期
      curDate = setDataInterval(curDate, parseInt(fieldOptions['start_date'], 10), fieldOptions['start_date_interval'], startType)
      startDate = fecha.format(curDate, datefmt)
    } else if (startType === 'after') {
      let curDate = getCurDate(datefmt)// 当前日期
      curDate = setDataInterval(curDate, parseInt(fieldOptions['start_date'], 10), fieldOptions['start_date_interval'], startType)
      startDate = fecha.format(curDate, datefmt)
    }

    if (endType === 'specific') {
      endDate = fieldOptions['end_date']
    }	if (endType === 'today') {
      endDate = fecha.format(new Date(), datefmt)
    } else if (endType === 'before') {
      let curDate = getCurDate(datefmt)// 当前日期
      curDate = setDataInterval(curDate, parseInt(fieldOptions['end_date'], 10), fieldOptions['end_date_interval'], endType)
      endDate = fecha.format(curDate, datefmt)
    } else if (endType === 'after') {
      let curDate = getCurDate(datefmt)// 当前日期
      curDate = setDataInterval(curDate, parseInt(fieldOptions['end_date'], 10), fieldOptions['end_date_interval'], endType)
      endDate = fecha.format(curDate, datefmt)
    }

    if (Utils.isNotEmpty(startDate)) {
      startTime = getDateTime(startDate, datefmt)
    }

    if (Utils.isNotEmpty(endDate)) {
      endTime = getDateTime(endDate, datefmt)
    }
    // 时间范围
    if (Utils.isNotEmpty(startTime) && Utils.isNotEmpty(startDate) &&
      Utils.isNotEmpty(endTime) && Utils.isNotEmpty(endDate) &&
      (curValTime < startTime || curValTime > endTime)) {
      errMessage = '请选择时间在' + startDate + '至' + endDate + '之间'
      return false
    // 开始时间
    } else if (Utils.isNotEmpty(startTime) && Utils.isNotEmpty(startDate) && curValTime < startTime) {
      errMessage = '请选择不早于' + startDate + '时间'
      return false
    // 结束时间
    } else if (Utils.isNotEmpty(endTime) && Utils.isNotEmpty(endDate) && curValTime > endTime) {
      errMessage = '请选择不晚于' + endDate + '时间'
      return false
    }
    return true
  }
})

