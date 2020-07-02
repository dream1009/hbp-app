<template>
  <div>
    <!-- <div class="lc-fixed-navbar"> -->
    <!-- head -->
    <van-nav-bar
      :title="generateTitle()"
      fixed
    />
    <!-- saerch -->
    <form action="/">
      <van-search
        v-model="search"
        :placeholder="searchPlaceholder"
        @search="onSearchAction"
      >
        <!-- <van-icon slot="action" name="filter-fill" style="padding:0 10px;" @click="onSearchAction"/> -->
      </van-search>
    </form>
    <!-- data list -->
    <van-cell-group>
      <van-cell class="root-title">
        <div slot="title">
          <template v-for="(data,index) in pathData">
            <span
              :key="'pathData'+index"
              :class="{'is-link':pathData.length-1!==index}"
              @click="changePath(index)"
            >{{ data[labelKey] }}</span>
            <span v-if="pathData.length-1!==index" :key="index">/</span>
          </template>
        </div>
      </van-cell>

      <van-cell
        v-for="(data,index) in orgList"
        :key="'orgList'+index"
        clickable
        class="root-content"
        @click="toggleChild(data,index)"
      >
        <div slot="title">
          {{ data[labelKey] }}
        </div>
        <span
          v-if="data.hasChild"
          slot="right-icon"
        >
          <span class="van-cell__right-icon">下级</span>
          <van-icon name="arrow " class="van-cell__right-icon" />
        </span>
      </van-cell>
    </van-cell-group>

    <van-list v-model="loading" :finished="finished" @load="onLoad">
      <card-list
        v-for="(item,index) in dataList"
        :key="'dataList'+index"
        :title="item[labelKey]"
        :desc="item['orgName']"
        :image="getPhoto(item['photo'])"
        bg-color="#38f"
        circle
        @click="onClick(item)"
      />
    </van-list>
    <!-- </div> -->

    <!--点击明细 -->
    <van-popup v-model="showPopup" class="lc-fullscreen-popup" position="right">
      <van-nav-bar
        :title="employee.name"
        :left-text="$t('close')"
        @click-left="showPopup=false"
      />
      <van-cell-group>
        <div class="lc-cell-wrapper">
          <lc-card
            :image="photo"
            :text="employee.name "
            :desc="getOrg(employee)"
            bg-color="#38f"
            rounded
            size="55"
          >
            <div slot="title" style="font-size:20px; margin-top: 15px;">
              {{ employee.name }}
            </div>
          </lc-card>
        </div>
        <van-cell :value="employee.name" title="姓名" clickable />
        <van-cell :value="employee.gender|sexFilter" title="性别" clickable />
        <van-cell :value="employee.mobile" title="电话" clickable />
        <van-cell :value="employee.email" title="邮箱" clickable />
        <van-cell :value="employee.wcAccount" title="微信" clickable />
        <van-cell :value="employee.orgName" title="部门" clickable />
        <van-cell :value="employee.position" title="岗位" clickable />
      </van-cell-group>
    </van-popup>

    <div style="height:50px" />
  </div>
</template>
<script>
import { queryByOrgIdOrName } from '@/api/platform/org/employee'
import { getPositionByUserId } from '@/api/platform/org/position'
import { queryByParentIdOrName } from '@/api/platform/org/org'
import { formatParams, loadFinished, getResultType } from '@/utils/params'
import LcCard from '@/components/LcCard'
import CardList from '@/components/CardList'
import navbar from '@/mixins/navbar'
import i18n from '@/lang' // Internationalization 国际化
export default {
  components: {
    LcCard,
    CardList
  },
  mixins: [navbar],
  props: {
    valueKey: {
      type: String,
      default: 'id'
    },
    labelKey: {
      type: String,
      default: 'name'
    },
    idKey: {
      type: String,
      default: 'id'
    },
    childrenKey: {
      type: String,
      default: 'children'
    }
  },
  data() {
    return {
      searchPlaceholder: i18n.t('common.input'),
      showPopup: false,
      search: '',
      pathData: [],
      orgList: [],
      dataList: [],
      employee: {},

      loadTemp: true,
      parentId: '',
      page: 1,
      loading: false,
      finished: false,
      isLoading: true,
      resultType: 'init',
      errorType: null,
      resultMessage: null
    }
  },
  computed: {
    photo() {
      return this.getPhoto(this.employee.photo)
    }
  },
  mounted() {
    this.loadData({
      id: '',
      name: '组织架构'
    }, true)
  },
  methods: {
    onLoad() {
      const params = {}
      if (this.search) {
        params['name'] = this.search
      }
      params['orgId'] = this.parentId

      this.loadUserData(params)
    },
    loadData(data, isInit) {
      if (isInit) {
        this.pathData = []
      }
      const parentId = data[this.idKey] || '0'

      // 加载
      queryByParentIdOrName(formatParams(
        { parentId: parentId }
      )).then(res => {
        this.orgList = res.data.dataResult

        data[this.childrenKey] = this.orgList
        this.pathData.push(data)
        if (isInit) return
        this.onLoad()
      }).catch((e) => {
        console.error(e)
      })
    },
    // 加载用户数据
    loadUserData(params) {
      if (this.loadTemp) {
        this.loadTemp = false
        queryByOrgIdOrName(formatParams(params, { 'page': this.page })).then(response => {
          const dataList = response.data.dataResult

          if (this.$utils.isNotEmpty(dataList)) {
            this.page++
            this.dataList = this.dataList.concat(dataList)
            this.finished = false
          }
          this.finished = !!loadFinished(response.data.pageResult)
          this.loading = false

          this.isLoading = false
          // 结果类型
          this.resultType = getResultType(this.dataList, this.finished)
          this.loadTemp = true
        }).catch((e) => {
          this.loading = false
          this.isLoading = false
          this.finished = true
          this.resultType = 'error'
          this.resultMessage = e.message
          this.loadTemp = true
          console.error(e)
        })
      }
    },
    toggleChild(data) {
      this.parentId = data[this.idKey]
      this.initPageData()
      this.loadData(data)
    },
    changePath(index) {
      const parentOrg = this.pathData[index]
      this.parentId = parentOrg[this.idKey]
      this.orgList = parentOrg[this.childrenKey]
      this.pathData.splice(index + 1, this.pathData.length - 1)
      this.page = 1
      this.dataList = []
      this.loadUserData({
        orgId: parentOrg[this.idKey]
      })
    },
    // 查询
    onSearchAction() {
      this.initPageData()
      this.loadUserData({ 'name': this.search })
    },
    getPhoto(photo) {
      if (this.$utils.isNotEmpty(photo)) {
        return photo.split('=')[1]
      } else {
        return
      }
    },
    getOrg(item) {
      if (item.orgName) {
        const nameArr = item.orgName.split('.')
        return nameArr.join(' ')
      }
      return ''
    },
    onClick(item) {
      this.employee = item
      getPositionByUserId({ userId: item.id }).then(response => {
        if (response.data) {
          const positions = response.data
          let position = ''
          for (let index = 0; index < positions.length; index++) {
            const element = positions[index]
            if (position.length > 0) {
              position += ','
            }
            position += element.name
          }
          this.employee.position = position
          this.showPopup = true
        }
      }).catch((e) => {
        this.showPopup = true
      })
    },
    initPageData() {
      this.page = 1
      this.finished = false
      this.dataList = []
      this.orgList = []
    }
  }
}
</script>
