<template>
  <cell
    :title="label"
    :required="required"
    :center="center"
    :border="border"
    :class="bem({
      error,
      disabled: $attrs.disabled,
      [`label-${labelAlign}`]: labelAlign,
      'min-height':autosize
    })"
  >
    <slot slot="title" name="label" />
    <div :class="bem('body')">
      <input
        ref="input"
        v-bind="$attrs"
        :value="datePickerValue"
        :class="bem('control', inputAlign)"
        readonly="readonly"
        @click="onClick"
      >
      <icon
        v-if="!readonly"
        slot="right-icon"
        :name="showClear?'clear':'arrow'"
        :class="showClear?bem('clear'):''"
        class="van-cell__right-icon "
        @click="onRightIconClick"
      />
    </div>
    <div
      v-if="errorMessage"
      :class="bem('error-message')"
      v-text="errorMessage"
    />
    <div
      v-if="desc"
      :class="bem('desc')"
      v-text="desc"
    />
    <van-popup
      v-model="showPopup"
      position="bottom"
    >
      <date-picker
        ref="datePicker"
        :type="type"
        :custom-types="customTypes"
        :min-date="minDate"
        :max-date="maxDate"
        :default-date="defaultDate"
        :minute-step="minuteStep"
        :unit-text="unitText"
        :today-text="todayText"
        @confirm="onDatePickerConfirm"
        @cancel="onDatePickerCancel"
      />
    </van-popup>
  </cell>
</template>
<script>

import create from '../utils/create'
import fecha from '@/utils/fecha'
import DatePicker from './datePicker'

export default create({
  name: 'lc-date-picker',
  components: {
    DatePicker
  },
  props: {
    value: [String, Date],
    icon: String,
    label: String,
    desc: String,
    error: Boolean,
    center: Boolean,
    leftIcon: String,
    readonly: Boolean,
    required: Boolean,
    clearable: {
      type: Boolean,
      default: true
    },
    labelAlign: String,
    inputAlign: {
      type: String,
      default: 'left'
    },
    max: Number,
    autosize: [Boolean, Object],
    errorMessage: String,
    border: {
      type: Boolean,
      default: true
    },

    type: { // date, time, datetime,custom
      type: String,
      default: 'custom'
    },
    format: {
      type: String,
      default: 'yyyy-MM-dd hh:mm:ss'
    },
    minDate: {
      type: Date
    },
    maxDate: {
      type: Date
    },
    defaultValue: {
      type: [String, Date],
      default: () => {
        return new Date()
      }
    },
    minuteStep: {
      type: Number
    },
    unitText: {
      type: Array
    },
    todayText: {
      type: String
    }
  },
  data() {
    return {
      selectedOptions: [],
      showPopup: false
    }
  },
  computed: {
    showClear() {
      return this.clearable && this.isNotEmpty(this.value) && this.isDef(this.value) && !this.readonly
    },
    customTypes() {
      return this.getCustomTypes()
    },
    datePickerValue() {
      if (this.isEmpty(this.value)) {
        return ''
      }
      if (this.value instanceof Date) {
        return fecha.format(this.value, this.format)
      } else {
        try {
          return fecha.format(this.parseFormatDate(this.value, this.format), this.format)
        } catch (error) {
          return this.value
        }
      }
    },
    defaultDate() { // 默认日期值
      if (this.isNotEmpty(this.value)) {
        if (this.value instanceof Date) {
          return this.value
        } else {
          return fecha.parse(this.value, this.format)
        }
      }
      if (this.defaultValue instanceof Date) {
        return this.defaultValue
      } else {
        return fecha.parse(this.defaultValue, this.format)
      }
    }
  },
  methods: {
    onClick() {
      if (this.readonly) { return }
      this.showPopup = true
    },
    onRightIconClick() {
      this.showClear ? this.onClear() : this.onClick()
    },
    onClear() {
      this.$emit('input', '')
    },
    onDatePickerConfirm(columnsValue) {
      this.showPopup = false
      this.$emit('input', this.$refs.datePicker.getFormatDate(this.format))
    },
    onDatePickerCancel() {
      this.showPopup = false
    },
    parseFormatDate(time, cFormat) {
      let d = fecha.parse(time, cFormat || 'yyyy-MM-dd')
      if (d) return d
      const dateFormat = ['yyyy-MM-dd HH:mm:ss', 'yyyy-MM-dd', 'HH:mm:ss', 'HH:mm']
      for (let i = 0; i < dateFormat.length; i++) {
        d = fecha.parse(time, dateFormat[i])
        if (d) return d
      }
      return time
    },
    getCustomTypes() {
      if (this.type !== 'custom') {
        return
      }
      // 自定义日期类型
      // 匹配的字符串
      const tokenRe = /yyyy|yyy|yy|y|MMMM|MMM|MM|M|dd|d|%ld|HH|H|mm|m|ss|s|DD|D|WW|W|w|hd/g
      return this.format.match(tokenRe)
    }
  }
})
</script>

