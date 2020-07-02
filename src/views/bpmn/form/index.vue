<template>
  <div>
    <van-tabs
      v-if="hasHistory"
      v-model="tabActive"
    >
      <van-tab title="表单详请">
        <!--表单-->
        <formrender
          ref="formrender"
          :form-def="formDef"
          :permissions="permissions"
          :data="formData"
          :buttons="buttons"
          :attributes="attributes"
          :readonly="readonly"
          :def-id="defId"
          :task-id="taskId"
          :bpmn-inst-id="instanceId||proInstId"
          :form-opinion-data="formOpinionData"
          @fr-ext="handleFrExt"
        />
      </van-tab>
      <van-tab title="审批历史">
        <approval-history
          :task-id="taskId"
          :bpmn-inst-id="instanceId||proInstId"
        />
      </van-tab>
      <van-tab v-if="hasFlowDiagram" title="流程图">
        <flow-diagram
          :def-id="defId"
          :task-id="taskId"
          :bpmn-inst-id="instanceId||proInstId"
        />
      </van-tab>
    </van-tabs>
    <div v-else>
      <!--没有意见的表单流程审批、启动或者草稿-->
      <formrender
        ref="formrender"
        :form-def="formDef"
        :permissions="permissions"
        :data="formData"
        :buttons="buttons"
        :attributes="attributes"
        :readonly="readonly"
        :def-id="defId"
        :task-id="taskId"
        :bpmn-inst-id="instanceId||proInstId"
        :form-opinion-data="formOpinionData"
        @fr-ext="handleFrExt"
      />
    </div>
    <!---流程图-->
    <diagram-popup
      v-model="flowDiagramPopup"
      :def-id="defId"
      :task-id="taskId"
      :bpmn-inst-id="instanceId||proInstId"
    />
    <!---审批历史-->
    <history-popup
      v-model="approvalHistoryPopup"
      :def-id="defId"
      :task-id="taskId"
      :bpmn-inst-id="instanceId||proInstId"
    />
    <stop-popup
      v-model="stopOpinionPopup"
      :task-id="taskId"
      @after-script="afterScript"
    />
    <agree-popup
      v-model="agreeOpinionPopup"
      :task-id="taskId"
      :action-name="actionName"
      :data="submitFormData"
      :version="version"
      @after-script="afterScript"
    />
    <chargeback-popup
      v-model="chargebackOpinionPopup"
      :task-id="taskId"
      :action-name="actionName"
      :data="submitFormData"
      :version="version"
      @after-script="afterScript"
    />
    <reject-popup
      v-model="rejectOpinionPopup"
      :task-id="taskId"
      :action-name="actionName"
      :data="submitFormData"
      :version="version"
      @after-script="afterScript"
    />
    <delegate-popup
      v-model="delegatePopup"
      :task-id="taskId"
    />
    <add-sign-task-popup
      v-model="addSignTaskPopup"
      :task-id="taskId"
    />
    <qrcode-popup
      ref="play"
      :task-id="taskId"
      :data="formData"
      :data-def="formDef"
      @changeShowQrcode="changeShowQrcode"
    />
    <billDetails-popup
      v-model="billDetailsOpinionPopup"
      :task-id="taskId"
      :action-name="actionName"
      :data="submitFormData"
      :version="version"
      @after-script="afterScript"
    />
    <rejectBill-popup
      v-model="rejectBillOpinionPopup"
      :task-id="taskId"
      :action-name="actionName"
      :data="submitFormData"
      :version="version"
      @after-script="afterScript"
    />
    <closeBill-popup
      v-model="closeBillOpinionPopup"
      :task-id="taskId"
      :action-name="actionName"
      :data="submitFormData"
      :version="version"
      @after-script="afterScript"
    />

    <!-- fr-toolbar  表单操作按钮-->
    <slot v-if="instanceId&&isNeedPrint()" name="fr-toolbar">
      <div class="lc-toolbar">
        <ul class="lc-toolbar-group">
          <li class="lc-toolbar-item van-hairline--right">
            <van-button type="primary" :plain="true" @click="bluetoothPrinter()">
              <van-icon name="fa fa-lock" />
              <span>蓝牙打印</span>
            </van-button>
          </li>
        </ul>
      </div>
    </slot>
    <slot ref="frExt" name="fr-ext" />
  </div>
