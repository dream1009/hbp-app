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
    <!---其他选项-->
    <div
      v-if="hasOtherOption"
      :class="bem('other')"
    >
      <van-field
        v-model="otherOption"
        :placeholder="readonly?'':otherOptionPlaceholder"
        :readonly="readonly"
        :disabled="$attrs.disabled"
        clearable
        type="textarea"
        rows="1"
        autosize
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
      <div style="height: 250px;overflow: auto;">
        <van-radio-group v-model="radio">
          <van-cell-group>
            <van-cell
              v-for="option in options"
              :key="option[valueKey]"
              class="cell-option"
              clickable
              @click="onRadioClick(option[valueKey])"
            >
              <div slot="title" :class="bem('label')">
                <van-radio
                  :name="option[valueKey]"
                  :disabled="option['disabled']"
                >
                  {{ option[labelKey] }}
                </van-radio>
              </div>
            </van-cell>
          </van-cell-group>
        </van-radio-group>
      </div>
    </van-popup>
  </cell>
</template>
<script>
import create from '../utils/create'
export default create({
  name: 'lc-radio',
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
    options: {
      type: Array,
      default: []
    },
    valueKey: {
      type: String,
      default: 'value'
    },
    labelKey: {
      type: String,
      default: 'label'
    },
    otherOptionKey: {
      type: String,
      default: 'include_other_option'
    },
    otherOptionValue: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      radio: '',
      showPopup: false,
      otherOption: '',
      otherOptionPlaceholder: '其他选项'
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
      if (this.cacheOptions[this.value]) {
        return this.cacheOptions[this.value][this.labelKey]
      }
      return (this.isObject ? '' : this.value)
    },
    cacheOptions() {
      const arr = this.options
      if (!arr || arr.length === 0) { return {} }
      const cacheOptions = {}
      for (let i = 0; i < arr.length; i++) {
        const option = arr[i]
        if (option instanceof String) {
          cacheOptions[option] = {
            [this.labelKey]: option
          }
        } else {
          cacheOptions[option[this.valueKey] ] = option
        }
      }
      return cacheOptions
    },
    hasOtherOption() {
      return this.isIncludeOtherOption(this.value)
    }
  },
  watch: {
    radio() {
      this.$emit('input', this.radio)
    },
    otherOption() {
      this.$emit('change-other-option', this.otherOption)
    }
  },
  mounted() {
    this.setOtherOptionValue()
  },
  methods: {
    onClick() {
      if (this.readonly) { return }
      this.radio = this.value
      this.showPopup = true
    },
    onRadioClick(val) {
      this.radio = val
      this.showPopup = false
    },
    onRightIconClick() {
      this.showClear ? this.onClear() : this.onClick()
    },
    onClear() {
      this.otherOption = ''
      this.$emit('input', '')
    },
    setOtherOptionValue() {
      if (this.hasOtherOption) {
        this.otherOption = this.otherOptionValue
      }
    },
    isIncludeOtherOption(value) {
      if (this.cacheOptions[value]) {
        return !!this.cacheOptions[value][this.otherOptionKey]
      }
      return false
    },
    changeOtherOption(value) {
      this.$emit('change-other-option', value)
    }
  }
})
</script>
