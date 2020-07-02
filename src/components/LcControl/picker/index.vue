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
        :value="showLabel"
        :class="bem('control', inputAlign)"
        readonly="true"
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
      <van-picker
        ref="picker"
        :value-key="labelKey"
        :columns="columns"
        show-toolbar
        @confirm="onConfirm"
        @cancel="onCancel"
      />
    </van-popup>
  </cell>
</template>
<script>
import create from '../utils/create'

export default create({
  name: 'lc-picker',
  props: {
    value: [String, Number, Array],
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
    inputAlign: String,
    autosize: [Boolean, Object],
    errorMessage: String,
    border: {
      type: Boolean,
      default: true
    },
    valueKey: {
      type: String,
      default: 'value'
    },
    labelKey: {
      type: String,
      default: 'label'
    },
    options: {
      type: Array,
      default: []
    },
    showToolbar: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showPopup: false
    }
  },
  computed: {
    isObject() {
      return Object.prototype.toString.call(this.value).toLowerCase() === '[object object]'
    },
    showClear() {
      return this.clearable && this.value !== '' && this.isDef(this.value) && !this.readonly
    },
    // 展示的label
    showLabel() {
      return this.cacheOptions[this.value] || (this.isObject ? '' : this.value)
    },
    columns() {
      return this.options
    },
    cacheOptions() {
      const arr = this.options
      if (!arr || arr.length === 0) { return {} }
      const cacheOptions = {}
      for (let i = 0; i < arr.length; i++) {
        const option = arr[i]
        if (option instanceof String) {
          cacheOptions[option] = option
        } else {
          cacheOptions[option[this.valueKey] ] = option[this.labelKey]
        }
      }
      return cacheOptions
    }
  },
  watch: {
    value() {
      this.initSelected()
    }
  },
  methods: {
    initSelected() {
      if (this.value && this.$refs.picker) {
        return this.$refs.picker.setColumnValue(0, this.cacheOptions[this.value])
      }
    },
    onClick() {
      if (this.readonly) { return }
      this.showPopup = true
      setTimeout(() => {
        this.initSelected()
      }, 10)
    },
    onConfirm(data, index) {
      this.showPopup = false
      this.$emit('input', data[this.valueKey])
    },
    onCancel() {
      this.showPopup = false
    },
    onRightIconClick() {
      this.showClear ? this.onClear() : this.onClick()
    },
    onClear() {
      this.$emit('input', '')
    }
  }
})
</script>
