<template>
  <van-nav-bar
    :title="generateTitle($route.name,$route.params.title||$route.meta.title)"
    :left-text="$t('back')"
    left-arrow
    fixed
    @click-left="onClickLeft"
    :style="getBackGroundStyle()"
  >
    <van-icon slot="left" name="arrow-left" :style="getSlotStyle()"/>
  </van-nav-bar>
</template>
<script>
import i18n from '@/utils/i18n'
import { getBackGroundStyle, getSlotStyle, getTextStyle} from '@/mixins/navbar'
export default {
  props: {
    leftPath: {
      type: String,
      default: '/dashboard'
    }
  },
  methods: {
    generateTitle(name, title) { // generateTitle by vue-i18n
      return i18n.generateTitle(name, title)
    },
    onClickLeft() {
      this.$router.push({ path: this.leftPath })
    },
      getBackGroundStyle() {
          return getBackGroundStyle()
      },
      getSlotStyle() {
          return getSlotStyle()
      },
      getTextStyle() {
          return getTextStyle()
      }
  }
}
</script>
