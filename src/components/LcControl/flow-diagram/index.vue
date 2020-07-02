<template>
  <div class="lc-cell-wrapper">
    <cell-group :border="border">
      <cell
        :title="label"
        :center="center"
        :border="border"
        :class="bem({
          error,
          [`label-${labelAlign}`]: labelAlign
        })"
      >
        <slot slot="title" name="label" />
        <van-button size="mini" plain type="primary" @click="onClick('zoomReset')">
          还原
        </van-button>
        <van-button size="mini" plain type="warning" @click="onClick('zoomIn')">
          放大
        </van-button>
        <van-button size="mini" plain type="danger" @click="onClick('zoomOut')">
          缩小
        </van-button>
      </cell>
      <cell style="padding:0;">
        <flow-diagram
          ref="flowDiagram"
          :def-id="defId"
          :task-id="taskId"
          :bpmn-inst-id="bpmnInstId"
          :auto-height="true"
          :toolbar="false"
        />
      </cell>
    </cell-group>
  </div>
</template>
<script>
import FlowDiagram from '@/components/Bpmn/flow-diagram'
import create from '../utils/create'
export default create({
  name: 'lc-flow-diagram',
  components: {
    FlowDiagram
  },
  props: {
    value: String,
    icon: String,
    label: String,
    error: Boolean,
    center: Boolean,
    leftIcon: String,
    labelAlign: String,
    inputAlign: {
      type: String,
      default: 'left'
    },
    placeholder: String,
    border: {
      type: Boolean,
      default: true
    },
    width: String,
    height: String,
    title: String,
    defId: String,
    taskId: String,
    bpmnInstId: String
  },
  methods: {
    onClick(action) {
      if (action === 'zoomReset') {
        this.$refs.flowDiagram.zoomReset()
      } else if (action === 'zoomIn') {
        this.$refs.flowDiagram.zoomIn()
      } else if (action === 'zoomOut') {
        this.$refs.flowDiagram.zoomOut()
      }
    }
  }
})
</script>

