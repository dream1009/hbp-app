<template>
  <div>
    <van-cell
      :title="$t('components.langSelect.title')"
      :value="language"
      icon="language"
      is-link
      @click="show = true"
    />
    <van-actionsheet
      v-model="show"
      :actions="actions"
      :cancel-text="$t('cancel')"
      @cancel="handleCancel"/>
  </div>
</template>

<script>

export default {
  data() {
    return {
      show: false,
      actions: [{
        lang: 'zh-CN',
        name: '中文',
        callback: this.handleSetLanguage,
        disabled: this.$i18n.locale === 'zh-CN'
      },
      {
        lang: 'zh-HK',
        name: '繁体中文',
        callback: this.handleSetLanguage,
        disabled: this.$i18n.locale === 'zh-HK'
      },
      {
        lang: 'en-US',
        name: 'English',
        callback: this.handleSetLanguage,
        disabled: this.$i18n.locale === 'en-US'
      }]
    }
  },
  computed: {
    language() {
      return this.$t('language')
    }
  },
  methods: {
    handleCancel() {
    //  this.show = false
    },
    handleSetLanguage({ lang }) {
      this.$i18n.locale = lang
      this.$toast.success({
        message: this.$t('components.langSelect.switchLang')
      })
      this.show = false
      setTimeout(() => {
        this.$store.dispatch('setLanguage', lang)
       this.$utils.reload()
      }, 1000)
    }
  }
}
</script>

