import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { Locale } from 'vant'
import storage from '@/utils/storage'
// vant lang
import vantEnUSLocale from 'vant/lib/locale/lang/en-US'
import vantZhCNLocale from 'vant/lib/locale/lang/zh-CN'
import vantZhHKLocale from 'vant/lib/locale/lang/zh-HK'

import enUSLocale from './en-US'
import zhCNLocale from './zh-CN'
import zhHKLocale from './zh-HK'

Vue.use(VueI18n)
const messages = {
  'en-US': {
    ...enUSLocale,
    ...vantEnUSLocale
  },
  'zh-CN': {
    ...zhCNLocale,
    ...vantZhCNLocale
  },
  'zh-HK': {
    ...zhHKLocale,
    ...vantZhHKLocale
  }
}

const i18n = new VueI18n({
  // silentTranslationWarn: true, // Warn 取消
  locale: storage.get('language', 'zh-CN'), // set locale
  messages // set locale messages
})

Locale.use(i18n.locale, messages[i18n.locale])

export default i18n
