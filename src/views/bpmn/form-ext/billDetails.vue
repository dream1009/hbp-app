<template>
  <van-popup slot="fr-ext" v-model="popup" class="lc-fullscreen-popup">
    <div class="lc-fixed-top">
      <van-nav-bar
        :title="'开票详情'"
        :left-text="$t('close')"
        left-arrow
        fixed
        @click-left="closePopup"
      />
      <!--<van-cell-group>
        <van-cell>
          <template slot="title">
            <span class="van-cell-text">
              直接处理
            </span>
            <van-icon name="question-circle" size="18px " @click="showWarnMessage" />
            &lt;!&ndash; <van-tag type="danger" @click="showWarnMessage">?</van-tag> &ndash;&gt;
          </template>
          <van-switch v-model="checked" size="20px" />
        </van-cell>
      </van-cell-group>-->
      <van-cell-group>
        <van-field
          readonly
          clickable
          label="抬头类型"
          placeholder="请选择抬头类型"
          :value="headupType"
          @click="showPicker = true"
        />

        <van-popup v-model="showPicker" position="bottom">
          <van-picker
            show-toolbar
            :columns="headupTypeColumns"
            @cancel="showPicker = false"
            @confirm="clickPicker"
          />
        </van-popup>

        <van-popup
          v-model="show"
          round
          position="bottom"
          :style="{ height: '20%' }"
        />

        <van-field
          v-model="invoiceHeadup"
          clearable
          required
          label="发票抬头"
          right-icon="question-o"
          placeholder="请输入发票抬头"
        />

        <van-field
          v-show="isRadionShow"
          v-model="dutyParagraph"
          clearable
          required
          label="税号"
          right-icon="question-o"
          placeholder="请输入税号"
        />

        <van-field
          v-show="isRadionShow"
          v-model="openingbankAccount"
          clearable
          required
          label="开户行及账号"
          right-icon="question-o"
          placeholder="请输入及开户行账号"
        />

        <van-field
          v-model="address"
          clearable
          v-if="headupType==='企业单位'"
          required
          label="地址"
          right-icon="question-o"
          placeholder="请输入地址"
        />
        <van-field
          v-model="address"
          clearable
          v-else
          label="地址"
          right-icon="question-o"
          placeholder="请输入地址"
        />

        <van-field
          v-model="phone"
          clearable
          required
          type="tel"
          label="手机号"
          right-icon="question-o"
          placeholder="请输入请输入手机号"
        />

        <van-field
          v-model="price"
          clearable
          disabled
          label="总金额"
          right-icon="question-o"
        />

        <van-field
          v-model="workorderNo"
          clearable
          disabled
          label="工单编号"
          right-icon="question-o"
        />

        <van-field
          v-model="invoiceRemark"
          label="开票备注"
          clearable
          right-icon="question-o"
          placeholder="请输入开票备注"
        />
        <van-cell>
          <van-button type="primary" block @click="onSelect">开票</van-button>
        </van-cell>
      </van-cell-group>
      <!--<lc-toolbar :actions="actions" style="position: fixed;bottom: 0" />-->
    </div>
    <!--<lc-toolbar :actions="actions" style="position: fixed;bottom: 0" />-->
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
import commonWords from '@/components/CommonWords'
import { invoiceHandle } from '@/api/platform/invoice/invoice'
import { invoiceData } from '@/api/platform/revenue/revenue'

