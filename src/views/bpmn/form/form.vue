<template>
  <bpmn-form v-bind="$attrs" v-on="$listeners" />
</template>
<script>
import BpmnForm from './index'

export default {
  name: 'FormDetail',
  components: {
    BpmnForm
  }
}
</script>
