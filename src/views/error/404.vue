<template>
  <div>
    <lc-result-page
      :buttons="buttons"
      type="lost"
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
          text: this.$t('backHome'),
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

