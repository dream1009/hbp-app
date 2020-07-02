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
            v-if="isEmpty(selectedData)"
            :class="bem('placeholder')"
          >
            {{ placeholder }}
          </div>
          <template v-for="data in selectedData " v-else>
            <van-tag
              :key="data[valueKey]"
              class="tag-span"
              type="primary"
              plain
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
    <!--对话框 -->
    <data-template
      :template-key="templateKey"
      :params="params"
      :show-popup="showPopup"
      :value="selectedValue"
      :multiple="multiple"

      :left-text="leftText"
      :id-key="idKey"
      :value-key="valueKey"
      :label-key="labelKey"
      :is-tree="isTree"
      :template-fields="templateFields"
      :dynamic-params="dynamicParams"

      @init-data="onInitData"
      @cancel="onCancel"
      @confirm="onConfirm"
    />
  </div>
</template>
<script>
/**
 * 关联数据
 * 1、列表
 *
 * 2、树形
 *
 *
 */
import { loadDataTemplateByKey, getDataTemplateListTemplate, buildDataTemplateFields } from '@/utils/data/template'
import { queryDataJson } from '@/api/platform/data/dataTemplate'
import { formatParams } from '@/utils/params'

import DataTemplate from '../data-template/template'

import create from '../utils/create'
import i18n from '@/lang' // Internationalization 国际化

export default create({
  name: 'lc-linkdata',
  components: {
    DataTemplate
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
    placeholder: String,
    autosize: [Boolean, Object],
    errorMessage: String,
    border: {
      type: Boolean,
      default: true
    },
    multiple: Boolean,
    templateKey: { // 对话框
      type: String,
      required: true
    },
    store: {// 存储类型 对应[多选]有效，json： json字符串,id:只存储id， array：存储数组数据 ，arrayId: 字符串类型。
      type: String,
      default: 'json',
      validator: function(value) {
        return ['json', 'id', 'array', 'arrayId'].indexOf(value) !== -1
      }
    },
    storeSeparator: {// 存储值分割符，对于设置字符串类型的分隔符
      type: String,
      default: ','
    },
    leftText: {
      type: String,
      default: i18n.t('cancel')
    },
    dynamicParams: Object
  },
  data() {
    return {
      idKey: 'id_',
      valueKey: 'id_',
      labelKey: '',
      isTree: false,
      params: {},
      templateFields: {}, // 模版字段
      showPopup: false, // 弹窗
      selectedData: [], // 选中的值
      selectedValue: []
    }
  },
  computed: {
    showClear() {
      return this.clearable && this.isNotEmpty(this.value) && this.isDef(this.value) && !this.readonly
    }
  },
  watch: {
    value() {
      if (this.isEmpty(this.value)) { this.selectedData = [] }
    }
  },
  created() {
    this.loadData(this.templateKey)
  },
  mounted() {
    // 初始化数据
    // this.initSelectedData()
    if (this.value) this.initSelectedData2()
  },
  methods: {
    // 加载加载配置数据
    loadData(key) {
      const params = {}
      loadDataTemplateByKey(key, params).then((data) => {
        const template = getDataTemplateListTemplate(data)
        this.templateFields = buildDataTemplateFields(data.fields)
        this.buildKey(data, template)
      }).catch((e) => {
        console.error(e)
      })
    },
    buildKey(dataTemplate, template) {
      this.idKey = this.valueKey = dataTemplate['unique']
      const resultColumns = template['result_columns']
      if (this.isEmpty(resultColumns)) { return }
      const index = resultColumns.length
      this.labelKey = resultColumns[index - 1]['name']
    },
    initSelectedData2() {
      const params = {
        key: this.templateKey,
        dynamicParams: JSON.stringify(this.dynamicParams), // 动态参数,获取页面的值
        filterConditionKey: '' // 多个过滤条件
      }
      const getIds = (value) => {
        if (this.store === 'json') { // json
          try {
            const data = this.$utils.parseData(value)
            if (Array.isArray(data)) {
              return data.map((d) => d[this.valueKey])
            }
            return `${data}`.split(this.storeSeparator)
          } catch (error) {
            console.warn(error)
            return []
          }
        } else if (this.store === 'id') { // id
          return `${value}`.split(this.storeSeparator)
        } else if (this.store === 'arrayId' && Array.isArray(value)) { // 数组id
          return value
        } else {
          if (Array.isArray(value)) return this.value.map((d) => d[this.valueKey])
          return `${value}`.split(this.storeSeparator)
        }
      }
      // 加载数据
      queryDataJson(formatParams(params)).then(response => {
        const { data: { dataResult = [] } = {}} = response
        const ids = getIds(this.value)
        this.selectedData = dataResult.filter(x => ids.some(y => x.id * 1 === y * 1))
      })
    },
    initSelectedData() {
      this.selectedValue = this.getArrayValue(this.value)
    },
    getArrayValue(value) {
      if (this.isEmpty(value)) {
        return []
      }
      if (this.store === 'json') { // json
        /* try {
          const data = this.$utils.parseData(value)
          return data.map((d) => {
            return d[this.valueKey]
          })
        } catch (error) {
          console.warn(error)
          return []
        }*/
        return [value]
      } else if (this.store === 'id') { // id
        return value.split(this.storeSeparator)
      } else if (this.store === 'arrayId') { // 数组id
        return value
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
          return '[{}]'
        }
        value.forEach(v => {
          const o = {}
          o[this.valueKey] = v[this.valueKey]
          o[this.labelKey] = v[this.labelKey]
          res.push(o)
        })
        return JSON.stringify(res)
      } else if (this.store === 'id') { // id
        return this.isNotEmpty(value) ? value.join(this.storeSeparator) : ''
      } else if (this.store === 'arrayId') { // 数组id
        if (this.isEmpty(value)) {
          return []
        } else {
          return value.map((d) => {
            return d[this.valueKey]
          })
        }
      } else { // 数组
        return value || []
      }
    },
    onClick() {
      if (this.readonly) { return }
      this.selectedValue = this.getArrayValue(this.value)
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
    },
    onRightIconClick() {
      this.showClear ? this.onClear() : this.onClick()
    },
    onClear() {
      this.selectedData = []
      this.setInputValue(this.getStoreValue([]))
    },
    setInputValue(value) {
      this.$emit('input', value)
      this.$nextTick(() => {
        this.$emit('callback', this.selectedData)
      })
    },
    // 回调初始化数据
    onInitData(data) {
      this.selectedData = data
      this.$nextTick(() => {
        this.$emit('attr-callback', this.selectedData)
      })
    }
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

