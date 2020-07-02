<template>
  <cell
    :icon="leftIcon"
    :title="label"
    :center="center"
    :border="border"
    :is-link="isLink"
    :required="required"
    :class="bem({
      error,
      disabled: $attrs.disabled,
      [`label-${labelAlign}`]: labelAlign,
      'min-height': type === 'textarea' && !autosize
    })"
  >
    <slot slot="title" name="label" />
    <div :class="bem('body')">
      <textarea
        v-if="type === 'textarea'"
        ref="input"
        v-bind="$attrs"
        :class="bem('control', inputAlign)"
        :value="value"
        :readonly="readonly"
        v-on="listeners"
      />
      <input
        v-else
        ref="input"
        v-bind="$attrs"
        :class="bem('control', inputAlign)"
        :type="type"
        :value="value"
        :readonly="readonly"
        v-on="listeners"
        :style="getFormateStyle(dataFormate)"
      >
      <icon v-if="readonly&&(dataFormate==='phone'||dataFormate==='telephone'||dataFormat==='contact')&&value" name="phone" size="20px" style="margin-right: 52%; color: #288ef0"></icon>
      <icon
        v-if="showClear&&type!=='number'"
        :class="bem('clear')"
        name="clear"
        @touchstart.prevent="$emit('input', '')"
      />
      <!--<icon
        v-if="showClear"
        :class="bem('clear')"
        name="clear"
        @touchstart.prevent="onRightIconClick"
      />-->
      <div v-if="$slots.icon || icon" :class="bem('icon')" @click="onClickIcon">
        <slot name="icon">
          <icon :name="icon" />
        </slot>
      </div>
      <div v-if="$slots.button" :class="bem('button')">
        <slot name="button" />
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
import create from '../utils/create'
import { isObj } from 'vant/lib/utils'
/**
 * 与官网一致，区别加入desc描述
 */
export default create({
  name: 'lc-field',

  inheritAttrs: false,

  props: {
    value: [String, Number],
    icon: String,
    label: String,
    desc: String,
    error: Boolean,
    height: [String, Number],
    dataFormate: String,
    center: Boolean,
    isLink: Boolean,
    leftIcon: String,
    readonly: Boolean,
    required: Boolean,
    clearable: Boolean,
    labelAlign: String,
    inputAlign: String,
    onIconClick: Function,
    autosize: [Boolean, Object],
    errorMessage: String,
    type: {
      type: String,
      default: 'text'
    },
    border: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      focused: false
    }
  },
  watch: {
    value() {
      this.$nextTick(this.adjustSize)
    }
  },
  mounted() {
    this.format()
    this.$nextTick(this.adjustSize)
  },
  computed: {
    showClear() {
      return this.clearable && this.focused && this.value !== '' && this.isDef(this.value) && !this.readonly
    },
    listeners() {
      return {
        ...this.$listeners,
        input: this.onInput,
        keypress: this.onKeypress,
        focus: this.onFocus,
        blur: this.onBlur
      }
    }
  },
  methods: {
    getFormateStyle() {
        if(this.dataFormate === 'phone' || this.dataFormate === 'telephone' || this.dataFormate === 'contact') {
            return 'color: #288ef0'
        }
    },
    onRightIconClick() {
      this.$emit('input', '')
    },
    blur() {
      this.$refs.input && this.$refs.input.blur()
      this.$emit('input', this.value)
    },
    // native maxlength not work when type = number
    format(target = this.$refs.input) {
      let { value } = target
      const { maxlength } = this.$attrs
      if (this.isDef(maxlength) && value.length > maxlength) {
        value = value.slice(0, maxlength)
        target.value = value
      }
      return value
    },
    onInput(event) {
      this.value = this.format(event.target)
    },
    onFocus(event) {
      this.focused = true
      this.$emit('focus', event)
      // hack for safari
      if (this.readonly) {
        this.blur()
      }
    },
    onBlur(event) {
      this.focused = false
      this.$emit('blur', event)
      this.blur()
    },
    onClickIcon() {
      this.$emit('click-icon')
      this.onIconClick && this.onIconClick()
    },
    onKeypress(event) {
      if (this.type === 'number') {
        const { keyCode } = event
        const allowPoint = String(this.value).indexOf('.') === -1
        const isValidKey = (keyCode >= 48 && keyCode <= 57) || (keyCode === 46 && allowPoint) || keyCode === 45
        if (!isValidKey) {
          event.preventDefault()
        }
      }
      if (this.type === 'search' && event.keyCode === 13) {
        this.blur()
      }
      this.$emit('keypress', event)
    },
    adjustSize() {
      const { input } = this.$refs
      if (!(this.type === 'textarea' && this.autosize) || !input) {
        return
      }
      input.style.height = this.height ? this.height + 'px' : 'auto'
      let height = input.scrollHeight
      if (isObj(this.autosize)) {
        const { maxHeight, minHeight } = this.autosize
        if (maxHeight) {
          height = Math.min(height, maxHeight)
        }
        if (minHeight) {
          height = Math.max(height, minHeight)
        }
      }
      if (height) {
        input.style.height = height + 'px'
      }
    }
  }
})
</script>
