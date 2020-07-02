<template>
  <van-popup v-model="display" position="bottom" :overlay="true" class="ibps-popups" @click-overlay="onCancel">
    <div class="van-picker__toolbar van-hairline--top-bottom">
      <slot>
        <div class="van-picker__cancel" @click="onCancel">{{ $t('cancel') }}</div>
        <div class="van-picker__confirm" @click="onConfirm">{{ $t('confirm') }}</div>
      </slot>
    </div>
    <van-radio-group v-model="commonLanguage" @change="onChange">
      <van-cell-group>
        <van-cell v-for="(item, index) in options" :key="item['name']+index" :name="item.name">
          <van-radio :name="item.name">{{ item.name }}</van-radio>
        </van-cell>
      </van-cell-group>
    </van-radio-group>
  </van-popup>
</template>
<script>
// import { XXX } from '@/api/platform/XXX/xxx'
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      commonLanguage: '',
      display: this.show,
      params: '',
      options: [
        {
          name: 'ces1'
        },
        {
          name: '我是同意得2'
        },
        {
          name: '测试反对@@@3'
        },
        {
          name: '我是同意得43'
        },
        {
          name: '测试反对@@@45'
        },
        {
          name: '我是同意得56'
        },
        {
          name: '测试反对@@@fgh'
        },
        {
          name: '我是同意得fghfghgf'
        },
        {
          name: '测试反对@@@fhfghh'
        },
        {
          name: '测试反对@@@jghjkhjkhjh45654dsfffffffffffffffffffffffffffffffffffffffffffffffffffff34534fhfghdfhfhdsytsfcghdfghidhgkdshgkjdhkdfhgkjdhgkjsdhgkjdshgkjdsfhgkjdf6术三个部分规划'
        },
        {
          name: '测试反对@@@jhjhjh'
        },
        {
          name: '测试反对@@@jh345345h'
        },
        {
          name: '测试反对@@@j456547jgjh'
        },
        {
          name: '测试反对@@@hjkhj5jh'
        },
        {
          name: '测试反对@@@jfhf3334545'
        },
        {
          name: '测试反对@@@548096jgh'
        },
        {
          name: '测试反jhjhjh对@@@'
        },
        {
          name: '测试对@@@jhj反hjh'
        }
      ]
      // TODO options获取后台 目前写死。
    }
  },
  watch: {
    show() {
      this.display = this.show
      // this.loadComLanguage()
    },
    value: {
      handler: function(val, oldVal) {
        if (val === false) {
          this.commonLanguage = ''
        }
      },
      immediate: true
    }
  },
  methods: {
    // loadComLanguage(){
    //   // TODO
    //   XXX({'a':b}).then(response=>{
    //     this.options = response.data['opinion']
    //   }).catch(error => {
    //     console.error(error)
    //   })
    // },
    onCancel() {
      this.$emit('close', false)
    },
    onConfirm() {
      this.onCancel()
      this.$emit('confirm', this.params)
    },
    onChange(value) {
      this.params = value
    }
  }
}
</script>
<style lang="scss">
.ibps-popups{
  .van-radio__label{
    max-width: 90%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>

