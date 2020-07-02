import _ from 'lodash'
import FormrenderResponseButton from '@/components/Formrender/button'
import { saveFormData } from '@/api/platform/data/dataTemplate'

var TemplateButton
window.TemplateButton = TemplateButton = function(options) {
  this.response_buttons = []
  this.initButtons(options)
}

TemplateButton.prototype = {
  initButtons: function(options) {
    var buttons = options.buttons
    var params = options.params
    for (var i = 0; i < buttons.length; i++) {
      var rf = buttons[i]
      rf.alias = rf[TemplateButton.key.BUTTON_TYPE]
      rf.label = rf[TemplateButton.key.LABEL]
      // TODO 屏蔽未开发的功能
      if (
        // rf.alias === 'close' ||
        rf.alias === 'print' ||
        rf.alias === 'startFlow' // ||
        // rf.alias === 'sefStartFlow'
      ) {
        continue
      }
      try {
        var button = new TemplateButton.Models[
          'ResponseButton' + _.upperFirst(rf.alias)
        ](rf, params)
        // 初始化按钮事件
        this.response_buttons.push(button)
      } catch (error) {
        console.error(error)
      }
    }
  }
}

TemplateButton.Models = {}
TemplateButton.BUTTON_TYPES = ['close', 'save', 'custom', 'startFlow']
TemplateButton.key = {
  BUTTON_TYPE: 'button_type',
  LABEL: 'label'
}

TemplateButton.VERSION = '2.0.0'

// 表单按钮
TemplateButton.Models.ResponseButton = FormrenderResponseButton.extend({
  aliasKey: TemplateButton.key.BUTTON_TYPE,
  /**
   * 版本号
   */
  getVersion: function() {
    return this.get('version')
  },
  /**
   * 表单key
   */
  getFormKey: function() {
    return this.get('formKey')
  },
  /**
   * bo的code
   */
  getBoCode: function() {
    return this.get('boCode')
  },
  /**
   * 主键
   */
  getPk: function() {
    return this.get('pk') || ''
  },
  getTemplateKey: function() {
    return this.get('templateKey')
  },
  getTemplateId: function() {
    return this.get('templateId')
  }
})

/**
 * 启动数据
 */
TemplateButton.Models.ResponseButtonSefStartFlow = TemplateButton.Models.ResponseButton.extend(
  {
    icon: 'save',
    style: 'primary',
    action(btn) {
      // 表单数据
      const formData = this.getFormData()
      // 验证表单是否正确
      this.getFormValidator().then(results => {
        const result = results.every(r => r)
        if (result) {
          // 表单提交校验
          const formSubmitVerify = this.getFormSubmitVerify()
          if (this.$utils.isNotEmpty(formSubmitVerify)) {
            return this.$toast(formSubmitVerify.msg)
          }
          // 保存数据
          btn.saveFormData.apply(this, [btn, formData])
        } else {
          this.formErrorToast()
        }
      })
    },
    saveFormData(btn, formData) {
      const jsonData = {
        formKey: btn.getFormKey(),
        code: btn.getBoCode(),
        pk: btn.getPk(),
        version: btn.getVersion(),
        data: JSON.stringify(formData)
      }
      // 保存数据
      saveFormData(jsonData).then(response => {
        this.$store.dispatch('setDataChange', false)
        this.$toast.success(`保存成功！`)
        this.$router.push({
          path: '/d/list/' + btn.getTemplateId()
        })
      })
    }
  }
)
// 关闭
TemplateButton.Models.ResponseButtonClose = TemplateButton.Models.ResponseButton.extend(
  {
    icon: 'close',
    action() {
      this.$store.dispatch('setDataChange', false)
      this.$router.go(-1)
    }
  }
)
// 打印
TemplateButton.Models.ResponseButtonPrint = TemplateButton.Models.ResponseButton.extend(
  {
    icon: 'print',
    action() {}
  }
)

// 自定义
TemplateButton.Models.ResponseButtonCustom = TemplateButton.Models.ResponseButton.extend(
  {
    icon: 'fa fa-lock',
    action() {
      this.$store.dispatch('setDataChange', false)
    }
  }
)

export default TemplateButton
