import { getTerminal, getNeedBackApp } from './auth'

export function operateRedirect(_this, path) {
  if (getNeedBackApp() === 'true') {
    _this.$bridge.callHandler('backNativeApp', '', (callbackData) => {
    })
  } else {
    if (path) {
      _this.$router.push({ path: path })
    } else {
      _this.$router.push({ path: '/bpmn-cust/pending-cust' })
    }
  }
}