</template>
<script>

import Formrender from '@/components/Formrender'
import BpmnButton from './button.js'
import ApprovalHistory from '@/components/Bpmn/approval-history'
import FlowDiagram from '@/components/Bpmn/flow-diagram'
import DiagramPopup from '../form-ext/diagram'
import HistoryPopup from '../form-ext/history'
import StopPopup from '../form-ext/stop'
import AgreePopup from '../form-ext/agree'
import RejectPopup from '../form-ext/reject'
import DelegatePopup from '../form-ext/delegate'
import AddSignTaskPopup from '../form-ext/addSignTask'
import ChargebackPopup from '../form-ext/chargeback'
import CloseBillPopup from '../form-ext/closeBill'
import RejectBillPopup from '../form-ext/rejectBill'
import JForm from '@/components/utils/JForm'// 自定义脚本
import routeLeave from '@/mixins/routeLeave'// 表单未保存提示
import QrcodePopup from '@/components/Qrcode/index'
import BillDetailsPopup from '../form-ext/billDetails'
import { getTaskFormData, getInstFormData, getFormDataForInst ,getInstFormBykey} from '@/api/platform/bpmn/bpmn'
import { complete } from '@/api/platform/bpmn/action'

export default {
  inject: ['reload'],
  name: 'FormDetail',
  components: {
    Formrender,
    ApprovalHistory,
    FlowDiagram,
    DiagramPopup,
    HistoryPopup,
    StopPopup,
    AgreePopup,
    RejectPopup,
    DelegatePopup,
    AddSignTaskPopup,
    ChargebackPopup,
    QrcodePopup,
    BillDetailsPopup,
    CloseBillPopup,
    RejectBillPopup
  },
  mixins: [routeLeave],
  data() {
    return {
      btn: [],
      title: '',
      tabActive: 0,
      hasHistory: true,
      // 流程参数
      taskId: '',
      defId: '',
      proInstId: '',
      instanceId: '',
      bizKey:'',
      formDef: {}, // 表单信息
      permissions: {}, // 表单权限
      formData: {}, // 表单数据
      buttons: [], // 操作按钮
      version: 0, // 版本号
      attributes: {}, // 表单属性，用于部分控件设置
      readonly: false, // 是否只读
      approvalHistoryPopup: false,
      flowDiagramPopup: false,
      hasFlowDiagram: false,
      stopOpinionPopup: false,
      agreeOpinionPopup: false,
      rejectOpinionPopup: false,
      delegatePopup: false,
      addSignTaskPopup: false,
      chargebackOpinionPopup: false,
      billDetailsOpinionPopup: false,
      closeBillOpinionPopup: false,
      rejectBillOpinionPopup: false,
      actionName: '',
      actionLabel: '',
      submitFormData: '',
      formOpinionData: {},
      showQrcode: true,
      needPrintForm: ['smfw', 'cqcb-xq', 'hb', 'zb', 'cb']
    }
  },
  created() {
    const query = this.$route.query
    this.defId = query.defId // 流程定义
    this.proInstId = query.proInstId // 草稿启动的流程实例id
    this.taskId = query.taskId//  任务ID
    this.instanceId = query.instanceId// 任务实例ID
    this.bizKey = query.bizKey //流程关联业务表单id
    this.nodeId = query.nodeId// 任务实例ID

    this.title = this.$route.params.title || ''// 标题
    this.btn = this.$route.params.btn || ''// 页面类型
    this.loadData()
  },
  mounted() {
    JForm._init(this)
  },
  methods: {
    loadData() {
      // 处理流程任务【待办】
      if (this.$utils.isNotEmpty(this.taskId)) {
        this.getTaskFormData()
      // 启动 或者草稿流程【新建流程、草稿】
      } else if (this.$utils.isNotEmpty(this.proInstId) || this.$utils.isNotEmpty(this.defId)) {
        this.getFormDataForInst()
      } else if(this.$utils.isNotEmpty(this.bizKey)){
        this.getInstFormDataByBizKey();
      }else {
      // 流程实例
        this.getInstFormData()
      }
    },
    /**
     * 获取流程任务表单
     */
    getTaskFormData() {
      this.hasHistory = false
      getTaskFormData({ taskId: this.taskId }).then(response => {
        const taskId = response.variables.taskId
        const instId = response.variables.instId
        if (taskId) {
          this.taskId = taskId
          this.getTaskFormData()
          return
        }
        if (instId) {
          this.instanceId = instId
          this.getInstFormData()
          return
        }
        this.setFormData(response.data)
      }).catch((e) => {
        console.error(e)
        this.$store.dispatch('setDataChange', false)
      })
    },
    /**
     * 启动 或者草稿流程
     */
    getFormDataForInst() {
      this.hasHistory = false
      getFormDataForInst({ defId: this.defId, proInstId: this.proInstId || '' }).then(response => {
        this.setFormData(response.data)
      }).catch((e) => {
        console.error(e)
        this.$store.dispatch('setDataChange', false)
      })
    },
    /**
     * 查看流程实例
     */
    getInstFormData() {
      this.readonly = true
      this.hasFlowDiagram = true
      getInstFormData({ bpmInstId: this.instanceId }).then(response => {
        this.setFormData(response.data)
      }).catch((e) => {
        console.error(e)
        this.$store.dispatch('setDataChange', false)
      })
    },
    /**
     * 查看流程实例
     */
    getInstFormDataByBizKey() {
      this.readonly = true
      this.hasFlowDiagram = true
      getInstFormBykey({ bizId: this.bizKey }).then(response => {
        this.setFormData(response.data)
        this.instanceId = response.data.bpmInstId;
      }).catch((e) => {
        console.error(e)
        this.$store.dispatch('setDataChange', false)
      })
    },
    setFormData(data) {
      if (this.$utils.isEmpty(data)) {
        this.$dialog.alert({
          message: `<div class="lc-error-messsage">未获取到数据</div>`
        }).then(() => {
          this.$router.go(-1)
        })
        return
      }
      // 判断是否设置表单
      if (this.$utils.isEmpty(data.formModel)) {
        this.$dialog.alert({
          message: `<div class="lc-error-messsage">未设置表单,请流程定义中设置表单</div>`
        }).then(() => {
          this.$router.go(-1)
        })
        return
      }

      this.title = this.$utils.isEmpty(this.title) ? data.title : this.title

      // 表单定义
      this.formDef = this.$utils.parseData(data.formModel.formData) || {}

      // 表单数据
      this.formData = this.$utils.parseData(data.boData) || {}

      // 表单权限
      this.permissions = this.$utils.parseData(data.permissions) || {}
      // 操作按钮
      this.buttons = this.readonly ? [] : this.getButtons(data.buttons, this.getParams(data)) || []
      // 版本号
      this.version = data.version
      // 属性
      this.attributes = data.attributes
      // 表单意见数据
      this.formOpinionData = this.handleOpinionData(data.attributes)

      // 设置标题
      this.$store.dispatch('setTitle', this.title)
      // 设置数据是否改变
      this.$store.dispatch('setDataChange', false)
    },
    getParams(data) {
      var attributes = data.attributes || {}
      return {
        title: this.title,
        defId: this.defId,
        proInstId: this.proInstId,
        taskId: this.taskId,
        nodeId: this.nodeId,
        lockUser: attributes.lockUser,
        curUserId: attributes.curUserId,
        suspendState: attributes.suspendState,
        printTemplateId: data.formModel.templateId,
        version: data.version,
        firstNodeUserAssign: attributes.firstNodeUserAssign
      }
    },
    getButtons(buttons, params) {
      if (this.$utils.isEmpty(buttons)) { return null }
      // let btns = buttons
      // if (this.btn.length > 0) {
      //   btns = this.btn
      // }
      const btn = new BpmnButton({
        buttons: buttons,
        params: params
      })
      return btn.response_buttons
    },
    getFormData() {
      return this.$refs.formrender.getFormData()
    },
    getFormOpinionData() {
      return this.$refs.formrender.getFormOpinionData()
    },
    hasFormOpinion() {
      return this.$refs.formrender.hasFormOpinion()
    },
    handleOpinionData(attrs) {
      const opinionData = {}
      if (this.$utils.isEmpty(attrs)) { return opinionData }
      let opinionList = attrs.opinionList || []
      const formOpinion = attrs.formOpinion || {}
      if (this.$utils.isEmpty(opinionList)) { return opinionData }
      opinionList = this.handleOpinionList(opinionList)

      if (this.$utils.isEmpty(formOpinion)) { // 没有绑定节点的
        opinionData.hasNode = false
        opinionData.opinionList = opinionList
      } else {
        const opinionMap = {}
        for (var i = 0; i < opinionList.length; i++) {
          const opinion = opinionList[i]
          const nodeId = 	opinion.taskKey
          const opinionMapList = opinionMap[nodeId]
          if (this.$utils.isEmpty(opinionMapList)) {
            opinionMap[nodeId] = []
          }
          opinionMap[nodeId].push(opinion)
        }

        const formOpinionData = {}
        for (var k in formOpinion) {
          formOpinionData[k] = opinionMap[formOpinion[k]]
        }
        opinionData.hasNode = true
        opinionData.formOpinionData = formOpinionData
        opinionData.formOpinionConfig = formOpinion
        opinionData.opinionList = opinionList
      }
      return opinionData
    },
    handleOpinionList(opinionList) {
      const list = []
      opinionList.forEach(opinion => {
        if (this.$utils.isNotEmpty(opinion.completeTime)) { list.push(opinion) }
      })
      return list
    },
    /**
     * 处理扩展
     */
    handleFrExt(action) {
      switch (action) {
        case 'play':
          this.$refs.play.updateQrcode()
          break
        case 'flowDiagram':
          this.flowDiagramPopup = true
          break
        case 'approvalHistory':
          this.approvalHistoryPopup = true
          break
        case 'stopProcess':
          this.stopOpinionPopup = true
          break
        case 'agree':
        case 'oppose':
        case 'abandon':
          this.submitFormData = this.getFormData()
          this.agreeOpinionPopup = true
          this.actionName = action
          break
        case 'rejectToPrevious':
        case 'rejectToStart':
        case 'reject':
          this.submitFormData = this.getFormData()
          this.rejectOpinionPopup = true
          this.actionName = action
          break
        case 'delegate':
          this.delegatePopup = true
          break
        case 'addSign':
          this.addSignTaskPopup = true
          break
        case 'chargeback':
          this.submitFormData = this.getFormData()
          this.chargebackOpinionPopup = true
          this.actionName = 'chargeback'
          break
        case 'billDetails':
          this.submitFormData = this.getFormData()
          this.billDetailsOpinionPopup = true
          this.actionName = 'billDetails'
          break
        case 'rejectBill':
          this.submitFormData = this.getFormData()
          this.rejectBillOpinionPopup = true
          this.actionName = 'rejectBill'
          break
        case 'closeBill':
          this.submitFormData = this.getFormData()
          this.closeBillOpinionPopup = true
          this.actionName = 'closeBill'
          break
        default:
          break
      }
    },
    afterScript(action) {
      if (!this.$refs.formrender.hasScript) return
      const afterSubmitResult = JForm._afterSubmit(this, action, this.getFormData())
      if (typeof (afterSubmitResult) !== 'undefined' && !afterSubmitResult) {
        return
      }
    },
    changeShowQrcode(param) {
      this.showQrcode = param
    },
    isNeedPrint() {
      return this.needPrintForm.indexOf(this.formDef.key) > -1
    },
    bluetoothPrinter() {
      const _this = this
      this.$bridge.registerHandler('bluetoothRefresh', function(data, responseCallback) {
        _this.reload()
      })
      const params = {
        type: '2',
        id: this.formData.workorderId
      }
      const dataParams = JSON.stringify(params)
      this.$bridge.callHandler('bluetoothPrint', dataParams, (callbackData) => {
        const data = {}
        this.formData.buttonType = '蓝牙打印'
        data.actionAlias = 'bluetoothPrinter'
        data.actionName = 'agree'
        data.taskId = this.taskId
        data.data = JSON.stringify(this.formData)
        const _this = this
        complete(data).then(response => {
          _this.$emit('after-script', data.actionName)
          _this.$store.dispatch('setDataChange', false)
          if (response.data) {
            _this.$router.replace({
              name: 'bpmnForm',
              query: {
                taskId: response.data
              }
            })
            _this.reload()
          } else {
            _this.$toast.success('操作完成')
            _this.$router.push({ path: '/bpmn-cust/pending-cust' })
          }
        }).catch(error => {
          console.error(error.cause)
        })
      })
    }
  }
}
</script>
