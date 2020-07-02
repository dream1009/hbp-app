import _ from 'lodash'
import Utils from '@/utils'
import FormrenderResponseButton from '@/components/Formrender/button'
import JForm from '@/components/utils/JForm'// 自定义脚本
import { startFlow, saveDraft, lock, unlock, suspendProcess, recoverProcess, complete } from '@/api/platform/bpmn/action'
import { payToQRCode, insertLogByXJ } from '@/api/platform/gathering/gathering'
import { refound } from '@/api/platform/refound/refound'
import { chaibiaoHT, huanbiaoHT, zhuangbiaoHT, yibiaoHT, chaibiaoVerify, huanbiaoVerify, updateDataByBusKeyAndValue, waterMeterBack, checkIdCard, peopleBack, waterNatureHT, createBill, queryWaterMeterState } from '@/api/platform/revenue/revenue'
import { queryChargeState, batchStartCustomizeProcess } from '@/api/platform/operate/operate'
import { getData } from '@/api/platform/identity'
import { outStock, cancelStock, verifyReceProcess, signature } from '@/api/platform/materiel/index'
import { startCustomizeProcess, completeProcess } from '@/api/platform/common/index'
import fecha from '@/utils/fecha'
import { operateRedirect } from '@/utils/redirect'

var BpmnButton
window.BpmnButton = BpmnButton = function(options) {
  this.response_buttons = []
  this.initButtons(options)
}

BpmnButton.prototype = {
  initButtons: function(options) {
    var __isSuper = false
    var buttons = options.buttons
    var params = options.params
    var lockUser = params.lockUser
    var suspendState = params.suspendState
    var __currentUserId = params.curUserId
    for (var i = 0; i < buttons.length; i++) {
      var rf = buttons[i]
      rf.alias = rf[BpmnButton.key.BUTTON_TYPE]
      rf.label = rf[BpmnButton.key.LABEL]
      if (rf.alias === 'lock' && lockUser !== '') { // 锁定
        continue
      }
      if (rf.alias === 'unlock' && (lockUser === '' || lockUser !== __currentUserId)) { // 解锁
        continue
      }
      if (rf.alias === 'forceUnlock' && (__isSuper === false || __isSuper === 'false' || lockUser === '')) { // 强制解锁
        continue
      }
      // if (rf.alias === 'delegate') { // 转办
      //   continue
      // }

      if ((rf.alias === 'suspendProcess' && suspendState === '2') || // 挂起
        (rf.alias === 'recoverProcess' && suspendState === '1')) { // 恢复
        continue
      }
      // rf.alias === 'custom' || // TODO 屏蔽-自定义
      if (
        rf.alias === 'saveDraft' || // 保存草稿
        rf.alias === 'flowImage' || // 流程图
        rf.alias === 'print' || //  TODO 屏蔽-打印
        rf.alias === 'startCommu' || // 屏蔽-沟通
        rf.alias === 'commu' || // 屏蔽-沟通
        rf.alias === 'startTrans' || // 屏蔽-流转
        rf.alias === 'agreeTrans' || // 屏蔽-同意流转
        rf.alias === 'opposeTrans') { // 屏蔽-反对流转
        continue
      }

      var button = new BpmnButton.Models['ResponseButton' + (_.upperFirst(rf.alias))](rf, params)
      // 初始化按钮事件
      this.response_buttons.push(button)
    }
    /* if (window.location.href.indexOf('/bpmn/form?defId=') < 0) {
      // 添加暂存按钮
      const save = { alias: 'custom', code: 'saveTemp', label: '暂存', name: '暂存' }
      const saveTemp = new BpmnButton.Models['ResponseButton' + (_.upperFirst(save.alias))](save, params)
      this.response_buttons.push(saveTemp)
    }*/
  }
}

BpmnButton.Models = {}
BpmnButton.BUTTON_TYPES = ['close', 'startFlow', 'lock', 'unlock', 'forceUnlock', 'agree', 'oppose', 'abandon', 'saveDraft', 'reject', 'endProcess', 'delegate', 'addSign', 'startCommu', 'commu', 'startTrans', 'flowImage', 'approvalHistory', 'opposeTrans', 'agreeTrans', 'suspendProcess', 'recoverProcess', 'print', 'rejectToStart', 'revoke', 'instanceDetail', 'custom']
BpmnButton.key = {
  BUTTON_TYPE: 'alias',
  LABEL: 'name'
}

BpmnButton.VERSION = '2.0.0'

// 表单按钮

BpmnButton.Models.ResponseButton = FormrenderResponseButton.extend({
  style: 'primary',
  plain: true,
  aliasKey: BpmnButton.key.BUTTON_TYPE,
  getTitle: function() {
    return this.get('title') || ''
  },
  getProInstId: function() {
    return this.get('proInstId')
  },
  getDefId: function() {
    return this.get('defId')
  },
  // 版本号
  getVersion: function() {
    return this.get('version')
  },
  getFormKey: function() {
    return this.get('formKey')
  },
  getTaskId: function() {
    return this.get('taskId')
  },
  getNodeId: function() {
    return this.get('nodeId')
  },
  getLockUser: function() {
    return this.get('lockUser')
  },
  getUserAssign: function() {
    return this.get('userAssign')
  },
  isDraft: function() {
    return Utils.isNotEmpty(this.getProInstId())
  },
  isCreateInstance: function() {
    return Utils.isEmpty(this.getTaskId())
  },
  isHideOpinion: function() {
    return this.toBoolean(this.getOptions('isHideOpinion'))
  },
  isHiddenDelegate: function() {
    return this.toBoolean(this.getOptions('isHiddenDelegate'))
  },
  isHidePath: function() {
    return this.toBoolean(this.getOptions('isHidePath'))
  },
  isCommonJumpType: function() {
    return this.toBoolean(this.getOptions('isCommonJumpType'))
  },
  isFirstNodeUserAssign: function() {
    return this.toBoolean(this.getOptions('firstNodeUserAssign'))
  },
  isEnd: function() {
    return this.toBoolean(this.getOptions('isEnd'))
  },
  isHide: function() {
    return (this.isCommonJumpType() && this.isHideOpinion() && this.isHidePath()) ||
      (this.isEnd() && this.isHideOpinion())
  },
  toBoolean: function(val) {
    return val && (val === true || val === 'true')
  },
  afterScript(btn, formData, hasScript) {
    if (!hasScript) return
    const afterSubmitResult = JForm._afterSubmit(this, btn.getAlias(), formData)
    if (typeof (afterSubmitResult) !== 'undefined' && !afterSubmitResult) {
      return
    }
  }
})

/**
 * 启动流程
 */
BpmnButton.Models.ResponseButtonStartFlow = BpmnButton.Models.ResponseButton.extend({
  icon: 'play',
  action(btn) {
    // 表单数据
    const formData = this.getFormData()
    //  console.info(formData)
    // 验证表单是否正确
    this.getFormValidator().then((results) => {
      const result = results.every((r) => r)
      if (result) {
        // 表单提交校验
        const formSubmitVerify = this.getFormSubmitVerify()
        if (this.$utils.isNotEmpty(formSubmitVerify)) {
          return this.$toast(formSubmitVerify.msg)
        }
        // 考虑换表需要实现自定义启动流程，所以不能使用系统自带的启动流程。
        if (btn.options.title === '换表' && (btn.options.defId === '647016677174673408' || btn.options.defId === '636976175440199680')) {
          const _this = this
          const bpmnSetText = [
            {
              defId: '647016677174673408',
              flowKey: 'Process_0pckn02_singleb',
              skipFirstNode: true,
              form: formData
            }
          ]
          const groupDes = formData.groupDes
          if (groupDes && (groupDes === '3' || groupDes === '4')) {
            const formDatas = {}
            formDatas.groupDes = groupDes
            formDatas.formCopy = [
              {
                workorderType: '8',
                workorderNo: formData.workorderNo,
                formId: '665154697228713984',
                isChangeUniqueForBizKey: false,
                tag: 0
              },
              {
                workorderType: '34',
                workorderNo: formData.workorderNo,
                formId: '666939959734697984',
                isChangeUniqueForBizKey: true,
                tag: 0
              },
              {
                workorderType: '34',
                workorderNo: formData.workorderNo,
                formId: '667020372582858752',
                isChangeUniqueForBizKey: true,
                tag: 0
              },
              {
                workorderType: '34',
                workorderNo: formData.workorderNo,
                formId: '675391004374728704',
                isChangeUniqueForBizKey: true,
                tag: 0
              }
            ]
            formDatas.script = [
              {
                scriptContent: 'hbpScript.updateMaterialWorkorderAddress(BIZ_KEY)'
              }
            ]
            // bpmnSetText.push({
            //   defId: '666204695865327616',
            //   flowKey: 'Process_20n95f5',
            //   skipFirstNode: false,
            //   form: formDatas
            // })
            let requisitionNo = ''
            getData({ alias: 'ckdh' }).then(response => {
              requisitionNo = response.data.id
              formDatas.requisitionNo = requisitionNo
              const dataParams = {
                bpmnSetText: JSON.stringify(bpmnSetText)
              }
              startCustomizeProcess(dataParams).then(response => {
                const state = response.state
                if (state != 200) {
                  this.$dialog.alert({ message: response.message })
                } else {
                  _this.$toast.success(response.message)
                  _this.$store.dispatch('setDataChange', false)
                  // _this.$router.replace({ path: '/bpmn-cust/pending-cust' })
                  operateRedirect(_this)
                }
              }).catch(error => {
                console.error(error.cause)
              })
            }).catch(error => {
              console.error(error.cause)
              return
            })
            return
          }
        }
        // 保存数据
        btn.saveData.apply(this, [btn, formData])
      } else {
        this.formErrorToast()
      }
    })
  },
  // 保存数据
  saveData(btn, formData) {
    const jsonData = {
      bpmnDefId: btn.getDefId(),
      //  nodeUsers: this.getUserAssign() || '', // 需要传入
      version: btn.getVersion(),
      proInstId: btn.getProInstId(),
      data: JSON.stringify(formData)
    }

    // 1、直接启动
    startFlow(jsonData).then(response => {
      const title = btn.getTitle()
      this.$toast.success(`启动${title}成功！`)
      this.$store.dispatch('setDataChange', false)
      // const path = btn.isDraft() ? 'myDraft' : 'newProcess'
      btn.afterScript(btn, this.getFormData(), this.hasScript())
      if (response.data.taskId) {
        this.$router.replace({
          name: 'bpmnForm',
          query: {
            taskId: response.data.taskId
          }
        })
        this.reload()
      } else {
        const path = btn.isDraft() ? 'myDraft' : 'newProcess'
        // this.$router.push({ path: `/bpmn/${path}` })
        operateRedirect(this, `/bpmn/${path}`)
      }
      // this.$router.push({ path: `/bpmn/${path}` })
    })
  }
})
// 保存草稿
BpmnButton.Models.ResponseButtonSaveDraft = BpmnButton.Models.ResponseButton.extend({
  icon: 'save',
  action(btn) {
    // 表单数据
    const formData = this.getFormData()
    const jsonData = {
      bpmnDefId: btn.getDefId(),
      version: btn.getVersion(),
      data: JSON.stringify(formData)
    }
    if (this.$utils.isNotEmpty(btn.getProInstId())) {
      jsonData.proInstId = btn.getProInstId()
    }

    // 验证表单是否正确
    this.getFormValidator().then((results) => {
      const result = results.every((r) => r)
      if (result) {
        saveDraft(jsonData).then(response => {
          btn.afterScript(btn, this.getFormData(), this.hasScript())
          this.$store.dispatch('setDataChange', false)
          const title = btn.getTitle()
          this.$toast.success(`保存${title}成功！`)
          const path = btn.isDraft() ? 'myDraft' : 'newProcess'
          this.$router.push({ path: `/bpmn/${path}` })
        })
      } else {
        this.formErrorToast()
      }
    })
  }
})

