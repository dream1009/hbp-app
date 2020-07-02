<template>
  <div class="lc-table-wrapper lc-cell-wrapper">
    <!--一对一-->
    <div v-if="isOne2One">
      <div class="van-cell table-cell">
        <div class="van-cell__title">
          {{ item.label }}
        </div>
      </div>
      <dynamic-form-item
        v-for="column in getRowColumns()"
        ref="formItem"
        :key="column.name"
        v-model="tableData[column.name]"
        :field="column"
        :data="tableData"
        :items="items"
        :params="params"
        :form-data="formDataValue"
        :rights="rights[column.name]"
        :required="required"
        :is-readonly="dialogRights"
        @cinput="handleInput($event)"
        @change-form-data="changeFormData($event)"
      />
    </div>
    <!--一对多-->
    <div
      v-for="(data,i) in tableData"
      v-else
      :key="i"
    >
      <div class="van-cell table-cell">
        <div class="van-cell__title">
          {{ item.label }}  {{ getIndex(i) }}
        </div>
        <div class="van-cell__value">
          <!-- 工具栏-->
          <template
            v-for="(toolbar,j) in toolbars"
          >
            <!-- <template v-if="j<2" > -->
            <van-button
              v-if="showToolbarButton(toolbar,i)"
              :key="i+j"
              :type="getButtonType(toolbar.style)"
              size="mini"
              plain
              style="margin-right: 2px;margin-bottom: 5px;"
              @click="onToolbarClick(toolbar,i)"
            >
              {{ toolbar.label }}
            </van-button>
            <!-- </template> -->
            <!-- <template v-else>
              <van-button
                v-if="showToolbarButton(toolbar,i)"
                :type="getButtonType(toolbar.style)"
                :key="i+j"
                size="mini"
                plain
                style="margin-right: 5px;"
                @click="onToolbarClick(toolbar,i)"
              >...</van-button>
            </template> -->
          </template>
        </div>
      </div>
      <!--子表字段-->
      <dynamic-form-item
        v-for="column in getRowColumns(i)"
        ref="formItem"
        :key="i+column.name"
        v-model="data[column.name]"
        :field="column"
        :form-field="items"
        :data="data"
        :params="params"
        :form-data="formDataValue"
        :rights="rights[column.name]"
        :required="required"
        :is-readonly="dialogRights"
        @cinput="handleInput($event,i)"
        @change-form-data="changeFormData($event)"
      />
    </div>
    <div v-if="tableData.length === 0">
      <div class="van-cell table-cell">
        <div class="van-cell__title van-ellipsis">
          {{ item.label }}
        </div>
        <div class="van-cell__value">
          <!-- 工具栏-->
          <template
            v-for="(toolbar,j) in toolbars"
          >
            <van-button
              v-if="showToolbarButton(toolbar,-1)"
              :key="j"
              :type="getButtonType(toolbar.style)"
              size="mini"
              plain
              style="margin-right: 5px;"
              @click="onToolbarClick(toolbar,-1)"
            >
              {{ toolbar.label }}
            </van-button>
          </template>
        </div>
      </div>
    </div>

    <!-- 弹窗-->
    <van-popup
      v-if="dialogMode"
      v-model="dialogPopup"
      class="lc-fullscreen-popup"
    >
      <van-nav-bar
        :title="item.label"
        :left-text="$t('close')"
        :right-text="$t('common.button.confirm')"
        @click-left="closePopup"
        @click-right="dialogConfirm"
      />
      <div class="lc-fixed-navbar">
        <dynamic-form-item
          v-for="(field) in columns"
          ref="dialogForm"
          :key="field.name"
          v-model="dialogData[field.name]"
          :field="field"
          :data="dialogFormData"

          :rights="rights[field.name]"
          :params="params"

          @cinput="handleDialogInput($event)"
        />
      </div>
    </van-popup>
  </div>
</template>
<script>
import Vue from 'vue'
import FormField from '../../form-field'
import FormItem from '../../form-item'
import LcControl from '@/components/LcControl'

Vue.component('dynamic-form-field', FormField)
Vue.component('dynamic-form-item', FormItem)
Vue.use(LcControl)
import FormOptions from '../../constants/formoptions'
import FormUtil from '../../utils/formUtil'
import JForm from '@/components/utils/JForm'// 自定义脚本

