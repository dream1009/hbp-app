<template>
  <div class="my  lc-fixed-bottom">
    <van-nav-bar
      :title="generateTitle()"
      fixed
    />

    <!-- <van-nav-bar
      v-if="layout.isShowNav"
      :title="generateTitle($route.name,$route.meta.title)"
      fixed
    >
      <div v-if="layout.isLeftBar"  slot="left" @click="onClickLeft">
        <van-icon class="van-nav-bar__arrow" name="arrow" />
        <span v-text="$t('back')" class="van-nav-bar__text" />
      </div>
      <van-icon v-if="layout.isRightBar" name="add" slot="right" @click="onClickRight"/>
    </van-nav-bar> -->

    <div class="lc-cell-wrapper">
      <lc-card
        :image="getPhotoImage()"
        :default-image="defaultImage"
        :title="$store.getters.fullname"
        :desc="$store.getters.position||$t('company')"
        circle
        is-link
        size="55"
        @click="userInfo()"
      >
        <div
          slot="title"
          style="font-size:20px; margin-top: 15px;"
        >
          {{ $store.getters.fullname }}
        </div>
      </lc-card>
    </div>
    <!-- <van-cell-group>
       <van-cell icon="lock-fill" :title="$t('my.changePassword')" is-link to="changePassword" />
      <van-cell :title="$t('my.setting')" icon="setting-fill" is-link to="setting" />
     <lang-select/>
    </van-cell-group> -->

    <van-cell-group>
      <van-cell :title="$t('my.changePassword')" icon="lock-fill" is-link to="changePassword" />
      <lang-select />
    </van-cell-group>

    <div class="divider" />

    <van-cell-group>
      <van-cell :title="$t('my.help')" icon="question-circle-fill" is-link @click="help" />
      <!--<van-cell :title="$t('my.about')" icon="logo" is-link @click="about" />-->
    </van-cell-group>

    <div class="divider" />

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
import defaultImage from '@/assets/images/logo/lc.png'
import LcCard from '@/components/LcCard'
import LangSelect from '@/components/LangSelect'
import storage from '@/utils/storage'
import navbar from '@/mixins/navbar'

export default {
  components: {
    LcCard,
    LangSelect
  },
  mixins: [navbar],
  data() {
    return {
      defaultImage: defaultImage
    }
  },
  methods: {
    getPhotoImage() {
      const photo = storage.get('avatarImgPath')
      if (this.$utils.isNotEmpty(photo)) {
        return photo
      } else {
        return
      }
    },
    userInfo() {
      this.$router.push({ name: 'userInfo' })
    },
    logout() {
      var lang = this.$i18n.locale
      this.$dialog.confirm({
        title: this.$t('common.dialog.title'),
        message: this.$t('my.logoutMessage')
      }).then(() => {
        this.$store.dispatch('logOut').then(() => {
          localStorage.clear()
          storage.set('language', lang)
          this.$utils.reload()// 为了重新实例化vue-router对象 避免bug
          this.$router.push({ path: '/login' })
        })
      }).catch(() => {

      })
    },
    about() {
      this.$router.push({ path: '/my/aboutUs' })
    },
    help() {
      this.$router.push({ path: '/my/help' })
    }
  }
}
</script>
<style lang="scss" scoped>
  .divider{
    height:20px;
    background: #f8f8f8;
  }
</style>

