<template lang="html">
  <div class="lc-notice-detail">
    <van-nav-bar
      :title="generateTitle()"
      :left-text="$t('back')"
      left-arrow
      fixed
      @click-left="onClickLeft"
    />
    <van-cell-group>
      <van-cell :value="detail.title" title="标题" />
      <van-cell :value="detail.publicItem|publicItemLabel" title="发布类型" />
      <van-lc-type
        v-model="detail.typeId"
        category-key="NOTICE_TYPE"
        label="类型"
        readonly
      />
      <van-cell :value="detail.userName" title="发布人" />
      <van-cell :value="detail.publicDate|formatDate('yyyy-MM-dd')" title="发布时间" />
      <van-cell :value="detail.loseDate|formatDate('yyyy-MM-dd')" title="截至时间" />
      <van-cell :value="detail.status=='publish'?'发布':'草稿'" title="状态" />
      <van-cell :value="detail.author" title="作者" />
      <van-cell :value="detail.key" title="关键字" />
      <van-lc-uploader
        v-model="detail.fileAttach"
        store="json"
        label="附件"
        multiple
        clearable
        readonly
      />
      <van-lc-editor
        v-model="detail.content"
        label="内容"
        readonly
      />
    </van-cell-group>
    <div style="height:50px" />
  </div>
</template>

<script>

import { getNotice } from '@/api/platform/notice/notice'
import navbar from '@/mixins/navbar'
import Vue from 'vue'
import LcControl from '@/components/LcControl'
Vue.use(LcControl)
export default {
  components: {},
  filters: {
    parseJson(json) {
      if (!json) {
        return ''
      }
      return JSON.parse(json)
    },
    publicItemLabel(item) {
      if (item === 'important') {
        return '重要公告'
      } else if (item === 'notices') {
        return '发布公告'
      }
    }
  },
  mixins: [navbar],
  data() {
    return {
      newId: this.$route.params.newId,
      detail: {}
    }
  },
  created() {
    this.onLoad()
  },
  methods: {
    onLoad() {
      getNotice({
        id: this.$route.query.id
      }).then(response => {
        this.detail = response.data
      }).catch(error => {
        console.error(error)
      })
    },
    onClickLeft() {
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="scss">
  .lc-notice-detail{
    .lc-field__control--left{
      text-align: right;
    }
  }
</style>
