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
      @search="onSearch"
    />
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <van-list v-model="loading" :finished="finished" @load="onLoad">
        <card-list
          v-for="(item,index) in list"
          :key="item.id+index"
          :title="item.taskName"
          :desc="item.taskSubject"
          :date="item.createTime|formatTime"
          :tag="_getStatus(item.status)"
          :tag-type="_getStatusType(item.status)"
          :check-mode="checkMode"
          :checked="checkedIds.includes(item.id)"
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
    <lc-toolbar
      v-show="checkMode"
      :actions="mainActions"
    />
  </div>
</template>
<script>
import CardList from '@/components/CardList'
import ListResultPage from '@/components/ListResultPage'

import { myTaskChange, setStatus } from '@/api/platform/bpmn/bpmn'

import { formatParams, loadFinished, getResultType } from '@/utils/params'
import random from '@/mixins/random'
import bpmnStatus from '@/mixins/bpmnStatus'
import i18n from '@/utils/i18n'
import LcToolbar from '@/components/LcToolbar'

export default {
  components: {
    CardList,
    ListResultPage,
    LcToolbar
  },
  mixins: [random, bpmnStatus],
  data() {
    return {
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
      checkedStatuss: [],
      mainActions: [{
        'name': this.$t('common.button.revoke'),
        'buttonType': 'danger',
        'callback': this.onRevoke
      }]
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
    getData() {
      const params = formatParams({ 'Q^TASK_SUBJECT_^SL': this.subject }, { 'page': this.page })
      myTaskChange(params).then(response => {
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
    onSearch() {
      this.resultType = 'init'
      this.page = 1
      this.list = []
      this.getData()
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
      if (this.checkMode) {
        const index = this.checkedIds.indexOf(item.id)
        if (index > -1) {
          this.checkedIds.splice(index, 1)
          this.checkedStatuss.splice(index, 1)
        } else {
          this.checkedIds = []
          this.checkedIds.push(item.id)
          this.checkedStatuss = []
          this.checkedStatuss.push(item.status)
        }
      } else {
        this.$router.push({
          name: 'taskChangeDetail',
          params: {
            id: item.id
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
    generateTitle(name, title) { // generateTitle by vue-i18n
      return i18n.generateTitle(name, title)
    },
    onRevoke(item) {
      if (this.checkedIds.length === 0) {
        return this.$toast.fail(this.$t('common.dialog.selectedRecords'))
      }
      if (this.checkedIds.length > 1) {
        return this.$toast.fail(this.$t('common.dialog.multipleSelected'))
      }
      if (this.checkedStatuss[0] !== 'running') {
        return this.$toast.fail('该任务不能进行该操作！')
      }

      setStatus({ id: this.checkedIds[0], status: 'cancel' }).then(response => {
        this.$toast.success(this.$t('common.operate.success'))
        setTimeout(() => {
          this.$utils.reload()
        }, 2000)
      }).catch((e) => {
        console.log(e)
      })
    }
  }

}
</script>
