<template>
  <div class="task-change-detail">
    <van-nav-bar
      :title="generateTitle()"
      :left-text="$t('back')"
      left-arrow
      fixed
      @click-left="onClickLeft"
    />
    <van-cell-group>
      <van-field v-model="taskChange.taskSubject" label="事项标题" disabled />
      <van-field v-model="taskChange.taskName" label="任务名称" disabled />
      <van-field v-model="changeType" label="更改类型" disabled />
      <van-field v-model="status" label="状态" disabled />
      <van-field v-model="taskChange.ownerName" label="委托人" disabled />
      <van-field v-model="taskChange.executorName" label="执行人" disabled />
      <van-field v-model="taskChange.createTime" label="创建时间" disabled />
      <van-field v-model="taskChange.completeTime" label="完成时间" disabled />
      <van-field
        v-model="taskChange.comment"
        label="变更描述"
        rows="2"
        autosize
        disabled
      />
    </van-cell-group>

    <van-cell-group>
      <div class="title">
        任务变更候选人
      </div>
      <van-cell value="执行人" title="候选人类型" />
      <div v-for="item in taskChange.bpmTaskChangeAssignPoList" :key="item.id">
        <van-cell :value="item.executorName" :title="type(item.type)" />
      </div>
    </van-cell-group>

    <div style="height:50px" />
  </div>
</template>

<script>
import navbar from '@/mixins/navbar'
import Vue from 'vue'
import LcControl from '@/components/LcControl'
import { taskChangeDetail } from '@/api/platform/bpmn/bpmn'
import bpmnStatus from '@/mixins/bpmnStatus'
Vue.use(LcControl)
export default {
  mixins: [navbar, bpmnStatus],
  data() {
    return {
      taskChange: {
        taskSubject: '',
        taskName: '',
        changeType: '',
        status: '',
        ownerName: '',
        createTime: '',
        completeTime: '',
        comment: '',
        executorName: ''
      }
    }
  },
  computed: {
    changeType() {
      if (this.taskChange.changeType === 'assignee') {
        return '代理'
      } else if (this.taskChange.changeType === 'shift') {
        return '转办'
      } else {
        return ''
      }
    },
    status() {
      if (this.taskChange.status === 'running') {
        return '运行中'
      } else if (this.taskChange.changeType === 'finish') {
        return '完成'
      } else {
        return ''
      }
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      const id = this.$route.params.id

      taskChangeDetail({ 'id': id }).then(response => {
        this.taskChange = response.data.bpmTaskChange
      }).catch((e) => {
        console.log(e)
      })
    },
    onClickLeft() {
      this.$router.push({
        name: 'taskChange'
      })
    },
    type(type) {
      if (type === 'user' || type === 'employee') {
        return '用户'
      } else if (type === 'org') {
        return '组织'
      } else if (type === 'pos') {
        return '岗位'
      } else if (type === 'role') {
        return '角色'
      } else {
        return ''
      }
    }
  }

}
</script>

<style lang="scss">
.task-change-detail{
  .title{
    text-align: center;
    font-size: 18px;
    color: #9a6965;
  }
}
</style>

