<template>
  <div class="lc-result-page">
    <img :src="actualImgUrl" :class="!imgUrl && type">
    <div class="text">
      {{ actualText }}
    </div>
    <div v-if="subtext" class="subtext">
      {{ subtext }}
    </div>
    <div v-if="buttons.length" class="buttons">
      <van-button
        v-for="(button, index) of buttons"
        :key="index"
        :type="button.type||'default'"
        @click="button.click"
      >
        {{ button.text }}
      </van-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LcResultPage',

  props: {
    type: {
      type: String,
      default: 'empty'
    },
    imgUrl: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: ''
    },
    subtext: {
      type: String,
      default: ''
    },
    buttons: {
      type: Array,
      default() {
        return []
      }
    }
  },

  data() {
    const data = {
      actualImgUrl: this.imgUrl || `./static/images/result-page/${this.type}.png`,
      actualText: this.text ||
        {
          // 您要访问的页面已丢失
          lost: this.$t('components.resultPage.lost'),
          //  您没有权限去该页面
          noRights: this.$t('components.resultPage.noRights'),
          // 网络连接异常
          network: this.$t('components.resultPage.network'),
          // 暂无信息
          empty: this.$t('components.resultPage.empty')
        }[this.type]
    }
    return data
  }
}

</script>
