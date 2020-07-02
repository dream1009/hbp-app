<template>
  <div class="messsage lc-fixed-bottom">
    <van-nav-bar
      :title="'消息'"
      fixed
    />
    <van-search
      placeholder="搜索"
      @click="onClickSearch"
    />
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <van-list v-model="loading" :finished="finished" @load="onLoad">
        <card-list
          v-for="(item,index) in list"
          :key="item.id+index"
          :title="item.title"
          :image="item.avatar"
          :desc="item.message"
          :date="item.time|formatTime"
          size="40"
          bg-color="#38f"
          rounded
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

    <!--搜索-->
    <van-popup v-model="showSearch" :overlay="false" class="lc-fullscreen-popup">
      <form action="/">
        <van-search
          ref="search"
          v-model="search"
          placeholder="搜索"
          show-action
          @search="onSearch"
          @cancel="onCancel"
        />
      </form>
      <div>搜索指定内容</div>
    </van-popup>
    <van-popup v-model="showMessage" :overlay="false" p class="lc-fullscreen-popup">
      聊天
    </van-popup>
  </div>
</template>
<script>
import CardList from '@/components/CardList'
import ListResultPage from '@/components/ListResultPage'

export default {
  components: {
    CardList,
    ListResultPage
  },
  data() {
    return {
      search: '',
      showSearch: false,
      list: [],
      page: 1,
      loading: false,
      finished: false,
      isLoading: true,
      resultType: 'init',
      errorType: null,
      resultMessage: null,

      showMessage: false
    }
  },

  methods: {
    getData() {
      setTimeout(() => {
        this.loading = false
        this.isLoading = false
        this.finished = true

        this.list = [
          {
            title: '晖哥',
            type: 'user', // friend、group等字符，robot:机器人，user：用户，如果是group，则创建的是群聊
            // avatar: 'xxx',
            message: '你在干嘛？',
            time: '2018-10-17 11:11:11'
          },
          {
            title: '系统消息',
            type: 'system', // friend、group等字符，robot:机器人，user：用户，system：系统消息，如果是group，则创建的是群聊
            avatar: 'sss',
            message: '您有一个事项待审批',
            time: '2018-10-15 11:11:11'
          }
        ]
      }, 1000)
    },
    onRefresh() {
      this.resultType = 'init'
      this.isLoading = true
      this.loading = true
      this.page = 1
      this.list = []
      this.getData()
    },

    onLoad() {
      this.getData()
    },
    onClick(item) {
      // 单聊
      this.$router.push({ path: '/message/chat', query: { id: item.id }})
      // 群聊

      // 系统消息
    },
    onClickSearch() {
      this.showSearch = true
      setTimeout(() => {
        this.$refs.search.$el.getElementsByTagName('input')[0].focus()
      }, 0)
    },
    onSearch() {

    },
    onCancel() {
      this.showSearch = false
    }
  }

}
</script>
