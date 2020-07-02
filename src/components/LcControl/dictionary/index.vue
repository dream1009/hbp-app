<template>
  <div class="lc-field-cell">
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
      <div :class="bem('body')" @click="onClick">
        <div :class="bem('control', inputAlign)" @click="onClick">
          <div
            v-if="isEmpty(selectedOptions)"
            :class="bem('placeholder')"
          >
            {{ placeholder }}
          </div>
          <template v-for="option in selectedOptions " v-else>
            <van-tag
              v-if="multiple"
              :key="option[labelKey]+option[valueKey]"
              class="tag-span"
              type="primary"
              plain
              v-text="showLabel(option)"
            />
            <div
              v-else
              :key="option[labelKey]+option[valueKey]"
              v-text="showLabel(option)"
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

    <!---弹窗 -->
    <van-popup
      v-if="showPopup"
      v-model="showPopup"
      class="lc-fullscreen-popup"
      position="bottom"
      @click-overlay="clickOverlay"
    >
      <van-nav-bar :left-text="leftText" left-arrow :style="getBackGroundStyle()" @click-left="onCancel">
        <span slot="title" :style="getTextStyle()" @click="onTitle()">{{ title }}</span>
        <van-icon slot="left" name="arrow-left" :style="getSlotStyle()" />
        <span slot="right" class="van-nav-bar__text" :style="getTextStyle()" @click="onConfirm">{{ $t('confirm') }}</span>
      </van-nav-bar>
      <div class="lc-fixed-navbar">
        <!-- <form action="/">
          <van-search
            v-model="search"
            :placeholder="searchPlaceholder"
            @search="onSearch"
          />
        </form>-->
        <van-cell-group v-if="isTree">
          <van-cell class="root-title">
            <div slot="title">
              <template v-for="(data,index) in treeData">
                <span
                  :key="data[labelKey]+data[valueKey]"
                  :class="{'is-link':treeData.length-1!==index}"
                  @click="onTree(index)"
                >{{ data[labelKey] }}</span>
                <span v-if="treeData.length-1!==index" :key="data[labelKey]+index">/</span>
              </template>
            </div>
          </van-cell>
        </van-cell-group>
        <van-radio-group v-if="!multiple" v-model="radio">
          <van-cell-group>
            <van-cell
              v-for="(option,index) in options"
              :key="option[labelKey]+option[valueKey]"
              clickable
            >
              <div slot="title" @click="toggleRadio(option,index)">
                <van-radio
                  v-if="hasCheckbox(option)"
                  :name="option[valueKey]"
                >
                  {{ option[labelKey] }}
                </van-radio>
                <span v-else>{{ option[labelKey] }}</span>
              </div>
              <span
                v-if="hasChild(option)"
                slot="right-icon"
                @click="toggle(option,index)"
              >
                <span class="van-cell__right-icon">下级</span>
                <van-icon name="arrow " class="van-cell__right-icon" />
              </span>
            </van-cell>
          </van-cell-group>
        </van-radio-group>
        <!--多选 -->
        <van-checkbox-group v-else v-model="checkbox">
          <van-cell-group>
            <van-cell
              v-for="(option,index) in options"
              :key="option[labelKey]+option[valueKey]"
              clickable
            >
              <div slot="title" @click="toggleCheckbox(option,index)">
                <van-checkbox
                  v-if="hasCheckbox(option)"
                  ref="checkboxes"
                  :name="option[valueKey]"
                  @click.native.stop="(e)=>clickCheckbox(e,option,index)"
                >
                  {{ option[labelKey] }}
                </van-checkbox>
                <span v-else>{{ option[labelKey] }}</span>
              </div>
              <span
                v-if="hasChild(option)"
                slot="right-icon"
                @click="toggle(option,index)"
              >
                <span class="van-cell__right-icon">下级</span>
                <van-icon name="arrow " class="van-cell__right-icon" />
              </span>
            </van-cell>
          </van-cell-group>
        </van-checkbox-group>
      </div>
    </van-popup>

    <!--点击明细 -->
    <van-popup v-if="showDetailPopup" v-model="showDetailPopup" class="lc-fullscreen-popup" position="right">
      <van-nav-bar :left-text="leftText" left-arrow :style="getBackGroundStyle()" @click-left="onDetailCancel">
        <span slot="title" :style="getTextStyle()">已选择的选项</span>
        <van-icon slot="left" name="arrow-left" :style="getSlotStyle()" />
        <span slot="right" class="van-nav-bar__text" :style="getTextStyle()" @click="onDetailConfirm">{{ $t('confirm') }}</span>
      </van-nav-bar>
      <van-cell-group>
        <van-swipe-cell v-for="(option,index) in getSelectedOptions()" :key="option[labelKey]+option[valueKey]" :right-width="65" class="lc-swipe-cell">
          <van-cell :title="showLabel(option)" clickable />
          <span slot="right" @click="removeSelected(index)">{{ $t('delete') }}</span>
        </van-swipe-cell>
      </van-cell-group>
    </van-popup>
  </div>
