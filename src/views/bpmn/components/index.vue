<template>
  <div class="lc-field-cell lc-type-selector">
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
            v-if="isEmpty(selectedData) && !readonly"
            :class="bem('placeholder')"
          >
            {{ defaultPlaceholder }}
          </div>
          <template v-for="data in selectedData " v-else>
            <van-tag
              :key="data[valueKey]"
              type="primary"
              class="tag-span"
              v-text="data[labelKey]"
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

    <type-popup
      :show-popup="showPopup"
      :value="selectedValue"
      :category-key="categoryKey"

      :left-text="leftText"
      :value-key="valueKey"
      :label-key="labelKey"

      @init-data="initData"
      @cancel="onCancel"
      @confirm="onConfirm"
    />
  </div>
</template>
<script>
import TypePopup from './typePopup'
import { getType } from '@/api/platform/cat/type'
import create from '@/components/LcControl/utils/create'
import i18n from '@/lang' // Internationalization 国际化

export default create({
  name: 'lc-type',
  components: {
    TypePopup
  },
  props: {
    value: [String, Array],
    categoryKey: String,
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
    placeholder: {
      type: String
    },
    autosize: [Boolean, Object],
    errorMessage: String,
    border: {
      type: Boolean,
      default: true
    },
    store: {// 存储类型 对应[多选]有效，json： json字符串,id:只存储id， array：存储数组数据 ，arrayId: 字符串类型。
      type: String,
      default: 'id',
      validator: function(value) {
        return ['json', 'id', 'array', 'arrayId', 'bind'].indexOf(value) !== -1
      }
    },
    storeSeparator: {// 存储值分割符，对于设置字符串类型的分隔符
      type: String,
      default: ','
    },
    bindId: {
      type: String
    },
    leftText: {
      type: String,
      default: i18n.t('cancel')
    },
    idKey: {
      type: String,
      default: 'id'
    },
    parentIdKey: {
      type: String,
      default: 'parentId'
    },
    valueKey: {
      type: String,
      default: 'id'
    },
    labelKey: {
      type: String,
      default: 'name'
    },
    childrenKey: {
      type: String,
      default: 'children'
    }
  },
  data() {
    return {
      showPopup: false, // 弹窗
      selectedData: [], // 选中的值
      selectedValue: [],
      bindIdValue: ''
    }
  },
  computed: {
    showClear() {
      return this.clearable && this.isNotEmpty(this.value) && this.isDef(this.value) && !this.readonly
    },
    defaultPlaceholder() {
      if (this.placeholder) { return this.placeholder }
      const type = this.type ? this.$t('components.selector.' + this.type) : ''
      return i18n.t('components.selector.placeholder', { type: type })
    }
  },
  watch: {
    value() {
      if (this.isEmpty(this.value)) {
        this.selectedData = []
      } else {
        this.initSelectedData()
      }
    }
  },
  mounted() {
    // 初始化数据
    this.initSelectedData()
  },
  methods: {
    initSelectedData() {
      let id = ''
      if (this.store === 'id' && this.value) {
        id = this.value
      } else {
        return
      }
      getType({ id: id }).then(response => {
        const data = response.data
        if (data) {
          this.selectedData = [data]
        }
      }).catch((e) => {
        console.error(e)
      })
    },
    getArrayValue(value, bindId) {
      if (this.isEmpty(value)) {
        return []
      }
      if (this.store === 'json') { // json
        try {
          const data = this.$utils.parseData(value)
          return data.map((d) => {
            return d[this.valueKey]
          })
        } catch (error) {
          console.warn(error)
          return []
        }
      } else if (this.store === 'id') { // id
        return value.split(this.storeSeparator)
      } else if (this.store === 'arrayId') { // 数组id
        return value
      } else if (this.store === 'bind') { // 绑定id
        if (this.isEmpty(bindId)) {
          return []
        }
        return bindId.split(this.storeSeparator)
      } else {
        return value.map((d) => {
          return d[this.valueKey]
        })
      }
    },
    getStoreValue(value) {
      const res = []
      if (this.store === 'json') { // json
        if (this.isEmpty(value)) {
          return ''
        }
        value.forEach(v => {
          const o = {}
          o[this.valueKey] = v[this.valueKey]
          o[this.labelKey] = v[this.labelKey]
          res.push(o)
        })
        return JSON.stringify(res)
      } else if (this.store === 'id') { // id
        if (this.isEmpty(value)) {
          return ''
        }
        value.forEach(v => {
          res.push(v[this.valueKey])
        })
        return res.join(this.storeSeparator)
      } else if (this.store === 'arrayId') { // 数组id
        if (this.isEmpty(value)) {
          return []
        } else {
          return value.map((d) => {
            return d[this.valueKey]
          })
        }
      } else if (this.store === 'bind') { // 绑定id
        const res = []
        const bindIdValue = []
        value.forEach(v => {
          bindIdValue.push(v[this.valueKey])
          res.push(v[this.labelKey])
        })
        this.bindIdValue = bindIdValue.join(this.storeSeparator)

        return res.join(this.storeSeparator)
      } else { // 数组
        return value || []
      }
    },
    onClick() {
      if (this.readonly) { return }
      this.selectedValue = this.getArrayValue(this.value, this.bindId)
      this.showPopup = true
    },
    onCancel() {
      this.showPopup = false
    },
    onConfirm(selectedData) {
      if (this.isEmpty(selectedData)) {
        this.$toast('请选择！')
        return
      }
      this.showPopup = false
      this.selectedData = selectedData

      this.setInputValue(this.getStoreValue(selectedData))
      this.$emit('load-data')
    },
    onRightIconClick() {
      this.showClear ? this.onClear() : this.onClick()
    },
    onClear() {
      this.setInputValue(this.getStoreValue([]))
      this.$emit('clear-data')
    },
    setInputValue(value) {
      this.$emit('input', value)
      if (this.store === 'bind') {
        this.$nextTick(() => {
          this.$emit('bind-callback', this.bindIdValue)
        })
      }
    },
    // 回调初始化数据
    initData(data) {
      this.selectedData = data
    }
  }
})
</script>
<style lang="scss" >
  .lc-swipe-cell{
    .van-swipe-cell__left,
    .van-swipe-cell__right {
      color: #FFFFFF;
      font-size: 15px;
      width: 65px;
      height: 44px;
      display: inline-block;
      text-align: center;
      line-height: 44px;
      background-color: #F44;
    }
  }
</style>

