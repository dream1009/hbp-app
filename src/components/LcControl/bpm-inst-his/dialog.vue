<template>
  <van-popup
    v-model="showPopup"
    class="lc-fullscreen-popup"
    position="bottom"
  >
    <van-nav-bar
      :left-text="leftText"
      title="流程实例历史"
      left-arrow
      @click-left="onCancel"
    >
      <span slot="right" class="van-nav-bar__text" @click="onConfirm">{{ rightShowText }}</span>
    </van-nav-bar>
    <div class="lc-fixed-navbar">
      <van-search
        v-model="subject"
        @search="onSearch"
      />
      <van-pull-refresh
        v-model="isLoading"
        @refresh="onRefresh"
      >
        <van-checkbox-group
          v-model="checkboxList"
        >
          <van-cell-group>
            <van-cell
              v-for="(item,index) in list"
              :key="item.id+index"
              clickable
              @click="toggleCheckbox(item,index)"
            >
              <van-checkbox
                slot="icon"
                ref="checkboxes"
                :name="item.id"
                style="margin-top: 15px;"
                @click.native.stop="(e)=>clickCheckbox(e,item,index)"
              />
              <card-list
                :title="item.procDefName"
                :desc="item.subject"
                :date="item.createTime|formatTime"
                :tag="_getStatus(item.status)"
                :tag-type="_getStatusType(item.status)"
                :avatar="false"
              />
            </van-cell>
          </van-cell-group>
        </van-checkbox-group>
        <list-result-page
          :result-type="resultType"
          :error-type="errorType"
          :result-message="resultMessage"
        />
      </van-pull-refresh>
    </div>
  </van-popup>
</template>
<script>
import { normalPassJson, normalPassJsonByScriptValue } from '@/api/platform/bpmn/bpmInstHis'
import { formatParams, loadFinished, getResultType } from '@/utils/params'
import i18n from '@/lang' // Internationalization 国际化
import CardList from '@/components/CardList'
import ListResultPage from '@/components/ListResultPage'
import bpmnStatus from '@/mixins/bpmnStatus'

export default {
  components: {
    CardList,
    ListResultPage
  },
  mixins: [bpmnStatus],
  props: {
    value: {
      type: Array,
      default: () => []
    },
    visible: {
      type: Boolean,
      default: false
    },
    params: {
      type: Object
    },
    leftText: {
      type: String,
      default: i18n.t('cancel')
    },
    rightText: {
      type: String,
      default: i18n.t('confirm')
    }
  },
  data() {
    return {
      showPopup: false,
      checkboxList: [], // 选中

      subject: '',
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
  computed: {
    rightShowText() {
      if (!this.checkboxList) return ''
      const length = this.checkboxList.length
      return length > 0 ? (this.rightText + `(${length})`) : ''
    }
  },
  watch: {
    visible() {
      if (this.visible) {
        this.showPopup = true
        this.getData()
      } else {
        this.showPopup = false
      }
    },
    value: {
      handler: function(val, oldVal) {
        if (val !== oldVal) {
          this.checkboxList = this.value.map((item) => {
            return item.id
          })
        }
      },
      immediate: true
    }
  },

  methods: {
    getData() {
      const params = formatParams(Object.assign({ 'Q^subject_^SL': this.subject }, this.params), { 'page': this.page })
      let method = normalPassJson
      if (this.$utils.isNotEmpty(this.params.script)) {
        method = normalPassJsonByScriptValue
      }
      method(params).then(response => {
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
    onRefresh() {
      this.resultType = 'init'
      this.isLoading = true
      this.page = 1
      this.list = []
      this.getData()
    },
    clickCheckbox(event, item, index) {
      let flag = true
      const target = event.target
      if (target && target.className.indexOf('van-checkbox__label') > -1) {
        flag = false
      } else if (target && target.parentNode.className.indexOf('van-checkbox__icon') > -1) {
        flag = false
      }
      if (flag) {
        this.toggle(item, index)
      }
    },
    toggleCheckbox(item, index) {
      this.$refs.checkboxes[index].toggle()
    },
    onRefreshPage() {
      this.onRefresh()
    },
    onCancel() {
      this.$emit('close', false)
    },
    onConfirm() {
      if (this.$utils.isEmpty(this.checkboxList)) {
        this.$toast('请选择流程实例！')
        return
      }

      this.$emit('confirm', this.getStoreValue(this.checkboxList))
      this.onCancel()
    },
    getStoreValue(data) {
      var result = []
      data.forEach(d => {
        const v = this.list.find((item) => {
          if (item.id === d) {
            return item
          }
        })
        if (v) {
          result.push({
            'id': v.id,
            'bizKey': v.bizKey,
            'procDefKey': v.procDefKey,
            'procDefName': v.procDefName,
            'subject': v.subject,
            'createBy': v.createBy,
            'creator': v.procDefName,
            'createTime': v.createTime,
            'endTime': v.endTime
          })
        } else {
          this.value.find((item) => {
            if (item.id === d) {
              result.push(item)
            }
          })
        }
      })
      return result
    }
  }
}
</script>

