// 複製官網的 https://github.com/baianat/vee-validate/tree/master/locale
import VeeValidate from 'vee-validate'
import { formatFileSize, isDefinedGlobally } from './utils'

const messages = {
  _default: (field) => `字段值無效。 `,
  after: (field, [target]) => `必須在${target}之後`,
  alpha_dash: (field) => `只能包含字母數字字符，包括破折號、下劃線`,
  alpha_num: (field) => `只能包含字母數字字符.`,
  alpha_spaces: (field) => `只能包含字母字符，包括空格.`,
  alpha: (field) => `只能包含字母字符.`,
  before: (field, [target]) => `必須在${target} 之前.`,
  between: (field, [min, max]) => `必須在${min} ${max}之間.`,
  confirmed: (field, [confirmedField]) => `不能和${confirmedField}匹配.`,
  date_between: (field, [min, max]) => `必須在${min}和${max}之間.`,
  date_format: (field, [format]) => `必須在在${format}格式中.`,
  decimal: (field, [decimals = '*'] = []) => `必須是數字的而且能夠保留${decimals === '*' ? '' : decimals} 位小數.`,
  digits: (field, [length]) => `必須是數字，且精確到 ${length}數`,
  dimensions: (field, [width, height]) => `必須是 ${width} 像素到 ${height} 像素.`,
  email: (field) => `必須是有效的郵箱.`,
  ext: (field) => `必須是有效的文件.`,
  image: (field) => `必須是圖片.`,
  included: (field) => `必須是一個有效值.`,
  ip: (field) => `必須是一個有效的地址.`,
  length: (field, [length, max]) => {
    if (max) {
      return `${field} 的長度必須在 ${length} 到 ${max} 之間。`
    }
    return `${field} 的長度必須為 ${length}。`
  },
  max: (field, [length]) => `不能大於${length}個字符.`,
  max_value: (field, [max]) => `必須小於或等於${max}.`,
  mimes: (field) => `必須是有效的文件類型.`,
  min: (field, [length]) => ` 必須至少有 ${length} 個字符.`,
  min_value: (field, [min]) => `必須大於或等於${min}.`,
  excluded: (field) => `必須是一個有效值.`,
  numeric: (field) => `只能包含數字字符.`,
  regex: (field) => `格式無效.`,
  required: (field) => `必填.`,
  size: (field, [size]) => `必須小於 ${formatFileSize(size)}.`,
  url: (field) => `不是有效的url.`
}

const locale = {
  name: 'zh-HK',
  messages,
  attributes: {
    my_newPassword: '新的密碼'
  }
}

if (isDefinedGlobally()) {
  VeeValidate.Validator.localize({ [locale.name]: locale })
}

export default locale
