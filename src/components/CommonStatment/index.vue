<template>
  <van-popup
    v-model="showPopup"
    class="lc-fullscreen-popup"
    position="bottom"
  >
    <van-nav-bar
      :left-text="$t('cancel')"
      title="常用语"
      left-arrow
      @click-left="onCancel"
    >
      <span slot="right" class="van-nav-bar__text" @click="onConfirm">{{ $t('confirm') }}</span>
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
        <van-list v-model="loading" :finished="finished" @load="onLoad">
          <van-radio-group
            v-model="radio"
          >
            <van-cell-group>
              <van-cell
                v-for="(item,index) in list"
                :key="item.id+index"
                clickable
                @click="toggle(item,index)"
              >
                <van-radio :name="item.id">{{ item.value }}</van-radio>
              </van-cell>
            </van-cell-group>
          </van-radio-group>
        </van-list>
        <list-result-page
          :result-type="resultType"
          :error-type="errorType"
          :result-message="resultMessage"
        />
      </van-pull-refresh>
    </div>
  </van-popup>

  <!-- <van-popup v-model="popup" position="bottom" class="lc-fullscreen-popup">
    <div class="van-picker__toolbar van-hairline--top-bottom">
      <slot>
        <div class="van-picker__cancel" @click="closePopup">{{ $t('cancel') }}</div>
        <div class="van-picker__confirm" @click="onConfirm">{{ $t('confirm') }}</div>
      </slot>
    </div>
    <van-radio-group v-model="commonLanguage" @change="onChange">
      <van-cell-group>
        <van-cell
          v-for="(item, index) in commonStatmentList"
          :key="item['name']+index"
          :name="item.name"
        >
          <van-radio :name="item.name">{{ item.name }}</van-radio>
        </van-cell>
      </van-cell-group>
    </van-radio-group>
  </van-popup> -->
</template>
<script>
import { queryPageList } from '@/api/platform/bpmn/bpmCommonStatment'
import { formatParams, loadFinished, getResultType } from '@/utils/params'
import ListResultPage from '@/components/ListResultPage'

export default {
  components: {
    ListResultPage
  },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showPopup: false,
      radio: '',
      cacheData: {},

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
  watch: {
    value() {
      this.showPopup = this.value
      if (this.showPopup) {
        this.loadData()
      }
    }
  },
  methods: {
    loadData() {
      const params = formatParams({
        'Q^value_^SL': this.subject
      }, {
        'page': this.page })

      queryPageList(params).then(response => {
        const dataResult = response.data.dataResult
        if (this.$utils.isNotEmpty(dataResult)) {
          this.list = this.list.concat(dataResult)
          // 缓存数据
          dataResult.map((d) => {
            this.cacheData[d['id']] = d.value
          })
          this.page++
          this.finished = false
        }

        this.finished = !!loadFinished(response.data.pageResult)
        this.loading = false
        this.isLoading = false
        // 结果类型
        this.resultType = getResultType(this.list, this.finished)
      }).catch(error => {
        console.error(error)
      })
    },
    onSearch() {
      this.resultType = 'init'
      this.page = 1
      this.list = []
      this.loadData()
    },
    onLoad() {
      this.loadData()
    },
    onRefresh() {
      this.resultType = 'init'
      this.isLoading = true
      this.page = 1
      this.list = []
      this.loadData()
    },

    onCancel() {
      this.$emit('input', false)
    },
    onConfirm() {
      if (this.$utils.isEmpty(this.radio)) {
        this.$toast('请选择')
        return
      }
      this.onCancel()
      this.$emit('confirm', this.cacheData[this.radio])
    },
    toggle(data) {
      this.radio = data['id']
    }
  }
}
</script>
