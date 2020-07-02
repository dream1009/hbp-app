<template>
  <div class="approval-history">
    <van-steps :active="active" direction="vertical" active-color="#f55353">
      <van-step v-for="(item, index) in opinions" :key="index">
        <h3>
          <span v-if="item.batch">
            <span v-if="item.qualifiedExecutor&&item.status == 'pending'">{{ getName(item.qualifiedExecutor) }}</span>
            <span v-else-if="item.qualifiedExecutor&&item.status != 'pending'">{{ getName(item.qualifiedExecutor) }}</span>
            <span v-else>未设置执行人</span>
          </span>
          <span v-else>
            <span v-if="item.auditor">{{ item.auditorName }}</span>
            <span v-else-if="item.qualifiedExecutor">{{ getName(item.qualifiedExecutor) }}</span>
            <span v-else>未设置执行人</span>
          </span>
          <span class="task-name">【{{ item.taskName }}】</span>
          <van-tag :class="getStatusType(item,index)" plain>{{ item.statusName }}</van-tag>
        </h3>

        <p v-if="item.opinion" class="opinion">{{ item.opinion }}</p>
        <p v-if="item.completeTime" class="time">
          到达: {{ item.createTime|formatDate('yyyy-MM-dd HH:mm:ss') }}<br>
          完成: {{ item.completeTime|formatDate('yyyy-MM-dd HH:mm:ss') }}</p>
      </van-step>
    </van-steps>
  </div>
</template>

<script>
import { getOpinions } from '@/api/platform/bpmn/bpmn'
export default {
  filters: {
    statusType(status) {
      if (status === 'pending') {
        return 'danger'
      }
      return 'success'
    }
  },
  props: {
    taskId: String,
    bpmnInstId: String
  },
  data() {
    return {
      active: -1,
      opinions: []
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      getOpinions({
        taskId: this.taskId,
        bpmInstId: this.bpmnInstId
      }).then(response => {
        this.opinions = response.data.dataResult
        this.setActive()
      })
    },
    getName(obj) {
      if (!obj) return ''
      let name = ''
      for (var i = 0; i < obj.length; i++) {
        name += obj[i].executor + ' '
      }
      return name
    },
    getStatusType({ status }, index) {
      return 'status-' + status
    },
    setActive() {
      this.opinions.forEach((o, i) => {
        if (o.status === 'pending') {
          if (this.active < 0) { this.active = i }
        }
      })
    }
  }
}
</script>
<style lang="scss">
.approval-history {
  h3 {
    margin: 0;
    font-size: inherit;
    font-weight: normal;
  }

  .task-name{
    color: #1E4A8D;
  }
  .opinion {
    color: #333;
    padding: 10px 0;
  }
  .time {
    color: #999999 ;
    font-size: 12px;
  }
  .status-pending {
    color: #f55353 !important;
  }
  .status-submit {
    color: #f89801 !important;
  }
  .status-resubmit {
    color: #e8d367 !important;
  }
  .status-agree {
    color: #58bc5b !important;
  }

  .status-oppose {
    color: #2886c6 !important;
  }
  .status-reject {
    color: #700101 !important;
  }
  .status-rejectToStart {
    color: #a54e4e !important;
  }
  .status-recover {
    color: #569296 !important;
  }

  .status-recoverToStart {
    color: #58a7cb !important;
  }

  .status-sign_pass {
    color: #6fa547 !important;
  }
  .status-sign_no_pass {
    color: #afab3d !important;
  }
  .status-abandon {
    color: #026670 !important;
  }
  .status-manual_end {
    color: #bc79b8 !important;
  }

  .status-complete {
    color: #5b6956 !important;
  }
  .status-suspend {
    color: #c33a1f !important;
  }

  .status-skip {
    color: #6fa547 !important;
  }
}
</style>
