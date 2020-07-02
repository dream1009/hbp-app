<template>
  <div
    :class="{
      'lc-fixed-toolbar':checkMode
    }"
    class="data-template-list lc-fixed-top"
  >
    <van-nav-bar
      :title="generateTitle(title)"
      :left-text="$t('back')"
      left-arrow
      fixed
      :style="getBackGroundStyle()"
      @click-left="onClickLeft"
      @click-right="toCheckMode()"
      v-if="!navBarHide"
    >
      <van-icon slot="left" name="arrow-left" :style="getSlotStyle()" />
      <span slot="right" :style="getSlotStyle()">{{ rightText }}</span></van-nav-bar>
    <van-search
      :placeholder="queryKeyTip"
      v-show="$utils.isNotEmpty(queryKey)"
      v-model="search"
      show-action
      @search="onSearch"
    >
      <template slot="action">
        <van-icon name="filter-fill" :class="stateActive?'active':'disactive'" @click="clickMoreSarch" />
      </template>
    </van-search>
    <!-- 设置过滤条件 -->
    <drop-menu
      ref="dropMenu"
      :async="async"
      :data="rangeData"
      :default-value="defaultValue"
      @change="changeFilterCondition"
    >
      <!-- <template v-slot:checks="scope">
        <div
v-if="$utils.isNotEmpty(rangeData[rootIndex].options)"
class="menu-slot-checks"
             :style="{'color':scope.color}"
>{{ scope.text||filterCondition }}
        </div>
      </template>
      <template v-slot:icon="scope">
        <span
v-if="$utils.isNotEmpty(rangeData[rootIndex].options)"
class="menu-slot-icon"
              :style="{'color':scope.color}"
>
          <van-icon :name="scope.icon" />
        </span>
      </template> -->
      <template slot="text">
        <label class="menu-slot-text" :class="$utils.isNotEmpty(rangeData[rootIndex].options)?null:'options-null'">&nbsp;&nbsp;共
          {{ totalCount||rootIndex }} 条</label>
      </template>
      <!-- 设置显示字段 -->
      <template v-if="isShowFilter" slot="right">
        <span class="menu-slot-right" size="small" @click="onShowFieldsList('fields')">
          <van-icon name="password-view" class="custom-icon" /> 显示字段
        </span>
      </template>

    </drop-menu>
    <!-- 列 -->
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <van-list v-model="loading" :finished="finished" @load="onLoad">
        <van-swipe-cell
          v-for="(item,index) in list"
          :key="item[idKey]+index"
          :right-width="removeButton?65:0"
          :on-close="onClose"
        >
          <card-list
            :avatar="false"
            :check-mode="checkMode"
            :checked="checkedIds.includes(item[idKey])"
            @click="onClick(item)"
          >
            <!--标题-->
            <div v-for="(field,i) in showFields" :key="'field'+i" slot="title" class="van-card-list__desc">
              <span class="van-card-list__desc__title">{{ field['label'] }}:</span>
              <field-formatter
                slot="title"
                class="titles"
                :label-key="field['name']"
                :data="item"
                :template-fields="{[field.name]: field}"
                dialog-name="project_name"
              />
            </div>

            <!--描述展示-->

            <!-- <div
              v-if="descField&&descField['name']&&item[descField['name']]"
              slot="title"
              class="van-card-list__desc"
            >
              <span class="van-card-list__desc__title">{{ descField['label'] }}:</span>
              <field-formatter
                :label-key="descField['name']"
                :data="item"
                :template-fields="templateFields"
                default-value
                dialog-name="project_name"
              />
            </div>
            <div
              v-if="secondDescField&&secondDescField['name']&&item[secondDescField['name']]"
              slot="title"
              class="van-card-list__desc"
            >
              <span class="van-card-list__desc__title">{{ secondDescField['label'] }}:</span>
              <field-formatter
                :label-key="secondDescField['name']"
                :data="item"
                :template-fields="templateFields"
                default-value
                dialog-name="project_name"
              />
            </div> -->

          </card-list>
          <span v-if="removeButton" slot="right" @click="removeData(item)">{{ $t('delete') }}</span>
        </van-swipe-cell>
      </van-list>
      <list-result-page
        :result-type="resultType"
        :error-type="errorType"
        :result-message="resultMessage"
      />
    </van-pull-refresh>
    <!--添加按钮-->
    <!-- <div v-if="addButton" v-show="!checkMode" class="palette-button">
      <lc-palette-button
        content="+"
        direction="lt"
        main-button-style="color:#fff;background-color:#26a2ff;"
        @click="onClickRight"
      />
    </div> -->
    <!--工具栏 -->
    <lc-toolbar v-show="checkMode" :actions="actions" :more-actions="moreActions" />
    <more-search
      :show="popupShow"
      :search-forms="searchForms"
      @callback="onSearch"
      @close="callback => popupShow = callback"
      @resetForm="resetForm"
    >
      <template v-for="slotForm in slotForms" :slot="slotForm.slotName" slot-scope="scopeType">
        <search-field
          ref="tempField"
          :key="slotForm.prop"
          :forms="searchForms.forms"
          :item="scopeType.item"
        />
      </template>
    </more-search>
    <van-popup v-model="display" position="bottom" :overlay="true">
      <div class="van-picker__toolbar van-hairline--top-bottom">
        <slot>
          <div class="van-picker__cancel" @click="onCancel">{{ $t('cancel') }}</div>
          <div class="van-picker__confirm" @click="onConfirm">{{ $t('confirm') }}</div>
        </slot>
      </div>
      <van-checkbox-group v-model="chooseResult">
        <van-cell-group>
          <van-cell v-for="(item, index) in fieldsList" :key="item['name']+index" :name="item.name">
            <van-checkbox :name="item.name">{{ item.name }}</van-checkbox>
          </van-cell>
        </van-cell-group>
      </van-checkbox-group>
    </van-popup>
  </div>
