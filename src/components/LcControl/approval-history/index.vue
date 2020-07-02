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
      </cell>
      <cell>
        <approval-history
          :task-id="taskId"
          :bpmn-inst-id="bpmnInstId"
        />
      </cell>
    </cell-group>
  </div>
</template>
<script>
import ApprovalHistory from '@/components/Bpmn/approval-history'
import create from '../utils/create'
export default create({
  name: 'lc-approval-history',
  components: {
    ApprovalHistory
  },
  props: {
    value: [String],
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
    taskId: String,
    bpmnInstId: String
  }
})
</script>

