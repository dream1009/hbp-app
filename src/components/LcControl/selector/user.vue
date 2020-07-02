<template>
  <div v-if="showSelectorPopup">
    <van-popup v-model="showSelectorPopup" class="lc-fullscreen-popup" position="bottom" @click-overlay="clickOverlay">
      <!-- 头部 -->
      <van-nav-bar
        :left-text="leftText"
        left-arrow
        @click-left="onCancel"
        :style="getBackGroundStyle()"
      >
        <span slot="title" @click="onTitle()" :style="getTextStyle()">{{ title }}</span>
        <van-icon slot="left" name="arrow-left" :style="getSlotStyle()"/>
        <span slot="right" class="van-nav-bar__text"  @click="onConfirm" :style="getTextStyle()">{{ $t('confirm') }}</span>
      </van-nav-bar>
      <div class="lc-fixed-navbar">
        <!-- 搜索框 -->
        <form action="/">
          <van-search
            v-model="search"
            :placeholder="searchPlaceholder"
            @search="onSearchAction"
          />
        </form>

        <!-- 组织 -->
        <van-cell-group>
          <!-- <van-cell is-link>
                <div slot="title">
                    按成员名称选人
                </div>
          </van-cell> -->
          <!--<lc-drop-menu
            ref="dropMenu0"
            :data="rangeData"
            :default-value="defaultValue"
            @change="onTypeChange"
          />-->
          <van-cell class="root-title">
            <div slot="title">
              <template v-for="(data,index) in pathData">
                <span
                  :key="data[valueKey]"
                  :class="{'is-link':pathData.length-1!==index}"
                  @click="changePath(index)"
                >{{ data[labelKey] }}</span>
                <span v-if="pathData.length-1!==index" :key="index">/</span>
              </template>
            </div>
          </van-cell>
          <van-cell
            v-for="(data,index) in orgList"
            :key="data[idKey]+index"
            clickable
            class="root-content"
            @click="toggleChild(data,index)"
          >
            <div slot="title" @click="toggleChild(data,index)">
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

        <!-- 列表内容 start -->
        <!---多选-->
        <van-checkbox-group v-if="multiple" v-model="checkbox">
          <van-cell-group>
            <van-list v-model="loading" :finished="finished" :immediate-check="immediateCheck" @load="onLoad">
              <van-cell
                v-for="(data,index) in dataList"
                :key="data[valueKey]+index"
                clickable
                @click="toggle(data,index)"
              >
                <van-checkbox
                  slot="icon"
                  ref="checkboxes"
                  :name="data[valueKey]"
                  style=" margin-top: 15px;"
                  @click.native.stop="(e)=>clickCheckbox(e,data,index)"
                />
                <template slot="title">
                  <lc-card
                    :image="getPhoto(data['photo'])"
                    :text="data[labelKey]"
                    :title="data[labelKey]"
                    bg-color="#3598dc"
                    circle
                    size="40"
                  />
                </template>
              </van-cell>
            </van-list>
          </van-cell-group>
        </van-checkbox-group>

        <!---单选-->
        <van-radio-group v-else v-model="radio">
          <van-cell-group>
            <van-list v-model="loading" :finished="finished" :immediate-check="immediateCheck" @load="onLoad">
              <van-cell
                v-for="(data,index) in dataList"
                :key="data[valueKey]+index"
                clickable
                @click="toggle(data,index)"
              >
                <van-radio
                  slot="icon"
                  ref="radioes"
                  :name="data[valueKey]"
                  style=" margin-top: 15px;"
                />
                <template slot="title">
                  <lc-card
                    :image="getPhoto(data['photo'])"
                    :text="data[labelKey]"
                    :title="data[labelKey]"
                    bg-color="#3598dc"
                    circle
                    size="40"
                  />
                </template>
              </van-cell>
            </van-list>
          </van-cell-group>
        </van-radio-group>
        <!-- 列表内容 end -->
      </div>
    </van-popup>
    <!--点击明细 -->
    <van-popup v-model="showDetailPopup" class="lc-fullscreen-popup" position="right">
      <van-nav-bar
        :left-text="leftText"
        left-arrow
        @click-left="onDetailCancel"
      >
        <span slot="title">已选择的选项</span>
        <span slot="right" class="van-nav-bar__text" @click="onDetailConfirm">{{ $t('confirm') }}</span>
      </van-nav-bar>
      <div class="lc-fixed-navbar">
        <van-cell-group>
          <van-swipe-cell
            v-for="(data,index) in selectedData"
            :key="data[valueKey]+index"
            :right-width="65"
            class="lc-swipe-cell"
          >
            <van-cell
              clickable
            >
              <template slot="title">
                <lc-card
                  :image="getPhoto(data['photo'])"
                  :text="data[labelKey]"
                  :title="data[labelKey]"
                  bg-color="#3598dc"
                  circle
                  size="40"
                />
              </template>
            </van-cell>
            <span slot="right" @click="removeSelected(index)">{{ $t('delete') }}</span>
          </van-swipe-cell>
        </van-cell-group>
      </div>
    </van-popup>
  </div>
