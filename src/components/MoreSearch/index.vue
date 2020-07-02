<template>
  <van-popup v-model="popupShow" position="right" :overlay="false" class="more-search-popup">
    <div class="title">
      <label>{{ title }}</label>
    </div>
    <van-cell-group>
      <search-field
        ref="searchForm"
        :forms="searchForms.forms"
        :input-align="searchForms.inputAlign||'right'"
      >
        <div v-for="(form,i) in slotForms()" :key="i" :slot="form.slotName">
          <slot :name="form.slotName" :item="form" />
        </div>
      </search-field>
    </van-cell-group>
    <!-- 操作按钮-->
    <slot name="fr-toolbar">
      <lc-toolbar v-if="actions && actions.length >0" ref="frToolbar" :actions="actions" />
    </slot>
  </van-popup>
</template>
<script>
import LcToolbar from '@/components/LcToolbar'// 工具栏
import searchField from './search-field'

export default {
  name: 'LcMoreSearch',
  components: {
    searchField,
    LcToolbar
  },
  props: {
    show: Boolean,
    searchForms: {
      type: Object,
      default: () => { }
    },
    title: {
      type: String,
      default: '高级搜索'
    }
  },
  data() {
    return {
      popupShow: this.show,
      actions: [
        {
          name: '取消',
          buttonType: 'default',
          callback: this.cancel
        },
        {
          name: '重置',
          buttonType: 'warning',
          callback: this.reset
        },
        {
          name: '确定',
          buttonType: 'primary',
          callback: this.confirm
        }
      ]
      // slotNameForm: this.slotForms()
    }
  },
  watch: {
    show: {
      handler: function(val, oldVal) {
        this.popupShow = val
      },
      immediate: true
    }
  },
  methods: {
    slotForms() {
      const forms = this.searchForms ? this.searchForms.forms || [] : []
      return forms.filter((form) => {
        if (form.slotName) {
          return form
        }
      })
    },
    cancel() {
      this.close()
    },
    reset() {
      this.$refs['searchForm'].resetSearchForm()
      this.$emit('resetForm')
    },
    confirm() {
      this.close()
      const data = this.$refs['searchForm'].getData()
      this.$emit('callback', data)
    },
    close() {
      this.popupShow = false
      this.$emit('close', this.popupShow)
    }
  }
}
</script>
<style lang="scss">
.more-search-popup {
  width: 100%;
  height: 100%;
  .title {
    text-align: center;
    padding: 15px 0 15px 15px;
    font-size: 16px;
  }
  .checkers {
    .van-cell__title {
      line-height: 3;
    }
    .lc-checker .lc-checker-item {
      text-align: center;
    }
  }
}
</style>
