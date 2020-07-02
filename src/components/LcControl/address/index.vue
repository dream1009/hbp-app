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
        :value="showName"
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
    <div v-if="hasStreet && !(readonly && $utils.isEmpty(street))" :class="bem('street')">
      <van-field
        v-model="street"
        :placeholder="readonly?'':streetPlaceholder"
        :readonly="readonly"
        :disabled="$attrs.disabled"
        :clearable="clearable"
        autocapitalize="off"
        autocorrect="off"
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
      <lc-area
        v-model="areaValue"
        :area-data="areaData"
        :top="top"
        :top-val="topVal"
        :level="level"
        @confirm="onConfirm"
        @cancel="onCancel"
      />
    </van-popup>
  </cell>
</template>
<script>

import { getAreaData } from './util/areaData'
import create from '../utils/create'
import LcArea from './area'
import util from './util'

const dataTypeArr = util.dataTypeArr
const levelArr = util.levelArr
let AreaData = null

export default create({
  name: 'lc-address',
  components: {
    LcArea
  },
  props: {
    value: [String, Array],
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
    autosize: [Boolean, Object],
    errorMessage: String,
    border: {
      type: Boolean,
      default: true
    },
    dataType: {
      type: String,
      default: 'all',
      validator: (val) => {
        return util.oneOf(val, dataTypeArr)
      }
    },
    store: {// 返回值类型 stringKey字符串key , array: 数组,string 字符串类型
      type: String,
      default: 'stringKey',
      validator: function(value) {
        return ['array', 'string', 'stringKey'].indexOf(value) !== -1
      }
    },
    storeSeparator: {// 返回值分割符，对于设置字符串类型的分隔符
      type: String,
      default: ','
    },
    separator: { // 展示分割符
      type: String,
      default: '/'
    },
    top: { // 最大区域，可选： country、province、city、district
      type: String,
      default: 'country',
      validator: val => {
        return util.oneOf(val, levelArr)
      }
    },
    topVal: { // 最大区域的值，如top='province'  topVal='CN'
      type: [String, Number],
      default: '0'
    },
    level: {// 最小区域，可选： country、province、city、district
      type: String,
      default: 'district',
      validator: val => {
        return util.oneOf(val, levelArr)
      }
    },
    hasStreet: { // 支持街道
      type: Boolean
    },
    streetPlaceholder: {
      type: String,
      default: '请输入详细地址'
    }

  },
  data() {
    return {
      areaData: {},
      areaValue: [],
      showPopup: false,
      showName: '',
      street: ''
    }
  },
  computed: {
    showClear() {
      return this.clearable && this.$utils.isNotEmpty(this.value) && this.isDef(this.value) && !this.readonly
    }
  },
  watch: {
    value() {
      this.initData()
    },
    street() {
      this.$emit('input', this.getStoreValue(this.areaValue))
      this.$emit('change-street', this.street)
    }
  },
  methods: {
    init() {
      if (this.$utils.isEmpty(AreaData)) { // 从服务器加载地址数据
        getAreaData().then((data) => {
          this.areaData = AreaData = data
          this.initData()
        })
      } else {
        this.areaData = AreaData
        this.initData()
      }
    },
    initData() {
      this.areaValue = this.getArrayValue()
      this.showName = this.getShowName()
      if (this.hasStreet) { this.street = this.getStreetValue() }
    },
    getArrayValue() {
      if (this.$utils.isEmpty(this.value)) { return [] }
      if (this.store === 'stringKey') {
        try {
          return this.getStringKeyValue(this.$utils.parseData(this.value))
        } catch (error) {
          console.warn(error)
          return []
        }
      } else if (this.store === 'string') {
        try {
          return this.$utils.parseData(this.value)
        } catch (error) {
          console.warn(error)
          return []
        }
      } else {
        return this.value
      }
    },
    getStringKeyValue(v) {
      const topIndex = util.getLevelIndex(this.top)
      const levelIndex = util.getLevelIndex(this.level) + 1
      const res = []
      let supCode = this.topVal// 上一级
      for (let i = topIndex; i < levelIndex; i++) {
        const code = v[util.getLevelKey(i)]
        if (code) {
          res.push({
            code: code,
            name: this.areaData[supCode][code]
          })
          supCode = code
        }
      }
      return res
    },
    getStoreValue(value) {
      if (this.$utils.isEmpty(value)) { return '' }
      if (this.store === 'stringKey') {
        const res = {}
        let i = util.getLevelIndex(this.top)
        value.forEach((v) => {
          res[ util.getLevelKey(i)] = v ? v.code : ''
          i++
        })
        if (this.hasStreet) { res['street'] = this.street }
        return this.isEmpty(res) ? '' : JSON.stringify(res)
      } else if (this.store === 'string') {
        return value.join(this.storeSeparator)
      } else {
        return value || []
      }
    },
    getShowName() {
      if (this.$utils.isEmpty(this.areaValue)) { return '' }
      const showName = []
      this.areaValue.forEach(v => {
        showName.push(v.name)
      })
      return showName.join(this.separator)
    },
    getStreetValue() {
      if (this.$utils.isEmpty(this.value)) { return '' }
      if (this.store === 'stringKey') {
        try {
          const v = this.$utils.parseData(this.value)
          return v['street']
        } catch (error) {
          console.warn(error)
          return ''
        }
      }
    },
    onClick() {
      if (this.readonly) { return }
      this.showPopup = true
    },
    onCancel() {
      this.showPopup = false
    },
    onConfirm(data) {
      this.showPopup = false
      this.$emit('input', this.getStoreValue(data))
    },
    onRightIconClick() {
      this.showClear ? this.onClear() : this.onClick()
    },
    onClear() {
      this.$emit('input', this.getStoreValue())
    }
  },
  mounted() {
    this.init()
  }
})
</script>
