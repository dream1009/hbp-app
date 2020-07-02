<template>
  <!--  -->
  <div class="inst-link lc-cell-wrapper">
    <cell
      v-if="label"
      :title="label"
      :required="required"
      :center="center"
      :border="border"
      :class="bem({
        error,
        disable:$attrs.disable,
        readonly: readonly,
        [`label-${labelAlign}`]: labelAlign
      })"
    />
    <div>
      <div v-for="(item,index) in content" :key="item.id+index">
        <van-cell>
          <h4>
            <span>{{ item['creator'] }}</span>
            <span class="task-name">【{{ item.procDefName }}】</span>
            <van-tag plain>
              {{ _getStatus(item.status) }}
            </van-tag>
          </h4>
          <p class="alink" @click="showBpmnForm(item)">
            {{ item['subject'] }}
          </p>
          <p class="time">
            发起时间: {{ item.createTime|formatDate('yyyy-MM-dd HH:mm:ss') }}
            <br>
            结束时间: {{ item.endTime|formatDate('yyyy-MM-dd HH:mm:ss') }}
          </p>
        </van-cell>
      </div>
    </div>
  </div>
</template>

<script>
import create from '../utils/create'
import bpmnStatus from '@/mixins/bpmnStatus'
export default create({
  name: 'lc-bpm-link',
  mixins: [bpmnStatus],
  inject: ['reload'],
  props: {
    label: String,
    params: Object,
    center: Boolean,
    border: {
      type: Boolean,
      default: true
    },
    labelAlign: String,
    required: Boolean,
    error: Boolean,
    readonly: {
      type: Boolean,
      default: true
    },
    fieldOptions: Object
  },
  data() {
    return {
      content: [],
      proInstId: '0'
    }
  },
  mounted() {
    // this.content = this.params
    if (
      this.fieldOptions.bpmLinkType === 'current' &&
      this.$utils.isNotEmpty(this.params.currentFormInst)
    ) {
      this.content = this.params.currentFormInst
    } else if (
      this.fieldOptions.bpmLinkType === 'postposition' &&
      this.$utils.isNotEmpty(this.params.postFormInst)
    ) {
      this.content = this.params.postFormInst
    }
  },
  methods: {
    showBpmnForm(item) {
      console.log('bpmlink.index.showBpmnForm-> ', item.id)
      this.reload()
      this.$router.push({
        name: 'bpmnFormInstance',
        query: {
          instanceId: item.id
        },
        params: {
          title: item.procDefName
        }
      })
    }
  }
})
</script>

<style lang="scss" >
.inst-link {
  .time {
    color: #999999;
    font-size: 12px;
  }
  .alink {
    color: #c98eec;
    white-space: nowrap;
  }
}
</style>
