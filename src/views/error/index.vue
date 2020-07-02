<template>
  <div>
    <lc-result-page
      :text="$t('error.401')"
      :buttons="buttons"
      type="noRights"
    />
  </div>
</template>

<script>
import LcResultPage from '@/components/ResultPage'

export default {
  components: { LcResultPage },
  data() {
    return {
      buttons: [
        {
          text: '返回首页',
          click: this.onBack
        }]
    }
  },
  methods: {
    onBack() {
      this.$router.push({ path: '/dashboard' })
    },
    onLogin() {

    }
  }
}
</script>

