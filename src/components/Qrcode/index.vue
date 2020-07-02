<template>
  <van-popup
    v-model="showQrcode"
    closeable
    close-icon="close"
    position="bottom"
    :style="{width: '100%', height: '100%' }"
>
    <div id="qrCode">
      <van-nav-bar
        :title="'二维码'"
        :left-text="leftText"
        :right-text="rightText"
        left-arrow
        @click-left="onCancel"
        @click-right="onConfirm"
      />
      <div id="code"/>
      <canvas id="canvas"/>
    </div>
  </van-popup>
</template>
<script>
import QRCode from 'qrcode'
import fecha from '@/utils/fecha'
import { complete } from '@/api/platform/bpmn/action'
import { payToOrderState, updateToLogAndPayment } from '@/api/platform/gathering/gathering'

export default {
  inject: ['reload'],
  name: 'Qrcode',
  props: {
    taskId: String,
    data: Object,
    dataDef: Object
  },
  data() {
    return {
      showQrcode: false,
      msg: 'HBP APP',
      leftText: '返回',
      rightText: '确认收款',
      hostname: 'www.z3pipe.com',
      port: 2438,
      clientId: '',
      timeout: 5,
      keepAlive: 50,
      cleanSession: false,
      ssl: false,
      userName: 'mao2080',
      password: '123',
      topic: '/mqtt/pay/',
      client: [],
      reconnectTimeout: 2000,
      mqtt: {},
      orderNo: '',
      paymentMethod: ''
    }
  },
  methods: {
    // 实时通信
    MQTTconnect() {
      this.mqtt = new Paho.Client(this.hostname, this.port, this.clientId)
      // 建立客户端实例
      const options = {
        invocationContext: {
          host: this.hostname,
          port: this.port,
          path: this.mqtt.path,
          clientId: this.clientId
        },
        timeout: this.timeout,
        keepAliveInterval: this.keepAlive,
        cleanSession: this.cleanSession,
        useSSL: this.ssl,
        userName: this.userName,
        password: this.password,
        onSuccess: this.onConnect,
        onFailure: function(e) {
          console.log(e)
          // 连接失败定时重连
          setTimeout(this.MQTTconnect(), this.reconnectTimeout)
        }
      }
      this.mqtt.onConnectionLost = this.onConnectionLost
      this.mqtt.onMessageArrived = this.onMessageArrived
      this.mqtt.connect(options)
    },
    onConnectionLost(response) {
      console.log('异常掉线，掉线信息为:' + response.errorMessage)
      this.clientId = this.orderNo + '-' + new Date().getTime()
      this.MQTTconnect()
    },

    // 接收到消息，处理
    onMessageArrived(message) {
      console.log('time' + fecha.format(new Date(), 'yyyy-MM-dd HH:mm:ss'))
      console.log('支付消息通知' + message.payloadString)
      const data = JSON.parse(message.payloadString)
      if (data.state === 'success' && data.orderNo === this.orderNo && data.outtradeno === this.orderNo) {
        this.checkPayState().then(data => {
          const state = data.orderState
          const taskId = data.taskId
          if (state === '1') {
            this.$router.replace({ name: 'bpmnForm', query: { taskId: taskId }})
            this.reload()
          }
        })
      }
    },
    // 连接
    onConnect() {
      console.log('time' + fecha.format(new Date(), 'yyyy-MM-dd HH:mm:ss'))
      // 连接成功，订阅主题
      console.log('topic===' + this.topic)
      this.mqtt.subscribe(this.topic, { qos: 0 })
      console.log('成功连接')
      // 发布一个消息
      this.mqtt.send('login', "{\'command\':\"login\",\"clientId\":\"" + this.mqtt.clientId + '\'}', 0)
    },
    updateQrcode() {
      const { qrcodeData: { url, showQrcode = false } = {}} = this.dataDef || {}
      this.orderNo = this.dataDef.qrcodeData.orderNo
      this.formData = this.dataDef.qrcodeData.data
      this.paymentMethod = this.formData.paymentMethod
      this.showQrcode = showQrcode
      this.topic = '/mqtt/pay/' + this.orderNo
      this.clientId = this.orderNo + '-' + new Date().getTime()
      if (url) {
        setTimeout(function() {
          const canvas = document.getElementById('canvas')
          QRCode.toCanvas(canvas, url, function(error) {
            if (error) console.error(error)
            console.log('QRCode success!')
          })
        }, 1000)
        this.MQTTconnect()
      }
    },
    checkPayState() {
      return new Promise((resolve, reject) => {
        const params = { orderNo: this.orderNo, paymentMethod: this.paymentMethod }
        payToOrderState(params).then(response => {
          if (response.state === 200) {
            resolve(response.data)
          }
        })
      })
    },
    pay() {
      const formData = this.formData
      const data = this.data
      data.buttonType = '支付'
      data.actionAlias = 'pay'
      data.actionName = 'agree'
      data.taskId = this.taskId
      formData.paymentState = '已收费'
      delete formData.paymentTime
      data.data = JSON.stringify(formData)
      const tranParams = {
        datas: JSON.stringify(formData)
      }
      updateToLogAndPayment(tranParams).then(response => {
        if (response.state === 200) {
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
              this.$router.push({ path: 'bpmn-cust/pending-cust' })
            }
          }).catch(error => {
            console.error(error.cause)
          })
        }
      }).catch(error => {
        console.error(error.cause)
      })
    },
    onCancel() {
      this.checkPayState().then(data => {
        const state = data.orderState
        const taskId = data.taskId
        if (state === '1') {
          this.$dialog.confirm({ message: '订单已被支付！' }).then(() => {
            this.$router.replace({ name: 'bpmnForm', query: { taskId: taskId }})
            this.reload()
          })
        } else {
          this.$dialog.confirm({ message: '支付未完成，确认返回吗？' }).then(() => {
            this.showQrcode = false
          })
        }
      })
    },
    onConfirm() {
      this.checkPayState().then(data => {
        const state = data.orderState
        const taskId = data.taskId
        if (state === '0') {
          this.$dialog.alert({ message: '请扫二维码支付!' })
          return
        }
        if (state === '1') {
          this.$router.replace({ name: 'bpmnForm', query: { taskId: taskId }})
          this.reload()
        }
        if (state === '2') {
          // 返回之前页面
          this.$dialog.alert({ message: '二维码失效!' })
          return
        }
      })
    }
  }
}
</script>
<style lang='scss'>
  #qrCode{
    height: 100%;
    text-align: center;
  }
  #code {
    height: 15%;
  }
  #canvas{
    height: 40%;
    width: 50%;
  }
</style>
