<template>
  <div>
    <van-search
      v-model="subject"
      show-action
      @search="onSearch"
      placeholder="请输入流程标题/名称"
    >
      <div slot="action">
        <van-icon name="wap-nav" :class="stateActive?'doing':'dont'" @click="clickMoreSarch" />
      </div>
    </van-search>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <van-list v-model="loading" :finished="finished" @load="onLoad">
        <card-list
          v-for="(item,index) in list"
          :key="item.id+index"
          :field0="item.field0"
          :field1="item.field1"
          :field2="item.field2"
          :field3="item.field3"
          :field4='item.field4'
          :field5="item.field5"
          :field6="item.field6"
          :field7="item.field7"
          :field8="item.field8"
          :field9="item.field9"
          :field10="item.field10"
          :title="item.title"
          :tag="item.content"
          :tag-type="_getStatusType(item.status)"
          :bgColor="_custColor()"
          is-link
          @click="onClick(item)"
        />
        <list-result-page
          :result-type="resultType"
          :error-type="errorType"
          :result-message="resultMessage"
        />
      </van-list>
    </van-pull-refresh>
    <more-search
      :show="popupShow"
      :search-forms="searchForms"
      @callback="onSearch"
      @close="visible => popupShow = visible"
      @resetForm="resetForm"
    >
      <div slot="type">
        <type
          v-model="type"
          label="流程分类"
          input-align="right"
          clearable
        />
      </div>
    </more-search>
  </div>
</template>
<script>
import CardList from '@/components/CardList'
import ListResultPage from '@/components/ListResultPage'
import MoreSearch from '@/components/MoreSearch'
import { myHandled } from '@/api/platform/bpmn/bpmnCust'
import { formatParams, loadFinished, getResultType } from '@/utils/params'
import random from '@/mixins/random'
import bpmnStatus from '@/mixins/bpmnStatus'
import type from '../components'
import { formatTime } from '@/filters/index'
import { getStatus } from '@/mixins/bpmnStatus'
import { getCustomData } from '../custom'
import i18n from '@/utils/i18n'
export default {
  components: {
    type,
    CardList,
    MoreSearch,
    ListResultPage
  },
  mixins: [random, bpmnStatus],
  data() {
    return {
      stateActive: false,
      popupShow: false,
      searchForms: {
        forms: [
          { prop: 'Q^SUBJECT_^SL', label: '请求标题', fieldType: 'text' },
          { prop: 'Q^TASK_NAME_^SL', label: '任务名称', fieldType: 'text' },
          { prop: 'Q^TYPE_ID_^SL', label: '流程分类', fieldType: 'slot', slotName: 'type' },
          { prop: 'Q^inst.status_^S', label: '状态', fieldType: 'select', valueKey: 'value', options: [
            { value: 'agree', label: '同意' },
            { value: 'oppose', label: '反对' },
            { value: 'reject', label: '驳回' },
            { value: 'rejectToStart', label: '驳回发起人' },
            { value: 'abandon', label: '弃权' }
          ] },
          { prop: ['Q^inst.create_time_^DL', 'Q^inst.create_time_^DG'], label: '创建时间', fieldType: 'dateRange', options: { datefmt: 'yyyy-MM-dd' }}
        ]
      },
      type: '',
      subject: '',
      list: [],
      page: 1,
      loading: false,
      finished: false,
      isLoading: true,
      resultType: 'init',
      errorType: null,
      resultMessage: null,
      par: {},
      params: ''
    }
  },
  methods: {
    generateTitle(name, title) { // generateTitle by vue-i18n
      return i18n.generateTitle(name, title)
    },
    formatTime: function(date) {
      return formatTime(date)
    },
    getStatus: function(param) {
      return getStatus(param)
    },
    getData(params) {
      myHandled(formatParams(params, { 'page': this.page })).then(response => {
        if (this.$utils.isNotEmpty(response.data.dataResult)) {
          response.data = getCustomData(response.data, 'inst')
          this.page++
          this.list = this.list.concat(response.data.dataResult)
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
      })
    },
    //
    onSearch(params) {
      this.stateActive = !!params
      if (typeof params === 'string') {
        this.stateActive = false
        params = { 'Q^subject_^SL': this.subject }
      }
      if (this.$utils.isNotEmpty(this.type)) {
        params['Q^type_id_^SL'] = this.type
      }
      if (this.$utils.isNotEmpty(this.checker)) {
        params['taskType'] = this.checker
      }
      this.params = params
      this.resultType = 'init'
      this.page = 1
      this.list = []
      this.getData(params)
      this.par = params
    },
    resetForm() {
      this.type = ''
    },
    clickMoreSarch() {
      this.popupShow = true
      this.stateActive = false
    },
    onLoad() {
      this.getData(this.params)
    },
    onRefresh() {
      this.resultType = 'init'
      this.isLoading = true
      this.page = 1
      this.list = []
      this.getData(this.params)
    },
    onClick(item) {
      this.$router.push({
        name: 'bpmnForm',
        query: {
          instanceId: item.bpmInstPo.id
        },
        params: {
          title: item.procDefName
        }
      })
    }
  }

}
</script>
<style lang="scss">
</style>
