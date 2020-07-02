<template>
  <div class="lc-drop-menu">
    <div class="lc-drop-menu-bar">
      <template v-for="(item, index) in data">
        <div
          :key="index"
          :class="{
            active: index === activeMenuBarIndex,
            selected: $_checkBarItemSelect(index),
            disabled: item.disabled
          }"
          class="bar-item"
          @click="$_onBarItemClick(item, index)"
        >
          <span
            v-text="$_getBarItemText(item, index)"
          />
        </div>
      </template>
    </div>
    <van-popup
      v-model="isPopupShow"
    >
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
        <!-- <van-radio
          v-model="selectedMenuListValue[activeMenuBarIndex]"
          :options="activeMenuListData"
          :optionRender="optionRender"
          :is-slot-scope="hasSlot"
          is-across-border
          @change="$_onListItemClick"
        >
          <template slot-scope="{ option }">
            <slot :option="option"></slot>
          </template>
        </van-radio> -->
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
          (item.value === defaultValue || item.text === defaultValue || item.label === defaultValue)
        ) {
          this.$set(this.selectedMenuListItem, barItemIndex, item)
          return 2
        }
      })
    },
    $_checkBarItemSelect(index) {
      return !!(this.selectedMenuListItem[index] !== undefined || this.defaultValue[index])
    },
    $_getBarItemText(item, index) {
      return this.selectedMenuListItem[index] !== undefined ? this.selectedMenuListItem[index].text : item.text
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
      this.selectedMenuListValue[activeMenuBarIndex] = listItem.name || listItem.text
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
