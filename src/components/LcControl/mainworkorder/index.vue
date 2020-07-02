<template>
  <div class="lc-field-cell">
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
      <div v-if="show" :class="bem('body')">
        <a
          class="mainWorkorder"
          href="javascript:;"
          @click="click()"
        >
          {{ value }}
        </a>
      </div>
    </cell>
  </div>
</template>
<script>
import create from '../utils/create'
import request from '@/utils/request'
export default create({
  inject: ['reload'],
  name: 'lc-mainWorkorder',
  props: {
    value: [String, Array],
    fieldOptions: Object,
    label: String,
    desc: String,
    center: Boolean,
    labelAlign: String,
    error: Boolean,
    required: Boolean,
    autosize: [Boolean, Object],
    readonly: {
      type: Boolean,
      default: false
    },
    border: {
      type: Boolean,
      default: true
    },
    name: String,
    coord: String
  },
  data() {
    return {
      show: false
    }
  },
  watch: {
  },
  mounted() {
    if (this.value) {
      this.show = true
    }
  },
  methods: {
    click() {
      getWorkOrderByNo({ no: this.value }).then(response => {
        if (response.data && response.data.instanceId) {
          this.$router.push({
            name: 'bpmnForm',
            query: {
              instanceId: response.data.instanceId
            },
            params: {
              title: response.data.workorder_type
            }})
          this.reload()
        } else {
          this.$dialog.alert({
            message: '未找到该工单数据'
          })
        }
      })
    }
  }
})
export function getWorkOrderByNo(params) {
  return request({
    url: '/workOperService/getWorkOrderByNo',
    method: 'post',
    isLoading: true,
    data: params
  })
}
</script>
<style lang="scss">
.mainWorkorder{
  color:white;
  background-color: #38f;
  padding: 2px 10px;
  border-radius:4px;
}
</style>
