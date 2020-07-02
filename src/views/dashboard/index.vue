<template>
  <div class="dashboard lc-fixed-bottom">
    <van-nav-bar
      :title="generateTitle()"
      fixed
      :style="getBackGroundStyle()"
      @click-left="onClickLeft"
      v-if="!navBarHide">
      <van-icon v-if="getTerminal()" slot="left" name="arrow-left" :style="getSlotStyle()"/>
    </van-nav-bar>
    <!--幻灯片-->
    <!--<div class="dashboard-swipe">
      <van-swipe :autoplay="11000">
        <van-swipe-item
          v-for="(swipe, index) in swipes"
          :key="index"
        >
          <img v-lazy="swipe.image||blankImage">
        </van-swipe-item>
      </van-swipe>
    </div>-->
    <!--通知-->
    <div class="dashboard-notice">
      <van-swipe
        :autoplay="6000"
        :height="36"
        :show-indicators="false"
        :initial-swipe="initialNotice()"
        style="height:36px;"
        vertical
      >
        <van-swipe-item v-for="(notice, index) in noticeList" :key="index">
          <van-notice-bar :left-icon="noticeIcon" :text="notice.title" @click="onNotice(notice)" />
        </van-swipe-item>
      </van-swipe>
    </div>
    <!--栏目-->
    <div v-if="dashboards && dashboards.length >0">
      <div
        v-for="(dashboard,index) in dashboards"
        :key="dashboard[aliasKey]+index"
        class="van-hairline--bottom dashboard-menus"
      >
        <h2 class="menus-title">{{ getText(dashboard) }}</h2>
        <div class="menus-show-toggle" @click="handleMenusDisplay">
          <van-icon v-if="isDisplay" name="wap-nav" />
          <img v-if="!isDisplay" class="square-img" :src="squareUp" >
        </div>
        <!-- 列表展示 -->
        <van-list v-if="isDisplay" class="menus-icon">
          <b v-for="menu in dashboard[childrenKey]" :key="menu[aliasKey]">
            <div
              v-if="
                menu['displayInMenu'] === 'Y' ||
                  menu['displayInMenu'] === '1' ||
                  menu['displayInMenu'] === true
              "
              class="single-menus"
              @click="onClick(menu)"
            >
              <avatar
                :icon="menu.iconType === 'icon' ? menu.icon : ''"
                :bg-color="menu.iconType === 'image' ? '' : menu.iconBgColor"
                :color="menu.iconType === 'image' ? '' : menu.iconFontColor"
                :text="getText(menu)"
                :image="getImage(menu)"
                :info="getInfo(menu)"
                size="50"
                rounded
              />
              <span class="list-title">
                <h3>{{ getText(menu) }}</h3>
                <div class="title-deal">
                  马上处理
                  <van-icon name="doubleright" />
                </div>
              </span>
            </div>
          </b>
        </van-list>

        <!-- 九宫格展示 -->
        <van-row v-if="!isDisplay" class="menus-icon">
          <b v-for="menu in dashboard[childrenKey]" :key="menu[aliasKey]">
            <van-col
              v-if="menu['displayInMenu'] === 'Y' || menu['displayInMenu'] === '1' || menu['displayInMenu'] === true"
              span="6"
              @click.native="onClick(menu)"
            >
              <avatar
                :icon="menu.iconType === 'icon'?menu.icon:''"
                :bg-color="menu.iconType === 'image'?'':menu.iconBgColor"
                :color="menu.iconType === 'image'?'':menu.iconFontColor"
                :text="getText(menu)"
                :image="getImage(menu)"
                :info="getInfo(menu)"
                size="50"
                rounded
              />
              <span class="title van-ellipsis">{{ getText(menu) }}</span>
            </van-col>
          </b>
        </van-row>
      </div>
    </div>

    <div v-else>
      <lc-result-page v-if="emptyData" :type="resultType" :text="resultMessage" />
      <!--骨架屏-->
      <div v-for="i in 8" v-else :key="i" class="van-hairline--bottom dashboard-menus empty-data">
        <h2 class="menus-title">&nbsp;</h2>
        <van-row class="menus-icon">
          <van-col v-for="j in 8" :key="j" span="6">
            <div class="avatar avatar--rounded">&nbsp;</div>
            <span class="title">&nbsp;</span>
          </van-col>
        </van-row>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import { getMenus, getInfoCount } from '@/api/platform/resource'
