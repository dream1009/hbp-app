import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './DocsApp'
import routes from './router'
import VantDoc, { progress } from 'vant-doc'
import { isMobile, utils } from './utils'
Vue.use(VueRouter).use(VantDoc)

Vue.prototype.$utils = utils // 全局帮助类
const router = new VueRouter({
  mode: 'hash',
  routes: routes()
})

router.beforeEach((route, redirect, next) => {
  if (isMobile) {
    location.replace('mobile.html' + location.hash)
  }
  progress.start()
  document.title = route.meta.title || document.title
  next()
})

router.afterEach(() => {
  progress.done()
  window.scrollTo(0, 0)
  Vue.nextTick(() => window.syncPath())
})

window.vueRouter = router

if (process.env.NODE_ENV !== 'production') {
  Vue.config.productionTip = false
}

new Vue({
  el: '#app', // eslint-disable-line
  render: h => h(App),
  router
})
