<template>
  <van-popup slot="fr-ext" v-model="popup" class="lc-fullscreen-popup">
    <div class="lc-fixed-top">
      <van-nav-bar
        :left-text="$t('close')"
        title="终止流程"
        left-arrow
        fixed
        @click-left="closePopup"
      />
      <van-cell-group>
        <van-field
          v-model="opinion"
          type="textarea"
          placeholder="请输入意见"
          class="fields"
          rows="4"
          autosize
        >
          <template slot="label">
            意见
            <div>
              <van-button size="mini" plain type="primary" @click="onCommonStatment">常用语</van-button>
            </div>
          </template>
        </van-field>
      </van-cell-group>
    </div>
    <lc-toolbar
      :actions="actions"
    />
    <common-statment
      v-model="commonStatmentPopup"
      @confirm="handleCommonStatment"
    />
  </van-popup>
</template>

<script>
import { stopProcess } from '@/api/platform/bpmn/action'
import LcToolbar from '@/components/LcToolbar'
import CommonStatment from '@/components/CommonStatment'
export default {
  components: {
    LcToolbar,
    CommonStatment
  },
  props: {
    value: Boolean,
    taskId: String
  },
  data() {
    return {
      popup: false,
      opinion: '',
      actions: [{
        'name': this.$t('common.button.save'),
        'buttonType': 'primary',
        'callback': this.onSave
      }],
      commonStatmentPopup: false

    }
  },
  watch: {
    value() {
      this.popup = this.value
    }
  },
  methods: {
    onCommonStatment() {
      this.commonStatmentPopup = true
    },
    handleCommonStatment(data) {
      this.opinion = data
    },
    closePopup() {
      this.$emit('input', false)
    },
    onSave() {
      stopProcess({
        taskId: this.taskId,
        endReason: this.opinion
      }).then(response => {
        this.$store.dispatch('setDataChange', false)
        this.$toast.success(`终止流程成功！`)
        this.$router.push({ path: '/bpmn-cust/pending-cust' })
        this.$emit('after-script', 'endProcess')
      }).catch(error => {
        console.error(error.cause)
      })
    }
  }

}
</script>
