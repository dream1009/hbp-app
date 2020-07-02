<template>
  <div>
    <div v-for="(item,i) in forms" :key="i">
      <!-- 单行文本--数字--数字范围 -->
      <van-lc-field
        v-if="item.fieldType==='text' || item.fieldType==='number'|| item.fieldType==='numberRange' ||item.fieldType === undefined"
        v-model="params[item.modelValue]"
        :label="item.label"
        :name="item.prop"
        :type="item.fieldType||'text'"
        :input-align="inputAlign"
        placeholder="请输入"
        autosize
        clearable
      />
      <!-- 隐藏域 -->
      <input v-else-if="item.fieldType==='hidden'" :value="value" type="hidden">
      <!-- 下拉 -->
      <van-lc-picker
        v-else-if="item.fieldType==='select'"
        v-model="params[item.modelValue]"
        :name="item.prop"
        :options="item.options"
        :label="item.label"
        :input-align="inputAlign"
        :value-key="item.valueKey"
        placeholder="请选择"
      />
      <!-- 选择器 -->
      <van-lc-selector
        v-else-if="item.fieldType==='selector'"
        v-model="params[item.modelValue]"
        :name="item.prop"
        :label="item.label"
        :store="item.type||'id'"
        :type="item.options.selector_type"
        :multiple="item.multiple"
        :input-align="inputAlign"
        placeholder="请选择"
        clearable
      />
      <!-- 数据字典 -->
      <van-lc-dictionary
        v-if="item.fieldType==='dictionary'"
        v-model="params[item.modelValue]"
        :multiple="false"
        :input-align="inputAlign"
        :label="item.label"
        :select-mode="item.selectMode"
        :display-mode="item.displayMode"
        :cat-type="item.options.dictionary"
        placeholder="请选择"
        clearable
      />
      <!-- 日期 -->
      <van-lc-date-picker
        v-else-if="item.fieldType==='datePicker'"
        v-model="params[item.modelValue]"
        placeholder="请选择"
        :type="item.options.datefmt_type||'custom'"
        :label="item.label"
        :format="item.options.datefmt||dateFormat"
        :name="item.prop"
        :input-align="inputAlign"
        clearable
      />
      <!-- 日期范围 -->
      <van-lc-daterange
        v-else-if="item.fieldType==='dateRange'"
        ref="daterange"
        v-model="params[item.modelValue]"
        :label="item.label"
        :date-format="item.options.datefmt"
        placeholder="请选择"
        @input="val=> dateInput(val, item)"
      />

      <!-- 自定义插槽 -->
      <template v-else>
        <slot :name="item.slotName" :item="item" />
      </template>
    </div>

  </div>
</template>
<script>
import vanLcField from '@/components/LcControl/field'
import vanLcPicker from '@/components/LcControl/picker'
import vanLcSelector from '@/components/LcControl/selector'
import vanLcDictionary from '@/components/LcControl/dictionary'
import vanLcDatePicker from '@/components/LcControl/date-picker'
import vanLcDaterange from '@/components/LcControl/daterange'

export default {
  components: {
    vanLcField,
    vanLcPicker,

    vanLcSelector,
    vanLcDictionary,

    vanLcDatePicker,
    vanLcDaterange

  },
  props: {
    forms: {
      type: Array
    },
    inputAlign: {
      type: String,
      default: 'right'
    }

  },
  data() {
    const forms = this.forms
    const params = {}
    const datePrefix = 'daterange-prefix'
    const nameParams = {}
    const format = {}
    forms.forEach((v, i) => {
      const propType = typeof v.prop
      if (propType === 'string') {
        v.modelValue = v.prop
        params[v.prop] = ''
        if (v.name) {
          nameParams[v.prop] = v.name
        }
        if (v.format) {
          format[v.prop] = v.format
        }
      } else if (propType === 'object' && Object.prototype.toString.call(v.prop) === '[object Array]') {
        v.prop.forEach((vv, j) => {
          params[vv] = ''
          if (v.name) {
            nameParams[vv] = v.name[j]
          }
          if (v.format) {
            format[vv] = v.format
          }
        })
      }
      if (v.fieldType === 'dateRange') {
        const key = datePrefix + i
        params[key] = ''
        v.modelValue = key
      }
    })
    return {
      params: params,
      nameParams: nameParams,
      format: format,
      datePrefix: datePrefix,
      defaultData: {}
    }
  },
  computed: {
    fieldOptions() {
      return this.item.options || {}
    },
    /**
     * 单选、多选、下拉等选项
     */
    options() {
      return this.fieldOptions['options'] || []
    }
  },
  created() {
    this.defaultData = JSON.parse(JSON.stringify(this.params))
  },
  methods: {
    dateInput(date, form) {
      let dates = ['', '']
      if (date !== null) {
        if (date.length === 2) {
          dates = date
        }
      }
      this.params[form.modelValue] = dates

      this.params[form.prop[0]] = dates[0]
      this.params[form.prop[1]] = dates[1]
    },
    getData() {
      const data = {}
      const { params, nameParams, datePrefix, format } = this
      Object.keys(params).forEach(v => {
        if (v.indexOf(datePrefix) === -1) {
          const val = format[v] ? format[v](params[v], v) : params[v]
          if (this.$utils.isNotEmpty(val)) {
            const key = nameParams[v] ? nameParams[v] : v
            data[key] = val
          }
        }
      })
      return data
    },
    resetSearchForm() {
      this.$refs['daterange'] ? this.$refs['daterange'][0].resetDate() : null
      this.params = JSON.parse(JSON.stringify(this.defaultData))
    }
  }
}
</script>
