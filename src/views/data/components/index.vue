<template>
  <!-- 单项选择 -->
  <van-lc-radio
    v-if="item.fieldType==='radio'"
    v-model="parameter[item.modelValue]"
    :label="item.label"
    :desc="item.desc"
    :placeholder="placeholder"
    :options="options"
    :other-option-value="otherOptionValue"
    :value-key="'val'"
    :name="item.prop"
    :input-align="inputAlign"
    @change-other-option="changeOtherOption"
  />
  <!-- 多项选择 -->
  <van-lc-checkbox
    v-else-if="item.fieldType==='checkbox'"
    v-model="parameter[item.modelValue]"
    :label="item.label"
    :placeholder="item.options.placeholder"
    :other-option-value="otherOptionValue"
    :options="options"
    :value-key="'val'"
    :name="item.prop"
    :input-align="inputAlign"
    @change-other-option="changeOtherOption"
    v-on="$listeners"
  />
  <!-- 富文本 -->
  <van-lc-editor
    v-else-if="item.fieldType==='editor'"
    v-model="parameter[item.modelValue]"
    :label="item.label"
    :placeholder="item.options.placeholder"
    :height="height"
    :name="item.prop"
  />
  <!-- 自动编号 -->
  <van-lc-auto-number
    v-else-if="item.fieldType==='autoNumber'"
    ref="autoNumber"
    v-model="parameter[item.modelValue]"
    :label="item.label"
    :placeholder="item.options.placeholder"
    :identity="fieldOptions.identity"
    :init="$utils.toBoolean(fieldOptions.init)"
    :name="item.prop"
    @input="id => defaultData[item.modelValue] = id"
  />
  <!-- 上传附件 -->
  <van-lc-uploader
    v-else-if="item.fieldType==='attachment'"
    v-model="parameter[item.modelValue]"
    :label="item.label"
    :placeholder="item.options.placeholder"
    :store="fieldOptions.store||'json'"
    :max-size="maxFileSize"
    :file-quantity="fileQuantity"
    :accept="accept"
    :file-formates="fileFormates"
    :name="item.prop"
  />
  <!-- 自定义对话框 -->
  <van-lc-custom-dialog
    v-else-if="item.fieldType==='customDialog'"
    v-model="parameter[item.modelValue]"
    :label="item.label"
    :placeholder="item.options.placeholder"
    :multiple="!single"
    :template-key="fieldOptions.dialog"
    :store="fieldOptions.store"
    :field-options="fieldOptions"
    :dynamic-params="dynamicParams"
    :name="item.prop"
    :input-align="inputAlign"
    @callback="dialogCallback"
    @attr-callback="dialogAttrCallback"
  />
  <!-- 关联数据 -->
  <van-lc-linkdata
    v-else-if="item.fieldType==='linkdata'"
    v-model="parameter[item.modelValue]"
    :label="item.label"
    :placeholder="item.options.placeholder"
    :multiple="multiple"
    :template-key="fieldOptions.linkdata"
    :store="fieldOptions.store"
    :dynamic-params="dynamicParams"
    :field-options="fieldOptions"
    :name="item.prop"
    :input-align="inputAlign"
    @callback="linkdataCallback"
    @attr-callback="linkdataAttrCallback"
  />
  <!-- 地址 -->
  <van-lc-address
    v-else-if="item.fieldType==='address'"
    v-model="parameter[item.modelValue]"
    :label="item.label"
    :placeholder="item.options.placeholder"
    :top="fieldOptions.top"
    :top-val="getAddressTopVal()"
    :level="fieldOptions.level"
    :has-street="fieldOptions.is_street"
    :name="item.prop"
  />
  <!-- 当前时间、当前日期 -->
  <van-lc-date-picker
    v-else-if="item.fieldType==='currentDate'|| item.fieldType==='currentTime'"
    v-model="parameter[item.modelValue]"
    :label="item.label"
    :placeholder="item.options.placeholder"
    :format="dateFormat"
    :name="item.prop"
    type="custom"
  />
  <!-- 签名 -->
  <van-lc-signature
    v-else-if="item.fieldType==='signature'"
    v-model="parameter[item.modelValue]"
    :label="item.label"
    :placeholder="item.options.placeholder"
    :height="height"
    :name="item.name"
  />
  <!-- 选择器 -->
  <van-lc-selector
    v-else-if="item.fieldType==='currentUser'|| item.fieldType==='currentOrg'"
    v-model="parameter[item.modelValue]"
    :label="item.label"
    :placeholder="item.options.placeholder"
    :store="fieldOptions.store||'json'"
    :type="fieldOptions.selector_type||'user'"
    :multiple="!single"
    :bind-id="bindId"
    :field-options="fieldOptions"
    :name="item.prop"
    @bind-callback="selectorBindCallback"
  />
  <!-- 流程实例-->
  <van-lc-bpm-inst-his
    v-else-if="item.fieldType === 'bpmInstHis'"
    v-model="parameter[item.modelValue]"
    :label="item.label"
    :height="height"
    :params="bpmInstHisParams"
    :name="item.prop"
  />