// 锁定
BpmnButton.Models.ResponseButtonLock = BpmnButton.Models.ResponseButton.extend({
  icon: 'lock-fill',
  action(btn) {
    const taskId = btn.getTaskId()
    lock({ taskId: taskId }).then(response => {
      btn.afterScript(btn, this.getFormData(), this.hasScript())
      this.$store.dispatch('setDataChange', false)

      const title = btn.getTitle()
      this.$toast.success(`锁定${title}成功！`)
      setTimeout(() => {
        this.$utils.reload()
      }, 2000)
    })
  }
})

// 解锁
BpmnButton.Models.ResponseButtonUnlock = BpmnButton.Models.ResponseButton.extend({
  icon: 'unlock-fill',
  action(btn) {
    const taskId = btn.getTaskId()
    unlock({ taskId: taskId }).then(response => {
      btn.afterScript(btn, this.getFormData(), this.hasScript())
      this.$store.dispatch('setDataChange', false)

      const title = btn.getTitle()
      this.$toast.success(`解锁${title}成功！`)
      setTimeout(() => {
        this.$utils.reload()
      }, 2000)
    })
  }
})
// 强制解锁
BpmnButton.Models.ResponseButtonForceUnlock = BpmnButton.Models.ResponseButton.extend({
  icon: 'unlock-fill',
  action(btn) {
    const taskId = btn.getTaskId()
    unlock({ taskId: taskId }).then(response => {
      btn.afterScript(btn, this.getFormData(), this.hasScript())
      this.$store.dispatch('setDataChange', false)

      const title = btn.getTitle()
      this.$toast.success(`强制解锁${title}成功！`)
      setTimeout(() => {
        this.$utils.reload()
      }, 2000)
    })
  }
})

/**
 * 流程任务相关操作
 */
BpmnButton.Models.ResponseButtonTaskOperate = BpmnButton.Models.ResponseButton.extend({
  /**
   * 获取流程任务相关参数
   */
  getTaskParams: function(actionName, btn) {
    const hasFormOpinion = this.hasFormOpinion()
    const opinion = hasFormOpinion ? this.getFormOpinionData() : ''

    return {
      actionName: actionName,
      hasFormOpinion: hasFormOpinion,
      opinion: opinion,
      taskId: btn.getTaskId(),
      defId: btn.getDefId(),
      version: btn.getVersion(),
      data: JSON.stringify(this.getFormData())
    }
  },
  /**
   * 处理表单action 的数据
   */
  handleAction(actionName, btn) {
    // 验证表单是否正确
    this.getFormValidator().then((results) => {
      const result = results.every((r) => r)
      if (result) {
        // 表单提交校验
        const formSubmitVerify = this.getFormSubmitVerify()
        if (this.$utils.isNotEmpty(formSubmitVerify)) {
          return this.$toast(formSubmitVerify.msg)
        }
        const hasFormOpinion = this.hasFormOpinion()
        if (btn.isHide() || hasFormOpinion) { // 隐藏表单意见
          const params = btn.getTaskParams.apply(this, [actionName, btn])
          complete(params).then(response => {
            this.$emit('after-script', actionName)
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
              // this.$router.push({ path: '/bpmn-cust/pending-cust' })
              operateRedirect(this)
            }
          }).catch(error => {
            console.error(error.cause)
          })
        } else {
          this.emitFrExt(actionName)
        }
      } else {
        this.formErrorToast()
      }
    })
  }
})

// 同意
BpmnButton.Models.ResponseButtonAgree = BpmnButton.Models.ResponseButtonTaskOperate.extend({
  icon: 'passed',
  action(btn) {
    btn.handleAction.apply(this, ['agree', btn])
  }
})
// 反对
BpmnButton.Models.ResponseButtonOppose = BpmnButton.Models.ResponseButtonTaskOperate.extend({
  icon: 'stop',
  action(btn) {
    btn.handleAction.apply(this, ['oppose', btn])
  }
})

// 弃权
BpmnButton.Models.ResponseButtonAbandon = BpmnButton.Models.ResponseButtonTaskOperate.extend({
  icon: 'close-square',
  action(btn) {
    btn.handleAction.apply(this, ['abandon', btn])
  }
})

// 驳回
BpmnButton.Models.ResponseButtonReject = BpmnButton.Models.ResponseButton.extend({
  icon: 'undo',
  action() {
    this.emitFrExt('reject')
  }
})
// 驳回发起人
BpmnButton.Models.ResponseButtonRejectToStart = BpmnButton.Models.ResponseButton.extend({
  icon: 'login',
  action() {
    this.emitFrExt('rejectToStart')
  }
})
// 驳回上一步
BpmnButton.Models.ResponseButtonRejectToPrevious = BpmnButton.Models.ResponseButton.extend({
  icon: 'left-circle',
  action() {
    this.emitFrExt('rejectToPrevious')
  }
})
// 终止流程
BpmnButton.Models.ResponseButtonEndProcess = BpmnButton.Models.ResponseButton.extend({
  icon: 'stop',
  action() {
    this.emitFrExt('stopProcess')
  }
})
// 转办
BpmnButton.Models.ResponseButtonDelegate = BpmnButton.Models.ResponseButton.extend({
  icon: 'filesync',
  action() {
    this.emitFrExt('delegate')
  }
})

// 补签
BpmnButton.Models.ResponseButtonAddSign = BpmnButton.Models.ResponseButton.extend({
  icon: 'addteam',
  action() {
    this.emitFrExt('addSign')
  }
})

// 开始沟通
BpmnButton.Models.ResponseButtonStartCommu = BpmnButton.Models.ResponseButton.extend({
  icon: 'message',
  action() {

  }
})
// 开始流转
BpmnButton.Models.ResponseButtonStartTrans = BpmnButton.Models.ResponseButton.extend({
  icon: 'issuesclose',
  action() {

  }
})
// 沟通
BpmnButton.Models.ResponseButtonCommu = BpmnButton.Models.ResponseButton.extend({
  icon: 'message',
  action() {

  }
})
// 流程图
BpmnButton.Models.ResponseButtonFlowImage = BpmnButton.Models.ResponseButton.extend({
  icon: 'image',
  action() {
    this.emitFrExt('flowDiagram')
  }
})
// 审批历史
BpmnButton.Models.ResponseButtonApprovalHistory = BpmnButton.Models.ResponseButton.extend({
  icon: 'detail-fill',
  action() {
    this.emitFrExt('approvalHistory')
  }
})
// 反对流转
BpmnButton.Models.ResponseButtonOpposeTrans = BpmnButton.Models.ResponseButton.extend({
  icon: 'fa fa-lock',
  action() {

  }
})

// 同意流转
BpmnButton.Models.ResponseButtonAgreeTrans = BpmnButton.Models.ResponseButton.extend({
  icon: 'fa fa-lock',
  action() {

  }
})

// 挂起
BpmnButton.Models.ResponseButtonSuspendProcess = BpmnButton.Models.ResponseButton.extend({
  icon: 'fa fa-lock',
  action(btn) {
    const taskId = btn.getTaskId()
    suspendProcess({ taskId: taskId }).then(response => {
      this.$store.dispatch('setDataChange', false)
      const title = btn.getTitle()
      this.$toast.success(`挂起${title}成功！`)
      btn.afterScript(btn, this.getFormData(), this.hasScript())
      // this.$router.push({ path: '/bpmn-cust/pending-cust' })
      operateRedirect(this)
    })
  }
})
// 恢复
BpmnButton.Models.ResponseButtonRecoverProcess = BpmnButton.Models.ResponseButton.extend({
  icon: 'fa fa-lock',
  action(btn) {
    const taskId = btn.getTaskId()
    recoverProcess({ taskId: taskId }).then(response => {
      this.$store.dispatch('setDataChange', false)
      const title = btn.getTitle()
      this.$toast.success(`恢复${title}成功！`)
      btn.afterScript(btn, this.getFormData(), this.hasScript())
      // this.$router.push({ path: '/bpmn-cust/pending-cust' })
      operateRedirect(this)
    })
  }
})
// 打印
BpmnButton.Models.ResponseButtonPrint = BpmnButton.Models.ResponseButton.extend({
  icon: 'fa fa-lock',
  action() {

  }
})
// 撤销
BpmnButton.Models.ResponseButtonRevoke = BpmnButton.Models.ResponseButton.extend({
  icon: 'fa fa-lock',
  action() {

  }
})
// 实例明细
BpmnButton.Models.ResponseButtonInstanceDetail = BpmnButton.Models.ResponseButton.extend({
  icon: 'fa fa-lock',
  action() {

  }
})

