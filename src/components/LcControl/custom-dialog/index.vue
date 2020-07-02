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
      <div :class="bem('body')">
        <div :class="bem('control', inputAlign)" style=" margin-left: 1px;" @click="onClick">
          <div v-if="isEmpty(selectedData)" :class="bem('placeholder')">{{ placeholder }}</div>
          <template v-for="data in selectedData " v-else>
            <van-tag v-if="data" :key="data[valueKey]" class="tag-span" type="primary" plain>
              <field-formatter
                :label-key="showLableKey"
                :data="data"
                :template-fields="templateFields"
              />
            </van-tag>
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
      :value-key="showLableKey"
      :label-key="labelKey"
      :parent-id-key="parentIdKey"
      :is-tree="isTree"
      :query-key="queryKey"
      :template-fields="templateFields"
      :dynamic-params="dynamicParams"
      :display-columns="columns"

      @init-data="initData"
      @cancel="onCancel"
      @confirm="onConfirm"
    />
  </div>
</template>
<script>
/**
 * 自定义对话框
 * 1、列表
 *
 * 2、树形
 *
 *
 */
import { loadDataTemplateByKey, getDataTemplateListTemplate, buildDataTemplateFields } from '@/utils/data/template'
import DataTemplate from '../data-template/template'
import create from '../utils/create'
import i18n from '@/lang' // Internationalization 国际化
import FieldFormatter from '@/components/DataTemplate/field-formatter'

export default create({
  name: 'lc-custom-dialog',
  components: {
    DataTemplate,
    FieldFormatter
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
    dialogType: String, // 对话框类型
    templateKey: { // 对话框对象的数据模版key
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
    fieldOptions: Object,
    dynamicParams: Object,
    displayColumns: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      dialogId: '#id#',
      dialogTitle: '#title#',
      idKey: 'id_',
      valueKey: 'id_',
      labelKey: '',
      parentIdKey: '',
      isTree: false,
      queryKey: '',
      params: {},
      templateFields: {}, // 模版字段
      showPopup: false, // 弹窗
      selectedData: [], // 选中的数据，这个值是用于展示的
      selectedValue: [], // 选中的值 是valueKey的值
      columns: []
    }
  },
  computed: {
    showClear() {
      return this.clearable && this.isNotEmpty(this.value) && this.isDef(this.value) && !this.readonly
    },
    showLableKey() {
      return this.labelKey
    }
  },
  watch: {
    value() {
      if (this.isEmpty(this.value)) { this.selectedData = [] } else { this.selectedValue = this.getArrayValue(this.value) }
    }
  },
  created() {
    // 初始化加载配置的数据
    this.loadData(this.templateKey)
  },
  mounted() {
    // 初始化数据
    this.initSelectedData()
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
      this.queryKey = this.getQueryKey(template['query_columns'])
      if (dataTemplate.showType === 'tree') { // 树形
        this.isTree = true
        const displayColumns = template['display_columns']
        if (this.$utils.isNotEmpty(displayColumns)) {
          this.labelKey = displayColumns['name_key']
          this.idKey = displayColumns['id_key']
          this.parentIdKey = displayColumns['pid_key']
        }
      } else if (dataTemplate.showType === 'list') {
        this.isTree = false
        const displayColumns = template['display_columns']
        if (this.$utils.isNotEmpty(displayColumns)) {
          this.labelKey = (displayColumns[0] ? displayColumns[0]['name'] : '') || ''
          this.columns = displayColumns
        }
      }
    },
    initSelectedData() {
      this.selectedValue = this.getArrayValue(this.value)
    },
    getArrayValue(value) {
      if (this.isEmpty(value)) {
        return []
      }
      if (this.store === 'json') { // json
        try {
          const data = this.$utils.parseData(value)
          return data.map((d) => {
            return d[this.dialogId]
          })
        } catch (error) {
          console.warn(error)
          return []
        }
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
          return ''
        }
        value.forEach(v => {
          if (this.isEmpty(v)) { return true }
          const o = {}
          o[this.valueKey] = v[this.valueKey]
          o[this.labelKey] = v[this.labelKey]
          res.push(o)
        })
        return JSON.stringify(res)
      } else if (this.store === 'id') { // id
        value.forEach(v => {
          res.push(v[this.valueKey])
        })
        return res.join(this.storeSeparator)
      } else if (this.store === 'arrayId') { // 数组id
        return value.map((d) => {
          return d[this.valueKey]
        })
      } else { // 数组
        return value || []
      }
    },
    onClick() {
      if (this.readonly) { return }
      // this.selectedValue = this.getArrayValue(this.value) //流程的自定义对话框不回显
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
      this.setInputValue(this.getStoreValue([]))
    },
    setInputValue(value) {
      const result = this.formatData(value)
      this.$emit('input', result)
      // 处理回调
      this.$nextTick(() => {
        this.$emit('callback', this.selectedData)
      })
    },
    // 回调初始化数据
    initData(data) {
      this.selectedData = data
      this.$nextTick(() => {
        this.$emit('attr-callback', this.selectedData)
      })
    },
    getQueryKey(queryColumns) {
      if (this.$utils.isNotEmpty(queryColumns) && queryColumns[0]) {
        return queryColumns[0].name
      }
    },
    formatData(data) {
      if (this.store === 'json') { // json
        const resutlList = JSON.parse(this.$utils.newData(data))
        resutlList.forEach(element => {
          element[this.dialogId] = element[this.valueKey]
          element[this.dialogTitle] = element[this.labelKey]
        })
        return JSON.stringify(resutlList)
      } else if (this.store === 'id') {
        return data
      }
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
