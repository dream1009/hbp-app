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
      <van-switch
        v-model="switchValue"
        :size="size"
        :disabled="disabled"
        :loading="loading"
        @input="onInput"
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
  </cell>
</template>
<script>
import create from '../utils/create'
export default create({
  name: 'lc-switch',
  props: {
    value: [Boolean, String, Number],
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
    activeValue: {// switch 打开时的值
      type: [Boolean, String, Number],
      default: true
    },
    inactiveValue: {// switch 关闭时的值
      type: [Boolean, String, Number],
      default: false
    },
    loading: Boolean,
    disabled: Boolean,
    size: {
      type: String,
      default: '26px'
    }

  },
  data() {
    return {
      switchValue: this.activeValue === this.value
    }
  },
  watch: {
    value() {
      this.switchValue = this.activeValue === this.value
      this.$emit('change', this.value)
    }
  },
  methods: {
    onInput(val) {
      this.$emit('input', val ? this.activeValue : this.inactiveValue)
    }
  }
})
</script>
