<template>
  <div>
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
    />
    <van-row>
      <van-col span="11">
        <van-lc-date-picker
          :value="displayValue && displayValue[0]"
          :placeholder="placeholder"
          :format="dateFormat"
          input-align="center"
          clearable
          @input="handleStartInput"
        />
      </van-col>
      <van-col span="2">
        <div class="line">-</div>
      </van-col>
      <van-col span="11">
        <van-lc-date-picker
          :value="displayValue && displayValue[1]"
          :placeholder="placeholder"
          :format="dateFormat"
          input-align="center"
          clearable
          @input="handleEndInput"
        />
      </van-col>
    </van-row>
  </div>
</template>
<script>
import create from '../utils/create'
import fecha from '@/utils/fecha'
import vanLcDatePicker from '@/components/LcControl/date-picker'

const rangeFormatter = function(value, format) {
  if (Array.isArray(value) && value.length === 2) {
    let start = value[0] || ''
    let end = value[1] || ''
    if (start) { start = fecha.format(start, format) }
    if (end) { end = fecha.format(end, format) }
    return [start, end]
  }
  return ''
}

function formatAsFormatAndType(value, customFormat) {
  if (!value) return null
  return rangeFormatter(value, customFormat) // 返回数组形式数据
}

const rangeParse = function(value, format) {
  if (Array.isArray(value) && value.length === 2) {
    let start = value[0] || null
    let end = value[1] || null
    if (start) { start = fecha.parse(start, format) }
    if (end) { end = fecha.parse(end, format) }
    return [start, end]
  }
  return ''
}

function parseAsFormatAndType(value, customFormat) {
  if (!value) return null
  return rangeParse(value, customFormat)// 返回数组形式数据
}

export default create({
  name: 'lc-daterange',
  props: {
    value: [String, Array],
    label: String,
    error: Boolean,
    center: Boolean,
    required: Boolean,
    clearable: {
      type: Boolean,
      default: true
    },
    labelAlign: String,
    autosize: [Boolean, Object],
    border: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    dateFormat: {
      type: String,
      default: 'yyyy-MM-dd hh:mm:ss'
    }
  },
  components: {
    vanLcDatePicker
  },
  data() {
    return {
      userInput: null
    }
  },
  computed: {
    displayValue() {
      const formattedValue = formatAsFormatAndType(this.parsedValue, this.dateFormat)
      if (formattedValue) {
        return [
          (formattedValue && formattedValue[0]) || '',
          (formattedValue && formattedValue[1]) || ''
        ]
      } else if (this.userInput !== null) {
        return this.userInput
      } else {
        return ''
      }
    },
    parsedValue() {
      if (!this.value) return this.value
      return parseAsFormatAndType(this.value, this.dateFormat) || this.value
    }
  },
  methods: {
    emitInput(val) {
      const formatted = formatAsFormatAndType(val, this.dateFormat)
      this.$emit('input', formatted)
    },
    handleStartInput(value) {
      if (this.userInput) {
        this.userInput = [value, this.userInput[1]]
      } else {
        this.userInput = [value, null]
      }
      this.$emit('input', this.userInput)
    },
    handleEndInput(value) {
      if (this.userInput) {
        this.userInput = [this.userInput[0], value]
      } else {
        this.userInput = [null, value]
      }
      this.$emit('input', this.userInput)
    },
    resetDate() {
      this.userInput = null
    }
  }
})
</script>
<style lang="scss">
.line{
  text-align: center;
  line-height: 44px;
}
</style>
