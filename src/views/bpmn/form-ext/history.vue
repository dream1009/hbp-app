<template>
  <van-popup slot="fr-ext" v-model="popup" class="lc-fullscreen-popup">
    <div class="lc-fixed-top">
      <van-nav-bar
        :left-text="$t('close')"
        title="审批历史"
        fixed
        @click-left="closePopup"
        :style="getBackGroundStyle()"
        >
        <van-icon slot="left" name="arrow-left" :style="getSlotStyle()"/>
      </van-nav-bar>
      <approval-history
        :task-id="taskId"
        :bpmn-inst-id="bpmnInstId"
      />
    </div>
  </van-popup>
</template>

<script>
import ApprovalHistory from '@/components/Bpmn/approval-history'
import {getBackGroundStyle, getSlotStyle} from '@/mixins/navbar';
export default {
  components: {
    ApprovalHistory
  },
  props: {
    value: Boolean,
    defId: String,
    taskId: String,
    bpmnInstId: String
  },
  data() {
    return {
      popup: false
    }
  },
  watch: {
    value() {
      this.popup = this.value
    }
  },
  methods: {
    closePopup() {
      this.$emit('input', false)
    },
    getBackGroundStyle() {
        return getBackGroundStyle()
    },
    getSlotStyle() {
        return getSlotStyle()
    }
  }

}
</script>

