<template>
  <van-popup slot="fr-ext" v-model="popup" class="lc-fullscreen-popup">
    <div class="lc-fixed-top">
      <van-nav-bar
        :title="actionName=='agree'?'同意':'终止'"
        :left-text="$t('close')"
        left-arrow
        fixed
        @click-left="closePopup"
      />
      <van-cell-group>
        <van-field
          v-model="opinion"
          :label="opinionLabel"
          type="textarea"
          placeholder="请输入意见"
          rows="6"
          autosize
        />
      </van-cell-group>
    </div>
    <lc-toolbar
      :actions="actions"
    />
  </van-popup>
</template>

<script>
import { completeBatch, stopProcess } from '@/api/platform/bpmn/action'
import LcToolbar from '@/components/LcToolbar'

export default {
  components: {
    LcToolbar
  },
  props: {
    value: Boolean,
    taskId: Array,
    bpmnInstId: String,
    actionName: String
  },
  data() {
    return {
      popup: false,
      opinionLabel: '意见',
      opinion: ''
    }
  },
  computed: {
    actions() {
      return [{
        'name': this.$t('common.button.' + this.actionName),
        'buttonType': 'primary',
        'callback': this.onSave
      }]
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
    },
    onSave(data) {
      if (this.actionName === 'agree') {
        completeBatch({
          'taskId': this.taskId.join(),
          'actionName': this.actionName,
          'opinion': this.opinion
        }).then(response => {
          this.closePopup()
          this.$toast.success(`批量审批同意成功！`)
          this.$emit('on-refresh')
        }).catch(error => {
          console.error(error.cause)
        })
      } else if (this.actionName === 'stop') {
        stopProcess({
          'taskId': this.taskId.join(),
          'endReason': this.opinion
        }).then(response => {
          this.closePopup()
          this.$toast.success(`批量停止流程成功！`)
          this.$emit('on-refresh')
        }).catch(error => {
          console.error(error.cause)
        })
      }
    }
  }

}
</script>
