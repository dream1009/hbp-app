<template>
  <div v-if="showSelectorPopup">
    <van-popup v-model="showSelectorPopup" class="lc-fullscreen-popup" position="bottom" @click-overlay="clickOverlay">
      <van-nav-bar
        :left-text="leftText"
        left-arrow
        @click-left="onCancel"
        :style="getBackGroundStyle()"
      >
        <span v-if="multiple" slot="title" @click="onTitle()" :style="getTextStyle()">{{ title }}</span>
        <van-icon slot="left" name="arrow-left" :style="getSlotStyle()"/>
        <span slot="right" class="van-nav-bar__text" @click="onConfirm" :style="getTextStyle()">{{ $t('confirm') }}</span>
      </van-nav-bar>
      <div class="lc-fixed-navbar">
        <form action="/">
          <van-search
            v-model="search"
            :placeholder="searchPlaceholder"
            @search="onSearch"
          />
        </form>
        <van-cell v-if="isTree" class="root-title">
          <div slot="title">
            <template v-for="(data,index) in pathDataTmp">
              <span :key="index">
                <span
                  :class="{'is-link':pathData.length-1!==index}"
                  @click="changePath(index)"
                >
                  {{ data[labelKey] }}
                </span>
                <span v-if="pathData.length>1&&pathData.length-1!==index">/</span>
              </span>
            </template>
          </div>
        </van-cell>
        <div v-else>
          <slot name="rootTitle" />
        </div>

        <!---多选-->
        <van-checkbox-group v-if="multiple" v-model="checkbox">
          <van-cell-group>
            <van-list v-model="loadingTmp" :finished="finished" @load="onLoad">
              <van-cell
                v-for="(data,index) in dataList"
                :key="data[idKey]+index"
                clickable
              >
                <div slot="title" @click="toggle(data,index)">
                  <van-checkbox
                    ref="checkboxes"
                    :name="data[valueKey]"
                    @click.native.stop="(e)=>clickCheckbox(e,data,index)"
                  >
                    {{ data[labelKey] }}
                  </van-checkbox>
                </div>
                <span
                  v-if="data.hasChild"
                  slot="right-icon"
                  @click="toggleChild(data,index)"
                >
                  <span class="van-cell__right-icon">下级</span>
                  <van-icon name="arrow " class="van-cell__right-icon" />
                </span>
              </van-cell>
            </van-list>
          </van-cell-group>
        </van-checkbox-group>

        <!---单选-->
        <van-radio-group v-else v-model="radio">
          <van-cell-group>
            <van-list v-model="loadingTmp" :finished="finished" @load="onLoad">
              <van-cell
                v-for="(data,index) in dataList"
                :key="data[idKey]+index"
                clickable
              >
                <div slot="title" @click="toggle(data,index)">
                  <van-radio
                    ref="radioes"
                    :name="data[valueKey]"
                  >
                    {{ data[labelKey] }}
                  </van-radio>
                </div>
                <span
                  v-if="data.hasChild"
                  slot="right-icon"
                  @click="toggleChild(data,index)"
                >
                  <span class="van-cell__right-icon">下级</span>
                  <van-icon name="arrow " class="van-cell__right-icon" />
                </span>
              </van-cell>
            </van-list>
          </van-cell-group>
        </van-radio-group>
      </div>
    </van-popup>
    <!--点击明细 -->
    <van-popup v-if="multiple" v-model="showDetailPopup" class="lc-fullscreen-popup" position="right">
      <van-nav-bar
        :left-text="$t('close')"
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
              :title="data[labelKey]"
              clickable
            />
            <span slot="right" @click="removeSelected(index)">{{ $t('delete') }}</span>
          </van-swipe-cell>
        </van-cell-group>
      </div>
    </van-popup>
  </div>
</template>
<script>
import i18n from '@/lang' // Internationalization 国际化
import { getBackGroundStyle, getSlotStyle, getTextStyle} from '@/mixins/navbar'
export default {
  props: {
    showPopup: Boolean,
    value: Array,
    multiple: Boolean,
    dataList: Array,
    cacheData: [Object, Array],
    pathData: Array,
    leftText: {
      type: String,
      default: i18n.t('cancel')
    },
    searchPlaceholder: {
      type: String,
      default: i18n.t('common.input')
    },
    isTree: {
      type: Boolean,
      default: true
    },
    rootId: {
      type: String,
      default: '0'
    },
    rootName: {
      type: String,
      default: '顶级'
    },
    idKey: {
      type: String,
      default: 'id'
    },
    parentIdKey: {
      type: String,
      default: 'parentId'
    },
    valueKey: {
      type: String,
      default: 'id'
    },
    labelKey: {
      type: String,
      default: 'name'
    },
    childrenKey: {
      type: String,
      default: 'children'
    },
    loading: Boolean,
    finished: Boolean

  },
  data() {
    return {
      search: '',
      checkbox: [],
      pathDataTmp: [],
      radio: '',
      showSelectorPopup: false,
      showDetailPopup: false,
      loadingTmp: false
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
      if (this.multiple) {
        this.checkbox = []
        if (this.$utils.isNotEmpty(this.value)) {
          this.value.forEach(v => {
            this.checkbox.push(v)
          })
        }
      } else {
        this.radio = ''
        if (this.$utils.isNotEmpty(this.value)) {
          this.radio = this.value[0]
        }
      }
    },
    showPopup() {
      this.showSelectorPopup = this.showPopup
      if (this.showPopup) {
        this.search = ''
        this.$emit('init-page-data')
      }
    },
    loadingTmp() {
      this.$emit('loading', this.loadingTmp)
    },
    loading() {
      this.loadingTmp = this.loading
    },
    pathData() {
      this.pathDataTmp = this.pathData
    }
  },
  methods: {
    // 查询
    onSearch() {
      // TODO
      this.$emit('load-data', {
        value: this.search
      }, true)
    },
    onLoad() {
      this.$emit('load-data', {
        value: this.search
      }, false)
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
    // 多选
    toggleCheckbox(data, index) {
      this.$refs.checkboxes[index].toggle()
    },
    // 单选
    toggleRadio(data, index) {
      this.radio = data[this.valueKey]
    },
    onCancel() {
      this.$emit('cancel')
    },
    onConfirm() {
      const result = this.multiple ? this.checkbox : this.radio ? [this.radio] : ''
      if (this.$utils.isEmpty(result)) {
        this.$toast(this.$t('common.dialog.selectedRecords'))
        return
      }
      this.$emit('confirm', result)
    },
    clickOverlay() {
      this.$emit('clickOverlay')
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
    toggleChild(data, index) {
      this.$emit('toggle-child', data)
    },
    changePath(index) {
      this.$emit('change-path', index)
    },
    // 删除选中
    removeSelected(index) {
      this.checkbox.splice(index, 1)
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
