<template>
  <demo-section class="lc-demo-toolbar">
    <demo-block :title="$t('basicUsage')">
      <card-list
        class="demo-card-list"
        :title="item.procDefName"
        :desc="item.subject"
        :date="item.date"
        :tag="item.status"
        :tag-type="item.statusType"
        :icon="'approve'"
        :is-link="true"
        @click="onClick(item)"
      />
    </demo-block>
  </demo-section>
</template>
<script>
const iconAry = ['approve', 'sign', 'official-document', 'reimbursement', 'my-request']

const colorAry = ['#e7505a', '#3598dc', '#32c5d2', '#578ebe', '#1bbc9b', '#3280fc', '#145ccd', '#8666b8', '#38b03f', '#03b8cf']

export default {
  i18n: {
    'zh-CN': {
      title2: '更多用法',
      title3: '修改菜单按钮标题'
    }
  },
  data() {
    return {
      item: {
        procDefName: '请假流程',
        subject: '管理员发起请假流程',
        date: '2018-11-11',
        status: '运行中',
        statusType: 'primary'
      }
    }
  },
  methods: {
    onClick() {
      console.log('click')
    },
    _random(ary, i) {
      if (i >= 0) {
        return ary[parseInt(i % ary.length)]
      }
      return ary[ Math.floor((Math.random() * ary.length))]
    },
    _randomIcon(i) {
      return this._random(iconAry, i)
    },
    _randomColor(i) {
      return this._random(colorAry, i)
    }
  }
}
</script>
<style lang="postcss">
.demo-card-list{
  padding: 10px;
  box-sizing: border-box;
  line-height: 24px;
  position: relative;
  background-color: #fff;
  color: #333;
  font-size: 14px;
  overflow: hidden;
  .van-card-list__date {
    font-size: 14px;
  }
  .van-card-list__date, .van-card-list__tag {
      -webkit-box-flex: 1;
      -webkit-flex: 1;
      flex: 1;
      min-width: 80px;
      line-height: 20px;
      text-align: right;
  }
  .van-card-list, .van-card-list__row, .van-card-list__thumb {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
 }
  .van-card-list__desc {
    color: #666;
    font-size: 12px;
    min-width: 60px;
  }
  .van-card-list__tag {
    min-width: 60px;
    color: #666;
    font-size: 12px;
  }
}
</style>