export default {
  name: 'LcTable',
  props: {
    desc: {
      type: String
    },
    value: {
      type: [Array, Object, String]
    },
    items: Array,
    item: {
      type: Object,
      default: () => { return [] }
    },
    readonly: {
      type: Boolean,
      default: false
    },
    permissions: {
      type: Object
    },
    responseFormula: {
      type: Object,
      default: () => { return {} }
    },
    formData: {
      type: Object
    },
    required: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      rights: {}, // 字段权限
      tableRights: FormOptions.t.PERMISSIONS.EDIT, // 表权限
      buttonRights: {}, // 按钮权限

      curRow: 0,
      dialogRights: false, // 弹窗权限
      dialogData: {}, // 弹窗数据
      dialogPopup: false, // 是否弹窗
      dictionaries: [], // 表单字典项
      dictData: []
    }
  },
  computed: {
    fieldOptions() {
      return this.item['field_options'] || {}
    },
    // 取出顶部工具栏
    toolbars() {
      return this.fieldOptions['buttons']
    },
    columns() {
      return this.fieldOptions['columns']
    },
    relation() {
      return this.fieldOptions['relation'] || 'one2More'
    },
    isOne2One() {
      return this.relation === 'one2one'
    },
    tableData() {
      if (this.$utils.isNotEmpty(this.value)) {
        /* const columns = this.fieldOptions.columns
        const values = this.value[0]
        columns.forEach(item => {
          const name = item.name
          if (values[name] !== undefined && values[name] !== '') { return }
          values[name] = FormUtil.getFieldDefaultValue(item, (n, d) => {
            values[n] = d
            // 延迟验证
            this.$nextTick(() => {
              this.getFormValidator()
            })
          })
        })*/
        return this.value
      } else {
        if (this.tableMode === 'block') { // 块模式才初始化数据
          return this.isOne2One ? this.getDefaultData(0) : [this.getDefaultData(0)]
        } else {
          return this.isOne2One ? {} : []
        }
      }
    },
    formDataValue() {
      return this.formData
    },
    params() { // 扩展参数
      return {
        code: this.item.code,
        responseFormula: this.responseFormula,
        dictData: this.dictData
      }
    },
    tableMode() { // 子表模式
      return this.fieldOptions['mode']
    },
    dialogMode() { // 弹窗模式
      return false
      // TODO 弹窗模式有bug 暂时屏蔽
      // this.tableMode === 'dialog'
    },
    dialogFormData() {
      return this.dialogData
    }
  },
  watch: {
    value() {
      this.$nextTick(() => {
        this.getFormValidator()
      })
    }
  },
  created() {
    this.initResponseFields()
    if (this.tableMode === 'block') {
      this.handleEmitInput(this.$utils.newData(this.tableData))
    }
    this.setDictData()
  },
  mounted() {
    JForm._init(this)
    if (this.required && (!this.tableData || this.tableData.length < 1)) {
      this.handleAdd(this.$utils.newData(this.tableData), 1)
    }
    this.getFormValidator()
  },
  methods: {
    /**
     * 初始化表单字典项
     */
    setDictData() {
      if (this.dictionaries.length > 0) {
        // 初始化表单字典项（获取字典项数据优化新增）
        FormUtil.getDictionaries(this.taskId, this.dictionaries).then(data => {
          this.dictData = data
        })
      }
    },
    /**
     *  初始化字段
     */
    initResponseFields() {
      const columns = this.columns
      if (!columns) { return }
      const permissions = this.permissions
      columns.forEach(item => {
        if (item.field_type === 'dictionary') {
            if (item.field_options.dictionary) {
                this.dictionaries.push(item.field_options.dictionary)
            }
        }
        // 设置权限
        this.rights[item.name] = this.getPermissions(permissions, item) || this.getDefaultRigths(item)
        const values = this.value[0]
        if (!values) { return }
        if (item.name) {
          const name = item.name
          if (values[name] !== undefined && values[name] !== '') { return }
          values[name] = FormUtil.getFieldDefaultValue(item, (n, d) => {
            if (values[n]) {
              values[n] = d
              // 延迟验证
              this.$nextTick(() => {
                this.getFormValidator()
              })
            }
          })
        }
      })
      if (this.dialogMode) {
        this.dialogRights = true
      }
      // 表权限
      this.tableRights = this.readonly ? FormOptions.t.PERMISSIONS.READ : (permissions ? permissions.rights : FormOptions.t.PERMISSIONS.EDIT)
      // 按钮权限
      this.getButtonRights(permissions)
    },
    getPermissions(permissions, { name, field_type }) {
      if (this.$utils.isEmpty(permissions)) {
        return this.readonly ? FormOptions.t.PERMISSIONS.READ : null
      }
      const fieldType = field_type
      let rightsValue = null
      const isNonInputField = FormOptions.t.NON_INPUT_FIELD_TYPES.findIndex((n) => { return n === fieldType }) > -1
      const isSpecial = false
      if (isNonInputField && permissions.columns) { // 非输入字段
        rightsValue = permissions.columns[name] ? permissions.columns[name] : null
      } else { // 字段
        rightsValue = permissions.columns[name] ? permissions.columns[name] : null
      }

      if (this.readonly && !isNonInputField && !isSpecial) { // 如果只读
        rightsValue = rightsValue !== FormOptions.t.PERMISSIONS.HIDE ? FormOptions.t.PERMISSIONS.READ : rightsValue
      }

      return rightsValue
    },
    /**
     * 默认权限
     */
    getDefaultRigths(item) {
      const fieldOptions = item.field_options || {}
      const hideRights = fieldOptions.hide_rights
      if (this.$utils.isNotEmpty(hideRights) && hideRights) {
        return FormOptions.t.PERMISSIONS.HIDE
      }
      const readRights = fieldOptions.read_rights
      if (this.$utils.isNotEmpty(readRights) && readRights) {
        return FormOptions.t.PERMISSIONS.READ
      }
      return
    },
    getButtonRights(permissions) {
      if (this.$utils.isEmpty(permissions)) {
        return this.readonly ? FormOptions.t.PERMISSIONS.HIDE : null
      }
      this.toolbars.forEach(btn => {
        const code = this.getButtonCode(btn)
        this.buttonRights[code] = permissions.buttons[code]
      })
    },
    getIndex(i) {
      if (this.tableData.length === 1) { return '' }
      return `(${i + 1})`
    },
    getButtonCode(btn) {
      let code = btn.type
      if (btn.type === 'custom') { code = btn.code ? btn.code : (btn.type + btn.$index) }
      return code
    },
    showToolbarButton(toolbar, i) {
      // 如果只读
      if (this.readonly) return false
      const code = this.getButtonCode(toolbar)
      if (i === -1 && (code === 'remove' || code === 'edit')) { return false }
      if (this.tableData.length > (i + 1) && code === 'add') { return false }
      // 第一行不能删除 按钮
      // if (code === 'remove' && this.tableData.length === 1) { return false }
      // 判断权限
      if (this.buttonRights[code] === FormOptions.t.PERMISSIONS.HIDE) { return false }

      return true
    },
    getButtonType(style) {
      if (!style) { return null }
      return style.split('-')[1]
    },
    onToolbarClick(item, i) {
      const tableData = this.$utils.newData(this.tableData)
      if (item.type === 'add' || item.type === 'edit' || item.type === 'remove') {
        // 前置事件
        const beforSubButtonResult = JForm._beforeSubButton(this, item.type, i, this.formData)
        if (typeof (beforSubButtonResult) !== 'undefined' && !beforSubButtonResult) {
          return
        }
      }
      if (item.type === 'add') {
        this.handleAdd(tableData, i)
        this.afterScript(item, i)
      } else if (item.type === 'edit') {
        this.handleEdit(i)
        this.afterScript(item, i)
      } else if (item.type === 'remove') {
        if (this.required && this.tableData.length <= 1) {
          this.$dialog.alert({ title: '提示', message: '必填表单不可删除' })
          return
        }
        this.$dialog.confirm({
          title: '提示',
          message: '确定删除？'
        }).then(() => {
          tableData.splice(i, 1)
          this.handleEmitInput(tableData)
          this.afterScript(item, i)
          this.$nextTick(() => {
            this.handleRunCalFormula(tableData)
          })
        })
      }
    },
    afterScript(item, i) {
      const afterSubButtonResult = JForm._afterSubButton(this, item.type, i, this.formData)
      if (typeof (afterSubButtonResult) !== 'undefined' && !afterSubButtonResult) {
        return
      }
    },
    // 添加
    handleAdd(tableData, i) {
      if (this.dialogMode) {
        this.dialogPopup = true
        this.curRow = i + 1
        this.dialogData = this.$utils.newData(this.getDefaultDialogData())// 弹窗数据
      } else {
        tableData.push(this.getDefaultData(i + 1))
        this.handleEmitInput(tableData)
      }
    },
    handleEdit(i) {
      this.curRow = i
      this.dialogPopup = true
      this.dialogData = this.$utils.newData(this.tableData[i])
    },
    dialogConfirm() {
      this.dialogPopup = false
      const tableData = this.$utils.newData(this.tableData)
      if (tableData[this.curRow]) {
        tableData[this.curRow] = this.dialogData
      } else {
        tableData.push(this.dialogData)
      }

      this.handleEmitInput(tableData)
    },
    closePopup() {
      this.dialogPopup = false
    },
    handleDialogInput(data) {
      Object.assign(this.dialogData, data)
    },
    getDefaultData(i) {
      const data = {}
      this.columns.forEach(item => {
        // 设置默认值
        data[ item.name] = FormUtil.getFieldDefaultValue(item, (n, d) => {
          this.$nextTick(() => {
          // 异步数据
            const tableData = this.$utils.newData(this.tableData)
            tableData[i][n] = d
            this.handleEmitInput(tableData)
          })
        })
      })
      return data
    },
    getDefaultDialogData() {
      const data = {}
      this.columns.forEach(item => {
        // 设置默认值
        data[ item.name] = FormUtil.getFieldDefaultValue(item, (name, d) => {
          // 异步数据
          this.dialogData[name] = d
        })
      })
      return data
    },
    handleInput(data, i) {
      if (this.isOne2One) {
        this.handleEmitInput(data)
      } else {
        const tableData = this.$utils.newData(this.tableData)
        tableData[i] = data
        this.handleEmitInput(tableData)
      }
    },
    changeFormData(data) {
      this.$emit('change-form-data', data)
    },
    handleEmitInput(data) {
      // 这里没有上报event，直接就是value了
      this.$emit('input', data)
    },
    handleRunCalFormula(tableData) {
      // 没有数据时，进行公式计算
      if (tableData.length === 0) {
        this.columns.forEach(item => {
          const i = Object.assign({}, item)
          i.table = this.item
          const key = item.code + '.' + item.name
          const formula = this.params.responseFormula ? this.params.responseFormula[key] : null
          if (formula) {
            FormUtil.runCalFormula(formula, this.formData, i, -1)
          }
        })
      }
    },
    getEl() {
      if (!this.$refs.formItem) { return }
      const $validate = []
      this.$refs.formItem.forEach(el => {
        $validate.push(el)
      })
      return $validate
    },
    getFormValidator() {
      if (!this.$refs.formItem) { return }
      const $validate = []
      this.$refs.formItem.forEach(el => {
        const v = new Promise((resolve, reject) => {
          el.getFormValidator().validate().then((result) => {
            resolve(result)
          })
        })
        $validate.push(v)
      })
      return Promise.all($validate)
    },
    getRowColumns(row) {
      const columns = []
      this.fieldOptions['columns'].forEach((column) => {
        var col = Object.assign({}, column)
        col.isSub = true
        col.table = this.item
        if (this.$utils.isNotEmpty(row)) {
          col.row = row
        }
        columns.push(col)
      })
      return columns
    }
  }
}
</script>
<style lang="scss" scoped>
  .lc-table-wrapper{
      padding-left: 5px;
      padding-right: 5px;
      background-color: #f2efef;
    .table-cell{
      background-color: #f8f8f8;
      .van-cell__title{
        font-size: 12px;
        color: #999;
      }
    }

  }
</style>
