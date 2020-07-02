/**
 * 表单通用验证
 */
import utils from '@/utils'
/* 合法uri*/
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

/* 小写字母*/
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 大写字母*/
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母*/
export function validatAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

export function validateMobile(phone) {
  const rtn = {
    result: true,
    msg: ''
  }

  let result = true
  let msg = ''
  var isPhone = /^0\d{2,3}-?\d{7,8}$/
  if (utils.isNotEmpty(phone)) {
    if (phone.length === 11) {
      if (isPhone.test(phone)) {
        msg = 'format' // '手机号码格式不正确'
        result = false
      }
    } else {
      msg = 'length'// '手机号码长度不为11位'
      result = false
    }
  } else {
    msg = 'empty'
    result = false
  }
  rtn.result = result
  rtn.msg = msg
  return rtn
}

