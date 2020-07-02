<template>
  <van-popup slot="fr-ext" v-model="popup" class="lc-fullscreen-popup">
    <div class="lc-fixed-top">
      <van-nav-bar
        :title="'关单'"
        :left-text="$t('close')"
        left-arrow
        fixed
        @click-left="closePopup"
      />
      <van-cell-group
        v-if="(actionName==='agree'|| actionName==='oppose') &&(options.directHandlerSign === 'true' || options.directHandlerSign === true)"
      >
        <van-cell>
          <template slot="title">
            <span class="van-cell-text">
              直接处理
            </span>
            <van-icon name="question-circle" size="18px " @click="showWarnMessage" />
            <!-- <van-tag type="danger" @click="showWarnMessage">?</van-tag> -->
          </template>
          <van-switch v-model="checked" size="20px" />
        </van-cell>
      </van-cell-group>
      <van-cell-group>
        <van-field
          v-model="user.userName"
          clearable
          label="关单人"
          right-icon="question-o"
          readonly
        />
        <van-field
          v-model="remark"
          label="备注"
          type="textarea"
          rows="4"
          placeholder="请输入备注"
          required
        />
      </van-cell-group>

    </div>
    <lc-toolbar :actions="actions" />
    <common-words
      v-model="popup"
      :show="show"
      @close="close => show = close"
      @confirm="confirm"
    />
  </van-popup>
</template>

<script>
import Vue from 'vue'
import LcControl from '@/components/LcControl'
Vue.use(LcControl)
import { complete } from '@/api/platform/bpmn/action'
import { toAgree } from '@/api/platform/bpmn/bpmn'
import { closeBillList } from '@/api/platform/closeBill/closeBill'
import LcToolbar from '@/components/LcToolbar'
import commonWords from '@/components/CommonWords'
import fecha from '@/utils/fecha'

