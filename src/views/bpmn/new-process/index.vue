<template>
  <div class="new-process">

    <!--<van-tabs v-model="tabActive" sticky @click="onClickTab">-->
      <!--<van-tab title="收藏的流程">
        <van-pull-refresh v-model="isLoading" @refresh="onRefreshFavorites">
          <van-list
            v-model="loading"
            :finished="finished"
            @load="loadFavoritesData"
          >
            <van-swipe-cell
              v-for="(item,index) in favoritesList"
              :key="item.id+index"
              :right-width="65"
              class="remove-favorites"
            >
              <card-list
                :field0="item.name"
                :field1="item.desc"
                :field3="item.createTime|formatTime"
                :bg-color="_randomColor(index)"
                :icon="_randomIcon(index)"
                is-link
                @click="toStart(item)"
              />
              <span slot="right" @click="onFavorites(item.defId,true)">
                <van-icon name="star" />
                取消
              </span>
            </van-swipe-cell>
            <list-result-page
              :result-type="resultType"
              :error-type="errorType"
              :result-message="resultMessage"
            />
          </van-list>
        </van-pull-refresh>
    </van-tab>-->
    <!--发布的流程-->
    <!--<van-tab title="发布的流程">-->
    <van-search v-model="subject" show-action @search="onSearch">
      <div slot="action">
        <van-icon name="filter-fill" :class="stateActive?'doing':'dont'" @click="showMoreSearch" />
      </div>
    </van-search>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <van-list v-model="loading" :finished="finished" @load="onLoad">
        <!--<van-swipe-cell-->
        <van-cell
          v-for="(item,index) in list"
          :key="item.id+index"
          :right-width="65"
          :class="item.favorites?'favorites-y':'favorites-n'"
        >
          <card-list
            :field0="{data: item, key: 'name', field: {name: 'name', field_options: {}}}"
            :field1="{data: item, key: 'desc', field: {name: 'desc', field_options: {}}}"
            :tag="_getStatus(item.favorites)"
            :tag-type="_getStatusType(item.favorites)"
            :image="image"
            is-link
            @click="toStart(item)"
          />
          <!--<span slot="right" @click="onFavorites(item.defId,item.favorites)">
                <van-icon name="star" />
                {{ item.favorites?'取消':'收藏' }}
              </span>-->
            </van-cell>
            <!--</van-swipe-cell>-->
            <list-result-page
              :result-type="resultType"
              :error-type="errorType"
              :result-message="resultMessage"
            />
          </van-list>
        </van-pull-refresh>
      <!--</van-tab>-->
    <!--</van-tabs>-->

    <more-search
      :show="popupShow"
      :search-forms="searchForms"
      @callback="onMoreSearch"
      @close="callback => popupShow = callback"
      @resetForm="resetForm"
    >
      <div slot="type">
        <type v-model="typeId" label="流程分类" input-align="right" clearable />
      </div>
    </more-search>
  </div>
</template>
<script>
import CardList from '@/components/CardList'
import ListResultPage from '@/components/ListResultPage'
import { formatParams, loadFinished, getResultType } from '@/utils/params'
import { defList, saveFavorites, removeFavorites, getFavoriteList } from '@/api/platform/bpmn/bpmn'
import random from '@/mixins/random'
import bpmnStatus from '@/mixins/bpmnStatus'

import MoreSearch from '@/components/MoreSearch'
import type from '../components'

