<template>
  <div v-if="showSelectorPopup">
    <van-popup v-model="showSelectorPopup" class="lc-fullscreen-popup" position="bottom" @click-overlay="clickOverlay">
      <van-nav-bar
        :left-text="leftText"
        left-arrow
        @click-left="onCancel"
        :style="getBackGroundStyle()"
      >
        <span slot="title" @click="onTitle()" :style="getTextStyle()">{{ title }}</span>
        <van-icon slot="left" name="arrow-left" :style="getSlotStyle()"/>
        <span slot="right" class="van-nav-bar__text" @click="onConfirm" :style="getTextStyle()">{{ $t('confirm') }}</span>
      </van-nav-bar>
      <form action="/">
        <van-search
          v-model="search"
          :placeholder="searchPlaceholder"
          @search="onSearchAction"
        >
          <!-- <van-icon slot="action" name="wap-nav" style="padding:0 10px;" @click="onSearchAction"/> -->
        </van-search>
      </form>
      <van-cell-group>
        <van-cell class="root-title">
          <div slot="title">
            <template v-for="(data,index) in pathData">
              <span
                :key="data[valueKey]"
                :class="{'is-link':pathData.length-1!==index}"
                @click="changePath(index)"
              >{{ data[labelKey] }}</span>
              <span v-if="pathData.length-1!==index" :key="index">/</span>
            </template>
          </div>
        </van-cell>
        <van-cell
          v-for="(data,index) in sysList"
          :key="data[idKey]+index"
          clickable
          @click="toggleChild(data,index)"
        >
          <div slot="title">
            {{ data[labelKey] }}<van-tag plain type="danger">子系统</van-tag>
          </div>
          <span
            slot="right-icon"
          >
            <span class="van-cell__right-icon" />
            <van-icon name="arrow " class="van-cell__right-icon" />
          </span>
        </van-cell>
      </van-cell-group>

      <!---多选-->
      <van-checkbox-group v-if="multiple" v-model="checkbox">
        <van-cell-group>
          <van-list v-model="loading" :finished="finished" @load="onLoad">
            <van-cell
              v-for="(data,index) in roleList"
              :key="data[valueKey]+index"
              clickable
            >
              <div slot="title" @click="toggle(data,index)">
                <van-checkbox
                  ref="checkboxes"
                  :name="data[valueKey]"
                  @click.native.stop="(e)=>clickCheckbox(e,data,index)"
                >
                  {{ data[labelKey] }}
                </van-checkbox>
              </div>
            </van-cell>
          </van-list>
        </van-cell-group>
      </van-checkbox-group>

      <!---单选-->
      <van-radio-group v-else v-model="radio">
        <van-cell-group>
          <van-list v-model="loading" :finished="finished" @load="onLoad">
            <van-cell
              v-for="(data,index) in roleList"
              :key="data[valueKey]+index"
              clickable
            >
              <div slot="title" @click="toggle(data,index)">
                <van-radio
                  ref="radioes"
                  :name="data[valueKey]"
                >
                  {{ data[labelKey] }}
                </van-radio>
              </div>
            </van-cell>
          </van-list>
        </van-cell-group>
      </van-radio-group>
    </van-popup>
    <!--点击明细 -->
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
          :key="data[valueKey]+index"
          :right-width="65"
          class="lc-swipe-cell"
        >
          <van-cell
            :title="data[labelKey]"
            clickable
          />
          <span slot="right" @click="removeSelected(index)">{{ $t('delete') }}</span>
        </van-swipe-cell>
      </van-cell-group>
    </van-popup>
  </div>
