import Vue from 'vue'
import Form from './form'

import FormItem from './form-item'
import FormField from './form-field'

import LcControl from '@/components/LcControl'

import LcTable from './components/table'

import '@/lang/vee-validate'// 表单验证国际化

import './utils/customValidator' // 表单验证

Vue.component('dynamic-form', Form)
Vue.component('dynamic-form-item', FormItem)
Vue.component('dynamic-form-field', FormField)
Vue.component('van-lc-table', LcTable)
Vue.use(LcControl)
