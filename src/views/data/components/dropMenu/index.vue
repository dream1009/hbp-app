<template>
  <div class="lc-drop-menu menus">
    <div>
      <template v-for="(item, index) in data">
        <div
          :key="index"
          :class="{
            active: index === activeMenuBarIndex,
            selected: $_checkBarItemSelect(index),
            disabled: item.disabled,
          }"
          class="bar-item"
          :style="{'padding':$utils.isNotEmpty(item.options)?8+'px':0}"
          @click="$_onBarItemClick(item, index)"
        >
          <slot name="checks" :text="$_getBarItemText(item, index)" :color="isPopupShow?'#666':'#38f'" />
          <slot name="icon" :icon="isPopupShow?'up':'down'" :color="isPopupShow?'#38f':'#666'" />
        </div>
      </template>
      <slot name="text" />
      <slot name="right" />
    </div>
    <van-popup v-model="isPopupShow">
      <div class="lc-drop-menu-list">
        <van-radio-group v-model="selectedMenuListValue[activeMenuBarIndex]">
          <van-cell-group>
            <van-cell
              v-for="item in activeMenuListData"
              :key="item.text"
              :title="item.text"
              clickable
              @click="$_onListItemClick(item)"
            >
              <van-radio :name="item.name||item.text" />
            </van-cell>
          </van-cell-group>
        </van-radio-group>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { traverse, compareObjects } from './util'
/**
 * TODO
 * 未做:自定义菜单项
 */

export default {
  name: 'LcDropMenu',

  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    },
    defaultValue: {
      type: Array,
      default() {
        return []
      }
    },
    optionRender: {
      type: Function,
      default: function() {}
    },
    async: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      isPopupShow: false,
      selectedMenuListItem: [],
      selectedMenuListValue: [],
      selectedMenuListIndex: [],
      activeMenuBarIndex: -1,
      activeMenuListData: [],
      scroller: ''
    }
  },

  computed: {
    hasSlot() {
      return !!this.$scopedSlots.default
    }
  },

  watch: {
    data(val, oldVal) {
      // Avoid  Literals
      /* istanbul ignore if  */
      if (!compareObjects(val, oldVal)) {
        this.$_initSelectedBar()
      }
    },
    defaultValue(val, oldVal) {
      /* istanbul ignore if  */
      if (!compareObjects(val, oldVal)) {
        this.$_initSelectedBar()
      }
    },
    isPopupShow() {
      if (this.isPopupShow) {
        this.$_onListShow()
      } else {
        this.$_onListHide()
      }
    },
    async: {
      handler: function(val, oldVal) {
        this.isPopupShow = false
      },
      immediate: true
    }
  },

  mounted() {
    this.$_initSelectedBar()
  },

  methods: {
    // MARK: private methods
    $_initSelectedBar() {
      this.selectedMenuListValue = this.defaultValue
      traverse(this.data, ['options'], (item, level, indexs) => {
        const barItemIndex = indexs[0]
        const defaultValue = this.defaultValue[barItemIndex]
        if (
          defaultValue !== undefined &&
          (item.value === defaultValue ||
            item.text === defaultValue ||
            item.label === defaultValue)
        ) {
          this.$set(this.selectedMenuListItem, barItemIndex, item)
          return 2
        }
      })
    },
    $_checkBarItemSelect(index) {
      return !!(
        this.selectedMenuListItem[index] !== undefined ||
        this.defaultValue[index]
      )
    },
    $_getBarItemText(item, index) {
      return this.selectedMenuListItem[index] !== undefined
        ? this.selectedMenuListItem[index].text
        : item.text
    },

    // MARK: events handler
    $_onBarItemClick(barItem, index) {
      /* istanbul ignore if  */
      if (!barItem || barItem.disabled) {
        return
      }

      if (!this.isPopupShow) {
        this.isPopupShow = true
        this.activeMenuBarIndex = index
        this.activeMenuListData = barItem.options
      } else {
        this.isPopupShow = false
      }
    },
    $_onListItemClick(listItem) {
      const activeMenuBarIndex = this.activeMenuBarIndex
      const barItem = this.data[activeMenuBarIndex]
      this.isPopupShow = false
      this.$set(this.selectedMenuListItem, activeMenuBarIndex, listItem)
      this.selectedMenuListValue[activeMenuBarIndex] =
        listItem.name || listItem.text
      this.$emit('change', barItem, listItem)
    },
    $_onListShow() {
      /* istanbul ignore next  */
      this.$emit('show')
    },
    $_onListHide() {
      /* istanbul ignore next  */
      this.activeMenuBarIndex = -1
      /* istanbul ignore next  */
      this.$emit('hide')
    },

    // MARK: public methods
    getSelectedValues() {
      return this.selectedMenuListItem
    },
    getSelectedValue(index) {
      return this.selectedMenuListItem[index]
    }
  }
}
</script>
<style lang="scss" scoped>
$font_size:14px;
$font_color:#38f;
.menus{
  >div{
    position: relative;
    background-color: #f1f4f8;
    // height: 100%;
    min-height:40px;
  }
  .bar-item{
    display: inline-block;
    position: relative;
    padding: 8px;
    top: 3px;
    left: 5px;
    .menu-slot-checks{
      max-width: 70px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-size: $font_size;
      text-align: center;
    }
    .menu-slot-icon{
      position: absolute;
      right: -7px;
      top: 9px;
      z-index: 2015;
      font-size: $font_size;
    }
  }
  .menu-slot-text{
    font-size: $font_size;
    position: relative;
    bottom:0;
    height: 100%;
  }
  .menu-slot-right{
    padding: 8px;
    font-size: $font_size;
    color:$font_color;
    position: absolute;
    top: 13%;
    right: 2%;
  }
}
</style>