</template>
<script>
import {
  queryDataJson,
  removeFormData
} from '@/api/platform/data/dataTemplate'
import {
  loadDataTemplateById,
  getDataTemplateListTemplate,
  buildDataTemplateFields
} from '@/utils/data/template'
import { transformToTreeFormat } from '@/utils/tree'
import { formatParams, loadFinished, getResultType } from '@/utils/params'
import i18n from '@/utils/i18n'
import storage from '@/utils/storage'
import CardList from '@/components/CardList'
import MoreSearch from '@/components/MoreSearch'
import ListResultPage from '@/components/ListResultPage'
import LcPaletteButton from '@/components/PaletteButton'
import LcToolbar from '@/components/LcToolbar'
import FieldFormatter from '@/components/DataTemplate/field-formatter'
import JTemplate from '@/components/utils/JTemplate' // 自定义脚本
import DropMenu from './components/dropMenu'

import SearchField from './components'
import { getBackGroundStyle, getSlotStyle } from '@/mixins/navbar'
import { getNeedBackApp, getHomePage, getTitleHide } from '@/utils/auth'

const DISPLAY_FIELD = window.config.DISPLAY_FIELD

export default {
  inject: ['reload'],
  name: 'TemplateList',
  components: {
    DropMenu,
    SearchField,
    CardList,
    ListResultPage,
    LcPaletteButton,
    LcToolbar,
    MoreSearch,
    FieldFormatter
  },
  props: {
    value: {
      type: [String, Number, Boolean, Array, Object, Date]
    }
  },

  data() {
    return {
      stateActive: false,
      popupShow: false,
      resetFields: false,
      dateFormat: 'yyyy-MM-dd',
      searchForms: {},
      firsthand: [],
      params: {},
      slotForms: [],
      paramsForm: {},
      async: false,
      rootIndex: 0,
      filterCondition: '',

      totalCount: '',
      fieldsList: [],
      showFields: [], // 列表的显示字段
      isShowFilter: false, // 是否配置显示字段
      searchParams: {}, // 搜索条件
      display: false,
      chooseResult: [],
      checkFilter: '',
      configKey: '',
      defaultValue: [],
      rangeData: [{ options: [] }],
      search: '',
      title: '',
      list: [],
      page: 1,
      loading: false,
      finished: false,
      isLoading: true,
      resultType: 'init',
      errorType: null,
      resultMessage: null,

      idKey: '',
      labelField: '',
      descField: '',
      secondDescField: '',
      dataTemplate: '',

      queryKey: '',
      queryKeyTip: '',
      isTree: false,
      templateId: '',
      templateKey: '',
      dynamicParams: '',
      formKey: '',

      templateFields: {}, // 模版字段

      editButtons: '', // 编辑按钮
      functionButtons: [], // 功能按钮

      checkMode: false,
      checkedIds: [],
      actions: [],
      moreActions: [],

      isInitialization: false,
      navBarHide: false
    }
  },
  computed: {
    addButton() {
      return this.includesFunctionButton('add')
    },
    removeButton() {
      return this.includesFunctionButton('remove')
    },
    editButton() {
      return this.includesFunctionButton('edit')
    },
    rightText() {
      if (this.list.length > 0 && this.title !== '作业历史') {
        return this.checkMode
          ? this.$t('common.button.cancel')
          : this.$t('common.button.manage')
      }
      return null
    },
    hasScript() {
      const tmpDef = this.dataTemplate
      return !!(tmpDef && tmpDef.attrs && tmpDef.attrs.mobile_script)
    }
  },
  created() {
    const navBarHide = getTitleHide()
    if (navBarHide === 'true') {
    this.navBarHide = true
       $("#app").css("margin-top","-46px")
    }
    const params = this.$route.params
    const queryParam = this.$route.query
    this.queryParam = queryParam
    this.templateId = params.id
    this.loadDataTemplate(this.templateId)
  },
  mounted() {
    // if (this.isInitialization && this.hasScript) {
    //   JTemplate._onLoad(this)
    // }
  },
  methods: {
    getBackGroundStyle() {
      return getBackGroundStyle()
    },
    getSlotStyle() {
      return getSlotStyle()
    },
    onCancel() {
      this.display = false
    },
    onConfirm() {
      if (this.chooseResult.length === 0) {
        this.$toast('显示字段至少选择一项！')
        return
      } else if (this.chooseResult.length > 3) {
        this.$toast('显示字段至多选择三项！')
        return
      }
      this.loadDataTemplate(this.templateId)
      storage.set('chooseFields', this.chooseResult)
      this.display = false
    },
    onShowFieldsList(keys) {
      this.async = !this.async
      this.configKey = keys
      this.display = true
    },
    changeFilterCondition(barItem, listItem) {
      this.checkFilter = listItem.name
      storage.set('filterCondition', listItem)
      this.onSearch()
    },
    initFilterText() {
      const listItem = storage.get('filterCondition')
      if (this.$utils.isNotEmpty(listItem)) {
        this.filterCondition = listItem.text
      } else {
        this.filterCondition = this.$utils.isNotEmpty(this.rangeData[this.rootIndex].options) ? this.rangeData[this.rootIndex].options[this.rootIndex].text : ''
      }
    },

    loadDataTemplate(id) {
      const params = {}
      loadDataTemplateById(id, params)
        .then(data => {
          this.title = data['name']
          this.dataTemplate = data
          const dyncParams = {}
          const dateSets = data['datasets']
          if (dateSets) {
            // for(const i=0;i<dateSets.length;i++){
            //     const item = dateSets[i];
            //   if(item.type==='table'){
            //     continue;
            //   }
            //   const paramVal = this.queryParam[item.label];
            //   if(paramVal!=null && paramVal!=undefined){
            //     dyncParams[item.name] = paramVal;
            //   }
            // };
            dateSets.forEach((item, index) => {
              if (item.type != 'table') {
                const paramVal = this.queryParam[item.label]
                if (paramVal != null && paramVal != undefined) {
                  dyncParams[item.name] = paramVal
                }
              }
            })
          }

          this.dynamicParams = JSON.stringify(dyncParams)

          // 初始化脚本
          if (!this.isInitialization) {
            this.initJTemplate()
            this.isInitialization = true
          }
          if (this.isInitialization && this.hasScript) {
            JTemplate._onLoad(this)
          }
          i18n.setTitle(this.title)
          const template = getDataTemplateListTemplate(data)

          this.templateFields = buildDataTemplateFields(data.fields)
          this.buildKey(data, template)
          this.loadData()
          this.initFilterText()
        })
        .catch(e => {
          console.error(e)
          // TODO 异常
        })
    },
    buildKey(dataTemplate, template) {
      this.idKey = dataTemplate['unique']
      this.templateKey = dataTemplate['key']
      this.formKey = dataTemplate['attrs']['form_key']
      this.firsthand = template['query_columns']
      const queryKey = this.getQueryKey(template['query_columns'])

      this.queryKey = queryKey ? queryKey[this.rootIndex] : queryKey
      this.queryKeyTip = `请输入${queryKey[1].filter(x => x.prop === this.queryKey).map(x => x.label).join('/')}`;

      const fieldsList = template['display_columns'] ? template['display_columns'] : []
      // 设置展示列表全部的字段
      if (DISPLAY_FIELD === 'default') {
        this.showFields = template['display_columns'] ? template['display_columns'] : []
        this.isShowFilter = false
      }
      if (this.$utils.isNotEmpty(fieldsList)) {
        this.fieldsList = fieldsList.map(i => {
          return { name: i.label }
        })
      } else {
        this.$toast('显示字段不能为空！请在PC端中配置。')
      }
      this.initOptions(fieldsList)
      const colums = []
      const chooseResult = storage.get('chooseFields')
      if (chooseResult !== undefined) {
        this.chooseResult = chooseResult
      }
      for (let i = 0; i < this.chooseResult.length; i++) {
        for (let l = 0; l < fieldsList.length; l++) {
          if (this.chooseResult[i] === fieldsList[l].label) {
            colums.push(fieldsList[l])
          }
        }
      }
      const displayColumns = colums
      const filterActions = this.$utils.isNotEmpty(template['filter_conditions']) ? template['filter_conditions'] : []
      if (this.$utils.isNotEmpty(filterActions)) {
        this.rangeData[this.rootIndex].options = filterActions.map(i => {
          return { text: i.label, name: i.key }
        })
      }
      this.initFilter(filterActions, this.rootIndex)

      if (dataTemplate.showType === 'tree') {
        this.isTree = true
        if (this.$utils.isNotEmpty(displayColumns)) {
          this.labelField = displayColumns['name_key']
          this.idKey = displayColumns['id_key']
          this.parentIdKey = displayColumns['pid_key']
        }
      } else if (dataTemplate.showType === 'list') {
        this.isTree = false
        if (this.$utils.isNotEmpty(displayColumns)) {
          // 显示字段顺序预处理
          const arr = []
          for (var i = 0; i < displayColumns.length; i++) {
            for (var l = 0; l < fieldsList.length; l++) {
              if (displayColumns[i].label === fieldsList[l].label) {
                arr[l] = fieldsList[l]
              }
            }
          }
          const columns = arr.filter(e => {
            if (e !== '' && e !== undefined) {
              return e
            }
          })
          // 列表显示字段的配置
          if (DISPLAY_FIELD === 'filter') {
            this.showFields = columns || []
            this.isShowFilter = true
          }
          /*
                        this.labelField = columns[0] || {}
                        this.descField = columns[1] || {}
                        this.secondDescField = columns[2] || {}
                        */
        }
        this.editButtons = template['buttons']['edit_buttons']
        this.functionButtons = template['buttons']['function_buttons']
        this.initToolbarAction()
      }
    },
    onSearch(params) {
      this.stateActive = !!params
      this.resultType = 'init'
      this.page = 1
      this.list = []
      const tempField = this.$refs.tempField
      if (tempField) {
        for (var i = 0; i < tempField.length; i++) {
          const obj = tempField[i].getParams()
          for (var j in obj) {
            if (tempField[i].item.prop === j) {
              this.paramsForm[j] = obj[j]
            }
          }
        }
        Object.assign(params, this.paramsForm)
      }
      // 搜索条件
      this.searchParams = params
      this.loadData(params)
    },
    resetForm() {
      const tempField = this.$refs.tempField
      if (!tempField) return
      for (var i = 0; i < tempField.length; i++) {
        const def = tempField[i].resetForm()
        for (var j in def) {
          this.paramsForm[j] = def[j]
        }
      }
      // 重置搜索条件
      this.searchParams = {}
    },
    clickMoreSarch() {
      this.popupShow = true
      this.stateActive = false
    },
    onLoad() {
      this.loadData()
    },
    loadData(par) {
      if (this.$utils.isEmpty(this.templateKey)) {
        return
      }
      if (this.checkFilter === '') {
        const listItem = storage.get('filterCondition')
        if (listItem !== undefined) {
          this.checkFilter = listItem.name
        }
      }
      const params = {
        key: this.templateKey,
        // dynamicParams:'',
        dynamicParams: this.dynamicParams, // 动态参数,获取页面的值
        filterConditionKey: this.checkFilter || '' // 多个过滤条件
      }
      if (this.search && this.queryKey) {
        params[this.queryKey] = this.search
      } else {
        Object.assign(params, par)
      }
      // 加载数据
      queryDataJson(formatParams(params, { 'page': this.page }))
        .then(response => {
          const dataResult = response.data.dataResult
          this.totalCount = response.data.pageResult.totalCount
          if (this.$utils.isNotEmpty(dataResult)) {
            if (this.isTree) {
              this.list = transformToTreeFormat(dataResult, {
                idKey: this.idKey,
                parentIdKey: this.parentIdKey,
                childrenKey: this.childrenKey
              })
              // 初始化最顶级数据
              this.initRootTreeData(response.vars)
            } else {
              this.page++
              this.list = this.list.concat(dataResult)
              this.finished = false
            }
          }

          if (this.isTree) {
            this.finished = true
          } else {
            if (loadFinished(response.data.pageResult)) {
              this.finished = true
            }
          }
          this.loading = false
          this.isLoading = false
          this.resetFields = false
          // 结果类型
          this.resultType = getResultType(this.list, this.finished)
        })
        .catch(e => {
          this.loading = false
          this.isLoading = false
          this.finished = true
          this.resultType = 'error'
          this.resultMessage = e.message
        })
    },
    // 默认显示字段列表
    initOptions(list) {
      list.forEach((val, index) => {
        if (this.configKey === '') {
          if (index < 2) {
            this.chooseResult.push(val.label)
          }
        }
      })
    },
    initFilter(list, index) {
      if (this.$utils.isNotEmpty(list)) {
        if (!this.$utils.isNotEmpty(this.defaultValue)) {
          const listItem = storage.get('filterCondition')
          if (this.$utils.isNotEmpty(listItem)) {
            const i = list.findIndex(i => i.label === listItem.text)
            this.defaultValue = [list[i].key]
          } else {
            this.defaultValue = [list[index].key]
          }
        }
      }
    },
    onRefresh() {
      this.resultType = 'init'
      this.isLoading = true
      this.page = 1
      this.list = []
      // 按搜索条件加载列表
      this.loadData(this.searchParams)
    },
    onClick(item) {
      if (this.checkMode) {
        const index = this.checkedIds.indexOf(item[this.idKey])
        if (index > -1) {
          this.checkedIds.splice(index, 1)
        } else {
          this.checkedIds.push(item[this.idKey])
        }
      } else {
        this.gotoForm({
          isEdit: false,
          pk: item[this.idKey]
        })
      }
    },

    generateTitle(name, title) {
      // generateTitle by vue-i18n
      return i18n.generateTitle(name, title)
    },
    gotoForm({ pk = '', isEdit = true }) {
      this.$router.push({
        name: 'dataTemplateform',
        query: {
          templateKey: this.templateKey,
          templateId: this.templateId,
          formKey: this.formKey,
          pk: pk,
          isEdit: isEdit
        },
        params: {
          buttons: isEdit ? this.editButtons : []
        }
      })
    },
    onClickLeft() {
      storage.remove('filterCondition')
      storage.remove('chooseFields')
      if (getNeedBackApp() === 'true' && (window.history.length <= 1 || getHomePage() === this.$route.path)) {
        this.$bridge.callHandler('backNativeApp', '', (callbackData) => {
        })
      } else {
        this.$router.push({ name: 'dashboard' })
      }
    },
    onClickRight() {
      this.gotoForm({})
    },
    onClose(clickPosition, instance) {
      switch (clickPosition) {
        case 'left':
        case 'cell':
        case 'outside':
          instance.close()
          break
        case 'right':
          instance.open()
          break
      }
    },
    editData(isEdit) {
      if (this.checkedIds.length === 0) {
        return this.$toast(this.$t('common.dialog.selectedRecords'))
      }
      if (this.checkedIds.length > 1) {
        return this.$toast(this.$t('common.dialog.multipleSelected'))
      }
      this.gotoForm({
        isEdit: isEdit !== false,
        pk: this.checkedIds[0]
      })
    },
    detailData(item) {
      if (this.checkMode) {
        this.editData(false)
      } else {
        this.gotoForm({
          isEdit: false,
          pk: item[this.idKey]
        })
      }
    },
    removeDatas() {
      if (this.checkedIds.length === 0) {
        return this.$toast(this.$t('common.dialog.selectedRecords'))
      }
      this.removeRecord(this.checkedIds.join(','), r => {
        this.checkMode = false
        this.checkedIds = []
      })
    },
    removeData(item) {
      this.removeRecord(item[this.idKey])
    },
    removeRecord(ids, callback) {
      this.$dialog
        .confirm({
          title: '提示',
          message: '确定删除？'
        })
        .then(() => {
          removeFormData({
            id: ids,
            idKey: this.idKey,
            formKey: this.formKey
          }).then(() => {
            this.$toast.success('删除成功！')
            this.onRefresh()
            if (callback) {
              callback(true)
            }
          })
        })
    },
    toCheckMode() {
      if (this.checkMode) {
        this.show = true
      }
      this.checkMode = !this.checkMode
    },
    /**
             * 初始化工具栏
             */
    initToolbarAction() {
      const functionButtons = this.functionButtons || []
      const actions = []
      const moreActions = []
      for (let i = 0; i < functionButtons.length; i++) {
        const action = {}
        if (functionButtons[i].button_type === 'remove') {
          action['name'] = functionButtons[i].label
          action['buttonType'] = 'danger'
          action['callback'] = this.removeDatas
        } else if (functionButtons[i].button_type === 'edit') {
          action['name'] = functionButtons[i].label
          action['buttonType'] = 'primary'
          action['callback'] = this.editData
        } else if (functionButtons[i].button_type === 'detail') {
          action['name'] = functionButtons[i].label
          action['buttonType'] = 'primary'
          action['callback'] = this.detailData
          // } else if (functionButtons[i].button_type === 'startFlow') {
          //   action['name'] = functionButtons[i].label
          //   action['buttonType'] = 'default'
          //   action['callback'] = this.defaultCallback
          // } else if (functionButtons[i].button_type === 'defStartFlow') {
          //   action['name'] = functionButtons[i].label
          //   action['buttonType'] = 'default'
          //   action['callback'] = this.defaultCallback
        } else if (functionButtons[i].button_type === 'custom') {
          action['name'] = functionButtons[i].label
          action['buttonType'] = 'default'
          action['callback'] = this.customCallback
        }
        // 3个以上按钮就放在更多菜单中
        if (this.$utils.isNotEmpty(action)) {
          if (actions.length > 3) {
            moreActions.push(action)
          } else {
            actions.push(action)
          }
        }
      }
      this.actions = actions
      this.moreActions = moreActions
    },
    customCallback(item) {
      this.beforeSubmit('custom')
      // TODO 后面是自定义按钮的事
    },
    beforeSubmit(alias) {
      // 前置事件
      if (this.hasScript) {
        const beforSubmitResult = JTemplate._beforeSubmit(
          this,
          alias,
          this.dataTemplate
        )
        if (typeof beforSubmitResult !== 'undefined' && !beforSubmitResult) {
          return
        }
      }
    },
    includesFunctionButton(key) {
      const btns = this.functionButtons.map(button => {
        return button['button_type']
      })
      return btns.includes(key)
    },
    getQueryKey(queryColumns) {
      this.searchForms.forms = []
      // 目前基础数据类型为4种，后续开发再补充。
      const dataType = ['varchar', 'date', 'clob', 'number']
      const arr = [
        'text',
        'number',
        'numberRange',
        'hidden',
        'select',
        'selector',
        'dateRange',
        'dictionary',
        'datePicker'
      ]
      const fieldTypeArr = [
        'dateRange',
        'select',
        'dictionary',
        'number',
        'date',
        'datePicker'
      ]
      // var options = []
      var field_type
      var optionsType
      if (!this.$utils.isNotEmpty(queryColumns)) {
        return
      }
      queryColumns.forEach(column => {
        if (column.common === 'Y') {
          // pc端模板查询字段是否常用条件配置
          var options = []
          var field = this.templateFields[column.name]
          field_type = column.field_type ? column.field_type : field.field_type
          if (!field_type) {
            field_type = field.type
          }
          if (!column.field_options) {
            options = field.field_options
          }
          if (field_type === 'date') {
            field_type = 'datePicker'
          }
          column.field_type = field_type
          if (dataType.includes(field.type)) {
            if (
              field.type === 'varchar' ||
                                field.type === 'clob' ||
                                field.type === 'number' ||
                                field.type === 'date'
            ) {
              if (!fieldTypeArr.includes(column.field_type)) {
                column.name = 'Q^' + column.name + '^SL'
              }
              if (
                column.field_type === 'select' ||
                                    column.field_type === 'dictionary'
              ) {
                column.name = 'Q^' + column.name + '^S'
              }
              if (column.field_type === 'datePicker') {
                column.name = 'Q^' + column.name + '^D'
              }
              // 时间范围
              if (column.field_type === 'dateRange') {
                column.name = ['Q^' + column.name + '^DL', 'Q^' + column.name + '^DG']
              }
              if (column.field_type === 'number') {
                column.name = 'Q^' + column.name + '^DB'
              }
            }
            // TODO 数据类型为日期类时改其余控件数据类型 PC端配置日期改其他类型控件无效果，日期类型绑定字段暂且为目前字段。
          }
          if (column && column.same === 'N') {
            optionsType = typeof column.field_options
            if (optionsType === 'object' && column.field_options.options) {
              options = column.field_options.options
            } else {
              // 时间范围
              if (column.field_type === 'dateRange') {
                options['datefmt'] = 'yyyy-MM-dd'
              } else {
                options = column.field_options
              }
            }
            field_type = column.field_type
          }

          const fielder = {
            fieldType: field_type,
            slotName: !arr.includes(field_type)
              ? column.name + 'searchForm'
              : null,
            prop: column.name,
            label: column.label,
            options: options
          }
          this.searchForms.forms.push(fielder)
          if (!arr.includes(field_type)) {
            this.slotForms.push(fielder)
          }
          this.slotForms.forEach(v => {
            this.paramsForm[v.prop] = ''
          })
        }
      })
      if (this.$utils.isNotEmpty(queryColumns)) {
        let arr = []
        for (var i = 0; i < this.searchForms.forms.length; i++) {
          if (this.searchForms.forms[i].fieldType === 'text') {
            arr.push(this.searchForms.forms[i])
          } else {
            arr.push(this.searchForms.forms[0])
          }
        }
        if (this.searchForms.forms.length === 1) {
          arr = this.searchForms.forms
        }
        return [arr[0].prop, this.searchForms.forms]
      }
    },
    /**
             * 初始化脚本
             */
    initJTemplate() {
      const id = 'JTemplate'
      let el = document.getElementById(id)
      if (el) {
        el.parentNode.removeChild(el)
      }
      if (this.dataTemplate.attrs && this.dataTemplate.attrs.mobile_script) {
        const code = this.dataTemplate.attrs.mobile_script
        el = document.createElement('script')
        el.type = 'text/javascript'
        el.id = id
        document.body.appendChild(el)
        try {
          el.appendChild(document.createTextNode(code))
        } catch (ex) {
          el.text = code
        }
        document.body.appendChild(el)
      }
    }
  }
}
</script>
<style lang="scss">
  .data-template-list {
    .options-null {
      bottom: -9px !important;
    }

    .van-swipe-cell__left {
      color: #ffffff;
      font-size: 15px;
      width: 65px;
      height: 52px;
      display: inline-block;
      text-align: center;
      line-height: 50px;
      background-color: #38f;
    }

    .van-swipe-cell__right {
      color: #ffffff;
      font-size: 15px;
      width: 65px;
      height: 52px;
      display: inline-block;
      text-align: center;
      line-height: 50px;
      background-color: #f44;
    }

    .palette-button {
      position: fixed;
      right: 30px;
      bottom: 31px;
      z-index: 500;
    }

    .titles {
      display: inline-block;
      vertical-align: middle;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .active {
      color: #4688f9;
    }

    .disactive {
      color: #666;
    }
  }
</style>