export default {
  inject: ['reload'],
  components: {
    LcToolbar,
    commonWords
  },
  props: {
    value: Boolean,
    taskId: String,
    bpmnInstId: String,
    data: [Object, String],
    actionName: String,
    version: Number,
    tWorkorderMaintain: []
  },
  data() {
    return {
      popup: false,
      opinionLabel: '',
      form: {
        data: [
        ],
        taskId: this.taskId,
        actionName: 'oppose',
        actionAlias: 'closeBill',
        opinion: '',
        backHandMode: 'direct',
        destination: '',
        version: 0,
        nodeUsers: []
      },
      options: {},
      path: [],
      user: [],
      userCheck: [],
      commonPath: [],
      commonUser: [],
      commonUserCheck: [],
      jumpOption: [],
      jumpType: 'common',
      jumpOptionShow: false,
      pathLabel: '路径',
      userLabel: '执行人',
      destination: '',
      checked: false,
      show: false,
      remark: '',
    }
  },
  computed: {
    actions() {
      if (!this.actionName) {
        return []
      }
      return [{
        'name': this.$t('common.button.closeBill'),
        'buttonType': 'primary',
        'callback': this.onSelect
      }]
    }
  },
  watch: {
    value() {
      this.user.userId = this.$store.getters.id
      this.user.userName = this.$store.getters.fullname
      this.popup = this.value
      if (this.popup) {
        this.form.opinion = ''
        // this.loadData()
        // this.loadComLanguage()
      }
    },
    jumpType() {
      if (this.$utils.isEmpty(this.jumpType)) {
        this.jumpType = 'common'
      }
      this.destination = ''
      if (this.jumpType === 'select') {
        this.initPath(this.options.outgoingNodes)
      } else if (this.jumpType === 'free') {
        this.initPath(this.options.allNodeDef)
      }
    },
    destination() {
      this.form.destination = this.destination
      if (this.jumpType === 'common') {
        this.commonPath = this.options.pathOutgoingNodes
        this.initCommonUser(this.options.pathOutgoingNodesUsersMap)
        this.commonUser = this.options.pathOutgoingNodesUsersMap
      } else if (this.jumpType === 'select') {
        this.initUser(this.options.outgoingNodesUsersMap)
      } else if (this.jumpType === 'free') {
        this.initUser(this.options.allNodeDefUsersMap)
      }
    },
    checked() {
      if (this.checked === 'true' || this.checked === true) {
        this.form.directHandlerSign = true
      } else {
        this.form.directHandlerSign = false
      }
    }
  },
  methods: {
    languageChange() {
      this.show = true
    },
    confirm(value) {
      this.form.opinion = value
    },
    closePopup() {
      this.$emit('input', false)
    },
    onSave(data) {
      if (!this.remark) {
        this.$dialog.alert({
          title: this.$t('common.dialog.warn'),
          message: `请输入备注！`
        })
        return
      }
      var params = {
        id: data.data.workorderId,
        data: JSON.stringify(
          data.data['t_workorder_close'] = [
            {
              'closeUser': this.user.userId,
              'closeRemark': this.remark,
              'workorderId': data.data.workorderId
            }
          ]
        )
      }
      closeBillList(params).then(response => {
        if (response.state === 200) {
          this.$toast.success(response.message)
          this.$router.replace({ path: '/bpmn-cust/pending-cust' })
        } else {
          this.$dialog.alert(response.message)
        }
      }).catch(error => {
        console.error(error.cause)
      })
    },
    loadData() {
      this.form.taskId = this.taskId
      this.form.actionName = this.actionName
      this.initOpinionLabel()
      // toAgree({
      //   taskId: this.taskId,
      //   actionName: this.actionName
      // }).then(response => {
      //   this.options = response.data
      //   this.initData()
      // }).catch(error => {
      //   console.error(error)
      // })
    },
    initOpinionLabel() {
      // 设置意见文本
      this.opinionLabel = '关单意见'
    },
    initData() {
      const options = this.options

      // 设置默认常用语
      if (options.defaultCommonStatment) {
        this.form.opinion = options.defaultCommonStatment.value
      }

      this.form.taskId = options.taskId
      this.form.actionName = 'oppose'

      // 还原数组，避免重新打开无限增加现象
      this.jumpOption = []
      if (options.jumpType.indexOf('common') !== -1) {
        this.jumpOption.push({ 'label': '正常跳转', 'value': 'common' })
      }
      if (options.jumpType.indexOf('select') !== -1) {
        this.jumpOption.push({ 'label': '选择路径跳转', 'value': 'select' })
      }
      if (options.jumpType.indexOf('free') !== -1) {
        this.jumpOption.push({ 'label': '自由跳转', 'value': 'free' })
      }

      if (this.jumpOption.length > 1) {
        this.jumpOptionShow = true
      }
      if (this.jumpType === 'common') {
        this.initCommonUser(options.pathOutgoingNodesUsersMap)
        this.commonPath = options.pathOutgoingNodes
        this.commonUser = options.pathOutgoingNodesUsersMap
      } else if (this.jumpType === 'select') {
        this.initPath(this.options.outgoingNodes)
      } else if (this.jumpType === 'free') {
        this.initPath(this.options.allNodeDef)
      }
    },
    onSelect(item) {
      const form = this.form
      form.data = this.data
      form.destination = this.destination
      form.version = this.version
      if (this.actionName === 'oppose') {
        form.nodeUsers = this.setNodeUsers()
      }

      this.onSave(this.form)
    },
    initPath(path) {
      this.path = []
      this.form.destination = ''
      for (var i = 0; i < path.length; i++) {
        this.path.push({ label: path[i].name, value: path[i].nodeId })
      }
    },
    initUser(users) {
      this.user = []
      this.userCheck = []
      if (this.$utils.isEmpty(this.destination)) return
      const temp = users[this.destination]
      for (var i = 0; i < temp.length; i++) {
        this.user.push({ label: temp[i].name, value: temp[i].id, 'type': temp[i].type })
        this.userCheck.push(temp[i].id)
      }
    },
    getIds(userArray) {
      if (this.$utils.isEmpty(userArray)) return
      const temp = []
      for (var i = 0; i < userArray.length; i++) {
        temp.push(userArray[i].id)
      }
      return temp
    },
    initCommonUser(data) {
      this.commonUserCheck = {}
      for (var variable in data) {
        this.commonUserCheck[variable] = this.getIds(data[variable])
      }
    },
    setNodeUsers() {
      const jumpType = this.jumpType ? this.jumpType : 'common'
      let userArray = []
      const nodeUsers = []
      let users = []
      let nodes = []
      let i = 0
      let j = 0
      if (jumpType === 'common') {
        users = this.options.pathOutgoingNodesUsersMap
        nodes = this.options.pathOutgoingNodes
        for (i = 0; i < nodes.length; i++) {
          userArray = []
          for (j = 0; j < users[nodes[i].nodeId].length; j++) {
            const user = users[nodes[i].nodeId][j]
            userArray.push({
              id: user.id,
              name: user.name,
              type: user.type,
              groupType: user.partyType || ''
            })
          }
          nodeUsers.push({
            jumpType: jumpType,
            nodeId: nodes[i].nodeId,
            executors: userArray
          })
        }
      } else {
        if (jumpType === 'select') {
          users = this.options.outgoingNodesUsersMap
        } else if (jumpType === 'free') {
          users = this.options.allNodeDefUsersMap
        }
        userArray = []
        for (i = 0; i < users[this.destination].length; i++) {
          const user = users[this.destination][i]
          userArray.push({
            id: user.id,
            name: user.name,
            type: user.type,
            groupType: user.partyType || ''
          })
        }
        nodeUsers.push({
          jumpType: jumpType,
          nodeId: this.destination,
          executors: userArray
        })
      }
      return JSON.stringify(nodeUsers)
    },
    showWarnMessage() {
      this.$dialog.alert({
        title: this.$t('common.dialog.warn'),
        message: `您拥有会签特权，可以对会签任务进行直接处理。`
      })
    }

  }

}
</script>
<style lang="scss">
.fields{
  .van-cell__title{
    max-width: 125px;
  }
}
</style>
