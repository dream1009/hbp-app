<template>
  <div style="height:100%;">
    <app-main ref="appMain" />
    <van-tabbar
      v-if="layout.isShowBar"
      v-model="layout.active"
      @change="tabbarChange"
    >
      <van-tabbar-item
        v-for="(tabbar,index) in tabbars"
        :key="tabbar.name"
        :icon="getIcon(tabbar,index)"
        :dot="getDot(tabbar.name)"
      >
        <img v-if="tabbar.thumb" :src="thumb" :alt="alt">
        <span>{{ tabbar.label }}</span>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<script>
import AppMain from './app-main'
import i18n from '@/utils/i18n'
// 是否开启IM
const openIM = false

const imTabbars = [
  {
    name: 'message',
    icon: 'message',
    label: i18n.generateTitle('message')
  },
  {
    name: 'notice',
    icon: 'notification',
    label: i18n.generateTitle('notice')
  },
  {
    name: 'dashboard',
    icon: 'appstore',
    label: i18n.generateTitle('dashboard'),
    class: 'tabbar-dashboard'
  },
  {
    name: 'contacts',
    icon: 'contacts',
    label: i18n.generateTitle('contacts')
  },
  {
    name: 'my',
    icon: 'user',
    label: i18n.generateTitle('my')
  }
]

const defaultTabbars = [/* {
  name: 'dashboard',
  icon: 'home',
  label: i18n.generateTitle('home'),
  class: 'tabbar-dashboard'
},
{
  name: 'notice',
  icon: 'notification',
  label: i18n.generateTitle('notice')
},
{
  name: 'contacts',
  icon: 'contacts',
  label: i18n.generateTitle('contacts')
},
{
  name: 'my',
  icon: 'user',
  label: i18n.generateTitle('my')
}*/
]

export default {
  name: 'Layout',
  components: {
    AppMain
  },
  data() {
    return {
      tabbars: openIM ? imTabbars : defaultTabbars
    }
  },
  computed: {
    layout() {
      var tabbar = this.tabbars.find(t => t.name === this.$route.name)
      if (this.$utils.isNotEmpty(tabbar)) {
        return {
          active: this.tabbars.findIndex(t => t.name === this.$route.name),
          isShowBar: this.$utils.isNotEmpty(tabbar.isShowBar) ? tabbar.isShowBar : true
        }
      } else {
        return {
          isShowBar: this.$utils.isNotEmpty(this.$route.meta.isShowBar) ? this.$route.meta.isShowBar : true
        }
      }
    }
  },
  methods: {
    generateTitle(name, title) { // generateTitle by vue-i18n
      return i18n.generateTitle(name, title)
    },
    onClickMore() {
      this.showMenu = true
    },
    tabbarChange() {
      const tabbar = this.tabbars[this.layout.active || 0]
      this.$router.push({ name: tabbar.name })
    },
    getIcon({ icon }, index) {
      if (this.layout.active === index) {
        return icon + '-fill'
      }
      return icon
    },
    getDot(name) { //
      return false
    }
  }
}
</script>
