<template>
  <div class="my-setting  lc-fixed-bottom">
    <van-nav-bar
      :title="generateTitle()"
      :left-text="$t('back')"
      left-arrow
      fixed
      @click-left="onBack"
    />

    <van-cell-group>
      <van-cell :title="$t('my.changePassword')" icon="lock-fill" is-link to="changePassword" />
      <lang-select />
    </van-cell-group>

    <div style="height:20px;background: #f8f8f8;" />

    <van-cell-group>
      <van-cell :title="$t('my.about')" icon="logo" is-link @click="about" />
    </van-cell-group>

    <div style="height:30px;background: #f8f8f8;" />

    <van-cell-group>
      <van-row type="flex" justify="center" class="lc-cell-wrapper">
        <van-col span="23">
          <van-button type="danger" block @click="logout">
            {{ $t('my.logout') }}
          </van-button>
        </van-col>
      </van-row>
    </van-cell-group>
  </div>
</template>
<script>
import LangSelect from '@/components/LangSelect'
import storage from '@/utils/storage'
import navbar from '@/mixins/navbar'

export default {
  components: {
    LangSelect
  },
  mixins: [navbar],
  data() {
    return {

    }
  },
  methods: {
    logout() {
      var lang = this.$i18n.locale
      this.$dialog.confirm({
        title: this.$t('common.dialog.title'),
        message: this.$t('my.logoutMessage')
      }).then(() => {
        this.$store.dispatch('logOut').then(() => {
          localStorage.clear()
          storage.set('language', lang)
          this.$utils.reload() // 为了重新实例化vue-router对象 避免bug
        })
      }).catch(() => {

      })
    },
    about() {
      this.$router.push({ path: '/my/aboutUs' })
    }
  }
}
</script>
