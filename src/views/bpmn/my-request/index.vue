<template>
  <div>
    <van-search
      v-model="subject"
      show-action
      @search="onSearch"
    >
      <div slot="action">
        <van-icon name="filter-fill" :class="stateActive?'doing':'dont'" @click="clickMoreSarch" />
      </div>
    </van-search>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <van-list v-model="loading" :finished="finished" @load="onLoad">
        <card-list
          v-for="(item,index) in list"
          :key="item.id+index"
          :title="item.procDefName"
          :desc="item.subject"
          :date="item.createTime|formatTime"
          :tag="_getStatus(item.status)"
          :tag-type="_getStatusType(item.status)"
          :bg-color="_randomColor(index)"
          :icon="_randomIcon(index)"
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
      @close="callback => popupShow = callback"
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
import type from '../components'

import { myRequest } from '@/api/platform/bpmn/bpmn'

import { formatParams, loadFinished, getResultType } from '@/utils/params'
import random from '@/mixins/random'
import bpmnStatus from '@/mixins/bpmnStatus'

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
      subject: '',
      stateActive: false,
      popupShow: false,
      searchForms: {
        forms: [
          { prop: 'Q^subject_^SL', label: '请求标题', fieldType: 'text' },
          { prop: 'Q^type_id_^SL', label: '流程分类', fieldType: 'slot', slotName: 'type' },
          { prop: 'Q^proc_def_name_^SL', label: '流程名称', fieldType: 'text' },
          { prop: ['Q^create_time_^DL', 'Q^create_time_^DG'], label: '创建时间', fieldType: 'dateRange', options: { datefmt: 'yyyy-MM-dd' }}
        ]
      },
      type: '',
      list: [],
      page: 1,
      loading: false,
      finished: false,
      isLoading: true,
      resultType: 'init',
      errorType: null,
      resultMessage: null
    }
  },
  methods: {
    getData(params) {
      myRequest(formatParams(params, { 'page': this.page })).then(response => {
        if (this.$utils.isNotEmpty(response.data.dataResult)) {
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
    onSearch(params) {
      this.stateActive = !!params
      if (typeof params === 'string') {
        this.stateActive = false
        params = { 'Q^subject_^SL': this.subject }
      }
      if (this.$utils.isNotEmpty(this.type)) {
        params['Q^type_id_^SL'] = this.type
      }
      this.resultType = 'init'
      this.page = 1
      this.list = []
      this.getData(params)
    },
    clickMoreSarch() {
      this.popupShow = true
      this.stateActive = false
    },
    resetForm() {
      this.type = ''
    },
    onLoad() {
      this.getData()
    },
    onRefresh() {
      this.resultType = 'init'
      this.isLoading = true
      this.page = 1
      this.list = []
      this.getData()
    },
    onClick(item) {
      this.$router.push({
        name: 'bpmnForm',
        query: {
          instanceId: item.id
        },
        params: {
          title: item.procDefName
        }})
    }
  }

}
</script>
