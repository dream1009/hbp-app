<template>
  <div>
    <selector
      :show-popup="showPopup"
      :value="checkedValue"
      :data-list="dataList"
      :cache-data="cacheData"
      :path-data="pathData"
      :multiple="multiple"

      :left-text="leftText"
      :search-placeholder="searchPlaceholder"
      :id-key="idKey"
      :parent-id-key="parentIdKey"
      :value-key="valueKey"
      :label-key="labelKey"
      :children-key="childrenKey"

      :root-name="$t('components.selector.org')"

      :loading="loading"
      :finished="finished"

      @load-data="loadData"
      @change-path="changePath"
      @toggle-child="toggleChild"
      @loading="changeLoading"
      @init-page-data="initPageData"
      @confirm="onConfirm"
      @cancel="onCancel"
      @click-overlay="clickOverlay"
    />
  </div>
</template>
<script>
import { queryByParentIdOrName, getOrgById } from '@/api/platform/org/org'
import { getTreeDataByScriptValue } from '@/api/platform/org/entity'
import { formatParams, loadFinished, getResultType } from '@/utils/params'
import i18n from '@/lang' // Internationalization 国际化
import Selector from './selector'

export default {
  components: {
    Selector
  },
  props: {
    value: Array,
    showPopup: Boolean,
    multiple: Boolean,
    leftText: String,
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
      default: 'id'
    },
    labelKey: {
      type: String,
      default: 'name'
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
      checkedValue: [],
      pathData: [],
      dataList: [],
      cacheData: {}, // 缓存数据
      parentId: '0',

      page: 1,
      loading: false,
      finished: false,
      isLoading: true,
      resultType: 'init',
      errorType: null,
      resultMessage: null
    }
  },
  watch: {
    value() {
      this.initData(this.value)
    },
    showPopup() {
      this.parentId = '0'
      this.pathData = [{
        id: '0',
        name: '组织'
      }]
      this.initPageData()
      this.cacheData = []
    }
  },
  methods: {
    initData(data) {
      this.checkedValue = []
      if (this.$utils.isEmpty(data)) {
        return
      }
      data.forEach(v => {
        if (this.cacheData[v]) {
          this.checkedValue.push(v)
        } else {
          this.getDataInfo(v)
        }
      })
    },
    /**
     * 获取数据信息
     */
    getDataInfo(id) {
      getOrgById({ id: id }).then(response => {
        const data = response.data
        if (this.$utils.isEmpty(data)) {
          return
        }
        this.cacheData[data[this.idKey]] = data
        this.checkedValue.push(data[this.idKey])
        this.$emit('init-data', this.getSelectedData(this.checkedValue))
      }).catch((e) => {
        console.error(e)
      })
    },
    loadData(data, isInit) {
      if (isInit) {
        this.initPageData()
        this.pathData = []
      }
      const params = {}
      if (data.value) {
        params['name'] = data.value
      }
      if (data[this.idKey] || this.parentId) {
        params['parentId'] = data[this.idKey] || this.parentId
      } else {
        params['parentId'] = '0'
      }

      if (this.otherFilter !== 'script') {
        params['type'] = this.otherFilter
        params['partyId'] = this.otherFilterCondition ? this.otherFilterCondition.partyId : undefined
        params['includeSub'] = this.otherFilterIncludeSub
      }

      // 加载
      queryByParentIdOrName(formatParams(
        params, { 'page': this.page }
      )).then(response => {
        const dataList = response.data.dataResult
        const pageResult = response.data.pageResult

        if (this.$utils.isNotEmpty(dataList)) {
          dataList.map((data) => {
            this.cacheData[data[this.valueKey]] = data
          })

          if (this.page !== pageResult.page) {
            this.page = pageResult.page
          } else {
            this.dataList = this.dataList.concat(dataList)
          }
          this.page++
          this.finished = false
        }
        this.loading = false
        this.isLoading = false
        this.finished = !!loadFinished(response.data.pageResult)
        // 结果类型
        this.resultType = getResultType(this.list, this.finished)
      }).catch((e) => {
        this.loading = false
        this.isLoading = false
        this.finished = true
        this.resultType = 'error'
        this.resultMessage = e.message
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
    onConfirm(data) {
      this.$emit('confirm', this.getSelectedData(data))
    },
    clickOverlay() {
      this.$emit('click-overlay')
    },
    toggleChild(data) {
      this.parentId = data.id
      this.pathData.push({ id: data.id, name: data.name })
      this.initPageData()
      this.loadData({})
    },
    changePath(index) {
      this.parentId = this.pathData[index][this.idKey]
      this.pathData.splice(index + 1, this.pathData.length - 1)
      this.initPageData()
      this.loadData({})
    },
    initPageData() {
      this.page = 1
      this.finished = false
      this.dataList = []
      // this.cacheData = []
    },
    changeLoading(data) {
      this.loading = data
    },
    loadDataByScript() {
      getTreeDataByScriptValue({ 'script': this.otherFilterCondition.scriptContent }).then(response => {
        const dataList = response.data.dataResult
        const pageResult = response.data.pageResult

        if (this.$utils.isNotEmpty(dataList)) {
          dataList.map((data) => {
            this.cacheData[data[this.valueKey]] = data
          })

          if (this.page !== pageResult.page) {
            this.page = pageResult.page
          } else {
            this.dataList = this.dataList.concat(dataList)
          }
          this.page++
          this.finished = false
        }
        this.loading = false
        this.isLoading = false
        this.finished = !!loadFinished(response.data.pageResult)
        // 结果类型
        this.resultType = getResultType(this.list, this.finished)
      }).catch((e) => {
        this.loading = false
        this.isLoading = false
        this.finished = true
        this.resultType = 'error'
        this.resultMessage = e.message
        console.error(e)
      })
    }
  }
}
</script>
