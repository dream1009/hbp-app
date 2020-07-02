<template>
  <van-checkbox-group
    :class="{
      [`is-${cols}col`]: cols >= 1
    }"
    :disabled="disabled"
    :max="max"
    class="lc-checker"
  >
    <div
      v-for="option in options"
      :key="option.value"
      class="lc-checker-col"
    >
      <div
        :class="{
          'checker':checker,
          'is-selected': value.indexOf(option.value) !== -1,
          'is-disabled': option.disabled || disabled,
          'is-ellipsis':ellipsis
        }"
        class="lc-checker-item"
        @click="select(option)"
      >
        <slot
          :option="option"
          :select="select"
          name="content"
        >
          {{ option.label }}
        </slot>
      </div>
    </div>
  </van-checkbox-group>
</template>

<script>
export default {
  name: 'LcChecker',
  props: {
    value: {
      type: Array,
      default: () => []
    },
    type: { // radio 或者checkbox
      type: String,
      default: 'checkbox'
    },
    options: {
      type: Array,
      default: () => []
    },
    ellipsis: {
      type: Boolean,
      default: true
    },
    radioRequired: Boolean,
    max: {
      type: [String, Number]
    },
    maxToast: Boolean,
    maxMessage: {
      type: String,
      default: () => {
        return `超过选择最大个数：{max}`
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    cols: {
      type: Number,
      default: 0
    },
    checker: Boolean
  },
  computed: {
    checkboxGroup() {
      return this.value
    }
  },
  methods: {
    // MARK: events handler
    $_onInput(values) {
      this.$emit('input', values)
    },
    // MARK: public methods
    select({ value, disabled }) {
      if (disabled) { return }
      const checkedValue = this.checkboxGroup.slice()
      let res = []
      const index = checkedValue.indexOf(value)
      if (this.type === 'radio') {
        const index = checkedValue.indexOf(value)
        if (index === -1 || (this.radioRequired && index === 0)) {
          res = [value]
        } else {
          res = []
        }
      } else {
        if (index !== -1) {
          checkedValue.splice(index, 1)
        } else {
          if (this.max && checkedValue.length >= this.max) {
            if (this.maxToast) {
              this.$toast(this.$utils.format(this.maxMessage, {
                max: this.max
              }))
            }

            return
          }
          checkedValue.push(value)
        }
        res = checkedValue
      }
      this.$_onInput(res)
    }
  }
}
</script>
