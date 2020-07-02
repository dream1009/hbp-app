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
      <div :class="bem('control', inputAlign)" @click="onClick">
        <div
          v-if="selectedOptions.length === 0"
          :class="bem('placeholder')"
        >
          {{ placeholder }}
        </div>
        <template v-for="option in selectedOptions " v-else>
          <van-tag
            :key="option[valueKey]"
            class="tag-span"
            type="primary"
            plain
            v-text="option[labelKey]"
          />
        </template>
      </div>
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
        autocapitalize="off"
        autocorrect="off"
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
      <div style="max-height: 260px; overflow:hidden;">
        <div v-if="showToolbar" class="van-picker__toolbar van-hairline--top-bottom">
          <slot>
            <div class="van-picker__cancel" @click="onCancel">
              {{ cancelButtonText || $t('cancel') }}
            </div>
            <div v-if="title" class="van-picker__title  van-ellipsis" @click="onTitleClick" v-text="title" />
            <div class="van-picker__confirm" @click="onConfirm">
              {{ confirmButtonText || $t('confirm') }}
            </div>
          </slot>
        </div>
        <div style="height: 220px; overflow: auto;">
          <van-checkbox-group v-model="checkbox" :max="max">
            <van-cell-group>
              <van-cell
                v-for="(option,index) in options"
                :key="option[valueKey]+index"
                class="cell-option"
                clickable
                @click="toggle(index)"
              >
                <div slot="title" :class="bem('label')">
                  <van-checkbox
                    ref="checkboxes"
                    :name="option[valueKey]"
                    :disabled="option['disabled']"
                    @click.native.stop="(e)=>clickCheckbox(e,index)"
                  >
                    {{ option[labelKey] }}
                  </van-checkbox>
                </div>
              </van-cell>
            </van-cell-group>
          </van-checkbox-group>
        </div>
      </div>
    </van-popup>
  </cell>
</template>
<script>
import create from '../utils/create'
import i18n from '@/lang' // Internationalization 国际化

export default create({
  name: 'lc-checkbox',
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
    placeholder: String,
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
    },
    options: {
      type: [Array, String],
      default: []
    },
    showToolbar: {
      type: Boolean,
      default: true
    },
    cancelButtonText: String,
    confirmButtonText: String
  },
  data() {
    return {
      checkbox: [],
      selectedOptions: [],
      showPopup: false,
      otherOption: '',
      otherOptionPlaceholder: '其他选项'
    }
  },
  computed: {
    showClear() {
      return this.clearable && this.value !== '' && this.isDef(this.value) && !this.readonly
    },
    title() {
      const length = this.checkbox.length
      return length > 0 ? i18n.t('components.checkbox.title', { length: length }) : ''
    },
    cacheOptions() {
      const arr = this.options
      if (!arr || arr.length === 0) { return [] }
      const cacheOptions = []
      for (let i = 0; i < arr.length; i++) {
        const option = arr[i]
        if (option instanceof String) {
          const o = {}
          o[this.labelKey] = o[this.valueKey] = option
          cacheOptions[option] = o
        } else {
          cacheOptions[option[this.valueKey] ] = option
        }
      }
      return cacheOptions
    },
    hasOtherOption() {
      return this.isIncludeOtherOption(this.getArrayValue())
    }

  },
  watch: {
    value() {
      this.$nextTick(this.initSelectedOptions())
    },
    otherOption() {
      this.$emit('change-other-option', this.otherOption)
    }
  },
  methods: {
    initSelectedOptions() {
      const value = this.getArrayValue()
      if (this.$utils.isEmpty(value)) {
        this.selectedOptions = []
        return
      }
      this.selectedOptions = value.map(v => { return this.cacheOptions[v] })
      this.setOtherOptionValue()
    },
    getArrayValue() {
      if (this.store === 'string') {
        if (this.$utils.isEmpty(this.value)) {
          return []
        } else {
          return this.value.split(this.storeSeparator)
        }
      } else {
        return this.value || []
      }
    },
    getStoreValue(value) {
      if (this.store === 'string') {
        return value.join(this.storeSeparator)
      } else {
        return value || []
      }
    },
    onClick() {
      if (this.readonly) { return }
      this.checkbox = this.getArrayValue()
      this.showPopup = true
    },
    clickCheckbox(event, index) {
      let flag = true
      const target = event.target
      if (target && target.className.indexOf('van-checkbox__label') > -1) {
        flag = false
      } else if (target && target.parentNode.className.indexOf('van-checkbox__icon') > -1) {
        flag = false
      }
      if (flag) {
        this.toggle(index)
      }
    },
    toggle(index) {
      this.$refs.checkboxes[index].toggle()
    },
    onTitleClick() {
      if (!this.$listeners['title-click']) { // 标题事件
        this.checkbox = []
      }
      this.$emit('title-click', this)
    },
    onCancel() {
      this.showPopup = false
      this.$emit('cancel', this)
    },
    onConfirm() {
      this.showPopup = false
      this.$emit('input', this.getStoreValue(this.checkbox))
      this.$emit('confirm', this)
    },
    onRightIconClick() {
      this.showClear ? this.onClear() : this.onClick()
    },
    onClear() {
      this.otherOption = ''
      this.$emit('input', this.getStoreValue([]))
    },
    setOtherOptionValue() {
      if (this.hasOtherOption) {
        this.otherOption = this.otherOptionValue
      }
    },
    isIncludeOtherOption(value) {
      for (let i = 0; i < value.length; i++) {
        var flag = this.cacheOptions[value[i]][this.otherOptionKey]
        if (flag) {
          return true
        }
      }
      return false
    },
    changeOtherOption(value) {
      this.$emit('change-other-option', value)
    }

  },
  mounted() {
    this.initSelectedOptions()
  }
})
</script>