export default {
  inject: ['reload'],
  components: {
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
        actionName: 'agree',
        actionAlias: 'billDetails',
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
      headupTypeColumns: ['个人/非企业单位', '企业单位'],
      headupType: '个人/非企业单位',
      invoiceHeadup: '',
      dutyParagraph: '',
      openingbankAccount: '',
      address: '',
      phone: '',
      price: '',
      workorderNo: '',
      invoiceRemark: '',
      houseNo: '',
      userAddress: '',
      isRadionShow: false,
      showPicker: false,
      isDp: ''
    }
  },
  computed: {
    actions() {
      if (!this.actionName) {
        return []
      }
      return [{
        'name': '开票3',
        'buttonType': 'primary',
        'callback': this.onSelect
      }]
    }
  },
  watch: {
    isRadionShow(value) {
      if (!value) {
        this.dutyParagraph = ''
        this.openingbankAccount = ''
      }
    },
    value() {
      this.$data.price = this.data.price
      this.$data.workorderNo = this.data.workorderNo
      this.$data.phone = this.data.phone
      this.$data.address = this.data.userAddress
      const workorderNo = this.data.workorderNo
      if (workorderNo && !this.invoiceHeadup) {
        invoiceData({ 'workorderNo': workorderNo }).then(response => {
          if (response.data && response.data.length > 0) {
            const item = response.data[0]
            this.address = item.S_KaiPiaoDZ
            this.invoiceHeadup = item.S_KaiPiaoTT
            this.isDp = item.I_ISDP
            this.dutyParagraph = item.S_ZengZhiSH
            this.openingbankAccount = item.S_KaiPiaoHM
          }
        })
      }
      this.$data.userAddress = this.data.userAddress
      this.popup = this.value
      if (this.popup) {
        this.form.opinion = ''
        // this.loadData()
        // this.loadComLanguage()
      }
    }
  },
  methods: {
    clickPicker(value) {
      this.headupType = value
      if (value === '企业单位') {
        this.isRadionShow = true
      } else if (value === '个人/非企业单位') {
        this.isRadionShow = false
      }
      this.showPicker = false
    },
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
      const headupType = this.headupType
      const invoiceHeadup = this.invoiceHeadup
      const dutyParagraph = this.dutyParagraph
      const openingbankAccount = this.openingbankAccount
      const address = this.address
      const phone = this.phone
      const invoiceRemark = this.invoiceRemark
      if (headupType === '企业单位') {
        if (this.invoiceHeadup === '') {
          this.$dialog.alert({ message: '发票抬头不能为空!' })
          return
        } else if (this.dutyParagraph === '') {
          this.$dialog.alert({ message: '税号不能为空!' })
          return
        } else if (this.openingbankAccount === '') {
          this.$dialog.alert({ message: '开户行账号不能为空!' })
          return
        } else if (this.address === '') {
          this.$dialog.alert({ message: '地址不能为空!' })
          return
        } else if (this.phone === '') {
          this.$dialog.alert({ message: '手机号不能为空!' })
          return
        } else if (!(/^1[34578]\d{9}$/.test(this.phone))) {
          this.$dialog.alert({ message: '请正确输入手机号!' })
          return
        }
      } else if (headupType === '个人/非企业单位') {
        if (this.invoiceHeadup === '') {
          this.$dialog.alert({ message: '发票抬头不能为空!' })
          return
        } else if (this.phone === '') {
          this.$dialog.alert({ message: '手机号不能为空!' })
          return
        }
      }
      const fpdata = { 'type': '0', 'headupType': headupType, 'invoiceHeadup': invoiceHeadup, 'dutyParagraph': dutyParagraph, 'bankAccount': openingbankAccount, 'address': address, 'phone': phone, 'isDp': this.isDp,
        'paymentId': this.data.paymentId, 'invoiceRemark': invoiceRemark, 'workorderNo': this.data.workorderNo, 'workorderId': this.data.workorderId, 'price': this.data.price, 'kpuser': this.$store.getters.fullname }
      const params = { 'fpdata': JSON.stringify(fpdata) }
      console.log(JSON.stringify(fpdata))
      invoiceHandle(params).then(response => {
        if (response.state === 200) {
          const refoundee = data.data.refoundee
          data.data['buttonType'] = '开票详情'
          data.data = JSON.stringify({ 'buttonType': '开票详情', 'refoundee': refoundee })
          complete(data).then(response => {
            this.$emit('after-script', 'oppose')
            this.$store.dispatch('setDataChange', false)
            if (response.data) {
              this.$router.replace({
                name: 'bpmnForm',
                query: {
                  taskId: response.data
                }
              })
              this.reload()
            } else {
              this.$toast.success(`操作成功！`)
              this.$router.push({ path: '/bpmn-cust/pending-cust' })
            }
          }).catch(error => {
            console.error(error.cause)
          })
        } else {
          this.$dialog.alert({ message: response.message })
        }
      })
    },
    loadData() {
      this.form.taskId = this.taskId
      this.form.actionName = this.actionName
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
