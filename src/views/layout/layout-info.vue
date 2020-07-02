<template>
  <div style="height:100%;">
    <van-nav-bar
      :title="title"
      :left-text="$t('back')"
      left-arrow
      fixed
      @click-left="onClickLeft"
      @click-right="onClickRight"
      v-if="!navBarHide"
      :style="getBackGroundStyle()"
    >
      <van-icon slot="left" name="arrow-left" :style="getSlotStyle()"/>
      <van-icon slot="right" name="home" :style="getSlotStyle()"/>
    </van-nav-bar>
    <app-main :style="style"/>
  </div>
</template>
<script>
    import AppMain from './app-main'
    import i18n from '@/utils/i18n'
    import {getNeedBackApp, getHomePage, getTitleHide} from "../../utils/auth";
    import {getBackGroundStyle, getSlotStyle} from '@/mixins/navbar';

    export default {
        name: 'LayoutInfo',
        inject: ['reload'],
        components: {
            AppMain
        },
        data() {
            return {
                navBarHide: false,
                style: ""

            }
        },
        created() {
            const navBarHide = getTitleHide()
            if (navBarHide === 'true') {
                this.navBarHide = true
                this.style = "margin-top: -46px"
            }
        },
        computed: {
            title() {
                const title = this.generateTitle(this.$route.name, this.$route.params.title || this.$route.meta.title)
                i18n.setIbpsBrowserTitle(title)
                return title
            }
        },
        methods: {
            generateTitle(name, title) { // generateTitle by vue-i18n
                return i18n.generateTitle(name, title)
            },
            onClickLeft() {
                if (getNeedBackApp() === 'true' && (window.history.length <= 1 || getHomePage() === this.$route.path)) {
                    this.$bridge.callHandler('backNativeApp', '', (callbackData) => {
                    })
                } else {
                    this.$router.go(-1)
                }
            },
            onClickRight() {
                this.$router.push({path: '/dashboard'})
            },
            getBackGroundStyle() {
                return getBackGroundStyle()
            },
            getSlotStyle() {
                return getSlotStyle()
            }
        }
    }
</script>
