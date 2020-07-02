<template>
  <div class="lc-fixed-toolbar">
    <lc-toolbar
      :actions="actions"
      :more-actions="moreActions"
      @more-click="clickHandler"
    />

    <van-list
      v-model="loading"
      :finished="finished"
      @load="onLoad"
    >
      <van-cell v-for="item in list" :key="item" :title="item + ''" />
    </van-list>
  </div>
</template>

<script>
import LcToolbar from '@/components/LcToolbar'
export default {
  inject: ['reload'],
  name: 'DemoToolbar',
  components: {
    LcToolbar
  },
  data() {
    return {
      actions: [
        {
          name: '完成订单',
          callback: this.onClick
        },
        {
          name: '打车来接',
          checked: false,
          type: 'checkbox'
        },
        {
          name: '一口价<span class="orange">10元</span>',
          callback: this.onClick
        }
      ],
      moreActions: [
        {
          name: '操作a',
          callback: this.onClick
        },
        {
          name: '操作b',
          callback: this.onClick
        },
        {
          name: '操作c',
          icon: 'question',
          callback: this.onClick
        },
        {
          name: '操作d',
          callback: this.onClick
        },
        {
          name: '操作e',
          icon: 'question',
          callback: this.onClick
        },

        {
          name: '操作f',
          callback: this.onClick
        },
        {
          name: '操作g',
          icon: 'question',
          callback: this.onClick
        },
        {
          name: '操作h',
          callback: this.onClick
        },
        {
          name: '操作i',
          icon: 'question',
          callback: this.onClick
        },
        {
          name: '操作e',
          icon: 'question',
          callback: this.onClick
        },

        {
          name: '操作f',
          callback: this.onClick
        },
        {
          name: '操作g',
          icon: 'question',
          callback: this.onClick
        },
        {
          name: '操作h',
          callback: this.onClick
        },
        {
          name: '操作i',
          icon: 'question',
          callback: this.onClick
        }
      ],
      list: [],
      loading: false,
      finished: false
    }
  },
  methods: {
    onClick(action) {
      this.$toast(action.name)
    },
    clickHandler(v) {
      v = false
    },
    onLoad() {
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          this.list.push(this.list.length + 1)
        }
        this.loading = false

        if (this.list.length >= 40) {
          this.finished = true
        }
      }, 500)
    }
  }
}
</script>
<style>
  .orange{
    color: #fc9153;
  }

</style>