// 自定义
BpmnButton.Models.ResponseButtonCustom = BpmnButton.Models.ResponseButton.extend({
  icon: 'fa fa-lock',
  action(btn) {
    this.$store.dispatch('setDataChange', false)
    if (btn.attributes.code === 'chargeback' || btn.attributes.code === 'chargeBack') {
      this.emitFrExt('chargeback')
    }

    const bpmComplete = function(actionName, params, _this, message, callback, ...obj) {
      complete(params).then(response => {
        _this.$emit('after-script', actionName)
        _this.$store.dispatch('setDataChange', false)
        if (callback) {
          callback(obj)
        }
        if (response.data) {
          _this.$router.replace({
            name: 'bpmnForm',
            query: {
              taskId: response.data
            }
          })
          _this.reload()
        } else {
          _this.$toast.success(message)
          _this.$router.replace({ path: '/bpmn-cust/pending-cust' })
        }
      }).catch(error => {
        console.error(error.cause)
      })
    }

    const completeNj = function(actionName, params, _this, message, callback, ...obj) {
      complete(params).then(response => {
        _this.$emit('after-script', actionName)
        _this.$store.dispatch('setDataChange', false)
        if (callback) {
          callback(obj)
        }
      }).catch(error => {
        console.error(error.cause)
      })
    }

    if (btn.attributes.code === 'saveTemp') {
      const data = {}
      data.actionAlias = btn.attributes.code
      data.actionName = btn.attributes.alias
      data.taskId = this.taskId
      data.data = JSON.stringify(this.formData)
      bpmComplete(data.actionName, data, this, '操作完成', function() {}, '')
    }

    // 延期按钮
    if (btn.attributes.code === 'postpone') {
      const data = {}
      data.actionAlias = btn.attributes.code
      data.actionName = 'oppose'
      data.taskId = this.taskId
      this.formData.workorderState = '申请延期'
      data.data = JSON.stringify(this.formData)
      bpmComplete(data.actionName, data, this, '操作完成', function() {}, '')
    }

    // 申请拆表、申请换表、申请装表
    if (btn.attributes.code === 'demolitionMeter' || btn.attributes.code === 'replaceMeter' || btn.attributes.code === 'newMeter') {
      var _this = this
      getData({ alias: 'gdlsh' }).then(response => {
        const data = {}
        data.actionAlias = btn.attributes.code
        data.actionName = 'custom'
        data.taskId = _this.taskId
        if (btn.attributes.code === 'demolitionMeter') {
          _this.formData.maintainType = '拆表'
        } else if (btn.attributes.code === 'replaceMeter') {
          _this.formData.maintainType = '换表'
        } else if (btn.attributes.code === 'newMeter') {
          _this.formData.maintainType = '换表'
        }
        _this.formData.subNo = response.data.id
        data.data = JSON.stringify(_this.formData)
        data.triggerMultiInstance = 'Y'
        data.destination = ''
        data.triggerUsers = '[]'
        bpmComplete(data.actionName, data, _this, '操作完成', function() {}, '')
      }).catch(() => {
        // 异常
      })
    }

    // 延期审核按钮
    if (btn.attributes.code === 'postponeCheck') {
      const delayAuditState =  this.formData.t_workorder_delay[0].delayAuditState
      if (!delayAuditState) {
        this.$dialog.alert({ message: '审核状态不能为空' })
        return
      }
      const data = {}
      data.actionAlias = btn.attributes.code
      data.actionName = 'oppose'
      data.taskId = this.taskId
      data.data = JSON.stringify(this.formData)
      if (delayAuditState === '通过') {
        data.actionName = 'agree'
      } else if (delayAuditState === '不通过') {
        data.actionName = 'oppose'
      }
      bpmComplete(data.actionName, data, this, '操作完成', function() {}, '')
    }

    // 销单完成按钮
    if (btn.attributes.code === 'destory') {
      if (!(this.$validator.errors.items.length === 0)) {
        this.$dialog.alert({ message: '表单还存在未规范的值!' })
        return
      }
      // 获取物料金额
      const price = Number(this.formData.price)
      // 获取实收金额
      const receivePrice = Number(this.formData.receivePrice)
      if (price !== '') {
        if (price !== receivePrice) {
          this.$dialog.alert({ message: '当前物料金额与实收金额不相等，无法提交!' })
          return
        }
      }
      const data = {}
      const _this = this
      data.actionAlias = btn.attributes.code
      data.actionName = this.formData.t_workorder_audit[0].auditState === '通过' ? 'agree' : 'oppose'
      data.taskId = this.taskId
      data.data = JSON.stringify(this.formData)
      // 调查询上门服务发起收费的状态（或许没有发起）
      const dataParams = {
        workorderId: this.formData.workorderId
      }
      queryChargeState(dataParams).then(response => {
        const state = response.state
        const message = response.message
        const dataState = response.data
        if (state === 200) {
          if (dataState === 5) {
            bpmComplete(data.actionName, data, _this, '操作成功!', function() {}, '')
          } else if (dataState === -1) {
            bpmComplete(data.actionName, data, _this, '操作成功!', function() {}, '')
          } else {
            this.$dialog.alert({ message: message })
          }
        } else if (state === -1) {
          this.$dialog.alert({ message: message })
          return
        }
      }).catch(error => {
        console.error(error.cause)
      })
    }

    // 按钮
    if (btn.attributes.code === 'pay') {
      if (!(this.$validator.errors.items.length === 0)) {
        this.$dialog.alert({ message: '表单还存在未规范的值!' })
        return
      }
      const paymentMethod = this.formData.paymentMethod
      const price = Number(this.formData.price)
      if (price === 0) {

      }
      const paymentId = this.formData.paymentId
      const _this = this
      if (paymentMethod === 'xj') {
        this.$dialog.confirm({
          // title: '确认已收款？',
          message: '确认已收款？'
        }).then(() => {
          const data = {}
          this.formData.buttonType = '支付'
          data.actionAlias = btn.attributes.code
          data.actionName = 'agree'
          data.taskId = this.taskId
          if (this.formData.paymentTime || this.formData.paymentTime === '') {
            delete this.formData.paymentTime
          }
          if (this.formData.orderNo || this.formData.orderNo === '') {
            delete this.formData.orderNo
          }
          data.data = JSON.stringify(this.formData)
          const paramsToXj = {
            datas: data.data
          }
          // 现金支付再后端走结点
          insertLogByXJ(paramsToXj).then(response => {
            if (response.state === 200) {
              _this.$router.replace({
                name: 'bpmnForm',
                query: {
                  taskId: response.data
                }
              })
              _this.reload()
            } else {
              _this.$dialog.alert({ message: response.message })
            }
          }).catch(error => {
            _this.$dialog.alert({
              message: response.message
            }).then(() => {
              _this.$emit('after-script', 'oppose')
              _this.$store.dispatch('setDataChange', false)
              _this.$router.push({ path: '/bpmn-cust/pending-cust' })
            })
          })
        })
      } else {
        const qrcodeParams = {}
        qrcodeParams.paymentId = paymentId
        qrcodeParams.paymentMethod = paymentMethod
        qrcodeParams.price = price
        qrcodeParams.taskId = this.taskId
        const formDataCopy = this.formData
        delete formDataCopy.paymentUrl
        qrcodeParams.data = JSON.stringify(formDataCopy)
        // 调用订单状态接口
        // 金额为0不用二维码支付
        if (price === 0) {
          // const data = {}
          // this.formData.buttonType = '支付'
          // data.actionAlias = btn.attributes.code
          // data.actionName = 'agree'
          // data.taskId = this.taskId
          // data.data = JSON.stringify(this.formData)
          // if (this.formData.paymentTime || this.formData.paymentTime === '') {
          //   delete this.formData.paymentTime
          // }
          // if (this.formData.orderNo || this.formData.orderNo === '') {
          //   delete this.formData.orderNo
          // }
          // data.data = JSON.stringify(this.formData)
          // const paramsToXj = {
          //   datas: data.data
          // }
          // insertLogByXJ(paramsToXj).then(response => {
          //   if (response.state === 200) {
          //     bpmComplete(data.actionName, data, _this, '操作完成', function() {}, '')
          //   }
          // })
          this.$dialog.alert({ message: '支付金额不能为0' })
          return
        }
        payToQRCode(qrcodeParams).then(response => {
          // 如果状态为200并且订单状态为已过期，那么调用生成二维码
          if (response.state === 200) {
            if (response.data.state === -3) {
              _this.$dialog.confirm('订单已经支付！').then(() => {
                _this.$router.replace({
                  name: 'bpmnForm',
                  query: {
                    taskId: response.data.taskId
                  }
                })
                _this.reload()
              })
            } else if (response.data.state === -1) {
              _this.$dialog.confirm('获取支付二维码失败！')
            } else {
              const qrcodeData = {}
              qrcodeData.url = response.data.paymentUrl
              qrcodeData.showQrcode = true
              qrcodeData.orderNo = response.data.orderNo
              this.formData.orderNo = response.data.orderNo
              this.formData.paymentUrl = response.data.paymentUrl
              qrcodeData.data = this.formData
              this.formDef['qrcodeData'] = qrcodeData
              this.emitFrExt('play')
            }
          } else {
            this.$dialog.confirm('获取支付二维码失败！')
          }
        })
      }
    }

    // 打印
    if (btn.attributes.code === 'bluetoothPrinter') {
      const _this = this
      this.$bridge.registerHandler('bluetoothRefresh', function(data, responseCallback) {
        _this.reload()
      })
      const params = {
        type: '2',
        id: this.formData.workorderId
      }
      var dataParams = JSON.stringify(params)
      this.$bridge.callHandler('bluetoothPrint', dataParams, (callbackData) => {
        const data = {}
        this.formData.buttonType = '蓝牙打印'
        data.actionAlias = btn.attributes.code
        data.actionName = 'agree'
        data.taskId = this.taskId
        data.data = JSON.stringify(this.formData)
        bpmComplete(data.actionName, data, this, '操作完成', function() {}, '')
      })
    }

    // 退款
    if (btn.attributes.code === 'refund') {
      const _this = this
      this.$dialog.confirm({
        message: '是否确定退款？'
      }).then(() => {
        const dataToRefound = {}
        dataToRefound.type = this.formData.paymentMethod
        dataToRefound.price = this.formData.price
        dataToRefound.orderNo = this.formData.orderNo
        dataToRefound.paymentId = this.formData.paymentId
        dataToRefound.workorderId = this.formData.workorderId
        dataToRefound.datas = JSON.stringify(this.formData)
        const data = {}
        this.formData.buttonType = '退款'
        data.actionAlias = btn.attributes.code
        data.actionName = 'agree'
        data.taskId = this.taskId
        data.data = JSON.stringify({ 'buttonType': '退款' })
        // 现金点退款直接退款
        if (this.formData.paymentMethod === 'xj') {
          refound(dataToRefound).then(response => {
            // 退款成功，在后端调用进下一个节点接口
            if (response.state === 200) {
              _this.$router.replace({
                name: 'bpmnForm',
                query: {
                  taskId: response.data
                }
              })
              _this.reload()
            } else {
              _this.$dialog.alert({ message: response.message })
            }
          }).catch(error => {
            if (error.state === -2) {
              _this.$dialog.alert({
                message: error.message
              }).then(() => {
                _this.$emit('after-script', 'oppose')
                _this.$store.dispatch('setDataChange', false)
                _this.$router.push({ path: '/bpmn-cust/pending-cust' })
              })
            } else {
              console.error(error.cause)
            }
          })
        } else {
          refound(dataToRefound).then(response => {
            // 退款成功，在后端调用进下一个节点接口
            if (response.state === 200) {
              _this.$router.replace({
                name: 'bpmnForm',
                query: {
                  taskId: response.data
                }
              })
              _this.reload()
            } else if (response.state === -1) {
              _this.$dialog.alert({ message: response.message })
            }
          }).catch(error => {
            if (error.state === -2) {
              _this.$dialog.alert({
                message: error.message
              }).then(() => {
                _this.$emit('after-script', 'oppose')
                _this.$store.dispatch('setDataChange', false)
                _this.$router.push({ path: '/bpmn-cust/pending-cust' })
              })
            } else {
              console.error(error.cause)
            }
          })
        }
      })
    }

    // 开票详情
    if (btn.attributes.code === 'billDetails') {
      if (!(this.$validator.errors.items.length === 0)) {
        this.$dialog.alert({ message: '表单还存在未规范的值!' })
        return
      }
      const price = Number(this.formData.price)
      if (price === 0) {
        this.$dialog.alert({ message: '金额为0,不能开票!' })
        return
      }
      this.emitFrExt('billDetails')
    }

    // 结束
    if (btn.attributes.code === 'end') {
      if (!(this.$validator.errors.items.length === 0)) {
        this.$dialog.alert({ message: '表单还存在未规范的值!' })
        return
      }
      const data = {}
      this.formData.buttonType = '结束收款'
      data.actionAlias = btn.attributes.code
      data.actionName = 'agree'
      data.taskId = this.taskId
      data.data = JSON.stringify(this.formData)
      bpmComplete(data.actionName, data, this, '操作成功', function() {}, '')
    }

    // 收费
    if (btn.attributes.code === 'charge') {
      if (!(this.$validator.errors.items.length === 0)) {
        this.$dialog.alert({ message: '表单还存在未规范的值!' })
        return
      }
      const data = {}
      this.formData.buttonType = '待开票'
      data.actionAlias = btn.attributes.code
      data.actionName = 'agree'
      data.taskId = this.taskId
      data.data = JSON.stringify(this.formData)
      bpmComplete(data.actionName, data, this, '操作成功', function() {}, '')
    }

    // 维修处理上报按钮
    if (btn.attributes.code === 'dealReported') {
      if (!(this.$validator.errors.items.length === 0)) {
        this.$dialog.alert({ message: '表单还存在未规范的值!' })
        return
      }
      var data = {}
      var _this = this
      data.actionAlias = btn.attributes.code
      data.actionName = 'custom'
      data.taskId = this.taskId
      data.data = JSON.stringify(this.formData)
      const price = Number(this.formData.price)
      if (this.formData.t_workorder_materiel_copy.length > 0) {
        if (price === 0) {
          this.$dialog.alert({
            message: '物料价格为0,是否继续填写物料',
            confirmButtonText: '需要',
            cancelButtonText: '不需要',
            showCancelButton: true
          }).then(() => {

          }).catch(() => {
            this.$dialog.alert({
              message: '是否需要蓝牙打印',
              confirmButtonText: '需要',
              cancelButtonText: '不需要',
              showCancelButton: true
            }).then(() => {
              data.actionName = 'agree'
              complete(data).then(response => {
                _this.$emit('after-script', 'oppose')
                _this.$store.dispatch('setDataChange', false)
                _this.$toast.success(`操作成功`)
                _this.$router.push({ path: '/bpmn-cust/pending-cust' })
                const params = {
                  type: '2',
                  id: this.formData.workorderId
                }
                var dataParams = JSON.stringify(params)
                _this.$bridge.callHandler('bluetoothPrint', dataParams, (callbackData) => {
                })
              }).catch(error => {
                console.error(error.cause)
              })
            }).catch(() => {
              data.actionName = 'agree'
              bpmComplete(data.actionName, data, _this, '操作成功', function() {}, '')
            })
          })
        } else {
          data.triggerMultiInstance = 'Y'
          data.destination = ''
          data.triggerUsers = '[]'
          completeNj(data.actionName, data, _this, '操作成功', function(defineParams) {
            const otherData = {}
            const __this = defineParams[1]
            otherData.actionAlias = defineParams[0]
            otherData.actionName = 'agree'
            otherData.taskId = __this.taskId
            otherData.triggerMultiInstance = 'Y'
            otherData.data = JSON.stringify(__this.formData)
            bpmComplete(otherData.actionName, otherData, _this, '操作成功', function() {}, '')
          }, btn.attributes.code, _this)
        }
      } else {
        this.$dialog.alert({
          message: '是否需要填写物料信息',
          confirmButtonText: '需要',
          cancelButtonText: '不需要',
          showCancelButton: true
        }).then(() => {

        }).catch(() => {
          this.$dialog.alert({
            message: '是否需要蓝牙打印',
            confirmButtonText: '需要',
            cancelButtonText: '不需要',
            showCancelButton: true
          }).then(() => {
            data.actionName = 'agree'
            complete(data).then(response => {
              _this.$emit('after-script', 'oppose')
              _this.$store.dispatch('setDataChange', false)
              _this.$toast.success(`操作成功`)
              _this.$router.push({ path: '/bpmn-cust/pending-cust' })
              const params = {
                type: '2',
                id: this.formData.workorderId
              }
              var dataParams = JSON.stringify(params)
              _this.$bridge.callHandler('bluetoothPrint', dataParams, (callbackData) => {
              })
            }).catch(error => {
              console.error(error.cause)
            })
          }).catch(() => {
            data.actionName = 'agree'
            bpmComplete(data.actionName, data, _this, '操作成功', function() {}, '')
          })
        })
      }
    }

    // 水表信息回传
    if (btn.attributes.code === 'passBack') {
      if (!(this.$validator.errors.items.length === 0)) {
        this.$dialog.alert({ message: '表单还存在未规范的值!' })
        return
      }
      const _this = this
      const data = {}
      data.actionAlias = btn.attributes.code
      data.actionName = 'agree'
      data.taskId = this.taskId
      data.data = JSON.stringify(this.formData)
      // 获取工单类型
      const workorderType = this.formData.workorderType
      // 移表
      if (workorderType === '5') {
        const dataParams = {
          workorderId: _this.formData.workorderId
        }
        yibiaoHT(dataParams).then(response => {
          if (response.state === 200) {
            const state = response.data
            if (state === 0) {
              dialogToState(state, _this)
            } else if (state === 1) {
              dialogToState(state, _this)
            } else if (state === 2) {
              dialogToState(state, _this)
            } else if (state === 3) {
              bpmComplete(data.actionName, data, this, '任务办理成功，数据回传成功!', function() {}, '')
            } else {
              dialogToState(state, _this)
            }
          } else {
            dialogToState(response.state, _this)
          }
        }).catch(error => {
          console.error(error.cause)
        })
        // 拆表
      } else if (workorderType === '7') {
        const dataParams = {
          workorderId: _this.formData.workorderId
        }
        chaibiaoHT(dataParams).then(response => {
          if (response.state === 200) {
            const state = response.data
            if (state === 0) {
              dialogToState(state, _this)
            } else if (state === 1) {
              dialogToState(state, _this)
            } else if (state === 2) {
              dialogToState(state, _this)
            } else if (state === 3) {
              bpmComplete(data.actionName, data, this, '任务办理成功，数据回传成功!', function() {}, '')
            } else {
              dialogToState(state, _this)
            }
          } else {
            dialogToState(response.state, _this)
          }
        }).catch(error => {
          console.error(error.cause)
        })
        // 换表
      } else if (workorderType === '8') {
        const dataParams = {
          workorderId: _this.formData.workorderId
        }
        huanbiaoHT(dataParams).then(response => {
          if (response.state === 200) {
            const state = response.data
            if (state === 0) {
              dialogToState(state, _this)
            } else if (state === 1) {
              dialogToState(state, _this)
            } else if (state === 2) {
              dialogToState(state, _this)
            } else if (state === 3) {
              bpmComplete(data.actionName, data, this, '任务办理成功，数据回传成功!', function() {}, '')
            } else {
              dialogToState(state, _this)
            }
          } else {
            dialogToState(response.state, _this)
          }
        }).catch(error => {
          console.error(error.cause)
        })
        // 装表
      } else if (workorderType === '9') {
        const dataParams = {
          workorderId: _this.formData.workorderId,
          houseNo: _this.formData.houseNo,
          shuibiaobh: _this.formData.waterMeterNo
        }
        zhuangbiaoHT(dataParams).then(response => {
          if (response.state === 200) {
            const state = response.data
            if (state === 0) {
              _this.$dialog.alert({ message: '任务办理失败，数据回传成功,数据异常' })
            } else if (state === 1) {
              bpmComplete(data.actionName, data, this, '任务办理成功，数据回传成功!', function() {}, '')
            } else {
              _this.$dialog.alert({ message: '任务办理失败，数据回传成功,数据异常' })
            }
          } else {
            dialogToState(response.state, _this)
          }
        }).catch(error => {
          console.error(error.cause)
        })
        // 用水性质变更
      } else if (workorderType === '31') {
        // 获取用水性质变更字段
        const isChange = this.formData.isChange
        if (isChange && isChange === '2') {
          data.actionName = 'oppose'
          bpmComplete(data.actionName, data, _this, '操作成功!', function() {}, '')
        } else {
          const dataParams = {
            workorderId: this.formData.workorderId,
            waterMeterNo: '',
            formData: JSON.stringify(this.formData)
          }
          waterNatureHT(dataParams).then(response => {
            const state = response.state
            const message = response.message
            const dataState = response.data
            if (state === 200) {
              if (dataState === 1) {
                bpmComplete(data.actionName, data, _this, '操作成功!', function() {}, '')
              } else {
                _this.$dialog.alert({
                  message: message
                }).then(() => {
                  _this.reload()
                })
              }
            } else if (state === -1) {
              _this.$dialog.alert({ message: message })
            }
          }).cause(error => {
            console.error(error.cause)
          })
        }
      } else {
        console.error('工单类型错误，不能办理任务!')
      }
    }

    const dialogToState = function(state, _this) {
      if (state === 0) {
        _this.$dialog.alert({ message: '任务办理失败，数据回传成功，但抄表人不正确' })
      } else if (state === 1) {
        _this.$dialog.alert({ message: '任务办理失败，数据回传成功，但回填人不正确' })
      } else if (state === 2) {
        _this.$dialog.alert({ message: '任务办理失败，数据回传成功，但登记人不正确' })
      } else if (state === 3) {
        _this.$emit('after-script', 'agree')
        _this.$store.dispatch('setDataChange', false)
        _this.$toast.success(`任务办理成功，数据回传成功!`)
        _this.$router.push({ path: '/bpmn-cust/pending-cust' })
      } else if (state === 4) {
        _this.$dialog.alert({ message: '任务办理失败，数据回传成功，但数据异常' })
      } else {
        _this.$dialog.alert({ message: '任务办理失败，数据回传失败' })
      }
    }
    // 营收校验
    if (btn.attributes.code === 'verify') {
      if (!(this.$validator.errors.items.length === 0)) {
        this.$dialog.alert({ message: '表单还存在未规范的值!' })
        return
      }
      const _this = this
      const data = {}
      data.actionAlias = btn.attributes.code
      data.actionName = 'agree'
      data.taskId = this.taskId
      data.data = JSON.stringify(this.formData)
      const dataParams = {
        workorderId: _this.formData.workorderId,
        workorderType: _this.formData.workorderType,
        houseNo: _this.formData.houseNo,
        shuibiaobh: _this.formData.waterMeterNo,
        newWaterMeterCode: '',
        nodeRecord: '',
        formData: _this.formData
      }
      dataParams.formData = JSON.stringify(dataParams.formData)
      // 获取工单状态
      const workorderState = this.formData.workorderState
      if (workorderState === '待录入' || workorderState === '待管网审核') {
        dataParams.nodeRecord = '结果录入'
      } else if (workorderState === '待客服审核') {
        dataParams.nodeRecord = '计量审核'
      } else if (workorderState === '待管网二次审核') {
        dataParams.nodeRecord = '管网二次审核'
      }
      // 获取工单类型
      const workorderType = this.formData.workorderType
      // 用户类型
      const userType = this.formData.userType
      // 水表类型
      const waterType = this.formData.waterType
      // 获取审核
      const auditState = this.formData.auditState
      if (auditState === '不通过') {
        data.actionName = 'oppose'
        bpmComplete(data.actionName, data, this, '操作成功', function() {}, '')
        return
      }
      // 拆表
      if (workorderType === '7') {
        const groupDes = _this.formData.groupDes
        const mainWorkorderType = _this.formData.mianWorkorderType
        // 若是居民ic则不校验
        if (userType === '居民' && (waterType === 'IC卡水表' || waterType === 'IC卡表')) {
          if (workorderState === '待管网二次审核') {
            this.formData.workorderState = '已校验'
          } else {
            this.formData.workorderState = '管网二次审核'
          }
          data.data = JSON.stringify(this.formData)
          bpmComplete(data.actionName, data, this, '操作成功', function () {
          }, '')
          return
        }
        // 居民非远传、IC卡过户检表发起官网二次审核（此时节点在官网审核上，因为官网二次审核与计量审核也会跑改方法）
        if ((groupDes === '0' || mainWorkorderType === '33') && workorderState === '待管网审核') {
          this.formData.workorderState = '管网二次审核'
          data.data = JSON.stringify(this.formData)
          bpmComplete(data.actionName, data, this, '操作成功', function() {}, '')
          return
        }
        dataParams.newWaterMeterCode = this.formData.t_workorder_meter[0]['meterNum']
        // 若是居民ic则不校验
        if (userType === '居民' && (waterType === 'IC卡水表' || waterType === 'IC卡表')) {
          this.formData.workorderState = '已校验'
          data.data = JSON.stringify(this.formData)
          bpmComplete(data.actionName, data, this, '操作成功', function() {}, '')
          return
        } else {
          if (dataParams.nodeRecord === '结果录入') {
            dataParams.newWaterMeterCode = _this.formData.t_workorder_meter[0]['meterNum']
            this.formData.nodeRecord = '管网审核'
          } else if (dataParams.nodeRecord === '计量审核') {
            dataParams.newWaterMeterCode = _this.formData.t_workorder_meter_two[0]['meterNum']
            this.formData.nodeRecord = '管网二次审核'
          } else if (dataParams.nodeRecord === '管网二次审核') {
            dataParams.newWaterMeterCode = _this.formData.t_workorder_meter_three[0]['meterNum']
            this.formData.nodeRecord = '管网二次审核'
          }
          waterMeterBack(dataParams).then(response => {
            if (response.state === 200) {
              if (response.data === 4) {
                // 结果录入校验与营收都成功直接可以关单
                this.formData.workorderState = '已校验'
                data.data = JSON.stringify(this.formData)
                bpmComplete(data.actionName, data, this, '操作成功', function() {}, '')
              } else {
                if (dataParams.nodeRecord === '结果录入' || dataParams.nodeRecord === '管网二次审核') {
                  this.formData.workorderState = '计量审核'
                  data.data = JSON.stringify(this.formData)
                  // 其中一个失败跑下一个结点
                  _this.$dialog.alert({
                    message: response.message
                  }).then(() => {
                    bpmComplete(data.actionName, data, this, response.message, function() {}, '')
                  })
                } else if (dataParams.nodeRecord === '计量审核') {
                  _this.$dialog.alert({ message: response.message })
                }
              }
            }
          }).catch(error => {
            _this.$dialog.alert({ message: error.message })
          })
        }
      } else if (workorderType === '8') {
        const groupDes = _this.formData.groupDes
        const mainWorkorderType = _this.formData.mianWorkorderType
        // 管网二次审核
        if (userType === '居民' && (waterType === 'IC卡水表' || waterType === 'IC卡表')) {
          if (workorderState === '待管网二次审核') {
            this.formData.workorderState = '已校验'
          } else {
            this.formData.workorderState = '管网二次审核'
          }
          data.data = JSON.stringify(this.formData)
          bpmComplete(data.actionName, data, this, '操作成功', function () {
          }, '')
          return
        }
        // 居民非远传、IC卡过户检表发起官网二次审核（此时节点在官网审核上，因为官网二次审核与计量审核也会跑改方法）
        if ((groupDes === '0' || mainWorkorderType === '33') && workorderState === '待管网审核') {
          this.formData.workorderState = '管网二次审核'
          data.data = JSON.stringify(this.formData)
          bpmComplete(data.actionName, data, this, '操作成功', function() {}, '')
          return
        }
        dataParams.newWaterMeterCode = this.formData.t_workorder_meter[0]['oldMeterCopyCode']
        // 若是居民ic则不校验
        if (userType === '居民' && (waterType === 'IC卡水表' || waterType === 'IC卡表')) {
          this.formData.workorderState = '已校验'
          data.data = JSON.stringify(this.formData)
          bpmComplete(data.actionName, data, this, '操作成功', function() {}, '')
          return
        } else {
          if (dataParams.nodeRecord === '结果录入') {
            dataParams.newWaterMeterCode = _this.formData.t_workorder_meter[0]['oldMeterCopyCode']
            this.formData.nodeRecord = '管网审核'
          } else if (dataParams.nodeRecord === '计量审核') {
            dataParams.newWaterMeterCode = _this.formData.t_workorder_meter_two[0]['oldMeterCopyCode']
            this.formData.nodeRecord = '计量审核'
          } else if (dataParams.nodeRecord === '管网二次审核') {
            dataParams.newWaterMeterCode = _this.formData.t_workorder_meter_three[0]['oldMeterCopyCode']
            this.formData.nodeRecord = '管网二次审核'
          }
          waterMeterBack(dataParams).then(response => {
            if (response.state === 200) {
              if (response.data === 4) {
                // 结果录入校验与营收都成功直接可以关单
                this.formData.workorderState = '已校验'
                data.data = JSON.stringify(this.formData)
                bpmComplete(data.actionName, data, this, '操作成功', function() { }, '')
              } else {
                if (dataParams.nodeRecord === '结果录入' || dataParams.nodeRecord === '管网二次审核') {
                  this.formData.workorderState = '计量审核'
                  data.data = JSON.stringify(this.formData)
                  // 其中一个失败跑下一个结点
                  _this.$dialog.alert({
                    message: response.message
                  }).then(() => {
                    bpmComplete(data.actionName, data, this, response.message, function() {}, '')
                  })
                } else if (dataParams.nodeRecord === '计量审核') {
                  _this.$dialog.alert({ message: response.message })
                }
              }
            }
          }).catch(error => {
            _this.$dialog.alert({ message: error.message })
          })
        }
      } else if (workorderType === '9') {
        dataParams.newWaterMeterCode = _this.formData.t_workorder_meter_two[0]['waterMeterNo']
        waterMeterBack(dataParams).then(response => {
          if (response.state === 200) {
            if (response.data === 1) {
              // 结果录入校验与营收都成功直接可以关单
              this.formData.workorderState = '已校验'
              data.data = JSON.stringify(this.formData)
              bpmComplete(data.actionName, data, this, '操作成功', function() {}, '')
            } else {
              _this.$dialog.alert({ message: response.message })
            }
          }
        }).catch(error => {
          console.error(error.cause())
        })
      } else if (workorderType === '13') {
        dataParams.newWaterMeterCode = ''
        waterMeterBack(dataParams).then(response => {
          if (response.state === 200) {
            if (response.data === 1) {
              // 结果录入校验与营收都成功直接可以关单
              this.formData.workorderState = '已校验'
              data.data = JSON.stringify(this.formData)
              bpmComplete(data.actionName, data, this, '操作成功', function() {}, '')
            } else {
              _this.$dialog.alert({ message: response.message })
            }
          }
        }).catch(error => {
          console.error(error.cause())
        })
      }
    }

    // 网点接单
    if (btn.attributes.code === 'orderRevice') {
      if (!(this.$validator.errors.items.length === 0)) {
        this.$dialog.alert({ message: '表单还存在未规范的值!' })
        return
      }
      const data = {}
      const _this = this
      data.actionAlias = btn.attributes.code
      data.actionName = 'custom'
      data.taskId = this.taskId
      data.data = JSON.stringify(this.formData)
      const businessType = _this.formData.businessType
      if (businessType === '新增加表' || businessType === '原水表遗失或损坏' || businessType === '扩容') {
        data.triggerMultiInstance = 'Y'
        data.destination = ''
        data.triggerUsers = '[]'
        bpmComplete(data.actionName, data, _this, '操作成功', function(defineParams) {
          const otherData = {}
          const __this = defineParams[1]
          otherData.actionAlias = defineParams[0]
          otherData.actionName = 'agree'
          otherData.taskId = __this.taskId
          otherData.triggerMultiInstance = 'Y'
          otherData.data = JSON.stringify(__this.formData)
          bpmComplete(otherData.actionName, otherData, _this, '操作成功', function() {}, '')
        }, btn.attributes.code, _this)
      } else {
        bpmComplete(data.actionName, data, this, '操作成功', function() {}, '')
      }
    }

    // 网点报价
    if (btn.attributes.code === 'offer') {
      if (!(this.$validator.errors.items.length === 0)) {
        this.$dialog.alert({ message: '表单还存在未规范的值!' })
        return
      }
      const data = {}
      const _this = this
      data.actionAlias = btn.attributes.code
      data.actionName = 'custom'
      data.taskId = this.taskId
      data.data = JSON.stringify(this.formData)
      data.triggerMultiInstance = 'Y'
      data.destination = ''
      data.triggerUsers = '[]'
      completeNj(data.actionName, data, _this, '操作成功', function(defineParams) {
        const otherData = {}
        const __this = defineParams[1]
        otherData.actionAlias = defineParams[0]
        otherData.actionName = 'agree'
        otherData.taskId = __this.taskId
        otherData.triggerMultiInstance = 'Y'
        otherData.data = JSON.stringify(__this.formData)
        bpmComplete(otherData.actionName, otherData, _this, '操作成功', function() {}, '')
      }, btn.attributes.code, _this)
    }

    // 用户服务发起拆换装流程
    if (btn.attributes.code === 'externalProcess') {
      if (!(this.$validator.errors.items.length === 0)) {
        this.$dialog.alert({ message: '表单还存在未规范的值!' })
        return
      }
      const data = {}
      const _this = this
      data.actionAlias = btn.attributes.code
      data.actionName = 'agree'
      data.taskId = this.taskId
      // 获取工单编号
      getData({ alias: 'gdlsh' }).then(response => {
        data.data = _this.formData
        data.data.subNo = response.data.id
        data.triggerMultiInstance = 'Y'
        data.destination = ''
        data.triggerUsers = '[]'
        data.actionName = 'custom'
        data.data = JSON.stringify(data.data)
        completeNj(data.actionName, data, _this, '操作成功', function(defineParams) {
          const otherData = {}
          const __this = defineParams[1]
          otherData.actionAlias = defineParams[0]
          otherData.actionName = 'agree'
          otherData.taskId = __this.taskId
          otherData.data = JSON.stringify(__this.formData)
          bpmComplete(otherData.actionName, otherData, _this, '操作成功', function() {}, '')
        }, btn.attributes.code, _this)
      }).catch((error) => {
        console.error(error.cause)
      })
    }

    // 批量发起拆表流程
    if (btn.attributes.code === 'batchSpiltProcess') {
      if (!(this.$validator.errors.items.length === 0)) {
        this.$dialog.alert({ message: '表单还存在未规范的值!' })
        return
      }
      const data = {}
      const _this = this
      data.actionAlias = btn.attributes.code
      data.actionName = 'agree'
      data.taskId = this.taskId
      data.data = JSON.stringify(this.formData)
      const dataParams = {
        formData: JSON.stringify(this.formData.t_workorder_meter),
        houseNo: this.formData.houseNo,
        mainWorkorderNo: this.formData.workorderNo,
        mainWorkorderType: this.formData.workorderType,
        defId: '636973169638375424'
      }
      batchStartCustomizeProcess(dataParams).then(response => {
        const state = response.state
        const dataState = response.data
        if (state === 200) {
          if (dataState === 0) {
            bpmComplete(data.actionName, data, _this, '操作成功', function() {}, '')
          } else if (dataState === -1) {
            this.$dialog.alert({ message: '批量生产拆表流程失败!' })
          }
        } else if (state === -1) {
          bpmComplete(data.actionName, data, _this, '操作成功', function() {}, '')
        }
      }).catch(error => {
        console.error(error.cause())
      })
    }

    // 预约
    if (btn.attributes.code === 'appointment') {
      if (!(this.$validator.errors.items.length === 0)) {
        this.$dialog.alert({ message: '表单还存在未规范的值!' })
        return
      }
      const dataParams = {
        busKey: 'workorder_id',
        busValue: this.formData.workorderId,
        tableName: 't_workorder_appointment',
        valMap: {
          'appointment_time': this.formData.t_workorder_appointment[0]['appointmentTime'],
          'appointment_remark': this.formData.t_workorder_appointment[0]['appointmentRemark'],
          'is_servery': this.formData.t_workorder_appointment[0]['isServery']
        }
      }
      dataParams.valMap = JSON.stringify(dataParams.valMap)
      updateDataByBusKeyAndValue(dataParams).then(response => {
        if (response.state === 200) {
          this.$dialog.alert({ message: '预约成功!' })
        } else {
          this.$dialog.alert({ message: '预约失败!' })
        }
      }).catch(error => {
        console.error(error.cause())
      })
    }

    if (btn.attributes.code === 'submitVerify') {
      if (!(this.$validator.errors.items.length === 0)) {
        this.$dialog.alert({ message: '表单还存在未规范的值!' })
        return
      }
      var data = {}
      var _this = this
      data.actionAlias = btn.attributes.code
      data.actionName = 'agree'
      data.taskId = this.taskId
      data.data = JSON.stringify(this.formData)
      this.$dialog.alert({
        message: '当前流程是否已审批完成',
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        showCancelButton: true
      }).then(() => {
        data.actionName = 'agree'
        bpmComplete(data.actionName, data, _this, '操作成功', function() {}, '')
      }).catch(error => {
        console.error(error.cause)
      })
    }

    if (btn.attributes.code === 'peopleVerify') {
      if (!(this.$validator.errors.items.length === 0)) {
        this.$dialog.alert({ message: '表单还存在未规范的值!' })
        return
      }
      var IDCardArr = []
      var meterLength = this.formData.t_workorder_meter_three
      for (var i = 0; i < meterLength; i++) {
        var meter = this.formData.t_workorder_meter_three[i]
        IDCardArr.push(meter.idNos)
      }
      var IDCard = IDCardArr.join(',')
      var dataParams = {
        IDCards: IDCard
      }
      var data = {}
      var _this = this
      data.actionAlias = btn.attributes.code
      data.actionName = 'agree'
      data.taskId = this.taskId
      data.data = JSON.stringify(this.formData)
      checkIdCard(dataParams).then(response => {
        if (response.state === 200) {
          if (response.data === 1) {
            bpmComplete(data.actionName, data, _this, '操作成功', function() {}, '')
          } else if (response.data === 2) {
            _this.$dialog.alert({ message: response.message })
          }
        } else {
          _this.$dialog.alert({ message: response.message })
        }
      }).catch(error => {
        console.error(error.catch)
      })
    }

    if (btn.attributes.code === 'checkBack') {
      if (!(this.$validator.errors.items.length === 0)) {
        this.$dialog.alert({ message: '表单还存在未规范的值!' })
        return
      }
      var auditState = this.formData.t_workorder_audit[0]['auditState']
      var IDCardArr = []
      var meterLength = this.formData.t_workorder_meter_three
      for (var i = 0; i < meterLength; i++) {
        var meter = this.formData.t_workorder_meter_three[i]
        IDCardArr.push(meter.idNos)
      }
      var IDCard = IDCardArr.join(',')
      var dataParams = {
        workorderId: this.formData.workorderId,
        formData: this.formData,
        IDCards: IDCardArr.join(',')
      }
      dataParams.formData = JSON.stringify(dataParams.formData)
      var data = {}
      var _this = this
      data.actionAlias = btn.attributes.code
      data.actionName = 'agree'
      data.taskId = this.taskId
      data.data = JSON.stringify(this.formData)
      if (auditState === '通过') {
        peopleBack(dataParams).then(response => {
          if (response.state === 200) {
            if (response.data === 1) {
              bpmComplete(data.actionName, data, _this, '操作成功', function() {}, '')
            } else if (response.data === 2) {
              _this.$dialog.alert({ message: response.message })
            }
          } else {
            _this.$dialog.alert({ message: response.message })
          }
        }).catch(error => {
          console.error(error.catch)
        })
      } else if (auditState === '不通过') {
        bpmComplete(data.actionName, data, _this, '操作成功', function() {}, '')
      }
    }

    if (btn.attributes.code === 'replaceByCheckMeter') {
      if (!(this.$validator.errors.items.length === 0)) {
        this.$dialog.alert({ message: '表单还存在未规范的值!' })
        return
      }
      // 获取工单状态
      var workorderState = this.formData.workorderState
      var auditState = ''
      var isNeedReplaceMeter = ''
      // 获取审核信息
      if (this.formData.t_workorder_audit) {
        auditState = this.formData.t_workorder_audit[0]['auditState']
      }
      if (this.formData.t_workorder_deal) {
        isNeedReplaceMeter = this.formData.t_workorder_deal[0]['isNeedReplaceMeter']
      }
      var data = {}
      var _this = this
      data.actionAlias = btn.attributes.code
      data.actionName = 'agree'
      data.taskId = this.taskId
      // 获取工单编号
      getData({ alias: 'gdlsh' }).then(response => {
        data.data.subNo = response.data.id
        data.data = JSON.stringify(_this.formData)
        // 审核处
        if (workorderState === '待审核') {
          if (auditState === '通过') {
            data.triggerMultiInstance = 'Y'
            data.destination = ''
            data.triggerUsers = '[]'
            data.actionName = 'custom'
            completeNj(data.actionName, data, _this, '操作成功', function(defineParams) {
              const otherData = {}
              const __this = defineParams[1]
              otherData.actionAlias = defineParams[0]
              otherData.actionName = 'agree'
              otherData.taskId = __this.taskId
              otherData.data = JSON.stringify(__this.formData)
              bpmComplete(otherData.actionName, otherData, _this, '操作成功', function() {}, '')
            }, btn.attributes.code, _this)
          } else if (auditState === '不通过') {
            bpmComplete(data.actionName, data, _this, '操作成功', function() {}, '')
          }
        }
        // 验表处
        if (workorderState === '待录入') {
          if (isNeedReplaceMeter === '1') {
            data.triggerMultiInstance = 'Y'
            data.destination = ''
            data.triggerUsers = '[]'
            data.actionName = 'custom'
            completeNj(data.actionName, data, _this, '操作成功', function(defineParams) {
              const otherData = {}
              const __this = defineParams[1]
              otherData.actionAlias = defineParams[0]
              otherData.actionName = 'agree'
              otherData.taskId = __this.taskId
              otherData.data = JSON.stringify(__this.formData)
              bpmComplete(otherData.actionName, otherData, _this, '操作成功', function() {}, '')
            }, btn.attributes.code, _this)
          } else if (isNeedReplaceMeter === '2') {
            bpmComplete(data.actionName, data, _this, '操作成功', function() {}, '')
          }
        }
      }).catch(() => {

      })
    }

    // 取消
    if (btn.attributes.code === 'postponeClose') {
      const data = {}
      var formDataIns = this.formData
      formDataIns.isServery = '1'
      data.actionAlias = btn.attributes.code
      data.actionName = 'oppose'
      data.taskId = this.taskId
      data.data = JSON.stringify(formDataIns)
      bpmComplete(data.actionName, data, this, '操作成功', function() {}, '')
    }

    // 驳回单子
    if (btn.attributes.code === 'rejectBill') {
      this.emitFrExt('rejectBill')
    }

    // 关单
    if (btn.attributes.code === 'closeBill') {
      this.emitFrExt('closeBill')
    }

    // 驳回
    if (btn.attributes.code === 'rejectAudit') {
      if (!(this.$validator.errors.items.length === 0)) {
        this.$dialog.alert({ message: '表单还存在未规范的值!' })
        return
      }
      const data = {}
      var formDataIns = this.formData
      data.actionAlias = btn.attributes.code
      data.actionName = 'agree'
      if (this.formData.auditState === '不通过') {
        data.actionName = 'oppose'
      }
      data.taskId = this.taskId
      data.data = JSON.stringify(formDataIns)
      bpmComplete(data.actionName, data, this, '操作成功', function() {}, '')
    }

    // 拆换结果录入提交
    if (btn.attributes.code === 'meterSub') {
      if (!(this.$validator.errors.items.length === 0)) {
        this.$dialog.alert({ message: '表单还存在未规范的值!' })
        return
      }
      const _this = this
      const data = {}
      const formDataIns = this.formData
      data.actionAlias = btn.attributes.code
      data.actionName = 'agree'
      data.taskId = this.taskId
      data.data = JSON.stringify(formDataIns)
      complete(data).then(response => {
        _this.$emit('after-script', 'oppose')
        _this.$store.dispatch('setDataChange', false)
        _this.$toast.success(`操作成功`)
        _this.$router.push({ path: '/bpmn-cust/pending-cust' })
        const params = {
          type: '2',
          id: _this.formData.workorderId
        }
        var dataParams = JSON.stringify(params)
        _this.$bridge.callHandler('bluetoothPrint', dataParams, (callbackData) => {
        })
      }).catch(error => {
        console.error(error.cause)
      })
      // // 当先领后做时，如果不需要换表，那么启动退库流程
      // const groupDes = _this.formData.groupDes
      // if (groupDes && (groupDes === '3' || groupDes === '4')) {
      //   const isReplace = _this.formData.t_workorder_meter[0].isReplaceMeter
      //   if (isReplace && isReplace === '2') {
      //     const formDatas = {}
      //     formDatas.formCopy = [
      //       {
      //         workorderType: '35',
      //         workorderNo: _this.formData.workorderNo,
      //         formId: '674657786243579904',
      //         isChangeUniqueForBizKey: false
      //       },
      //       {
      //         workorderType: '35',
      //         workorderNo: _this.formData.workorderNo,
      //         formId: '674915568289054720',
      //         isChangeUniqueForBizKey: true
      //       }
      //     ]
      //     formDatas.workorderId = _this.formData.workorderId
      //     const bpmnSetText = [
      //       {
      //         defId: '666205818244300800',
      //         flowKey: 'Process_3icb5mf',
      //         skipFirstNode: true,
      //         form: formDatas
      //       }
      //     ]
      //     const dataParams = {
      //       bpmnSetText: JSON.stringify(bpmnSetText)
      //     }
      //     startCustomizeProcess(dataParams).then(response => {
      //       const state = response.state
      //       if (state !== 200) {
      //         this.$dialog.alert({ message: response.message })
      //       } else {
      //         bpmComplete(data.actionName, data, _this, '操作成功', function() {}, '')
      //       }
      //     }).catch(error => {
      //       console.error(error.cause)
      //     })
      //   }
      // } else {
      //   complete(data).then(response => {
      //     _this.$emit('after-script', 'oppose')
      //     _this.$store.dispatch('setDataChange', false)
      //     _this.$toast.success(`操作成功`)
      //     _this.$router.push({ path: '/bpmn-cust/pending-cust' })
      //     const params = {
      //       type: '2',
      //       id: _this.formData.workorderId
      //     }
      //     var dataParams = JSON.stringify(params)
      //     _this.$bridge.callHandler('bluetoothPrint', dataParams, (callbackData) => {
      //     })
      //   }).catch(error => {
      //     console.error(error.cause)
      //   })
      // }
    }

    // 用户服务审核提交
    if (btn.attributes.code === 'userServiceSub') {
      if (!(this.$validator.errors.items.length === 0)) {
        this.$dialog.alert({ message: '表单还存在未规范的值!' })
        return
      }
      const data = {}
      const formDataIns = this.formData
      data.actionAlias = btn.attributes.code
      data.actionName = 'agree'
      if (this.formData.auditState === '不通过' || this.formData.auditState === '否') {
        data.actionName = 'oppose'
      }
      data.taskId = this.taskId
      data.data = JSON.stringify(formDataIns)
      bpmComplete(data.actionName, data, this, '操作成功', function() {}, '')
    }

    // 用户服务收费
    if (btn.attributes.code === 'userServiceCharge') {
      if (!(this.$validator.errors.items.length === 0)) {
        this.$dialog.alert({ message: '表单还存在未规范的值!' })
        return
      }
      var _this = this
      const dataParams = {
        id: this.formData.paymentId,
        data: JSON.stringify(this.formData)
      }
      const data = {}
      var formDataIns = this.formData
      delete formDataIns.isInvoice
      delete formDataIns.isBill
      delete formDataIns.headupType
      data.actionAlias = btn.attributes.code
      data.actionName = 'agree'
      data.taskId = this.taskId
      delete formDataIns.createState
      delete formDataIns.receivableCreateState
      delete formDataIns.receiptCreateState
      data.data = JSON.stringify(formDataIns)
      createBill(dataParams).then(response => {
        const state = response.state
        var message = ''
        if (state === 200) {
          message += '任务办理成功' + '<br/>'
          message += response.message
          var res = response.data
          if (res) {
            for (var i in res) {
              if (res[i].receivable) {
                message += '<br/>'
                message += res[i].receivable
              }
              if (res[i].receipt) {
                message += '<br/>'
                message += res[i].receipt
              }
            }
          }
          complete(data).then(response => {
            _this.$dialog.alert({
              message: message
            }).then(() => {
              _this.$emit('after-script', 'oppose')
              _this.$store.dispatch('setDataChange', false)
              _this.$router.push({ path: '/bpmn-cust/pending-cust' })
            })
          }).catch(error => {
            console.error(error.cause)
          })
        } else {
          message += '任务办理失败' + '<br/>'
          message += response.message
          var res = response.data
          if (res) {
            for (var i in res) {
              if (res[i].receivable) {
                message += '<br/>'
                message += res[i].receivable
              }
              if (res[i].receipt) {
                message += '<br/>'
                message += res[i].receipt
              }
            }
          }
          _this.$dialog.alert(message)
        }
      }).catch(error => {
        console.error(error.cause)
      })
    }

    /**
     * 调用出库接口
     * @param dataParams
     * @param form
     * @param tableName
     */
    const delivery = function(dataParams, form, tableName, _this) {
      const outParams = {
        form: JSON.stringify(form),
        tableName: tableName
      }
      // 出库
      outStock(outParams).then(response => {
        if (response.state === 200) {
          bpmComplete(dataParams.actionName, dataParams, _this, '操作成功', function() {}, '')
        } else {
          this.$dialog.alert({ message: response.message })
        }
      }).catch(error => {
        console.error(error.cause)
      })
    }

    // 物料出库
    if (btn.attributes.code === 'deliver') {
      if (!(this.$validator.errors.items.length === 0)) {
        this.$dialog.alert({ message: '表单还存在未规范的值!' })
        return
      }
      const formDataIns = this.formData
      const data = {
        actionName: 'agree',
        actionAlias: btn.attributes.code,
        taskId: this.taskId,
        data: JSON.stringify(formDataIns)
      }
      const auditState = this.formData.auditState
      // 没有值
      if (!auditState) {
        delivery(data, formDataIns, 't_material_requisition_details', this)
      } else {
        // 同意
        if (auditState === '通过') {
          delivery(data, formDataIns, 't_material_requisition_details', this)
          // 不同意
        } else {
          dataParams.actionName = 'oppose'
          // 走流程
          bpmComplete(data.actionName, data, this, '操作成功', function() {}, '')
        }
      }
    }

    // 物料退库
    if (btn.attributes.code === 'cancelStock') {
      if (!(this.$validator.errors.items.length === 0)) {
        this.$dialog.alert({ message: '表单还存在未规范的值!' })
        return
      }
      const _this = this
      const formDataIns = this.formData
      const data = {
        actionName: 'agree',
        actionAlias: btn.attributes.code,
        taskId: this.taskId,
        data: JSON.stringify(formDataIns)
      }
      const auditState = this.formData.auditState
      if (auditState === '不通过' || auditState === '否') {
        data.actionName = 'oppose'
        bpmComplete(data.actionName, data, this, '操作成功', function() {}, '')
      } else if (auditState === '通过') {
        const cancelParams = {
          form: JSON.stringify(this.formData),
          tableName: 't_material_requisition_details'
        }
        // 调用退库接口
        cancelStock(cancelParams).then(response => {
          const returnData = response.data
          if (response.state === 200) {
            formDataIns.cancelStockState = '退库成功'
            formDataIns.cancelStockTime = fecha.format(new Date, 'yyyy-MM-dd HH:mm:ss')
            // 构建参数
            formDataIns.formCopy = [
              {
                workorderType: '8',
                uniqueMainValue: returnData.oBillNo,
                uniqueSubValue: returnData.oBillNo,
                formId: '689245486179155968',
                tag: 1
              },
              {
                workorderType: '8',
                uniqueMainValue: formDataIns.workorderId,
                uniqueSubValue: returnData.oBillNo,
                formId: '689245590705405952',
                tag: 1
              },
              {
                workorderType: '8',
                uniqueMainValue: formDataIns.workorderId,
                uniqueSubValue: formDataIns.workorderId,
                formId: '689246724408999936',
                tag: 1
              }
            ]
            formDataIns.script = [
              {
                scriptContent: 'hbpScript.updateCancelStockNum4Negative("' + formDataIns.workorderId + '")'
              },
              {
                scriptContent: 'hbpScript.updateCancelStockBillNo("' + returnData.nBillNo + '", "' + returnData.oBillNo + '")'
              },
              {
                scriptContent: 'hbpScript.updateCancelStockDetailsMainId("' + returnData.oBillNo + '", "' + formDataIns.workorderId + '")'
              }
            ]
            data.data = JSON.stringify(formDataIns)

          } else {
            if (response.message) {
              this.$dialog.alert({ message: response.message })
            } else if (response.cause) {
              this.$dialog.alert({ message: response.cause })
            }
            data.actionName = 'custom'
            formDataIns.cancelStockState = '退库失败'
            formDataIns.cancelStockTime = fecha.format(new Date(), 'yyyy-MM-dd HH:mm:ss')
            data.data = JSON.stringify(formDataIns)
          }
          // 退库完成，调用流程完成接口
          completeProcess(data).then(saveRes => {
            if (saveRes.state === 200) {
              this.$dialog.alert({message: saveRes.message}).then(() => {
                _this.$emit('after-script', data.actionName)
                _this.$store.dispatch('setDataChange', false)
                _this.$router.replace({ path: '/bpmn-cust/pending-cust' })
              })
            } else {
              if (saveRes.message) {
                this.$dialog.alert({ message: saveRes.message })
              } else if (saveRes.cause) {
                this.$dialog.alert({ message: saveRes.cause })
              }
            }
          }).catch(error => {
            console.error(error.cause)
          })
        }).catch(error => {
          console.error(error.cause)
          data.actionName = 'custom'
          formDataIns.cancelStockState = '退库失败'
          formDataIns.cancelStockTime = fecha.format(new Date(), 'yyyy-MM-dd HH:mm:ss')
          data.data = JSON.stringify(formDataIns)
          completeProcess(data).then(saveRes => {
            if (saveRes.state !== 200) {
              if (saveRes.message) {
                this.$dialog.alert({ message: saveRes.message })
              } else if (saveRes.cause) {
                this.$dialog.alert({ message: saveRes.cause })
              }
            }
          }).catch(error => {
            console.error(error.cause)
          })
        })
      }
    }

    // 退库签字
    if (btn.attributes.code === 'signature') {
      if (!(this.$validator.errors.items.length === 0)) {
        this.$dialog.alert({ message: '表单还存在未规范的值!' })
        return
      }
      const formDataIns = this.formData
      const data = {
        actionName: 'agree',
        actionAlias: btn.attributes.code,
        taskId: this.taskId,
        data: JSON.stringify(formDataIns)
      }
      const auditState = this.formData.auditState
      if (auditState === '不通过' || auditState === '否') {
        data.actionName = 'oppose'
        bpmComplete(data.actionName, data, this, '操作成功', function() {}, '')
      } else if (auditState === '通过') {
        const cancelParams = {
          form: JSON.stringify(this.formData),
          tableName: 't_material_requisition_details'
        }
        // 签字接口
        signature(cancelParams).then(response => {
          if (response.state === 200) {
            bpmComplete(data.actionName, data, this, '操作成功', function() {}, '')
          } else {
            if (response.message) {
              this.$dialog.alert({ message: response.message })
            } else if (response.cause) {
              this.$dialog.alert({ message: response.cause })
            }
          }
        }).catch(error => {
          console.error(error.cause)
        })
      }
    }

    /**
     * 换表接单，若是先领后做的换表则需等待换表的完成
     */
    if (btn.attributes.code === 'replaceMeterDispatchList') {
      if (!(this.$validator.errors.items.length === 0)) {
        this.$dialog.alert({ message: '表单还存在未规范的值!' })
        return
      }
      const formDataIns = this.formData
      const data = {
        actionName: 'agree',
        actionAlias: btn.attributes.code,
        taskId: this.taskId,
        data: JSON.stringify(formDataIns)
      }
      const groupDes = formDataIns.groupDes
      if (groupDes && (groupDes === '3' || groupDes === '4')) {
        const dataParams = {
          workorderId: formDataIns.workorderId
        }
        verifyReceProcess(dataParams).then(response => {
          const state = response.state
          if (state === 200) {
            bpmComplete(data.actionName, data, this, '操作成功', function() {}, '')
          } else {
            _this.$dialog.alert(response.message)
          }
        }).catch(error => {
          console.error(error.cause)
        })
      } else {
        bpmComplete(data.actionName, data, this, '操作成功', function() {}, '')
      }
    }

    /**
     * 换表新建工单
     */
    if (btn.attributes.code === 'replaceMeterNewWorkorder') {
      const formData = this.getFormData()
      const _this = this
      const bpmnSetText = []
      const groupDes = formData.groupDes
      const formDatas = {}
      const data = {
        actionName: 'agree',
        actionAlias: btn.attributes.code,
        taskId: this.taskId,
        data: JSON.stringify(formData)
      }
      bpmComplete(data.actionName, data, this, '操作成功', function() {
        // if (groupDes && (groupDes === '3' || groupDes === '4')) {
        //   formDatas.groupDes = groupDes
        //   formDatas.formCopy = [
        //     {
        //       workorderType: '8',
        //       workorderNo: formData.workorderNo,
        //       formId: '665154697228713984',
        //       isChangeUniqueForBizKey: false
        //     },
        //     {
        //       workorderType: '34',
        //       workorderNo: formData.workorderNo,
        //       formId: '666939959734697984',
        //       isChangeUniqueForBizKey: true
        //     },
        //     {
        //       workorderType: '34',
        //       workorderNo: formData.workorderNo,
        //       formId: '667020372582858752',
        //       isChangeUniqueForBizKey: true
        //     },
        //     {
        //       workorderType: '34',
        //       workorderNo: formData.workorderNo,
        //       formId: '675391004374728704',
        //       isChangeUniqueForBizKey: true
        //     }
        //   ]
        //   bpmnSetText.push({
        //     defId: '666204695865327616',
        //     flowKey: 'Process_20n95f5',
        //     skipFirstNode: false,
        //     form: formDatas
        //   })
        // } else {
        //   return
        // }
        // let requisitionNo = ''
        // getData({ alias: 'lldj' }).then(response => {
        //   requisitionNo = response.data.id
        //   formDatas.requisitionNo = requisitionNo
        //   const dataParams = {
        //     bpmnSetText: JSON.stringify(bpmnSetText)
        //   }
        //   startCustomizeProcess(dataParams).then(response => {
        //     const state = response.state
        //     if (state !== 200) {
        //       this.$dialog.alert({ message: response.message })
        //     } else {
        //       _this.$toast.success(response.message)
        //       _this.$store.dispatch('setDataChange', false)
        //       _this.$router.replace({ path: '/bpmn-cust/pending-cust' })
        //     }
        //   }).catch(error => {
        //     console.error(error.cause)
        //   })
        // }).catch(error => {
        //   console.error(error.cause)
        // })
      }, '')
    }
  }
})
export default BpmnButton
