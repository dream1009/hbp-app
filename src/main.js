// 全局css样式
import 'normalize.css'
import '@/assets/vant-css/icon.scss'
import '@/assets/vant-css/index.css'
import '@/assets/styles/index.scss'

import Vue from 'vue'
// import FastClick from 'fastclick'

import Vconsole from 'vconsole'
if(window.config.debug==true){
  // 打开移动端调试
  const vConsole = new Vconsole()
  Vue.use(vConsole)
}

// 导入VeeValidate
import '@/lang/vee-validate'

import App from './App'
import router from './router'
import store from './store'
import './errorLog' // error log 错误日志
import './permission' // permission control 权限控制
import i18n from './lang' // Internationalization 国际化
import utils from './utils' // utils 帮助类
/* import vConsole from '@/utils/vconsole.js'
export default vConsole*/
import $ from 'jquery'
window.jQuery = $
window.$ = $
import Vant from 'vant'
Vue.use(Vant) // 导入vant
Vue.prototype.$utils = utils // 全局帮助类

import VueBridgeWebview from './utils/bridgeWebview'
// Vue.prototype.$bridge = VueBridgeWebView
Vue.use(VueBridgeWebview)
import * as filters from './filters' // global filters 全局过滤
// register global utility filters. 注册全局过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
/**
 *  日志输出开关
 */
Vue.config.productionTip = false
// /**
//  *  点击延迟 和富文本框冲突暂时移除
//  */
// FastClick.attach(document.body)

/**
 *  创建实例
 */
new Vue({
  store,
  router,
  i18n,
  render: h => h(App)
}).$mount('#app')

