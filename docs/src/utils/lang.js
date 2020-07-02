import Locale from 'vant/packages/locale'
import zhCN from 'vant/packages/locale/lang/zh-CN'
import enUS from 'vant/packages/locale/lang/en-US'

const langMap = {
  'en-US': {
    title: 'HBP platform app',
    messages: enUS
  },
  'zh-CN': {
    title: 'HBP 平台 移动应用',
    messages: zhCN
  }
}
let currentLang = ''

setLang(getDefaultLang())

function getDefaultLang() {
  const langs = Object.keys(langMap)
  const hash = location.hash

  for (let i = 0; i < langs.length; i++) {
    if (hash.indexOf(langs[i]) !== -1) {
      return langs[i]
    }
  }

  const userLang = localStorage.getItem('IBPS_LANGUAGE') || navigator.language || 'zh-CN'
  return userLang.indexOf('zh-') !== -1 ? 'zh-CN' : 'en-US'
}

export function setLang(lang) {
  if (currentLang === lang) {
    return
  }

  currentLang = lang
  if (window.localStorage) {
    localStorage.setItem('IBPS_LANGUAGE', lang)
  }
  Locale.use(lang, langMap[lang].messages)
  document.title = langMap[lang].title
}