</template>
<script>
import { transformToTreeFormat, transformToKeyValue } from '@/utils/tree'
import create from '../utils/create'
import i18n from '@/lang' // Internationalization 国际化
import { getBackGroundStyle, getSlotStyle, getTextStyle } from '@/mixins/navbar'

import { getData } from '@/api/platform/dictionary'

export default create({
  name: 'lc-dictionary',
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
    placeholder: String,
    autosize: [Boolean, Object],
    errorMessage: String,
    border: {
      type: Boolean,
      default: true
    },
    multiple: Boolean,
    catType: {// 数据字典的type值，用于查询数据字典
      type: String,
    },
    dataType: {// value:只存value,all:存value和label
      type: String,
      default: 'value',
      validator: function(value) {
        return ['all', 'value'].indexOf(value) !== -1
      }
    },
    store: {// 存储类型 对应[多选]有效，array 数组。string 字符串类型
      type: String,
      default: 'array',
      validator: function(value) {
        return ['array', 'string'].indexOf(value) !== -1
      }
    },
    storeSeparator: {// 存储值分割符，对于设置字符串类型的分隔符
      type: String,
      default: ','
    },
    selectMode: {// 选值模式 leaf、any
      type: String,
      default: 'any',
      validator: function(value) {
        return ['any', 'leaf'].indexOf(value) !== -1
      }
    },
    displayMode: {// To 显示模式 path 、name
      type: String,
      default: 'name',
      validator: function(value) {
        return ['name', 'path'].indexOf(value) !== -1
      }
    },
    separator: {// 树形选项分隔符
      type: String,
      default: '/'
    },

    leftText: {
      type: String,
      default: i18n.t('cancel')
    },
    searchPlaceholder: {
      type: String,
      default: i18n.t('common.input')
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
      default: 'key'
    },
    labelKey: {
      type: String,
      default: 'name'
    },
    childrenKey: {
      type: String,
      default: 'children'
    },
    // 扩展参数
    params: Object
  },
  data() {
    return {
      showPopup: false,
      showDetailPopup: false,
      rootTitle: '顶级',
      isTree: false,
      treeData: [],
      search: '',
      cacheOptions: {}, // 缓存的选项
      options: [],
      selectedOptions: [],
      checkbox: [],
      radio: '',
      dictData: [],
      taskId: ''

    }
  },
  computed: {
    showClear() {
      return this.clearable && this.isNotEmpty(this.value) && this.isDef(this.value) && !this.readonly
    },
    allowCheckAll() {
      return this.selectMode === 'any'
    },
    title() {
      if (this.multiple) {
        const length = this.checkbox.length
        return length > 0 ? i18n.t('components.checkbox.title', { length: length }) : ''
      } else {
        return this.isNotEmpty(this.radio) ? this.showLabel(this.cacheOptions[this.radio]) : ''
      }
    },
    newDictData() {
      return this.params.dictData
    }
  },
  watch: {
    value() {
      this.$nextTick(this.initSelectedOptions())
    },
    newDictData(val, oldVal) {
      this.dictData = val
      this.loadData({}, true)
    },
    catType() {
      this.loadData({}, true)
    }
  },
  methods: {
    getBackGroundStyle() {
      return getBackGroundStyle()
    },
    getSlotStyle() {
      return getSlotStyle()
    },
    getTextStyle() {
      return getTextStyle()
    },
    initSelectedOptions() {
      if (this.isEmpty(this.value)) {
        return this.setDefaultData()
      }
      this.selectedOptions = this.getSelectedData(this.multiple ? this.getArrayValue() : this.value)
      if (this.isEmpty(this.selectedOptions)) {
        return this.setDefaultData()
      }
      if (this.multiple) {
        this.checkbox = this.getArrayValue()
      } else {
        this.radio = this.value
      }
    },
    setDefaultData() {
      this.selectedOptions = []
      if (this.multiple) {
        this.checkbox = []
      } else {
        this.radio = ''
      }
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
    getSelectedData(value) {
      if (this.isEmpty(value)) {
        return []
      }
      const data = []
      if (value instanceof Array) {
        value.map(v => {
          if (this.cacheOptions[v]) {
            data.push(this.cacheOptions[v])
          }
        })
      } else {
        if (this.cacheOptions[value]) {
          data.push(this.cacheOptions[value])
        }
      }
      return data
    },
    getSelectedOptions() {
      return this.getSelectedData(this.checkbox)
    },
    showLabel(option) {
      if (this.displayMode === 'name') { // 显示模式 path 、name
        return option[this.labelKey]
      } else {
        if (!this.isTree) { return option[this.labelKey] }
        return this.getPathLabel(option).join(this.separator)
      }
    },
    getPathLabel(option) {
      const cacheIdData = this.getCacheIdData()
      const label = option[this.labelKey]
      const parentId = option[this.parentIdKey]
      const labels = []
      this.pushParent(labels, parentId, cacheIdData)
      labels.push(label)
      return labels
    },
    pushParent(labels, pid, cacheIdData) {
      const p = cacheIdData[pid]
      if (p) {
        this.pushParent(labels, p[this.parentIdKey], cacheIdData)
        labels.push(p[this.labelKey])
      }
    },
    getCacheIdData() {
      const options = {}
      for (const key in this.cacheOptions) {
        const option = this.cacheOptions[key]
        options[option[this.idKey]] = option
      }
      return options
    },
    hasCheckbox(option) {
      return (this.allowCheckAll || !this.hasChild(option))
    },
    hasChild(option) {
      return option[this.childrenKey] && option[this.childrenKey].length
    },
    hasContainTree() {
      if (this.isEmpty(this.options)) {
        return false
      }
      return !!this.options.find(v => { return this.hasChild(v) })
    },
    initRootData() {
      this.isTree = this.hasContainTree()
      if (!this.isTree) {
        return
      }
      this.treeData = []
      const data = {
        [this.valueKey]: 'root',
        [this.labelKey]: this.rootTitle,
        [this.childrenKey]: this.options
      }
      this.treeData.push(data)
    },
    async loadData(params, isInit) {
      if (this.$utils.isEmpty(this.catType)) {
        this.$toast.fail(this.$t('components.dictionary.fieldOptionsDictionary'))
        return
      }
      params.type = this.catType
      // 查询页面字典值
      let data
      // 表单里面的字典值
      if (this.params) {
        data = this.dictData[this.catType]
        this.options = transformToTreeFormat(data, {
          idKey: this.idKey,
          parentIdKey: this.parentIdKey,
          childrenKey: this.childrenKey
        })
      } else { // 搜索查询字典值
        const res = await getData(params)
        data = res.data
        this.options = transformToTreeFormat(data, {
          idKey: this.idKey,
          parentIdKey: this.parentIdKey,
          childrenKey: this.childrenKey
        })
      }
      if (isInit) {
        this.cacheOptions = transformToKeyValue(data, {
          valueKey: this.valueKey,
          labelKey: this.labelKey
        })
        // 初始化最顶级数据
        this.initRootData()
      }
      // 初始化选择数据
      this.initSelectedOptions()
    },
    onClick() {
      if (this.readonly) { return }
      this.showPopup = true
      this.search = ''
      this.checkbox = []
      this.radio = ''
      this.loadData({ }, true)
    },
    clickOverlay() {
    },
    onTitle() {
      if (!this.multiple) { return }
      this.showDetailPopup = true
    },
    onDetailCancel() {
      this.showDetailPopup = false
    },
    onDetailConfirm() {
      this.showDetailPopup = false
    },
    removeSelected(index) {
      this.checkbox.splice(index, 1)
    },
    onCancel() {
      this.showPopup = false
    },
    onConfirm() {
      this.showPopup = false
      this.setInputValue(this.multiple ? this.getStoreValue(this.checkbox) : this.radio)
    },
    onRightIconClick() {
      this.showClear ? this.onClear() : this.onClick()
    },
    onClear() {
      this.setInputValue(this.multiple ? this.getStoreValue([]) : '')
    },
    setInputValue(value) {
      this.$emit('input', value)
    },
    toggle(option, index) {
      if (option[this.childrenKey] && option[this.childrenKey].length > 0) {
        this.toggleChild(option)
      } else {
        if (this.multiple) { // 多选
          this.toggleCheckbox(option, index)
        } else {
          this.toggleRadio(option, index)
        }
      }
    },
    toggleChild(option) {
      if (option[this.childrenKey] && option[this.childrenKey].length > 0) {
        this.options = option[this.childrenKey]
        this.treeData.push(option)
      }
    },
    clickCheckbox(event, option, index) {
      let flag = true
      const target = event.target
      if (target && target.className.indexOf('van-checkbox__label') > -1) {
        flag = false
      } else if (target && target.parentNode.className.indexOf('van-checkbox__icon') > -1) {
        flag = false
      }
      if (flag) {
        this.toggle(option, index)
      }
    },
    // 多选
    toggleCheckbox(option, index) {
      if (!this.hasCheckbox(option)) {
        this.toggleChild(option)
        return
      }
      this.$refs.checkboxes[index].toggle()
    },
    // 单选
    toggleRadio(option, index) {
      if (!this.hasCheckbox(option)) {
        this.toggleChild(option)
        return
      }
      this.radio = option[this.valueKey]
    },
    onSearch(value) {
      this.loadData({
        name: value
      })
    },
    onSearchCancel() {
      this.loadData({})
    },
    onTree(index) {
      this.options = this.treeData[index][this.childrenKey]
      this.treeData.splice(index + 1, this.treeData.length - 1)
    }
  },
  mounted() {
    this.dictData = this.params.dictData
    this.loadData({}, true)
  }
})
</script>
<style lang="scss">
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