</template>
<script>
import Vue from 'vue'
import LcControl from '@/components/LcControl'
Vue.use(LcControl)
import fecha from '@/utils/fecha'
import FormOptions from './constants/formoptions'
import { fileTypes as FILE_TYPES, accept as ACCEPT } from '@/constants/file'

export default {
  props: {
    value: {
      type: [String, Number, Boolean, Array, Object, Date]
    },
    readonly: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object
    },
    inputAlign: {
      type: String,
      default: 'right'
    },

    forms: {
      type: Array
    },
    item: Object
  },
  data() {
    const forms = this.forms
    const parameter = {}
    forms.forEach((v, i) => {
      const propType = typeof v.prop
      if (propType === 'string') {
        v.modelValue = v.prop
        parameter[v.prop] = ''
        if (v.fieldType === 'checker' || (v.fieldType === 'select' && v.options)) {
          const index = v.options.findIndex(a => {
            return a.value === ''
          })
          if (index > -1) {
            v.options[index].value = 'all'
            parameter[v.prop] = v.options[index].value
          } else {
            parameter[v.prop] = v.options[0].value
          }
        }
      } else if (
        propType === 'object' &&
          Object.prototype.toString.call(v.prop) === '[object Array]'
      ) {
        v.prop.forEach((vv, j) => {
          parameter[vv] = ''
        })
      }
    })
    return {
      parameter: parameter,
      ajaxOptions: [],
      defaultData: {}
    }
  },
  computed: {
    formData() {
      return this.data
    },
    fieldOptions() {
      return this.item.options || {}
    },
    label() {
      if (this.$utils.isNotEmpty(this.fieldOptions.units)) {
        return this.item.label + '(' + this.fieldOptions.units + ')'
      }
      return this.item.label
    },
    // 日期格式
    dateFormat() {
      if (this.item.fieldType === 'currentDate') {
        return FormOptions.t.DATE_FORMATS['date']
      } else if (this.item.fieldType === 'currentTime') {
        return FormOptions.t.DATE_FORMATS['datetime']
      } else {
        if (
          this.fieldOptions['datefmt_type'] &&
          this.fieldOptions['datefmt_type'] !== 'custom'
        ) {
          return (
            FormOptions.t.DATE_FORMATS[this.fieldOptions['datefmt_type']] ||
            FormOptions.t.DATE_FORMATS['date']
          )
        } else {
          return (
            this.fieldOptions['datefmt'] || FormOptions.t.DATE_FORMATS['date']
          )
        }
      }
    },
    /**
     * 单选、多选、下拉等选项
     */
    options() {
      return this.fieldOptions['options'] || []
    },
    /**
     * 其他选项的值
     */
    otherOptionValue() {
      const otherId = this.fieldOptions['option_other_id']
      if (this.$utils.isEmpty(otherId)) return
      return this.formData[otherId] || ''
    },
    /**
     *  占位符
     */
    placeholder() {
      return !this.$attrs.readonly ? this.fieldOptions['placeholder'] : ''
    },
    /**
     * 下拉占位符
     */
    selectPlaceholder() {
      return !this.$attrs.readonly
        ? this.fieldOptions['include_blank_value'] ||
            this.fieldOptions['placeholder']
        : ''
    },
    /**
     * 最大文件上传
     */
    maxFileSize() {
      if (this.$utils.isNotEmpty(this.fieldOptions.max_file_size)) {
        return this.fieldOptions.max_file_size * 1024 * 1024
      }
      return 100 * 1024 * 1024 // 最大100M
    },
    /**
     * 最大文件个数
     */
    fileQuantity() {
      const fileQuantity = this.fieldOptions.max_file_quantity
      if (
        this.$utils.isNotEmpty(fileQuantity) &&
        (fileQuantity !== '-1' || fileQuantity !== -1)
      ) {
        return parseInt(fileQuantity, 10)
      }
      return null
    },
    /**
     * 文件允许类型
     */
    accept() {
      const mediaType = this.fieldOptions.media_type
      if (this.$utils.isEmpty(mediaType)) {
        return '*'
      }
      return ACCEPT[mediaType] || '*'
    },
    /**
     * 文件格式
     */
    fileFormates() {
      const mediaType = this.fieldOptions.media_type
      if (this.$utils.isEmpty(mediaType)) {
        return []
      }
      const x = FILE_TYPES[mediaType]
      if (x) {
        return x.map(v => {
          return '.' + v
        })
      } else {
        return (this.fieldOptions.media || '').split(',')
      }
    },
    /**
     * 绑定ID
     */
    bindId() {
      const bindId = this.fieldOptions['bind_id']
      if (this.$utils.isEmpty(bindId)) {
        return ''
      }
      return this.formData[bindId] || ''
    },
    /**
     * 是否单选
     */
    single() {
      return this.$utils.toBoolean(this.fieldOptions['is_single'])
    },
    /**
     * 是否多选
     */
    multiple() {
      return this.$utils.toBoolean(this.fieldOptions['multiple'] === 'Y')
    },
    /**
     * 高度
     */
    height() {
      return this.fieldOptions.height
        ? parseInt(this.fieldOptions.height, 10)
        : null
    },

    /**
     * 动态参数、固定值
     */
    dynamicParams() {
      const paramsObj = this.fieldOptions['params'] || []
      const rtn = {}
      paramsObj.forEach(param => {
        let value = ''
        let bindTbName = '' // 绑定的表名
        let bindColumn = '' // 绑定的字段
        if (param.value) {
          const strValue = param.value.split('.')// 兼容旧版本
          bindTbName = strValue.length > 1 ? strValue[0] : ''
          bindColumn = strValue.length > 1 ? strValue[1] : strValue[0]
        }
        if (param.mode && param.mode === 'bind') { // 绑定字段
          if (this.isSubTable) { // TODO 子表 暂时未处理
            const subtbName = ''// 子表表名
            // ① 取相同子表值 同一列的值
            // ② 取主表的值
            console.info(subtbName)
            console.info(bindTbName)
          } else {
            value = this.data[bindColumn]
          }
        } else { // 固定值
          value = bindColumn
        }
        if (this.$utils.isNotEmpty(value)) {
          rtn[param.fieldName] = value
        }
      })
      return rtn
    },
    bpmInstHisParams() {
      const filter = this.fieldOptions.filter || {}
      return {
        bpmDefScope: filter.bpmDefScope || 'all',
        bpmDefKey: filter.bpmDefKey,
        script: filter.script,
        starterScope: filter.starterScope || 'current',
        starter: filter.starter
      }
    }
  },
  created() {
    this.defaultData = JSON.parse(JSON.stringify(this.parameter))
  },
  methods: {
    getParams() {
      return this.parameter
    },
    resetForm() {
      this.parameter = JSON.parse(JSON.stringify(this.defaultData))
      return this.parameter
    },
    formatDate(value) {
      if (this.$utils.isEmpty(value)) return ''
      if (value instanceof Date) {
        return fecha.format(value, this.dateFormat)
      } else {
        try {
          return fecha.format(this.parseFormatDate(value, this.dateFormat), this.dateFormat)
        } catch (error) {
          return value
        }
      }
    },
    changeOtherOption(value) {
      const otherId = this.fieldOptions['option_other_id']
      if (this.$utils.isEmpty(otherId)) return
      const formData = this.$utils.newData(this.formData)
      formData[otherId] = value
      this.changeFormData(formData)
    },
    getAddressTopVal() {
      const top = this.fieldOptions.top
      const topval = this.fieldOptions.topval
      if (this.$utils.isEmpty(topval)) {
        if (top === 'country') {
          return '0'
        }
        return '' // 异常配置
      }
      if (top === 'country') {
        return '0'
      } else if (top === 'province') {
        return topval['country'] + ''
      } else if (top === 'city') {
        return topval['province'] + ''
      } else if (top === 'district') {
        return topval['city'] + ''
      }
      return ''
    },
    /**
     * 对话框回调
     */
    dialogCallback(data, params) {
      const bind = this.getBind()
      if (this.$utils.isEmpty(bind)) {
        return
      }
      // 设置联动数据
      const formData = this.$utils.newData(this.formData)
      bind.forEach(obj => {
        const name = obj.name
        const field = obj.fieldName
        if (this.$utils.isEmpty(name) || this.$utils.isEmpty(field)) {
          return true
        }
        // TODO  目前只支持主表  数据处理没做
        const value = data
          .map(d => {
            return d[field]
          })
          .join(',')
        formData[name] = value
      })
      this.changeFormData(formData)
    },
    /**
     * 对话框回调
     */
    // TODO pc 端做这个功能再做
    dialogAttrCallback(data, params) {},
    /**
     * 关联数据回调
     */
    linkdataCallback(data, params) {
      const linkLinkage = this.getLinkLinkage()
      const linkAttr = this.getLinkAttr()
      if (this.$utils.isEmpty(linkLinkage) && this.$utils.isEmpty(linkAttr)) {
        return
      }

      // 设置联动数据
      const formData = this.$utils.newData(this.formData)
      linkLinkage.forEach(obj => {
        const name = obj.name
        const field = obj.field
        if (this.$utils.isEmpty(name) || this.$utils.isEmpty(field)) {
          return true
        }
        // TODO  目前只支持主表  数据处理没做
        const value = data
          .map(d => {
            return d[field]
          })
          .join(',')
        formData[name] = value
      })

      this.linkageChangeFormData(linkAttr, formData, data, params)
    },
    /**
     * 关联数据---关联属性
     */
    linkdataAttrCallback(data, params) {
      const linkAttr = this.getLinkAttr()
      if (this.$utils.isEmpty(linkAttr)) {
        return
      }
      const formData = this.$utils.newData(this.formData)
      this.linkageChangeFormData(linkAttr, formData, data, params)
    },
    /**
     * 关联数据----联动改变表单数据
     */
    linkageChangeFormData(linkAttr, formData, data, params) {
      if (this.$utils.isNotEmpty(linkAttr)) {
        // 关联属性
        linkAttr.forEach(obj => {
          const name = obj.name
          const field = obj.field
          if (this.$utils.isEmpty(name) || this.$utils.isEmpty(field)) {
            return true
          }
          // TODO  目前只支持主表  数据处理没做
          const value = data
            .map(d => {
              return d[field]
            })
            .join(',')
          formData[name] = value
        })
      }
      this.changeFormData(formData)
    },
    getLinkLinkage() {
      return this.fieldOptions['link_linkage'] || []
    },
    getLinkAttr: function() {
      return this.fieldOptions['link_attr'] || []
    },
    getBind: function() {
      return this.fieldOptions['bind'] || []
    },
    getBindId: function() {
      return this.fieldOptions['bind_id'] || ''
    },
    selectorBindCallback(data) {
      const bindId = this.getBindId()
      if (this.$utils.isNotEmpty(bindId)) {
        const formData = this.$utils.newData(this.formData)
        formData[bindId] = data
        this.changeFormData(formData)
      } else {
        this.$toast('[' + this.label + ']字段未绑Id')
      }
    },
    getEl() {
      return this.$refs.formItem.getEl()
    }
  }
}
</script>