</template>
<script>
import { queryBySubSysIdOrName, getRoleById } from '@/api/platform/org/role'
import { getTreeDataByScriptValue } from '@/api/platform/org/entity'
import { findAll } from '@/api/platform/system'
import { formatParams, loadFinished, getResultType } from '@/utils/params'
import i18n from '@/lang' // Internationalization 国际化
import { getBackGroundStyle, getSlotStyle, getTextStyle} from '@/mixins/navbar';
export default {
  props: {
    showPopup: Boolean,
    multiple: Boolean,
    value: {
      type: [String, Array]
    },
    leftText: {
      type: String,
      default: i18n.t('cancel')
    },
    searchPlaceholder: {
      type: String,
      default: i18n.t('common.input')
    },
    valueKey: {
      type: String,
      default: 'id'
    },
    labelKey: {
      type: String,
      default: 'name'
    },
    idKey: {
      type: String,
      default: 'id'
    },
    parentIdKey: {
      type: String,
      default: 'parentId'
    },
    childrenKey: {
      type: String,
      default: 'children'
    },
    otherFilter: String,
    otherFilterIncludeSub: [String, Boolean],
    otherFilterCondition: {
      type: Object,
      default: () => { return {} }
    }
  },
  data() {
    return {
      search: '',
      pathData: [],
      radio: '',
      checkbox: [],
      sysList: [],
      roleList: [],
      cacheData: {},
      showSelectorPopup: false,
      showDetailPopup: false,

      page: 1,
      loading: false,
      finished: false,
      isLoading: true,
      resultType: 'init',
      errorType: null,
      resultMessage: null
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
      this.showSelectorPopup = this.showPopup
      if (this.showPopup) {
        this.initPageData()
        this.cacheData = []
        if (this.otherFilter === 'script') {
          this.loadDataByScript()
        } else {
          this.loadData({
            name: this.$t('components.selector.role')
          }, true)
        }
      } else {
        this.radio = ''
        this.checkbox = []
      }
    }
  },
  methods: {
    onLoad() {
      const params = {}
      const pathData = this.pathData
      if (this.search) {
        params['name'] = this.search
      }
      if (pathData.length > 1 && pathData[pathData.length - 1]) {
        params['orgId'] = pathData[pathData.length - 1].id
      }
      this.loadRoleData(params)
    },
    initData(data) {
      this.checkbox = []
      if (this.$utils.isEmpty(data)) {
        return
      }
      data.forEach(v => {
        if (this.cacheData[v]) {
          this.checkbox.push(v)
        } else {
          this.getDataInfo(v)
        }
      })
      if (this.multiple) {
        this.checkbox = data
      } else {
        this.radio = data[0]
      }
    },
    /**
     * 获取数据信息
     */
    getDataInfo(id) {
      getRoleById({ id: id }).then(response => {
        const data = response.data
        if (this.$utils.isEmpty(data)) { return }
        data[this.labelKey] = data['name']
        this.cacheData[data[this.idKey]] = data
        if (this.checkbox && this.checkbox.indexOf(data[this.idKey]) === -1) {
          this.checkbox.push(data[this.idKey])
        }
        this.$emit('init-data', this.getSelectedData(this.checkbox))
      }).catch((e) => {
        console.error(e)
      })
    },
    loadData(data, isInit) {
      if (isInit) {
        this.pathData = []
        // 加载
        findAll().then(res => {
          this.sysList = res.data

          data[this.childrenKey] = this.sysList
          this.pathData.push(data)
          this.roleList = []
        }).catch((e) => {
          console.error(e)
        })
      } else {
        this.sysList = []
        if (data[this.idKey]) {
          this.loadRoleData({ 'sysId': data[this.idKey] })
        }
        this.pathData.push(data)
      }
    },
    // 加载角色数据
    loadRoleData(params) {
      if (!params) return
      if (this.otherFilter !== 'script') {
        params['type'] = this.otherFilter
        params['partyId'] = this.otherFilterCondition ? this.otherFilterCondition.partyId : undefined
      }

      queryBySubSysIdOrName(formatParams(params, { 'page': this.page })).then(response => {
        const roleList = response.data.dataResult

        if (this.$utils.isNotEmpty(roleList)) {
          roleList.map((d) => {
            d[this.labelKey] = d[this.labelKey]
            this.cacheData[d[this.valueKey]] = d
          })
          this.page++
          this.roleList = this.roleList.concat(roleList)
          this.finished = false
        }
        this.finished = !!loadFinished(response.data.pageResult)
        this.loading = false
        this.isLoading = false
        // 结果类型
        this.resultType = getResultType(this.list, this.finished)
      }).catch((e) => {
        this.loading = false
        this.isLoading = false
        this.finished = true
        this.resultType = 'error'
        this.resultMessage = e.message
        // TODO 异常
        console.error(e)
      })
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
      this.$emit('confirm', this.getSelectedData(data))
    },
    clickOverlay() {
      this.$emit('click-overlay')
    },
    toggleChild(data) {
      this.initPageData()
      this.loadData(data)
    },
    changePath(index) {
      const parentOrg = this.pathData[index]
      this.sysList = parentOrg[this.childrenKey]
      this.pathData.splice(index + 1, this.pathData.length - 1)
      // this.loadRoleData({
      //   sysId: parentOrg[this.idKey]
      // })
      this.loadData({
        name: this.$t('components.selector.role')
      }, true)
    },
    // 查询
    onSearchAction() {
      this.initPageData()
      this.loadRoleData({ 'name': this.search })
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
    getPhoto() {

    },
    clickCheckbox(event, data, index) {
      let flag = true
      const target = event.target
      if (target && target.className.indexOf('van-checkbox__label') > -1) {
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
      this.radio = data[this.valueKey]
    },
    toggleCheckbox(data, index) {
      this.$refs.checkboxes[index].toggle()
    },
    removeSelected(index) {
      this.checkbox.splice(index, 1)
    },
    initPageData() {
      this.page = 1
      this.sysList = []
      this.roleList = []
      // this.cacheData = []
    },
    loadDataByScript() {
      getTreeDataByScriptValue({ 'script': this.otherFilterCondition.scriptContent }).then(response => {
        const roleList = response.data.dataResult

        if (this.$utils.isNotEmpty(roleList)) {
          roleList.map((d) => {
            d[this.labelKey] = d[this.labelKey]
            this.cacheData[d[this.valueKey]] = d
          })
          this.page++
          this.roleList = this.roleList.concat(roleList)
          this.finished = false
        }
        this.finished = !!loadFinished(response.data.pageResult)
        this.loading = false
        this.isLoading = false
        // 结果类型
        this.resultType = getResultType(this.list, this.finished)
      }).catch((e) => {
        this.loading = false
        this.isLoading = false
        this.finished = true
        this.resultType = 'error'
        this.resultMessage = e.message
        // TODO 异常
        console.error(e)
      })
    },
      getBackGroundStyle() {
          return getBackGroundStyle()
      },
      getSlotStyle() {
          return getSlotStyle()
      },
      getTextStyle() {
          return getTextStyle()
      }

  }
}
</script>
