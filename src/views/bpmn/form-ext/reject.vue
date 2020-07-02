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
          v-model="form.opinion"
          v-validate="{ required: true}"
          :error="errors.has('opinion')"
          :error-message="errors.first('opinion')"
          class="fields"
          autocapitalize="off"
          autocorrect="off"
          type="textarea"
          placeholder="请输入意见"
          name="opinion"
          rows="4"
          autosize
          required
        >
          <template slot="label">
            意见
            <div>
              <van-button size="mini" plain type="primary" @click="onCommonStatment">常用语</van-button>
            </div>
          </template>
        </van-field>

        <van-lc-radio
          v-show="actionName==='reject'"
          v-model="rejectMode"
          :options="rejectOption"
          label="驳回方式"
          placeholder="请选择"
          clearable
          required
        />
        <van-lc-radio
          v-show="actionName==='reject'||actionName==='rejectToStart'"
          v-model="form.backHandMode"
          :options="backOption"
          label="返回方式"
          placeholder="请选择"
          clearable
          required
          @change="initNodeOption"
        />
        <van-lc-radio
          v-show="rejectMode=='rejectDest'"
          v-model="form.destination"
          :options="nodeOption"
          label="驳回到节点"
          placeholder="请选择"
          clearable
          required
        />
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
import Vue from 'vue'
import { complete } from '@/api/platform/bpmn/action'
import { toRejectToPrevious, toRejectToStart, toReject } from '@/api/platform/bpmn/bpmn'
import LcControl from '@/components/LcControl'
import LcToolbar from '@/components/LcToolbar'
Vue.use(LcControl)
import CommonStatment from '@/components/CommonStatment'
export default {
  inject: ['reload'],
  components: {
    LcToolbar,
    CommonStatment
  },
  props: {
    value: Boolean,
    taskId: String,
    actionName: String,
    data: [Object, String]
  },
  data() {
    return {
      title: '驳回',
      popup: false,
      form: {
        data: JSON.stringify(this.data),
        taskId: this.taskId,
        actionName: this.actionName,
        opinion: '',
        backHandMode: 'direct',
        destination: ''
      },
      rejectMode: 'reject',
      rejectOption: [{
        label: '驳回上一步',
        value: 'reject'
      }, {
        label: '驳回指定节点',
        value: 'rejectDest'
      }],
      backOption: [{
        label: '回到本节点',
        value: 'direct'
      }, {
        label: '按流程图执行',
        value: 'normal'
      }],
      nodeOption: [],
      responseData: {},
      actions: [{
        'name': this.$t('common.button.reject'),
        'buttonType': 'primary',
        'callback': this.onSave
      }],

      commonStatmentPopup: false
    }
  },
  watch: {
    value() {
      this.popup = this.value
      if (this.popup) {
        this.initData()
        this.loadData(this.actionName)
      }
    },
    rejectMode() {
      if (this.rejectMode === 'rejectDest') {
        this.initNodeOption()
      }
    },
    backHandMode() {
      this.initNodeOption()
    }
  },
  methods: {
    onCommonStatment() {
      this.commonStatmentPopup = true
    },
    handleCommonStatment(data) {
      this.form.opinion = data
    },
    closePopup() {
      this.$emit('input', false)
    },
    loadData(actionName) {
      if (actionName === 'rejectToPrevious') {
        this.title = '驳回上一步'
        toRejectToPrevious({
          taskId: this.taskId
        }).then(response => {
          this.initOpinion(response.data)
        }).catch(error => {
          console.error(error.cause)
        })
      } else if (actionName === 'rejectToStart') {
        this.title = '驳回发起人'
        toRejectToStart({
          taskId: this.taskId
        }).then(response => {
          this.initOpinion(response.data)
        }).catch(error => {
          console.error(error.cause)
        })
      } else if (actionName === 'reject') {
        this.title = '驳回'
        toReject({
          taskId: this.taskId
        }).then(response => {
          const data = response.data
          this.responseData = data
          this.initOpinion(data)
        }).catch(error => {
          console.error(error.cause)
        })
      }
    },
    onSave() {
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.complete()
        } else {
          var name = document.getElementsByName(this.errors.items[0].field)
          if (name) {
            name[0].focus()
          }
          this.$toast('表单未正确填写！')
        }
      })
    },
    complete() {
      if (this.actionName === 'rejectToPrevious') {
        this.form.actionName = 'reject'
      } else {
        this.form.actionName = this.actionName
      }
      this.form.data = JSON.stringify(this.data)
      complete(this.form).then(response => {
        this.$store.dispatch('setDataChange', false)
        this.$emit('after-script', this.actionName)
        if (response.data) {
          this.$router.replace({
            name: 'bpmnForm',
            query: {
              taskId: response.data
            }
          })
          this.reload()
        } else {
          this.$toast.success(`驳回成功！`)
          this.$router.push({ path: '/bpmn-cust/pending-cust' })
        }
      }).catch(error => {
        console.error(error.cause)
      })
    },
    onCancel() {
      this.show = false
    },
    // 初始化节点参数
    initNodeOption() {
      this.destination = ''
      var option = []
      var list
      if (this.backHandMode === 'direct') {
        list = this.responseData.bpmExecUserNode
      } else {
        list = this.responseData.bpmExecGoMapUserNode
      }
      if (list) {
        for (var j = 0; j < list.length; j++) {
          option.push({ 'label': list[j].name, 'value': list[j].nodeId })
        }
      }
      this.nodeOption = option
    },
    // 初始化还原参数
    initData() {
      this.opinion = ''
      this.rejectMode = 'reject'
      this.backHandMode = 'direct'
      this.destination = ''
    },
    // 设置默认常用语
    initOpinion(data) {
      if (data.defaultCommonStatment) {
        this.form.opinion = data.defaultCommonStatment.value
      }
    }
  }

}
</script>
