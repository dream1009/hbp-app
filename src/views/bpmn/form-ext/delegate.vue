<template>
  <van-popup slot="fr-ext" v-model="popup" class="lc-fullscreen-popup">
    <div class="lc-fixed-top">
      <van-nav-bar
        :title="title"
        :left-text="$t('close')"
        left-arrow
        fixed
        @click-left="closePopup"
      />

      <van-cell-group>
        <van-field
          v-model="form.taskSubject"
          label="事项标题"
          disabled
        />
        <van-field
          v-model="form.taskName"
          label="任务名称"
          disabled
        />
        <van-field
          v-model="typeName"
          label="更改类型"
          disabled
        />
        <van-field
          v-model="statusName"
          label="状态"
          disabled
        />
        <van-field
          v-model="form.ownerName"
          label="委托人"
          disabled
        />
        <van-field
          label="执行人"
          disabled
        />
        <van-field
          v-model="form.comment"
          label="更改描述"
        />
        <van-lc-selector
          v-model="selector"
          label="任务变更候选人"
          type="user"
          store="array"
          multiple
          clearable
        />
      </van-cell-group>
    </div>
    <lc-toolbar
      :actions="actions"
    />
  </van-popup>
</template>

<script>
import Vue from 'vue'
import bpmnStatus from '@/mixins/bpmnStatus'
import { toDelegate } from '@/api/platform/bpmn/bpmn'
import { saveTaskChange } from '@/api/platform/bpmn/action'
import LcControl from '@/components/LcControl'
import LcToolbar from '@/components/LcToolbar'
Vue.use(LcControl)
export default {
  components: {
    LcToolbar
  },
  mixins: [bpmnStatus],
  props: {
    value: Boolean,
    taskId: String
  },
  data() {
    return {
      title: '转办',
      popup: false,
      form: {
        taskSubject: '',
        taskName: '',
        changeType: '',
        status: '',
        ownerName: '',
        comment: ''
      },
      selector: [],
      actions: [{
        'name': this.$t('common.button.save'),
        'buttonType': 'primary',
        'callback': this.onSave
      }]
    }
  },
  computed: {
    statusName() {
      if (this.form.status === 'running') {
        return '运行中'
      } else if (this.form.status === 'finish') {
        return '完成'
      } else if (this.form.status === 'cancel') {
        return '取消'
      }
      return ''
    },
    typeName() {
      if (this.form.changeType === 'shift') {
        return '转办'
      } else if (this.form.changeType === 'assignee') {
        return '代理'
      }
      return ''
    }

  },
  watch: {
    value() {
      this.popup = this.value
      if (this.popup) {
        this.initData()
      }
    }
  },
  created() {
    // this.initData()
  },
  methods: {
    closePopup() {
      this.$emit('input', false)
    },
    onSave() {
      const temp = this.selector
      if (!temp.length > 0) {
        this.$dialog.alert({
          title: this.$t('common.dialog.warn'),
          message: this.$t('common.dialog.selectedRecords')
        })
        return
      }
      const poList = []
      for (var i = 0; i < temp.length; i++) {
        poList.push({ 'id': '', 'taskChangeId': '', 'type': 'employee', 'executor': temp[i].id })
      }
      this.form.bpmTaskChangeAssignPoList = poList
      this.form.completeTime = ''
      saveTaskChange({
        json: JSON.stringify(this.form)
      }).then(response => {
        this.$store.dispatch('setDataChange', false)
        this.$toast.success(`操作成功！`)
        this.$router.push({ path: '/bpmn-cust/pending-cust' })
      }).catch(error => {
        console.error(error.cause)
      })
    },
    initData() {
      toDelegate({ 'taskId': this.taskId }).then(response => {
        const data = response.data.bpmTaskChange
        this.form = data
      }).catch(error => {
        console.error(error.cause)
      })
    }
  }
}
</script>

<style>
</style>
