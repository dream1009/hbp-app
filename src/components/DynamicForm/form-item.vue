<template>
  <dynamic-form-field
    v-show="!hidden"
    ref="formField"
    :item="field"
    :items="formField"
    :value="value"
    :readonly="readonly"
    :required="required"
    :params="params"
    :data="data"
    :form-opinion="formOpinion"
    @input="handleInput($event)"
    @change-form-data="changeFormData($event)"
    @change-form-opinion="changeFormOpinion"
  />
</template>
<script>
import FormUtil from './utils/formUtil'
export default {
  props: {
    field: {
      type: Object,
      required: true
    },
    data: {
      type: Object
    },
    formData: {
      type: Object
    },
    value: {
      type: [String, Number, Boolean, Array, Object, Date]
    },
    rights: { // 设置权限
      type: [String, Object],
      default: 'e'
    },
    isReadonly: Boolean,
    formOpinion: Array, // 表单意见
    formField: Array,
    // 扩展参数
    params: Object
  },
  data() {
    return {
      tableData: this.data
    }
  },
  computed: {
    // 是否隐藏
    hidden() {
      // pc 设置移动端隐藏
      return this.$utils.toBoolean(this.fieldOptions.mobile, true) ? this.rights === 'h' : true
    },
    // 是否只读
    readonly() {
      return this.isReadonly ? true : this.rights === 'r'
    },
    // 必填
    required() {
      // 只读、隐藏，都不设置必填
      return (this.readonly || this.hidden) ? false : (this.rights === 'b' ? true : this.fieldOptions.required || false)
    },
    fieldOptions() {
      return this.field.field_options || {}
    }
  },
  watch: {
    // data() {
    //   this.runCalFormula()
    // },
    value(n, o) {
      if (n === o) return;
      this.tableData = { ...this.data, [this.field.name]: this.value }
      // 值改变进行公式计算
      this.runCalFormula()
      // 值改变进行数据联动
      this.runLinkage()

      this.$emit('cinput', this.tableData)
      if (this.$utils.isNotEmpty(this.formData)) {
        this.$emit('change-form-data', this.formData)
      }
    }
  },
  created() {
      this.runCalFormula()
  },
  methods: {
    // 单个值的修改
    handleInput(val) {
      if (this.field.field_type === 'linkdata') {
        const link_config = this.field.field_options.link_config
        const id = link_config.id
        val = JSON.parse(val)[0][id]
      }
      if (val.constructor === Array && this.data[this.field.name] === '') {
        this.data[this.field.name] = val
      }
      // 这里没有上报event，直接就是value了.
      const eventData = { ...this.data, [this.field.name]: val }
      this.$emit('cinput', eventData)
    },
    // 表单值的修改
    changeFormData(data) {
      this.$emit('cinput', data)
    },
    // 表单意见
    changeFormOpinion(data) {
      this.$emit('change-form-opinion', data)
    },
    //  计算公式计算
    runCalFormula() {
      const field = this.field || {}
      if (field.isSub) {
        const key = field.code + '.' + field.name
        const formula = this.params.responseFormula ? this.params.responseFormula[key] : null
        if (formula) {
          FormUtil.runCalFormula(formula, this.formData, field, field.row)
        }
      } else {
        field.code = (field.code || this.params.code)
        const key = field.code + '.' + field.name
        const formula = this.params.responseFormula[key]
        if (formula) {
          FormUtil.runCalFormula(formula, this.tableData, field)
        }
      }
    },
    /**
     * 计算联动数据
     */
    runLinkage() {
      const field = this.field || {}
      if (field.isSub) {
        const key = field.code + '.' + field.name
        const linkages = this.params.responseLinkages ? this.params.responseLinkages[key] : null
        if (linkages) {
          FormUtil.runLinkage(linkages, this.formData, field, field.row)
        }
      } else {
        field.code = (field.code || this.params.code)
        const key = field.code + '.' + field.name
        const linkages = this.params.responseLinkages[key]

        if (linkages) {
          FormUtil.runLinkage(linkages, this.tableData, field)
        }
      }
    },
    /**
     * 获得表单验证
     */
    getFormValidator() {
      return this.$refs.formField.$validator
    },
    /**
     *  获得表单验证的第一个错误
     */
    getFirstError() {
      return this.$refs.formField.errors.has(this.field.name) ? this.$refs.formField.errors.first(this.field.name) : ''
    },
    /**
     * 获得表单错误信息
     */
    getFormErrors() {
      return this.$refs.formField.errors
    },
    /**
     *  当前字段
     */
    getEl() {
      return this.$refs.formField.getEl()
    }
  }
}
</script>

