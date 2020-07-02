<template>
  <div class="help">
    <van-nav-bar
      :title="generateTitle()"
      :left-text="$t('back')"
      left-arrow
      fixed
      @click-left="onBack"
    />
    <van-collapse v-model="activeNames">
      <van-collapse-item title="1、首页" name="1">
        &nbsp; &nbsp;首页可以通过后台配置动态菜单，流程的相关操作。
      </van-collapse-item>
      <van-collapse-item title="2、公告" name="2">
        &nbsp; &nbsp;公告可以进行公告的增删改查操作。
      </van-collapse-item>
      <van-collapse-item title="3、通讯录" name="3">
        &nbsp; &nbsp;通讯录可以查询系统的用户信息资料。
      </van-collapse-item>
      <van-collapse-item title="4、我的" name="4">
        &nbsp; &nbsp;我的可以查看个人资料、修改密码、切换语言、退出登录等相关操作。
      </van-collapse-item>
    </van-collapse>
  </div>
</template>
<script>
import navbar from '@/mixins/navbar'

export default {
  mixins: [navbar],
  data() {
    return {
      activeNames: []
    }
  }
}
</script>

