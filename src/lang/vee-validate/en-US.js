import VeeValidate from 'vee-validate'
import { formatFileSize, isDefinedGlobally } from './utils'

const messages = {
  _default: (field) => `The field value is not valid.`,
  after: (field, [target, inclusion]) => `The field must be after ${inclusion ? 'or equal to ' : ''}${target}.`,
  alpha_dash: (field) => `The field may contain alpha-numeric characters as well as dashes and underscores.`,
  alpha_num: (field) => `The field may only contain alpha-numeric characters.`,
  alpha_spaces: (field) => `The field may only contain alphabetic characters as well as spaces.`,
  alpha: (field) => `The field may only contain alphabetic characters.`,
  before: (field, [target, inclusion]) => `The field must be before ${inclusion ? 'or equal to ' : ''}${target}.`,
  between: (field, [min, max]) => `The field must be between ${min} and ${max}.`,
  confirmed: (field) => `The field confirmation does not match.`,
  credit_card: (field) => `The field is invalid.`,
  date_between: (field, [min, max]) => `The field must be between ${min} and ${max}.`,
  date_format: (field, [format]) => `The field must be in the format ${format}.`,
  decimal: (field, [decimals = '*'] = []) => `The field field must be numeric and may contain ${!decimals || decimals === '*' ? '' : decimals} decimal points.`,
  digits: (field, [length]) => `The field must be numeric and exactly contain ${length} digits.`,
  dimensions: (field, [width, height]) => `The field must be ${width} pixels by ${height} pixels.`,
  email: (field) => `The field must be a valid email.`,
  ext: (field) => `The field must be a valid file.`,
  image: (field) => `The field must be an image.`,
  included: (field) => `The field must be a valid value.`,
  integer: (field) => `The field must be an integer.`,
  ip: (field) => `The field must be a valid ip address.`,
  length: (field, [length, max]) => {
    if (max) {
      return `The field length must be between ${length} and ${max}.`
    }
    return `The field length must be ${length}.`
  },
  max: (field, [length]) => `The field may not be greater than ${length} characters.`,
  max_value: (field, [max]) => `The field must be ${max} or less.`,
  mimes: (field) => `The field must have a valid file type.`,
  min: (field, [length]) => `The field must be at least ${length} characters.`,
  min_value: (field, [min]) => `The field must be ${min} or more.`,
  excluded: (field) => `The field must be a valid value.`,
  numeric: (field) => `The field may only contain numeric characters.`,
  regex: (field) => `The field format is invalid.`,
  required: (field) => `The field is required.`,
  size: (field, [size]) => `The field size must be less than ${formatFileSize(size)}.`,
  url: (field) => `The field is not a valid URL.`
}

const locale = {
  name: 'en-US',
  messages,
  attributes: {
    my_newPassword: 'New password'
  }
}

if (isDefinedGlobally()) {
  // eslint-disable-next-line
  VeeValidate.Validator.localize({ [locale.name]: locale });
}

export default locale
