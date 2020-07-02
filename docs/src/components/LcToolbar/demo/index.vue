<template>
  <demo-section class="lc-demo-toolbar">
    <demo-block :title="$t('basicUsage')">
      <lc-toolbar :actions="actions" />
    </demo-block>

    <demo-block :title="$t('title2')">
      <lc-toolbar :more-actions="moreActions" :more-cancel-text="cancelText" />
    </demo-block>
    <demo-block :title="$t('title3')">
      <lc-toolbar :more-actions="moreActions" :more-cancel-text="cancelText" :menu-button-text="'附加菜单'" />
    </demo-block>
  </demo-section>
</template>

<script>
import LcToolbar from '../../../../../src/components/LcToolbar'
export default {
  i18n: {
    'zh-CN': {
      title2: '更多用法',
      title3: '修改菜单按钮标题'
    }
  },
  components: {
    LcToolbar
  },
  data() {
    return {
      hiddenCancel: false,
      showCancel: false,
      actions: [
        {
          'name': '同意',
          'buttonType': 'primary',
          'callback': this.onClick
        }, {
          'name': '反对',
          'buttonType': 'danger',
          'callback': this.onClick
        }
      ],
      moreActions: [
        {
          'name': '挂起',
          'buttonType': 'primary',
          'callback': this.onClick
        }, {
          'name': '恢复',
          'buttonType': 'primary',
          'callback': this.onClick
        }
      ],
      cancelText: '关闭'
    }
  },
  methods: {
    onClick(item) {
      console.log('click')
    }
  }
}
</script>

<style lang="postcss">
.lc-toolbar-group {
  overflow: hidden;
  li{
    margin-left:15px;
    float:left;
  }
}
.sheetBtn{
    margin-left:15px;
  }
</style>
