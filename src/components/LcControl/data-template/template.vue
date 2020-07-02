<template>
  <div v-if="showDialogPopup">
    <van-popup v-model="showDialogPopup" class="lc-fullscreen-popup" position="bottom" @click-overlay="clickOverlay">
      <van-nav-bar
        :left-text="leftText"
        left-arrow
        @click-left="onCancel"
      >
        <span slot="title" @click="onTitle()">{{ title }}</span>
        <span slot="right" class="van-nav-bar__text" @click="onConfirm">{{ $t('confirm') }}</span>
      </van-nav-bar>
      <div class="lc-fixed-navbar">
        <!--查询 -->
        <form action="/">
          <van-search
            v-show="$utils.isNotEmpty(queryKey)"
            v-model="search"
            :placeholder="searchPlaceholder"
            show-action
            @search="onSearch"
          />
        </form>
        <van-cell v-if="displayColumns&&displayColumns.length>1">
          <van-col style="width: 40px" span="1">&nbsp;</van-col>
          <van-col style="width: 60px" span="2" v-for="(item, index) in displayColumns"  :key="index">{{item.label}}</van-col>
        </van-cell>
        <!--树形 -->
        <div class="lc-fixed-navbar">
        <van-cell-group v-if="isTree">
          <van-cell class="root-title">
            <div slot="title">
              <template v-for="(data,index) in pathData">
                <span
                  :key="data[idKey]"
                  :class="{'is-link':pathData.length-1!==index}"
                  @click="changePath(index)"
                >{{ data[labelKey] }}</span>
                <span v-if="pathData.length-1!==index" :key="index">/</span>
              </template>
            </div>
          </van-cell>
        </van-cell-group>
        <!--多选 -->
        <van-checkbox-group v-if="multiple" v-model="checkbox">
          <van-cell-group>
            <van-cell
              v-for="(data,index) in dataList"
              :key="data[idKey]+index"
              clickable
              @click="toggle(data,index)"
            >
              <div slot="title">
                <van-checkbox
                  ref="checkboxes"
                  :name="data[idKey]"
                  @click.native.stop="(e)=>clickCheckbox(e,data,index)"
                >
                  <field-formatter
                    :label-key="labelKey"
                    :data="data"
                    :template-fields="templateFields"
                  />
                </van-checkbox>
              </div>
              <span
                v-if="hasChild(data)"
                slot="right-icon"
                @click="toggle(data,index)"
              >
                <span class="van-cell__right-icon" />
                <van-icon name="arrow " class="van-cell__right-icon" />
              </span>
            </van-cell>
          </van-cell-group>
        </van-checkbox-group>

        <!--单选 -->
        <van-radio-group v-else v-model="radio">
          <van-cell-group>
            <van-cell
              v-for="(data,index) in dataList"
              :key="data[idKey]+index"
              clickable
            >
              <div slot="title" @click="toggle(data,index)">
                <!--<van-radio :name="data[idKey]" v-if="displayColumns&&displayColumns.length>1">
                  <field-formatter
                    v-for="(item, index1) in displayColumns"
                    :key="data[idKey]+index1"
                    :label-key="item.name"
                    :data="data"
                    :template-fields="templateFields"
                  />
                </van-radio>-->
                <div v-if="displayColumns&&displayColumns.length>1">
                  <tr>
                  <van-radio style="width: 40px" :name="data[idKey]">
                  </van-radio>
                  <td style="width: 60px;margin-left: 20px"  v-for="(item, index1) in displayColumns" :key="index1">{{data[item.name]}}</td>
                  </tr>
                </div>
                <van-radio :name="data[idKey]" v-else>
                  <field-formatter
                    :label-key="labelKey"
                    :data="data"
                    :template-fields="templateFields"
                  />
                </van-radio>
              </div>
              <span
                v-if="hasChild(data)"
                slot="right-icon"
                @click="toggleChild(data,index)"
              >
                <span class="van-cell__right-icon">下级</span>
                <van-icon name="arrow " class="van-cell__right-icon" />
              </span>
            <!--
                     <span
                      slot="right-icon"
                      @click="toggleMore(data,index)" >

                      <span class="van-cell__right-icon">明细</span>
                      <van-icon  name="arrow " class="van-cell__right-icon" />
                    </span>
                    -->
            </van-cell>
          </van-cell-group>
        </van-radio-group>
      </div>
      </div>
    </van-popup>

    <!--多选点击明细 -->
    <van-popup v-model="showDetailPopup" class="lc-fullscreen-popup" position="right">
      <van-nav-bar
        :left-text="leftText"
        left-arrow
        @click-left="onDetailCancel"
      >
        <span slot="title">已选择的选项</span>
        <span slot="right" class="van-nav-bar__text" @click="onDetailConfirm">{{ $t('confirm') }}</span>
      </van-nav-bar>

      <van-cell-group>
        <van-swipe-cell
          v-for="(data,index) in selectedData"
          :key="data[idKey]+index"
          :right-width="65"
          class="lc-swipe-cell"
        >
          <van-cell
            clickable
          >
            <template slot="title">
              <field-formatter
                :label-key="labelKey"
                :data="data"
                :template-fields="templateFields"
                class="van-cell-text"
              />
            </template>
          </van-cell>
          <span slot="right" @click="removeSelected(index)">{{ $t('delete') }}</span>
        </van-swipe-cell>
      </van-cell-group>
    </van-popup>
  </div>
