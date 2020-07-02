
// vee-validate
import Vue from 'vue'
import lang from '@/lang'
import VeeValidate, { Validator } from 'vee-validate'

import veeEnUSLocale from '@/lang/vee-validate/en-US'
import veeZhCNLocale from '@/lang/vee-validate/zh-CN'
import veeZhHKLocale from '@/lang/vee-validate/zh-HK'

Vue.use(VeeValidate, {
  locale: lang.locale,
  dictionary: {
    [veeEnUSLocale.name]: veeEnUSLocale,
    [veeZhCNLocale.name]: veeZhCNLocale,
    [veeZhHKLocale.name]: veeZhHKLocale
  }
})

// 设置国际化
Validator.localize(lang.locale)
