<template>
  <div class="about-us">
    <van-nav-bar
      :title="generateTitle()"
      :left-text="$t('back')"
      left-arrow
      fixed
      @click-left="onBack"
    />
    <div class="logo">
      <avatar
        icon="logo"
        color="#3598dc"
        rounded
        size="80"
      />
      <div class="title">
        HBP平台{{ version }}
      </div>
    </div>
    <!--<div class="content">
      &nbsp;&nbsp;&nbsp;&nbsp;广州流辰信息技术有限公司，是国内专注的Java快速开发平台提供商，其自主研发的IBPS快速开发平台，主要用流程主要面向大中型企业、政府机构及软件开发商提供Java软件基础平台及技术服务。
    </div>
    <div class="content">
      &nbsp;&nbsp;&nbsp;&nbsp;基于对中国BPM和快速开发平台市场的理解，以创新的技术、满意的服务、务实的产品为行业伙伴和用户提供领先的业务基础中间件软件和解决方案。同时，流辰还向合作伙伴和最终用户提供与软件产品相关的技术支持、培训、实施与定制开发服务。
    </div>-->
    <div class="qr">
      <vue-qr :logo-src="logoSrc" :size="200" :text="qrText" />
    </div>
    <div class="copyright">
      <a href="#" @click="goHome()">
        {{ $t('company') }}
      </a>©{{ $t('login.copyright') }}
    </div>
  </div>
</template>
<script>
import logoSrc from '@/assets/images/logo/lc.png'
import VueQr from 'vue-qr'

import Avatar from '@/components/Avatar'
import navbar from '@/mixins/navbar'
import settings from '@/settings'

export default {
  components: {
    VueQr,
    Avatar
  },
  mixins: [navbar],
  data() {
    return {
      showPopup: false,
      version: `V${settings.version}`,
      logoSrc: logoSrc,
      qrText: 'http://weixin.qq.com/r/EDifh1bEkQvurRLk920C'
    }
  },
  methods: {
    goHome() {
      window.location.href = 'http://www.ecitychina.com'
    },
    onChangeClick() {
      this.showPopup = true
    },
    onCancel() {
      this.showPopup = false
    }
  }

}
</script>
<style lang="scss" scoped>
  .logo{
    text-align: center;
    border-radius: 20px;
    padding: 15px 15px 0;
  }
  .title{
    padding: 5px;
    color: #666;
  }
  .changelog{
    padding: 5px;
    color: #38f;
  }
  .content{
    padding:10px;
    line-height: 2;
  }
  .qr{
    margin: 0 auto;
    vertical-align: middle;
    text-align: center;
  }
  .copyright{
    left: 15px;
    right: 15px;
    // display: table-cell;
    vertical-align: middle;
    text-align: center;
    bottom: 5px;
    font-weight: 400;
    font-size: 14px;
    color: #999;
  }
</style>