export default {
  name: 'DefineList',
  components: {
    type,
    CardList,
    MoreSearch,
    ListResultPage
  },
  mixins: [random, bpmnStatus],
  data() {
    return {
      image: '/static/images/icon/newProcess.png',
      tabActive: 0,
      subject: '',
      stateActive: false,
      popupShow: false,
      searchForms: {
        forms: [
          { prop: 'Q^name_^SL', label: '流程名称', fieldType: 'text' },
          { prop: 'Q^type_id_^SL', label: '流程分类', fieldType: 'slot', slotName: 'type' }
        ]
      },
      favoritesList: [],

      show: false,
      pageValue: 5,
      typeId: '',

      list: [],
      loading: false,
      finished: false,
      isLoading: true,
      page: 1,
      pageSize: 15,
      totalCount: 0,
      resultType: 'init',
      errorType: null,
      resultMessage: null,
      params: ''
    }
  },
  created() {
    // this.loadFavoritesList()
  },
  methods: {
    onClickTab(index) {
      this.isLoading = true
      this.page = 1
      if (index === 0) {
        this.loadFavoritesData()
      } else {
        this.onSearch()
      }
    },
    onRefreshFavorites() {
      this.resultType = 'init'
      this.isLoading = true
      this.page = 1
      this.favoritesList = []
      this.loadFavoritesList()
    },
    loadFavoritesData(params) {
      this.page = 1
      this.favoritesList = []
      this.loadFavoritesList(params)
    },
    loadFavoritesList() {
      const params = formatParams({}, { 'page': this.page })
      getFavoriteList(params).then(response => {
        const data = response.data
        if (this.$utils.isEmpty(data)) {
          this.loading = false
          this.isLoading = false
          this.finished = true
          // 结果类型
          this.resultType = 'empty'
        } else {
          if (this.$utils.isNotEmpty(data.dataResult)) {
            if (this.page !== data.pageResult.page) return
            this.page++
            this.favoritesList = this.favoritesList.concat(data.dataResult)
            this.finished = false
          }
          this.finished = !!loadFinished(data.pageResult)
          this.loading = false
          this.isLoading = false
          // 结果类型
          this.resultType = getResultType(this.favoritesList, this.finished)
        }
      }).catch((e) => {
        this.resultType = 'error'
        this.loading = false
        this.isLoading = false
        this.resultMessage = e.message
      })
    },
    onRefresh() {
      this.resultType = 'init'
      this.isLoading = true
      this.page = 1
      this.list = []
      this.loadData(this.params)
    },
    onSearch() {
      this.stateActive = false
      this.typeId = ''
      this.params = { 'Q^name_^SL': this.subject }
      this.loadData(this.params)
    },
    loadData(params) {
      this.page = 1
      this.list = []
      this.loadDefineList(params)
    },
    onLoad() {
      this.loadDefineList(this.params)
    },
    loadDefineList(params) {
      defList(formatParams(params, { 'page': this.page })).then(response => {
        const data = response.data
        if (this.$utils.isEmpty(data)) {
          this.loading = false
          this.isLoading = false
          this.finished = true
          // 结果类型
          this.resultType = 'empty'
        } else {
          if (this.$utils.isNotEmpty(data.dataResult)) {
            if (this.page !== data.pageResult.page) return
            this.page++
            this.list = this.list.concat(data.dataResult)
            this.finished = false
          }
          this.finished = !!loadFinished(data.pageResult)
          this.loading = false
          this.isLoading = false
          // 结果类型
          this.resultType = getResultType(this.list, this.finished)
        }
      }).catch((e) => {
        this.resultType = 'error'
        this.loading = false
        this.isLoading = false
        this.resultMessage = e.message
      })
    },
    onMoreSearch(data) {
      this.stateActive = true
      this.subject = ''
      if (this.$utils.isNotEmpty(this.typeId)) {
        data['Q^type_id_^SL'] = this.typeId
      }
      this.params = data
      this.loadData(data)
    },
    resetForm() {
      this.typeId = ''
    },
    showMoreSearch() {
      this.popupShow = true
      this.stateActive = false
    },
    onFavorites(defId, type) {
      if (type === true) {
        removeFavorites({ defId: defId }).then(response => {
          this.$toast.success('取消收藏成功！')
          this.onClickTab(this.tabActive)
        })
      } else {
        saveFavorites({ defId: defId }).then(response => {
          this.$toast.success('收藏成功！')
          this.onClickTab(this.tabActive)
        })
      }
    },
    // 启动流程
    toStart(item) {
      this.$router.push({
        name: 'bpmnForm',
        query: {
          defId: item.id
        },
        params: {
          title: item.name
        }
      })
    }
  }
}
</script>
<style lang="scss">

.new-process {
  .menus-icon {
    .van-col {
      text-align: center;
      float: none;
      display: inline-block;
      vertical-align: middle;
      padding-top: 10px;
      padding-bottom: 10px;
    }
    .title {
      display: block;
      font-size: 14px;
      padding-top: 10px;
    }
  }
    .van-swipe-cell__right {
      color: #FFFFFF;
      font-size: 15px;
      width: 65px;
      height: 52px;
      display: inline-block;
      text-align: center;
      line-height: 50px;
    }
    .remove-favorites,
    .favorites-y{
      .van-swipe-cell__right {
        background-color: #F44
      }
    }
    .favorites-n{
      .van-swipe-cell__right {
        background-color: rgb(51, 136, 255)
      }
    }
    .palette-button{
      position: fixed;
      right: 30px;
      bottom: 31px;
      z-index: 500;
    }
    .favorites-list{
      border-bottom:5px solid #eee;
    }
    .actionsheet-page{
      height: 140px;
      .van-dialog__content{
        padding: 20px;
        .van-slider__button{
          background: #38f;
        }
      }
    }
}
</style>
