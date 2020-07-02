
/**
 * 数据模版--封装自定义代码扩展接口
 *
 * <pre>
 * 作者:hugh zhuang
 * 邮箱:3378340995@qq.com
 * 日期:2017-10-01-下午3:29:34
 * 版权:广州流辰信息技术有限公司
 * </pre>
 */
import _ from 'lodash'
// 定义全局
var JTemplate
if (!window.JTemplate) {
  JTemplate = window.JTemplate = {}
} else {
  JTemplate = window.JTemplate
}
/**
   * 封装自定义代码扩展接口
   */
_.extend(JTemplate, {
  // 已经初始化
  _isInitialization: false,
  _isLoadJavaScriptFile: false,
  // 初始化表单
  _init: function(template) {
    if (this._isInitialization) return
    this.template = template

    this._isInitialization = true
  },

  // 模版加载
  _onLoad: function(form) {
    // if (Utils.isNotEmpty(this.javaScriptFiles)) {
    //   this._loadJavaScriptFile()
    // }
    if (_.isFunction(this.onLoad)) {
      this.onLoad(form)
    }
  },

  // 加载按钮
  _onLoadActions: function(form, actions) {
    if (_.isFunction(this.onLoadActions)) {
      this.onLoadActions(form, actions)
    }
  },

  // 表单校验
  _customFormatter: function(form, data) {
    if (_.isFunction(this.customFormatter)) {
      return this.customFormatter(form, data)
    }
    return true
  },

  // 提交前事件
  _beforeSubmit: function(form, action, postData) {
    if (_.isFunction(this.beforeSubmit)) {
      return this.beforeSubmit(action, postData, form)
    }
  },

  // 提交后事件
  _afterSubmit: function(form, action, postData) {
    if (_.isFunction(this.afterSubmit)) {
      return this.afterSubmit(action, postData, form)
    }
  },
  // 清理所有自定义事件
  cleanEvents: function() {
    this.onLoad = null
    this.onLoadActions = null
    this.onValidate = null
    this.afterSubButton = null
    this.beforeSubButton = null
    this._isInitialization = false
  }
})

export default JTemplate