</template>
<script>
import DropMenu from '@/components/DropMenu'
import { getUserById } from '@/api/platform/org/employee'
import { queryByParentIdOrName } from '@/api/platform/org/org'
import { queryByParentId as queryByParentId4Post } from '@/api/platform/org/position'
import { queryBySubSysIdOrName } from '@/api/platform/org/role'
import { queryGroups, getGroupById } from '@/api/platform/org/group'
import { getTreeDataByScriptValue } from '@/api/platform/org/entity'
import { dialogUserJson4Org, dialogUserJson4Post, dialogUserJson4Role, dialogUserJson4Group } from '@/api/platform/org/user'
import { formatParams, loadFinished, getResultType } from '@/utils/params'
import LcCard from '@/components/LcCard'
import i18n from '@/lang' // Internationalization 国际化
import { typeOptions } from './constants'
import { getBackGroundStyle, getSlotStyle, getTextStyle} from '@/mixins/navbar'
export default {
  components: {
    LcCard,
    [DropMenu.name]: DropMenu
  },
  props: {
    showPopup: Boolean,
    multiple: Boolean,
    value: {
      type: [String, Array]
    },
    leftText: {
      type: String,
      default: i18n.t('cancel')
    },
    searchPlaceholder: {
      type: String,
      default: i18n.t('common.input')
    },
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
    parentIdKey: {
      type: String,
      default: 'parentId'
    },
    childrenKey: {
      type: String,
      default: 'children'
    },
    filter: [Object, Array]
  },
  data() {
    return {
      search: '',
      page: 1,
      loading: false,
      finished: false,
      isLoading: true,
      immediateCheck: false,
      resultType: 'init',
      errorType: null,
      resultMessage: null,
      pathData: [],
      radio: '',
      checkbox: [],
      orgList: [],
      dataList: [],
      cacheData: {},
      showSelectorPopup: false,
      showDetailPopup: false,

      typeOptions: typeOptions,
      currentFilterOption: {},
      defaultValue: ['org'],
      rangeData: [
        {
          text: '组织范围',
          options: [
            {
              text: '组织',
              name: 'org'
            }, {
              text: '岗位',
              name: 'position'
            }, {
              text: '角色',
              name: 'role'
            }, {
              text: '用户组',
              name: 'group'
            }
          ]
        // },
        // {
        //   text: '是否含子项',
        //   options: [
        //     {
        //       text: '是',
        //       name: 'true'
        //     }, {
        //       text: '否',
        //       name: 'false'
        //     }
        //   ]
        }
      ]
    }
  },
  computed: {
    title() {
      if (this.multiple) {
        const length = this.checkbox.length
        return length > 0 ? i18n.t('components.checkbox.title', { length: length }) : ''
      } else {
        return this.$utils.isNotEmpty(this.radio) ? this.cacheData[this.radio] ? this.cacheData[this.radio][this.labelKey] : '' : ''
      }
    },
    selectedData() {
      return this.checkbox.map((d) => {
        return this.cacheData[d] || {}
      })
    }
  },
  watch: {
    value() {
      this.initData(this.value)
    },
    showPopup() {
      this.showSelectorPopup = this.showPopup
      if (this.$utils.isEmpty(this.rangeData[0].options)) {
        return
      }
      if (this.showPopup) {
        this.search = ''
        this.initPageData()
        this.cacheData = []
        const data = this.rangeData[0].options[0].partyId ? {
          name: this.rangeData[0].options[0].partyName,
          [this.idKey]: this.rangeData[0].options[0].partyId
        } : { name: this.rangeData[0].options[0].text }
        this.loadData(data, true)
      } else {
        this.radio = ''
        this.checkbox = []
        // 取消后重新初始化维度
        this.defaultValue = [this.rangeData[0].options[0].name]
      }
    }
  },
  mounted() {
    this.getFilter()
  },
  methods: {
    onLoad() {
      const params = {}
      const pathData = this.pathData
      if (this.search) {
        params['name'] = this.search
      }
      if (pathData.length > 1 && pathData[pathData.length - 1]) {
        params['typeKey'] = pathData[pathData.length - 1].id || this.getOrgListIds(this.orgList)
      }

      this.loadUserData(params)
    },
    initData(data) {
      this.checkedValue = []
      if (this.$utils.isEmpty(data)) {
        return
      }
      data.forEach(v => {
        if (this.cacheData[v]) {
          this.checkedValue.push(v)
          this.$emit('init-data', this.getSelectedData(this.checkedValue))
        } else {
          this.getDataInfo(v)
        }
      })
      if (this.multiple) {
        this.checkbox = data
      } else {
        this.radio = data[0]
      }
    },
    getFilter() {
      if (this.filter && this.filter.length > 0) {
        const rangeData = []
        for (let index = 0, tmp; index < this.filter.length; index++) {
          const element = this.filter[index]
          if (this.$utils.isEmpty(element.userType)) {
            continue
          }
          tmp = {}
          tmp = this.$utils.newData({}, element)
          tmp.name = element.userType
          tmp.text = this.getTypeLabel(element.userType)
          if (index === 0) {
            this.defaultValue[0] = element.userType
            this.currentFilterOption = element
          }
          rangeData.push(tmp)
        }
        this.rangeData[0].options = rangeData
      }
    },
    /**
     * 获取数据信息
     */
    getDataInfo(id) {
      getUserById({ id: id }).then(response => {
        const data = response.data
          if (data && data['fullname']) {
              data[this.labelKey] = data['fullname']
              this.cacheData[data[this.idKey]] = data
              this.checkedValue.push(data[this.idKey])
              this.$emit('init-data', this.getSelectedData(this.checkedValue))
          }
      }).catch((e) => {
        console.error(e)
      })
    },
    loadData(data, isInit) {
      if (isInit) {
        this.pathData = []
      }

      const listItem = this.currentFilterOption

      if (listItem && listItem.descVal === 'script') {
        this.loadDataByScript()
        return
      }

      const type = this.defaultValue[0]
      if (type === 'org') {
        this.loadOrgData(
          { type: listItem.descVal, partyId: listItem.partyId, parentId: data[this.idKey] || '0', includeSub: listItem.includeSub },
          data,
          { orgId: data[this.idKey] || listItem.partyId, type: listItem.descVal, inclueChild: listItem.includeSub }
        )
      } else if (type === 'position') {
        this.loadPositionData(
          { type: listItem.descVal, partyId: listItem.partyId, parentId: data[this.idKey] || '0', includeSub: listItem.includeSub },
          data,
          { posId: data[this.idKey] || listItem.partyId, type: listItem.descVal, inclueChild: listItem.includeSub }
        )
      } else if (type === 'role') {
        this.loadRoleData(
          { type: listItem.descVal, partyId: listItem.partyId, sysId: data[this.idKey] || '0' },
          data,
          { roleId: data[this.idKey] || listItem.partyId, type: listItem.descVal, inclueChild: listItem.includeSub }
        )
      } else if (type === 'group') {
        if (isInit) {
          this.loadGroupData(
            null,
            data,
            { groupId: data[this.idKey] || listItem.partyId, type: listItem.descVal, inclueChild: listItem.includeSub }
          )
        } else {
          this.pathData.push(data)
          this.loadUserDataByGroup({ groupId: data[this.idKey] || listItem.partyId, type: listItem.descVal, inclueChild: listItem.includeSub })
        }
      }
    },
    // 加载用户数据
    loadUserData(params) {
      const option = this.currentFilterOption
      const type = this.defaultValue[0]
      params.partyId = option.partyId
      params.type = option.descVal || 1
      params.inclueChild = option.includeSub || true
      if (type === 'org') {
        params.orgId = params.typeKey || option.partyId || this.getOrgListIds(this.orgList)
        this.loadUserDataByOrg(params)
      } else if (type === 'position') {
        params.posId = params.typeKey || option.partyId || this.getOrgListIds(this.orgList)
        this.loadUserDataByPost(params)
      } else if (type === 'role') {
        params.roleId = params.typeKey || option.partyId || this.getOrgListIds(this.orgList)
        this.loadUserDataByRole(params)
      } else if (type === 'group') {
        params.groupId = params.typeKey || option.partyId || this.getOrgListIds(this.orgList)
        this.loadUserDataByGroup(params)
      }
    },
    getSelectedData(data) {
      return data.map((d) => {
        return this.cacheData[d]
      })
    },
    onCancel() {
      this.$emit('cancel')
    },
    onConfirm() {
      const data = this.multiple ? this.checkbox : [this.radio]
      this.$emit('confirm', this.getSelectedData(data))
    },
    clickOverlay() {
      this.$emit('click-overlay')
    },
    toggleChild(data) {
      this.initPageData()
      this.loadData(data, false)
    },
    getOrgListIds(orgList) {
      if (this.$utils.isEmpty(orgList)) {
        return undefined
      }
      let orgId = ''
      for (let index = 0, list = orgList; index < list.length; index++) {
        const element = list[index]
        orgId += element.id + ','
      }
      return orgId
    },
    changePath(index) {
      const parentOrg = this.pathData[index]
      this.orgList = parentOrg[this.childrenKey]
      this.pathData.splice(index + 1, this.pathData.length - 1)
      this.page = 1
      this.dataList = []

      const orgId = this.getOrgListIds(this.orgList)

      this.loadUserData({
        typeKey: parentOrg[this.idKey] || orgId
      })
    },
    // 查询
    onSearchAction() {
      this.initPageData()
      const params = { 'name': this.search }
      params.typeKey = this.getOrgListIds(this.pathData[this.pathData.length - 1][this.childrenKey]) || this.pathData[this.pathData.length - 1].id
      this.loadUserData(params)
    },
    onDetailCancel() {
      this.showDetailPopup = false
    },
    onDetailConfirm() {
      this.showDetailPopup = false
    },
    onTitle() {
      if (!this.multiple) { return }
      this.showDetailPopup = true
    },
    getPhoto(photo) {
      if (this.$utils.isNotEmpty(photo)) {
        return photo.split('=')[1]
      } else {
        return
      }
    },
    clickCheckbox(event, data, index) {
      let flag = true
      const target = event.target
      if (target && target.className.indexOf('van-checkbox__label') > -1) {
        flag = false
      } else if (target && target.parentNode.className.indexOf('van-checkbox__icon') > -1) {
        flag = false
      }
      if (flag) {
        this.toggle(data, index)
      }
    },
    toggle(data, index) {
      if (this.multiple) { // 多选
        this.toggleCheckbox(data, index)
      } else {
        this.toggleRadio(data, index)
      }
    },
    // 单选
    toggleRadio(data, index) {
      this.radio = data[this.valueKey]
    },
    toggleCheckbox(data, index) {
      this.$refs.checkboxes[index].toggle()
    },
    removeSelected(index) {
      this.checkbox.splice(index, 1)
    },
    initPageData() {
      this.page = 1
      this.dataList = []
      this.orgList = []
      // this.cacheData = []
    },
    getTypeLabel(key) {
      const typeOptions = this.typeOptions
      for (let index = 0; index < typeOptions.length; index++) {
        const element = typeOptions[index]
        if (this.$utils.isNotEmpty(key) && element.value === key) {
          return element.label
        }
      }
      return key
    },
    // 切换查询维度
    onTypeChange(barItem, listItem) {
      this.pathData = []
      this.dataList = []
      this.currentFilterOption = listItem

      if (listItem.descVal === 'script') {
        this.loadDataByScript()
        return
      }

      if (listItem.name === 'org') {
        this.loadOrgData(
          { type: listItem.descVal, partyId: listItem.partyId, parentId: '0', includeSub: listItem.includeSub },
          { name: '组织' },
          { orgId: listItem.partyId, type: listItem.descVal, inclueChild: listItem.includeSub }
        )
      } else if (listItem.name === 'position') {
        this.loadPositionData(
          { type: listItem.descVal, partyId: listItem.partyId, parentId: '0', includeSub: listItem.includeSub },
          { name: '岗位' },
          { posId: listItem.partyId, type: listItem.descVal, inclueChild: listItem.includeSub }
        )
      } else if (listItem.name === 'role') {
        this.loadRoleData(
          { type: listItem.descVal, partyId: listItem.partyId, sysId: '0' },
          { name: '角色' },
          { roleId: listItem.partyId, type: listItem.descVal, inclueChild: listItem.includeSub }
        )
      } else if (listItem.name === 'group') {
        this.loadGroupData(
          { type: listItem.descVal, partyId: listItem.partyId, parentId: '0' },
          { name: '用户组' },
          { groupId: listItem.partyId, type: listItem.descVal, inclueChild: listItem.includeSub }
        )
      }
    },
    // 加载组织信息
    loadOrgData(params, data, params4user) {
      queryByParentIdOrName(formatParams(params, { limit: 999 })).then(res => {
        this.orgList = res.data.dataResult
        data[this.childrenKey] = this.orgList
        this.pathData.push(data)
        if (this.$utils.isEmpty(data[this.idKey])) {
          params4user.orgId = this.getOrgListIds(this.orgList)
        }
        this.loadUserDataByOrg(params4user)
      }).catch((e) => {
        console.error(e)
      })
    },
    // 加载岗位信息
    loadPositionData(params, data, params4user) {
      queryByParentId4Post(formatParams(params, { limit: 999 })).then(res => {
        this.orgList = res.data.dataResult
        data[this.childrenKey] = this.orgList
        this.pathData.push(data)
        if (this.$utils.isEmpty(data[this.idKey])) {
          params4user.posId = this.getOrgListIds(this.orgList)
        }
        this.loadUserDataByPost(params4user)
      }).catch((e) => {
        console.error(e)
      })
    },
    //  加载角色信息
    loadRoleData(params, data, params4user) {
      queryBySubSysIdOrName(formatParams(params, { limit: 999 })).then(res => {
        this.orgList = res.data.dataResult
        data[this.childrenKey] = this.orgList
        this.pathData.push(data)
        if (this.$utils.isEmpty(data[this.idKey])) {
          params4user.roleId = this.getOrgListIds(this.orgList)
        }
        this.loadUserDataByRole(params4user)
      }).catch((e) => {
        console.error(e)
      })
    },
    // 加载用户组信息
    loadGroupData(params, data, params4user) {
      queryGroups().then(res => {
        this.orgList = JSON.parse(res.data || '[]')
        data[this.childrenKey] = this.orgList
        this.pathData.push(data)
        if (this.$utils.isEmpty(data[this.idKey])) {
          params4user.orgId = this.getOrgListIds(this.orgList)
        }
        this.loadUserDataByGroup(params4user)
      }).catch((e) => {
        console.error(e)
      })
    },
    // 加载用户信息-通过组织信息
    loadUserDataByOrg(params) {
      dialogUserJson4Org(formatParams(params, { 'page': this.page })).then(response => {
        const dataList = response.data.dataResult
        if (this.$utils.isNotEmpty(dataList)) {
          dataList.map((d) => {
            d[this.labelKey] = d[this.labelKey]
            this.cacheData[d[this.valueKey]] = d
          })
          this.page++
          this.dataList = this.dataList.concat(dataList)
          this.finished = false
        }
        this.finished = !!loadFinished(response.data.pageResult)
        this.loading = false
        this.isLoading = false
        // 结果类型
        this.resultType = getResultType(this.list, this.finished)
      }).catch((e) => {
        this.loading = false
        this.isLoading = false
        this.finished = true
        this.resultType = 'error'
        this.resultMessage = e.message
        console.error(e)
      })
    },
    // 加载用户信息-通过岗位信息
    loadUserDataByPost(params) {
      dialogUserJson4Post(formatParams(params, { 'page': this.page })).then(response => {
        const dataList = response.data.dataResult

        if (this.$utils.isNotEmpty(dataList)) {
          dataList.map((d) => {
            d[this.labelKey] = d[this.labelKey]
            this.cacheData[d[this.valueKey]] = d
          })
          this.page++
          this.dataList = this.dataList.concat(dataList)
          this.finished = false
        }
        this.finished = !!loadFinished(response.data.pageResult)
        this.loading = false
        this.isLoading = false
        // 结果类型
        this.resultType = getResultType(this.list, this.finished)
      }).catch((e) => {
        this.loading = false
        this.isLoading = false
        this.finished = true
        this.resultType = 'error'
        this.resultMessage = e.message
        console.error(e)
      })
    },
    // 加载用户信息-通过角色信息
    loadUserDataByRole(params) {
      dialogUserJson4Role(formatParams(params, { 'page': this.page })).then(response => {
        const dataList = response.data.dataResult

        if (this.$utils.isNotEmpty(dataList)) {
          dataList.map((d) => {
            d[this.labelKey] = d[this.labelKey]
            this.cacheData[d[this.valueKey]] = d
          })
          this.page++
          this.dataList = this.dataList.concat(dataList)
          this.finished = false
        }
        this.finished = !!loadFinished(response.data.pageResult)
        this.loading = false
        this.isLoading = false
        // 结果类型
        this.resultType = getResultType(this.list, this.finished)
      }).catch((e) => {
        this.loading = false
        this.isLoading = false
        this.finished = true
        this.resultType = 'error'
        this.resultMessage = e.message
        console.error(e)
      })
    },
    // 加载用户信息-通过用户组信息
    loadUserDataByGroup(params) {
      dialogUserJson4Group(formatParams(params, { 'page': this.page })).then(response => {
        const dataList = response.data.dataResult

        if (this.$utils.isNotEmpty(dataList)) {
          dataList.map((d) => {
            d[this.labelKey] = d[this.labelKey]
            this.cacheData[d[this.valueKey]] = d
          })
          this.page++
          this.dataList = this.dataList.concat(dataList)
          this.finished = false
        }
        this.finished = !!loadFinished(response.data.pageResult)
        this.loading = false
        this.isLoading = false
        // 结果类型
        this.resultType = getResultType(this.list, this.finished)
      }).catch((e) => {
        this.loading = false
        this.isLoading = false
        this.finished = true
        this.resultType = 'error'
        this.resultMessage = e.message
        console.error(e)
      })
    },
    // 通过脚本加载
    loadDataByScript() {
      this.getFilter()
      getTreeDataByScriptValue({ 'script': this.currentFilterOption.scriptContent }).then(response => {
        // // 判断返回值，不是数组不做动作，免得报错
        // if (!(response && response.data && response.data.dataResult && Array.isArray(response.data.dataResult))) {
        //   return
        // }
        if (!(response && response.data && Array.isArray(response.data))) {
          return
        }
        response.data.filter(item => {
          if (item.name === '用户组') {
            return
          }
          const groupId = item.id
          const groupName = item.name
          const data = {
            id: groupId,
            name: groupName
          }
          // getGroupById({ 'id': groupId }).then(response => {
          //   // 构建用户组结构
          //   this.orgList = JSON.parse(response.data || '[]')
          //   data[this.childrenKey] = this.orgList
          // }).catch((e) => {
          //   console.error(e)
          // })
          this.pathData.push(data)
          const params4user = {
            groupId: groupId,
            includeChild: this.currentFilterOption.includeSub,
            type: this.currentFilterOption.descVal
          }
          // 构建用户数据
          this.loadUserDataByGroup(params4user)
        })
        // this.loadUserDataByRole({})
      }).catch((e) => {
        console.error(e)
      })
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

