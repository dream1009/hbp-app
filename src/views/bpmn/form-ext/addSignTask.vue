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
        <van-lc-selector
          v-model="form.addSignTaskUserId"
          label="补签人员"
          type="user"
          store="id"
          multiple
          clearable
          required
        />
        <van-lc-checkbox
          v-model="form.messageType"
          :options="options"
          label="提醒消息"
          placeholder="请选择"
          clearable
          required
        />
        <van-field
          v-model="form.addReason"
          label="补签原因"
          type="textarea"
          placeholder="请输入"
          rows="4"
          autocapitalize="off"
          autocorrect="off"
          autosize
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
import { toAddSignTask } from '@/api/platform/bpmn/bpmn'
import { doAddSignTask } from '@/api/platform/bpmn/action'
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
      title: '补签',
      popup: false,
      form: {
        taskId: this.taskId,
        addSignTaskUserId: '',
        addSignTaskUserName: '',
        messageType: 'inner',
        addReason: ''
      },
      actions: [{
        'name': this.$t('common.button.save'),
        'buttonType': 'primary',
        'callback': this.onSave
      }],
      options: [
        {
          label: '内部消息',
          value: 'inner'
        }, {
          label: '邮件',
          value: 'mail'
        }, {
          label: '短信',
          value: 'sms'
        }
      ]
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
  methods: {
    closePopup() {
      this.$emit('input', false)
    },
    onSave() {
      const temp = this.form.addSignTaskUserId
      if (!temp.length > 0) {
        this.$toast.fail(this.$t('common.dialog.selectedRecords'))
        return
      }
      doAddSignTask(this.form).then(response => {
        this.form.addSignTaskUserId = ''
        this.form.addReason = ''
        this.closePopup()
      }).catch(error => {
        console.error(error)
      })
    },
    initData() {
      toAddSignTask({ 'taskId': this.taskId }).then(response => {

      }).catch(error => {
        console.error(error.cause)
      })
    }
  }
}
</script>

<style>
</style>
