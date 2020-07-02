<template>
  <div>
    <van-nav-bar
      :title="generateTitle($route.name,$route.params.title||$route.meta.title)"
      :left-text="$t('back')"
      :right-text="rightText"
      left-arrow
      fixed
      @click-left="$router.push({ name: 'dashboard' })"
      @click-right="toCheckMode()"
    />
    <van-search
      v-model="subject"
      show-action
      @search="onSearch"
    >
      <div slot="action">
        <van-icon name="filter-fill" :class="stateActive?'doing':'dont'" @click="clickMoreSarch" />
      </div>
    </van-search>
    <van-pull-refresh
      v-model="isLoading"
      @refresh="onRefresh"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        @load="onLoad"
      >
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
          :check-mode="checkMode"
          :checked="checkedIds.includes(item.id)"
          is-link
          @click="onClick(item)"
        />
      </van-list>
      <list-result-page
        :result-type="resultType"
        :error-type="errorType"
        :result-message="resultMessage"
      />
    </van-pull-refresh>
    <lc-toolbar
      v-show="checkMode"
      :actions="actions"
    />
    <batch-popup
      v-model="batchOpinionPopup"
      :task-id="checkedIds"
      :action-name="actionName"
      @on-refresh="onRefreshPage"
    />
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
      <div slot="checker" slot-scope="slotItem">
        <van-lc-checker
          v-model="checker"
          class="checkers"
          :options="slotItem.item.options"
          :label="slotItem.item.label"
          :cols="1"
          :type="'radio'"
          checker
        />
      </div>
    </more-search>
  </div>
</template>
<script>
import LcToolbar from '@/components/LcToolbar'
import CardList from '@/components/CardList'
import ListResultPage from '@/components/ListResultPage'
import MoreSearch from '@/components/MoreSearch'

import { myTasks } from '@/api/platform/bpmn/bpmn'
import { batchSuspendProcess, batchRecoverProcess } from '@/api/platform/bpmn/action'

import { formatParams, loadFinished, getResultType } from '@/utils/params'
import random from '@/mixins/random'
import bpmnStatus from '@/mixins/bpmnStatus'
import i18n from '@/utils/i18n'
import BatchPopup from './batch'
import type from '../components'
import vanLcChecker from '@/components/LcControl/checker'
export default {
  components: {
    type,
    CardList,
    ListResultPage,
    LcToolbar,
    BatchPopup,
    MoreSearch,
    vanLcChecker
  },
  mixins: [random, bpmnStatus],
  data() {
    return {
      popupShow: false,
      stateActive: false,
      searchForms: {
        forms: [
          { prop: 'Q^subject_^SL', label: '请求标题' },
          { prop: 'Q^type_id_^SL', label: '流程分类', fieldType: 'slot', slotName: 'type' },
          { prop: 'Q^creatorId^SL', label: '创建人', fieldType: 'selector', options: { selector_type: 'user' }},
          { prop: 'Q^procDefName^SL', label: '流程名称', fieldType: 'text' },
          { prop: ['Q^create_time_^DL', 'Q^create_time_^DG'], label: '创建时间', fieldType: 'dateRange', options: { datefmt: 'yyyy-MM-dd' }},
          { prop: 'taskType', label: '任务类型', fieldType: 'slot', slotName: 'checker', options: [
            { value: '', label: '全部' },
            { value: 'NORMAL', label: '待办' },
            { value: 'AGENT', label: '代理' },
            { value: 'DELIVERTO', label: '转交' }
          ] }
        ]
      },
      type: '',
      checker: '',

      subject: '',
      list: [],
      page: 1,
      loading: false,
      finished: false,
      isLoading: true,
      resultType: 'init',
      errorType: null,
      resultMessage: null,
      checkMode: false,
      checkedIds: [],
      show: false,
      actions: [
        {
          name: this.$t('common.button.agree'),
          buttonType: 'primary',
          callback: this.openAgreeDialog
        }, {
          name: this.$t('common.button.stop'),
          buttonType: 'danger',
          callback: this.openStopDialog
        }, {
          name: this.$t('common.button.suspend'),
          buttonType: 'warning',
          callback: this.suspend
        }, {
          name: this.$t('common.button.recover'),
          buttonType: 'info',
          callback: this.recover
        }
      ],
      batchOpinionPopup: false,
      actionName: 'agree'
    }
  },
  computed: {
    rightText() {
      if (this.list.length > 0) {
        return this.checkMode ? this.$t('common.button.cancel') : this.$t('common.button.manage')
      }
      return null
    }
  },
  methods: {
    generateTitle(name, title) { // generateTitle by vue-i18n
      return i18n.generateTitle(name, title)
    },
    getData(params) {
      myTasks(formatParams(params, { 'page': this.page })).then(response => {
        if (this.$utils.isNotEmpty(response.data.dataResult)) {
          this.page++
          this.list = this.list.concat(response.data.dataResult)
          this.finished = false
        }
        this.totalCount = response.data.pageResult.totalCount
        this.finished = !!loadFinished(response.data.pageResult)
        this.loading = false
        this.isLoading = false
        // 结果类型
        this.resultType = getResultType(this.list, this.finished)
        console.log(response)
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
      if (this.$utils.isNotEmpty(this.type) || this.$utils.isNotEmpty(this.checker)) {
        params['Q^type_id_^SL'] = this.type
        params['taskType'] = this.checker
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
      this.checker = ''
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
    onRefreshPage() {
      this.checkMode = false
      this.onRefresh()
    },
    onClick(item) {
      if (this.checkMode) {
        const index = this.checkedIds.indexOf(item.id)
        if (index > -1) {
          this.checkedIds.splice(index, 1)
        } else {
          this.checkedIds.push(item.id)
        }
      } else {
        this.$router.push({
          name: 'bpmnForm',
          query: {
            taskId: item.id
          },
          params: {
            title: item.procDefName
          }
        })
      }
    },
    toCheckMode() {
      if (this.checkMode) {
        this.show = true
      }
      this.checkMode = !this.checkMode
    },
    openAgreeDialog() {
      if (this.checkedIds.length === 0) {
        return this.$toast(this.$t('common.dialog.selectedRecords'))
      }
      this.batchOpinionPopup = true
      this.actionName = 'agree'
    },
    openStopDialog() {
      if (this.checkedIds.length === 0) {
        return this.$toast(this.$t('common.dialog.selectedRecords'))
      }
      this.batchOpinionPopup = true
      this.actionName = 'stop'
    },
    suspend() {
      if (this.checkedIds.length === 0) {
        return this.$toast(this.$t('common.dialog.selectedRecords'))
      }
      this.$dialog.confirm({
        title: this.$t('common.dialog.warn'),
        message: this.$t('common.operate.makeSure')
      }).then(() => {
        const taskIds = this.checkedIds.join()
        batchSuspendProcess({ 'taskIds': taskIds }).then(response => {
          this.$toast.success(`批量挂起流程成功！`)
          this.onRefreshPage()
        }).catch((e) => {
          console.error(e)
        })
      })
    },
    recover() {
      if (this.checkedIds.length === 0) {
        return this.$toast(this.$t('common.dialog.selectedRecords'))
      }
      this.$dialog.confirm({
        title: this.$t('common.dialog.warn'),
        message: this.$t('common.operate.makeSure')
      }).then(() => {
        const taskIds = this.checkedIds.join()
        batchRecoverProcess({ 'taskIds': taskIds }).then(response => {
          this.$toast.success(`批量恢复流程成功！`)
          this.onRefreshPage()
        }).catch((e) => {
          console.error(e)
        })
      })
    }
  }

}
</script>