import { noticeList } from '@/api/platform/notice/notice'
import { formatParams } from '@/utils/params'
import Avatar from '@/components/Avatar'
import LcResultPage from '@/components/ResultPage'
import navbar from '@/mixins/navbar'
import { Lazyload } from 'vant'
Vue.use(Lazyload)
import { transformToTreeFormat } from '@/utils/tree'
import i18n from '@/utils/i18n' // Internationalization 国际化
import noticeIcon from '@/assets/images/notice/notice.png'
import squareUp from '@/assets/images/square-up.png' // 九宫格图标
import { getTerminal, getTitleHide } from "@/utils/auth";
// 透明图片
const BLANK = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
export default {
  name: 'Dashboard',
  components: {
    Avatar,
    LcResultPage
  },
  mixins: [navbar],
  data() {
    return {
      idKey: 'id',
      aliasKey: 'alias',
      labelKey: 'name',
      parentIdKey: 'parentId',
      childrenKey: 'children',
      urlKey: 'defaultUrl',
      dashboards: [],
      thumb: {},
      emptyData: false,
      resultType: 'empty',
      resultMessage: '没有应用，请联系管理员',
      countInfo: {}, // 右上角图标
      swipes: [],
      blankImage: BLANK,
      noticeIcon: noticeIcon,
      noticeList: [],
      isDisplay: true, // 菜单展示方式，默认列表展示,
      squareUp: squareUp,
      navBarHide: false
    }
  },
  created() {
      const navBarHide = getTitleHide()
      if (navBarHide === 'true') {
          this.navBarHide = true
          $("#app").css("margin-top","-46px")
      }
      this.loadData()
  },
  methods: {
    onClickLeft() {
        this.$bridge.callHandler('backNativeApp', '', (callbackData) => {
        })
      },
    getTerminal() {
        return getTerminal()
    },
    handleMenusDisplay() {
      this.isDisplay = !this.isDisplay
    },
    svgName(name) {
      return `#${name}`
    },
    getImage(menu) {
      if (menu.iconType === 'image') {
        return menu.icon
      }
      return
    },
    getText(menu) {
      return i18n.generateTitle(menu[this.aliasKey], menu[this.labelKey])
    },
    loadData() {
      this.loadMenus()
      this.loadCountInfo()
      // this.loadNotice()
    },
    loadMenus() {
      // this.swipes = [{}]
      getMenus().then(response => {
        const data = response.data
        const menus = []
        data.menus.forEach(item => {
          // 过滤掉外勤App菜单
          if (!(item.defaultUrl && item.defaultUrl.slice(0, 4) === 'app:')) {
            menus.push(item)
          }
        })
        this.dashboards = transformToTreeFormat(menus, {
          idKey: this.idKey,
          parentIdKey: this.parentIdKey,
          childrenKey: this.childrenKey
        })
        this.emptyData = !(data.length > 0)
      }).catch((e) => {
        this.emptyData = true
        this.resultType = 'error'
        this.resultMessage = e.message
      })
    },
    loadCountInfo() {
      getInfoCount().then(response => {
        this.countInfo = response.data
      }).catch((e) => {
      })
    },
    getInfo(menu) {
      const info = this.countInfo[menu[this.aliasKey]]
      if (this.$utils.isNotEmpty(info)) { return info > 99 ? '99+' : info }
    },
    loadNotice() {
      const params = formatParams({ status: 'publish' }, { page: 1, limit: 5 })
      noticeList(params).then(response => {
        this.noticeList = response.data.dataResult
      }).catch((e) => {
      })
    },
    initialNotice() {
      return Math.floor((Math.random() * this.noticeList.length))
    },
    onClick(menu) {
      const url = menu[this.urlKey]
      if (this.$utils.isNotEmpty(url)) {
        if (/^https:\/\/|http:\/\//.test(url)) {
          this.$utils.open(url)
        } else {
          this.$router.push({ path: url })
        }
      } else {
        // 判断是否有下级菜单如果有
        if (this.$utils.isNotEmpty(menu.children)) {
          this.$router.push({ path: '/next-menu' })
        } else {
          this.$toast('未配置菜单的url路径,请在后台配置！')
        }
      }
    },
    onNotice(item) {
      this.$router.push({
        name: 'noticeDetail',
        query: {
          id: item.id
        }
      })
    }
  }
}
</script>
<style lang="scss">
.dashboard {
  .dashboard-menus{
    margin: 0 15px;
  }
  .menus-title{
    margin: 0;
    font-weight: 600;
    font-size: 15px;
    padding: 10px 10px 10px 0;
  }
  .menus-icon {
    .van-col {
      text-align: center;
      float: none;
      display: inline-block;
      vertical-align: middle;
      padding-top: 10px;
      padding-bottom: 10px;
    }
    .title {
      display: block;
      font-size: 14px;
      padding-top: 10px;
    }
    // 列表样式
    .single-menus {
      margin: 20px;
    }
    .list-title {
      position: absolute;
      font-size: 14px;
      margin-left: 30px;
    }
    .title-deal {
      font-weight: normal;
      color: #878787;
      margin-top: 10px;
    }
  }
  .menus-show-toggle {
    position: absolute;
    top: 10px;
    left: 70px;
    .square-img {
      width: 20px;
    }
  }
  .dashboard-swipe {
    .van-swipe {
      cursor: pointer;
    }
    .van-swipe-item {
      color: #fff;
      font-size: 20px;
      text-align: center;
      line-height: 120px;
    }
    .van-swipe-item:nth-child(even) {
      background-color: #f7f7f7;
      background: -webkit-linear-gradient(#f7f7f7, #f0f7fb);
    }
    .van-swipe-item:nth-child(odd) {
      background-color: #f0f7fb;
      background: -webkit-linear-gradient(#f0f7fb, #f7f7f7);
    }
    .van-swipe img {
        width: 100%;
        height: 150px;
        display: block;
        box-sizing: border-box;
        pointer-events: none;
    }
  }
  .dashboard-notice {
    .van-swipe-item {
      text-align: center;
      line-height: 36px;
    }
    .van-swipe-item:nth-child(even) {
      background-color: #f7f7f7;
      background: -webkit-linear-gradient(#f7f7f7, #f0f7fb);
    }
    .van-swipe-item:nth-child(odd) {
      background-color: #f0f7fb;
      background: -webkit-linear-gradient(#f0f7fb, #f7f7f7);
    }
  }
  .empty-data{
    .menus-title {
      background-color: #f7f7f7;
      background: -webkit-linear-gradient(#f7f7f7, #f0f7fb);
      margin:10px;
      height: 25px;
      width: 70px;
       padding: 0px;
    }
    .avatar{
      width: 50px;
      height: 50px;
      background: #f9f9f9;
    }
    .title{
       margin:10px;
      background: #f9f9f9;
    }
  }

}
</style>
