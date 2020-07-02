<template>
  <div class="notice lc-fixed-bottom">
    <van-nav-bar
      :title="generateTitle()"
      fixed
    >
      <div
        slot="right"
        @click="onClickRight"
      >
        <span class="van-nav-bar__text">{{ $t('notice.createNotice') }}</span>
      </div>
    </van-nav-bar>

    <van-tabs v-show="tabDatas.length>1" v-model="tabActive" @click="onClickTab">
      <van-tab v-for="data in tabDatas" :key="data.name" :title="data.title" />
    </van-tabs>

    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <van-list v-model="loading" :finished="finished" @load="onLoad">
        <div v-for="(item,index) in list" :key="item.id">
          <van-swipe-cell :right-width="65">
            <van-cell
              :key="item.id+index"
              :title="item.title"
              :value="item.publicDate|formatDate('yyyy/MM/dd')"
              :label="item.userName"
              @click="onClick(item)"
            />
            <span slot="right" class="" @click="onDelete(item.id)">{{ $t('common.button.remove') }}</span>
          </van-swipe-cell>
        </div>
        <list-result-page
          :result-type="resultType"
          :error-type="errorType"
          :result-message="resultMessage"
        />
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import navbar from '@/mixins/navbar'
import { noticeList, removeNotice } from '@/api/platform/notice/notice'
import { formatParams, loadFinished, getResultType } from '@/utils/params'
import ListResultPage from '@/components/ListResultPage'

export default {
  components: {
    ListResultPage
  },
  mixins: [navbar],
  data() {
    return {
      tabActive: 0,
      tabDatas: [{
        name: 'notices',
        title: this.$t('notice.notices'),
        status: 'publish'
      }, {
        name: 'expired',
        title: this.$t('notice.expired'),
        status: 'expired'
      }, {
        name: 'drafts',
        title: this.$t('notice.drafts'),
        status: 'drafts'
      }],
      page: 1,
      status: 'publish',
      loading: false,
      finished: false,
      isLoading: false,
      list: [],
      resultType: 'init',
      errorType: null,
      resultMessage: null
    }
  },
  methods: {
    getData() {
      const params = formatParams({ 'status': this.status }, { 'page': this.page })
      noticeList(params).then(response => {
        const data = response.data
        if (this.$utils.isNotEmpty(data.dataResult)) {
          this.page++
          this.list = this.list.concat(data.dataResult)
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
    onClickTab(index) {
      this.page = 1
      this.list = []
      this.status = this.tabDatas[index].status
      this.resultType = 'init'
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
      this.$router.push({
        name: item.status === 'drafts' ? 'noticeEdit' : 'noticeDetail',
        query: {
          id: item.id
        }
      })
    },
    onClickRight() {
      this.$router.push({
        name: 'noticeAdd'
      })
    },
    onDelete(id) {
      this.$dialog.confirm({
        title: this.$t('common.dialog.warn'),
        message: '确认删除该公告？'
      }).then(() => {
        removeNotice({
          id: id
        }).then(response => {
          this.onClickTab(this.tabActive)
        })
      })
    }
  }

}
</script>

<style lang="scss">
  .notice {
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
