<template>
  <div class="my-revoke">
    <!--<van-nav-bar
      :title="generateTitle($route.name,$route.params.title||$route.meta.title)"
      :left-text="$t('back')"
      :right-text="rightText"
      left-arrow
      fixed
      @click-left="$router.push({ name: 'dashboard' })"
      @click-right="toCheckMode()"
    />-->
    <van-nav-bar
      :title="generateTitle($route.name,$route.params.title||$route.meta.title)"
      fixed
      @click-left="$router.push({ name: 'dashboard' })"
      @click-right="toCheckMode()"
      :style="getBackGroundColor()"
      class="van-nav-bar"
      v-if="!navBarHide"
    >
      <van-icon slot="left" name="arrow-left" :style="getSlotColor()"/>
      <van-icon slot="right" name="setting" :style="getSlotColor()"/>
    </van-nav-bar>

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
            <span slot="right" @click="onRevoke(item.taskId)">{{ $t('common.button.revoke') }}</span>
        <list-result-page
          :result-type="resultType"
          :error-type="errorType"
          :result-message="resultMessage"
        />
      </van-list>
    </van-pull-refresh>
    <van-popup slot="fr-ext" v-model="popup" class="lc-fullscreen-popup">
      <div class="lc-fixed-top">
        <van-nav-bar
          :title="$t('common.button.revoke')"
          :left-text="$t('close')"
          left-arrow
          fixed
          @click-left="popup=false"
        />
        <van-cell-group>
          <van-field
            v-model="form.opinion"
            v-validate="{ required: true}"
            :error="errors.has('opinion')"
            :error-message="errors.first('opinion')"
            label="原因"
            type="textarea"
            placeholder="请输入意见"
            rows="4"
            autosize
            required
            name="opinion"
          />
        </van-cell-group>
        <lc-toolbar
          :actions="actions"
        />
      </div>
    </van-popup>
    <lc-toolbar
      v-show="checkMode"
      :actions="mainActions"
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
    </more-search>
  </div>
</template>
<script>
import CardList from '@/components/CardList'
import ListResultPage from '@/components/ListResultPage'
import LcToolbar from '@/components/LcToolbar'
import MoreSearch from '@/components/MoreSearch'
import type from '../components'

import { myRevoke } from '@/api/platform/bpmn/bpmnCust'
import { complete } from '@/api/platform/bpmn/action'

import { formatParams, loadFinished, getResultType } from '@/utils/params'
import random from '@/mixins/random'
import bpmnStatus from '@/mixins/bpmnStatus'
import i18n from '@/utils/i18n'
import { getCustomData } from '../custom'
import { getTitleHide} from "@/utils/auth";

export default {
  components: {
    type,
    CardList,
    ListResultPage,
    LcToolbar,
    MoreSearch
  },
  mixins: [random, bpmnStatus],
  data() {
    return {
      popupShow: false,
      stateActive: false,
      searchForms: {
        forms: [
          { prop: 'Q^wfInst.subject_^SL', label: '请求标题', fieldType: 'text' },
          { prop: 'Q^type_id_^SL', label: '流程分类', fieldType: 'slot', slotName: 'type' },
          { prop: 'Q^wfInst.proc_def_name_^SL', label: '流程名称', fieldType: 'text' },
          { prop: ['Q^ec.end_time_^DL', 'Q^ec.end_time_^DG'], label: '审批时间', fieldType: 'dateRange', options: { datefmt: 'yyyy-MM-dd' }}
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
      popup: false,
      form: {
        taskId: '',
        opinion: '',
        actionName: 'revoke'
      },
      checkMode: false,
      checkedIds: [],
      actions: [{
        'name': this.$t('common.button.save'),
        'buttonType': 'primary',
        'callback': this.onValidate
      }],
      mainActions: [{
        'name': this.$t('common.button.revoke'),
        'buttonType': 'danger',
        'callback': this.onRevoke
      }],
      navBarHide: false
    }
  },
  created() {
     const navBarHide = getTitleHide()
     if (navBarHide === 'true') {
         this.navBarHide = true
         this.style = "margin-top: -46px"
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
      myRevoke(formatParams(params, { 'page': this.page })).then(response => {
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
    resetForm() {
      this.type = ''
    },
    clickMoreSarch() {
      this.popupShow = true
      this.stateActive = false
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
        const index = this.checkedIds.indexOf(item.bpmInstPo.taskId)
        if (index > -1) {
          this.checkedIds.splice(index, 1)
        } else {
          this.checkedIds.push(item.bpmInstPo.taskId)
        }
      } else {
        this.$router.push({
          name: 'bpmnForm',
          query: {
            instanceId: item.bpmInstPo.id
          },
          params: {
            title: item.bpmInstPo.procDefName
          }})
      }
    },
    onRevoke(item) {
      if (item.name) {
        if (this.checkedIds.length === 0) {
          return this.$toast(this.$t('common.dialog.selectedRecords'))
        }
        if (this.checkedIds.length > 1) {
          return this.$toast(this.$t('common.dialog.multipleSelected'))
        }
        this.form.taskId = this.checkedIds[0]
      } else {
        this.form.taskId = item
      }
      this.popup = true
    },
    onSave() {
      complete(this.form).then(response => {
        this.$toast.success(`撤销成功！`)
        this.popup = false
        this.onRefreshPage()
      }).catch(e => {
        console.error(e)
      })
    },
    onValidate() {
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.onSave()
        } else {
          var name = document.getElementsByName(this.errors.items[0].field)
          if (name) {
            name[0].focus()
          }
          this.$toast('表单未正确填写！')
        }
      })
    },
    toCheckMode() {
      if (this.checkMode) {
        this.show = true
      }
      this.checkMode = !this.checkMode
    },
    getBackGroundColor() {
          if (window.config.THEME_COLOR && window.config.TEXT_COLOR) {
              return 'background:' + window.config.THEME_COLOR + '; color:' + window.config.TEXT_COLOR
          }
          return 'background: #288ef0; color: white'
      },
      getSlotColor() {
          if (window.config.ICON_COLOR) {
              return 'color:' + window.config.ICON_COLOR
          }
          return 'color:' + window.config.ICON_COLOR
      }
  }

}
</script>

<style lang="scss" >
  .my-revoke{
    .van-swipe-cell__right {
      color: #FFFFFF;
      font-size: 15px;
      width: 65px;
      height: 52px;
      display: inline-block;
      text-align: center;
      line-height: 50px;
      background-color: #F44;
    }
  }
</style>
<style lang="scss">
.doing{
  color: #4688f9;
}
.dont{
  color: #666;
}
</style>
