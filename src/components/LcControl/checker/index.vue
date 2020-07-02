<template>
  <cell
    :title="label"
    :required="required"
    :center="center"
    :border="border"
    :class="bem({
      error,
      disabled: $attrs.disabled,
      [`label-${labelAlign}`]: labelAlign
    })"
  >
    <slot slot="title" class="title" name="label" />
    <div :class="bem('body')">
      <div :class="bem('control')">
        <checker
          v-model="checkerValue"
          :type="type"
          :options="options"
          :max="max"
          :ellipsis="ellipsis"
          :max-toast="maxToast"
          :max-message="maxMessage"
          :checker="checker"
          :disabled="readonly||disabled"
          :radio-required="radioRequired"
          :cols="cols"
          @input="$_onInput"
        />
      </div>
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
  </cell>
</template>

<script>
/**
 * 参考功能：
 * https://vux.li/demos/v2/?x-page=v2-doc-home#/component/checker
 * TODO 未实现的功能
 */
import create from '../utils/create'
import Checker from '@/components/Checker'
export default create({
  name: 'lc-checker',
  components: {
    Checker
  },
  props: {
    value: {
      type: [String, Number, Array],
      default: () => []
    },
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
    errorMessage: String,
    border: {
      type: Boolean,
      default: true
    },
    store: {// 返回值类型  array: 数组。string 字符串类型
      type: String,
      default: 'string',
      validator: function(value) {
        return ['array', 'string'].indexOf(value) !== -1
      }
    },
    storeSeparator: {// 返回值分割符，对于设置字符串类型的分隔符
      type: String,
      default: ','
    },
    type: { // radio 或者checkbox
      type: String,
      default: 'checkbox'
    },
    options: { // 选项值
      type: Array,
      default: () => [],
      validator: function(value) {
        value.forEach(i => {
          if (i.value === '') {
            i.value = 'all'
          }
        })
        return value
      }
    },
    ellipsis: {
      type: Boolean,
      default: true
    },
    radioRequired: Boolean,
    max: [String, Number],
    maxToast: {
      type: Boolean,
      default: true
    },
    maxMessage: String,
    disabled: {
      type: Boolean,
      default: false
    },
    cols: {
      type: Number,
      default: 0
    },
    checker: Boolean // checker 有打勾的
  },
  data() {
    return {
      checkerValue: this.$_getArrayValue()
    }
  },
  watch: {
    value: {
      handler: function(val, oldVal) {
        if (val === '') {
          this.checkerValue = this.$_getArrayValue(val)
        }
      },
      immediate: true
    }
  },
  methods: {
    $_onInput(values) {
      const arr = []
      if (values.length === 1 && this.type === 'radio') {
        if (values[0] === 'all') {
          this.$emit('input', this.$_getStoreValue(arr))
        } else {
          this.$emit('input', this.$_getStoreValue(values))
        }
      } else {
        this.$emit('input', this.$_getStoreValue(values))
      }
    },
    $_getArrayValue(values = this.value) {
      if (this.store === 'string') {
        let value = values
        if (value === '' && this.type === 'radio') {
          value = 'all'
        }
        return this.$utils.isNotEmpty(value) ? value.split(this.storeSeparator) : []
      } else {
        return values || []
      }
    },
    $_getStoreValue(value) {
      if (this.store === 'string') {
        return value.join(this.storeSeparator)
      } else {
        return value || []
      }
    }
  }
})

</script>
