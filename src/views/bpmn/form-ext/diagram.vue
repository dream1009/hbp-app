<template>
  <van-popup slot="fr-ext" v-model="popup" class="lc-fullscreen-popup">
    <div class="lc-fixed-top">
      <van-nav-bar
        :left-text="$t('close')"
        title="流程图"
        fixed
        @click-left="closePopup"
      />
      <flow-diagram
        :def-id="defId"
        :task-id="taskId"
        :bpmn-inst-id="bpmnInstId"
      />
    </div>
  </van-popup>
</template>

<script>
import FlowDiagram from '@/components/Bpmn/flow-diagram'
export default {
  components: {
    FlowDiagram
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
    }
  }
}
</script>