</template>

<script>
import FieldFormatter from '@/components/DataTemplate/field-formatter'

import { queryDataJson, getDataById } from '@/api/platform/data/dataTemplate'

import { transformToTreeFormat } from '@/utils/tree'
import { formatParams } from '@/utils/params'
import i18n from '@/lang' // Internationalization 国际化
export default {
  components: {
    FieldFormatter
  },
  props: {
    templateKey: String,
    templateFields: Object,
    displayColumns: {
      type: Array
    },
    params: Object,
    value: Array,
    showPopup: Boolean,
    multiple: Boolean,
    leftText: String,
    searchPlaceholder: String,
    isTree: Boolean,
    idKey: { // 唯一键
      type: String,
      default: 'id_'
    },
    parentIdKey: {
      type: String,
      default: 'parentId'
    },
    valueKey: { // 展示的key showLableKey
      type: String,
      default: 'id_'
    },
    labelKey: {
      type: String,
      default: 'name'
    },
    childrenKey: {
      type: String,
      default: 'children'
    },
    queryKey: String,
    dynamicParams: Object // 动态参数
  },
  data() {
    return {
      search: '',
      radio: '', // 单选
      checkbox: [], // 多选
      pathData: [],
      dataList: [], // 数据
      cacheData: {}, // 缓存数据
      template: {},
      showDialogPopup: false,
      showDetailPopup: false,
      style: {
        width: '20px'
      }
    }
  },
  computed: {
    title() {
      if (this.multiple) {
        const length = this.checkbox.length
        return length > 0 ? i18n.t('components.checkbox.title', { length: length }) : ''
      } else {
        return this.$utils.isNotEmpty(this.radio) ? this.cacheData[this.radio] ? this.cacheData[this.radio][this.labelKey] : '' : ''
      }
    },
    selectedData() {
      return this.checkbox.map((d) => {
        return this.cacheData[d] || {}
      })
    }
  },
  watch: {
    value() {
      this.initData(this.value)
    },
    showPopup() {
      this.showDialogPopup = this.showPopup
      if (this.showPopup && this.params) {
        this.loadData(this.params, true)
      }
    },
    params() {
      this.initTemplate()
    }

  },
  methods: {
    initData(data) {
      this.checkedValue = []
      if (this.$utils.isEmpty(data)) {
        return this.setSelectedData()
      }
      data.forEach(v => {
        if (this.cacheData[v]) {
          this.checkedValue.push(v)
        } else {
          this.getDataInfo(v)
        }
      })
      this.setSelectedData(data)
    },
    setSelectedData(data) {
      if (this.multiple) {
        this.checkbox = data || []
      } else {
        this.radio = data ? data[0] : ''
      }
    },
    /**
     * 获取数据信息
     */
    getDataInfo(id) {
      if (!id) {
        return
      }
      getDataById({
        key: this.templateKey,
        id: id
      }).then(response => {
        const data = response.data
        if (this.$utils.isNotEmpty(data)) {
          this.cacheData[data[this.idKey]] = data
          this.checkedValue.push(data[this.idKey])
          this.$emit('init-data', this.getSelectedData(this.checkedValue))
        }
      }).catch((e) => {
        console.error(e)
      })
    },
    loadData(p, isInit) {
      if (isInit) {
        this.pathData = []
      }
      const params = {
        key: this.templateKey,
        dynamicParams: JSON.stringify(this.dynamicParams), // 动态参数,获取页面的值
        filterConditionKey: '' // 多个过滤条件
      }
      if (this.search && this.queryKey) {
        params[`Q^${this.queryKey}^SL`] = this.search
      }
      // 加载数据
      queryDataJson(formatParams(params, this.page)).then(response => {
        const dataResult = response.data.dataResult
        if (this.isTree) {
          this.dataList = transformToTreeFormat(dataResult, {
            idKey: this.idKey,
            parentIdKey: this.parentIdKey,
            childrenKey: this.childrenKey
          })
          // 初始化最顶级数据
          this.initRootTreeData(response.vars)
          // 缓存数据
          dataResult.map((d) => {
            this.cacheData[d[this.idKey]] = d
          })
        } else {
          this.dataList = dataResult
          this.dataList.map((d) => {
            this.cacheData[d[this.idKey]] = d
          })
        }
      }).catch((e) => {
        console.error(e)
      })
    },
    /**
     * 初始
     */
    initRootTreeData(vars) {
      this.pathData = []
      const data = {
        [this.idKey]: vars.rootPId || '',
        [this.labelKey]: vars.rootLabel || '顶级',
        [this.childrenKey]: this.dataList
      }
      this.pathData.push(data)
    },

    getSelectedData(data) {
      return data.map((d) => {
        return this.cacheData[d]
      })
    },
    onCancel() {
      this.$emit('cancel')
    },
    onConfirm() {
      const data = this.multiple ? this.checkbox : [this.radio]
      const isNull = this.multiple ? this.checkbox.length === 0 : this.radio === ''
      if (isNull) {
        this.$dialog.alert({ message: '请选择选项后再操作' })
        return
      }
      this.$emit('confirm', this.getSelectedData(data))
    },
    clickOverlay() {
      this.$emit('click-overlay')
    },
    toggleChild(data) {
      if (data[this.childrenKey] && data[this.childrenKey].length > 0) {
        this.dataList = data[this.childrenKey]
        this.pathData.push(data)
      }
    },
    changePath(index) {
      this.dataList = this.pathData[index][this.childrenKey]
      this.pathData.splice(index + 1, this.pathData.length - 1)
    },
    // 查询
    onSearch() {
      // this.page = 1
      this.list = []
      this.loadData()
    },
    onDetailCancel() {
      this.showDetailPopup = false
    },
    onDetailConfirm() {
      this.showDetailPopup = false
    },
    onTitle() {
      if (!this.multiple) { return }
      this.showDetailPopup = true
    },
    hasChild(data) {
      if (this.isTree) {
        return data[this.childrenKey] && data[this.childrenKey].length
      }
      return false
    },
    clickCheckbox(event, data, index) {
      let flag = true
      const target = event.target
      if (target && target.className.indexOf('lc-data-template-data') > -1) {
        flag = false
      } else if (target && target.className.indexOf('van-checkbox__label') > -1) {
        flag = false
      } else if (target && target.parentNode.className.indexOf('van-checkbox__icon') > -1) {
        flag = false
      }
      if (flag) {
        this.toggle(data, index)
      }
    },
    toggle(data, index) {
      if (this.multiple) { // 多选
        this.toggleCheckbox(data, index)
      } else {
        this.toggleRadio(data, index)
      }
    },
    // 单选
    toggleRadio(data, index) {
      this.radio = data[this.idKey]
    },
    toggleCheckbox(data, index) {
      this.$refs.checkboxes[index].toggle()
    },
    removeSelected(index) {
      this.checkbox.splice(index, 1)
    },
    toggleMore(data, index) {
      this.$dialog.alert({
        message: this.format4popup(data)
      })
    },
    format4popup(data) {
      const res = []
      const displayColumns = this.template.display_columns
      for (let i = 0; i < displayColumns.length; i++) {
        const column = displayColumns[i]
        res.push(column.label + ':' + this.format4Data(data[column.name]))
      }
      return res.join('</br>')
    },
    format4Data(data) {
      // TODO 转换数据
      return data
    },

    // ====私有方法
    initTemplate() {
      const attrs = this.params.attrs
      if (attrs.templates) {
        // 如果是组合
        if (attrs.showType === 'compose') {
          let tpl = {}
          if (attrs.composeType === 'treeList') {
            tpl = attrs.templates[1]
          } else if (attrs.composeType === 'listTree') {
            tpl = attrs.templates[0]
          }
          if (!tpl) {
            this.$dialog.alert('未设置模版！')
            return
          }

          if (tpl.attrs['bind_template'] === 'Y') {
            const t = this.getDataByKey(tpl.attrs['bind_template_key'])
            if (t) {
              this.template = t.templates[0]
            }
          } else {
            this.template = tpl
          }
        } else {
          this.template = attrs.templates[0]
        }
      }
    }

  }
}
</script>
