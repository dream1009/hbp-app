<template>
  <div class="lc-toolbar">
    <ul
      v-if="moreActions && moreActions.length >0"
      v-show="showMore"
      class=" lc-toolbar-group-more"
    >
      <van-actionsheet
        v-model="showMore"
        :actions="moreActions"
        :cancel-text="moreCancelText"
        @cancel="onCancel"
      />
    </ul>
    <ul class="lc-toolbar-group">
      <lc-toolbar-item
        v-for="(action, index) in basicActions"
        :key="index"
        :action="action"
        @click.native="itemClick(action)"
      />
    </ul>
  </div>
</template>

<script>
import LcToolbarItem from './toolbar-item.vue'

const EVENT_MORE_CLICK = 'more-click'
const EVENT_CANCEL = 'cancel'
export default {
  name: 'LcToolbar',
  components: {
    LcToolbarItem
  },
  props: {
    actions: {
      type: Array,
      default: () => []
    },
    moreActions: {
      type: Array
    },
    moreCancelText: {
      type: String,
      default: '取消'
    }
  },
  data() {
    return {
      showMore: false
    }
  },
  computed: {
    basicActions() {
      const basicActions = this.actions.slice()
      this.moreActions && this.moreActions.length > 0 && basicActions.push({
        icon: 'ellipsis',
        $vanMore: true,
        callback: () => {
          this.$emit(EVENT_MORE_CLICK, this.showMore)
        }
      })
      return basicActions
    }
  },
  methods: {
    itemClick(action) {
      if (action.$vanMore) {
        this.showMore = !this.showMore
      }
      if (action.callback && !action.disabled) {
        action.callback(action)
      }
    },
    onCancel() {
      this.$emit(EVENT_CANCEL)
    },
    closeMoreAction() {
      this.showMore = false
    }
  }
}
</script>
