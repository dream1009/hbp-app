<template>
  <div class="lc-fixed-bottom">
    <van-nav-bar
      :title="generateTitle()"
      fixed
    >
      <div slot="left" @click="onBack">
        <van-icon class="van-nav-bar__arrow" name="arrow" />
        <span class="van-nav-bar__text" v-text="$t('back')" />
      </div>
    </van-nav-bar>
    <van-cell-group>
      <van-cell>
        <div slot="title" class="userInfo_img">
          头像
        </div>
        <avatar
          slot="right-icon"
          :image="getPhotoImage()"
          :default-image="defaultImage"
          size="50"
          circle
        />
      </van-cell>
      <van-cell :value="name" title="姓名" />
      <van-cell :value="gender|sexFilter" title="性别" />
      <van-cell :value="account" title="登录账号" />
      <van-cell :value="wcAccount" title="微信账号" />
      <van-cell :value="org" title="部门" />
      <van-cell :value="position" title="岗位" />
    </van-cell-group>
  </div>
</template>

<script>
import { getUserDetail } from '@/api/platform/org/employee'
import defaultImage from '@/assets/images/logo/lc.png'
import Avatar from '@/components/Avatar'
import storage from '@/utils/storage'
import navbar from '@/mixins/navbar'
export default {
  components: {
    Avatar
  },
  filters: {
    sexFilter(sex) {
      if (sex === 'male') {
        return '男'
      } else if (sex === 'female') {
        return '女'
      } else {
        return '未设置'
      }
    }
  },
  mixins: [navbar],
  data() {
    return {
      name: '',
      gender: '',
      account: '',
      wcAccount: '',
      org: '',
      position: '',
      defaultImage: defaultImage
    }
  },
  created() {
    // 获取用户信息
    getUserDetail().then(response => {
      const data = response.data
      // 设置用户信息
      this.name = data.partyEmployee.name
      this.gender = data.partyEmployee.gender
      this.account = data.partyEmployee.account
      this.wcAccount = data.partyEmployee.wcAccount
      this.org = data.partyEmployee.orgName
      const positions = data.partyPosition
      let pos = ''
      for (var i = 0; i < positions.length; i++) {
        if (pos.length > 0) pos += ','
        pos += positions[i].name
      }
      this.position = pos
    }).catch(e => {
      console.error(e)
    })
  },
  methods: {
    getPhotoImage() {
      const photo = storage.get('avatarImgPath')
      if (this.$utils.isNotEmpty(photo)) {
        return photo
      } else {
        return
      }
    }
  }

}
</script>

<style lang="scss">
.userInfo_img {
    padding-top: 15px;
}
</style>
