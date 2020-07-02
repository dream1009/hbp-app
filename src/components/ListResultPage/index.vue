<template>
  <div v-if="resultType">
    <div
      v-if="resultType==='init'"
      class="van-init-text"
    />
    <div
      v-else-if="resultType==='finished'"
      class="van-finished-text"
    >
      {{ finishedText }}
    </div>
    <lc-result-page
      v-else-if="resultType==='error'|| resultType==='empty'"
      :type="resultType"
      :text="resultMessage"
    />
    <div v-else />
  </div>
</template>

<script>
import LcResultPage from '@/components/ResultPage'
import i18n from '@/lang' // Internationalization 国际化

/**
 * 目前list 状态
  *1、 init 展示初始列表
   2、 finished 加载完成
   3、 empty  没有数据
   4、 error  异常
   5、 未加载完成的 null
 */
export default {
  name: 'ListResultPage',
  components: {
    LcResultPage
  },
  props: {
    finished: {
      type: Boolean
    },
    finishedText: {
      type: String,
      default: i18n.t('components.resultPage.finished')
    },
    resultType: {
      type: String
    },
    resultMessage: {
      type: String
    }
  },
  computed: {
    hasResultPage() {
      return this.resultType !== null
    }
  }
}
</script>
<style lang="scss">
.van-finished-text {
  display: table;
  white-space: nowrap;
  height: auto;
  overflow: hidden;
  line-height: 1;
  text-align: center;
  padding: 10px 0;
  font-size:13px;
  color: #999;
}
.van-finished-text:after,.van-finished-text:before {
  content: '';
  display: table-cell;
  position: relative;
  top: 50%;
  width: 50%;
 }
.van-finished-text:before {
  background-position: right 1em top 50%
}
.van-finished-text:after {
  background-position: left 1em top 50%
}
</style>

