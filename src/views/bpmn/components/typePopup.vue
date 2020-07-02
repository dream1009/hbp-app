<template>
  <div v-if="showSelectorPopup">
    <van-popup v-model="showSelectorPopup" class="lc-fullscreen-popup" position="bottom" @click-overlay="clickOverlay">
      <van-nav-bar
        :left-text="leftText"
        left-arrow
        @click-left="onCancel"
      >
        <span slot="right" class="van-nav-bar__text" @click="onConfirm">{{ $t('confirm') }}</span>
      </van-nav-bar>
      <div class="lc-fixed-navbar">
        <van-cell v-if="isTree" class="root-title">
          <div slot="title">
            <template v-for="(data,index) in pathData">
              <span :key="data[idKey]+index">
                <span
                  :class="{'is-link':pathData.length-1!==index}"
                  @click="changePath(index)"
                >
                  {{ data[labelKey] }}
                </span>
                <span v-if="pathData.length-1!==index">/</span>
              </span>
            </template>
          </div>
        </van-cell>
        <div v-else>
          <slot name="rootTitle" />
        </div>

        <!---单选-->
        <van-radio-group v-model="radio">
          <van-cell-group>
            <van-cell
              v-for="(data,index) in dataList"
              :key="data[idKey]+index"
              clickable
            >
              <div slot="title" @click="toggleRadio(data,index)">
                <van-radio
                  ref="radioes"
                  :name="data[valueKey]"
                >
                  {{ data[labelKey] }}
                </van-radio>
              </div>
              <span
                v-show="data.isLeaf==='N'"
                slot="right-icon"
                @click="onClick(data)"
              >
                <span class="van-cell__right-icon">下级</span>
                <van-icon name="arrow " class="van-cell__right-icon" />
              </span>
            </van-cell>
          </van-cell-group>
        </van-radio-group>
      </div>
    </van-popup>
  </div>
</template>
<script>
import i18n from '@/lang' // Internationalization 国际化
import { getTypes } from '@/api/platform/cat/type'
export default {
  props: {
    showPopup: Boolean,
    value: Array,
    categoryKey: {
      type: String,
      default: 'FLOW_TYPE'
    },
    leftText: {
      type: String,
      default: i18n.t('cancel')
    },
    isTree: {
      type: Boolean,
      default: true
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
    }
  },
  data() {
    return {
      dataList: [],
      flowTypes: [],
      checkbox: [],
      pathData: [{ id: 0, name: '流程分类' }],
      radio: '',
      cacheData: {}, // 缓存数据
      showSelectorPopup: false
    }
  },

  computed: {
    title() {
      return this.$utils.isNotEmpty(this.radio) ? this.cacheData[this.radio] ? this.cacheData[this.radio][this.labelKey] : '' : ''
    }
  },
  watch: {
    value() {
      this.radio = ''
      if (this.$utils.isNotEmpty(this.value)) {
        this.radio = this.value[0]
      }
    },
    showPopup() {
      this.showSelectorPopup = this.showPopup
      if (this.showPopup) {
        this.pathData = [{ id: 0, name: '流程分类' }]
        this.loadTypes()
      }
    }
  },
  methods: {
    loadTypes() {
      getTypes({ catKey: this.categoryKey }).then(response => {
        const data = response.data
        this.flowTypes = data
        this.screening(null, 1)
      })
    },
    screening(parentId, depth) {
      const tempList = []
      if (this.$utils.isNotEmpty(parentId)) {
        for (var i = 0; i < this.flowTypes.length; i++) {
          if (parentId === this.flowTypes[i].parentId) {
            tempList.push(this.flowTypes[i])
          }
        }
      } else if (this.$utils.isNotEmpty(depth)) {
        for (i = 0; i < this.flowTypes.length; i++) {
          if (depth === this.flowTypes[i].depth) {
            tempList.push(this.flowTypes[i])
          }
        }
      }
      this.dataList = tempList
    },
    // 单选
    toggleRadio(data, index) {
      this.radio = data[this.valueKey]
    },
    onCancel() {
      this.$emit('cancel')
    },
    onConfirm() {
      this.$emit('confirm', this.radio ? this.getSelectedData(this.radio) : '')
    },
    clickOverlay() {
      this.$emit('clickOverlay')
    },
    changePath(index) {
      if (index === 0) {
        this.loadTypes()
      } else {
        this.screening(this.pathData[index][this.valueKey])
      }
      this.pathData.splice(index + 1, this.pathData.length - 1)
    },
    onClick(item) {
      this.screening(item.id)
      this.pathData.push({ 'id': item.id, 'name': item.name })
    },
    getSelectedData(data) {
      for (let index = 0; index < this.flowTypes.length; index++) {
        const e = this.flowTypes[index]
        if (e.id === data) {
          return [e]
        }
      }
    }

  }
}
</script>
