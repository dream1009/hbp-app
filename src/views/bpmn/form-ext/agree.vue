<template>
  <div/>
  <!--  <van-popup slot="fr-ext" v-model="popup" class="lc-fullscreen-popup">
      <div class="lc-fixed-top">
        <van-nav-bar
          :title="actionName=='agree'?'同意':'反对'"
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
              &lt;!&ndash; <van-tag type="danger" @click="showWarnMessage">?</van-tag> &ndash;&gt;
            </template>
            <van-switch v-model="checked" size="20px" />
          </van-cell>
        </van-cell-group>
        <van-cell-group>
          <van-field
            v-show="!options.hideOpinion===true"
            v-model="form.opinion"
            class="fields"
            autocapitalize="off"
            autocorrect="off"
            type="textarea"
            placeholder="请输入意见"
            rows="4"
            autosize
          >
            <template slot="label">
              {{ opinionLabel }}
              <div>
                <van-button size="mini" plain type="primary" @click="onCommonStatment">常用语</van-button>
              </div>
            </template>
          </van-field>
        </van-cell-group>

        &lt;!&ndash;<van-cell-group v-if="actionName==='agree'">
          <van-lc-checker
            v-show="jumpOptionShow"
            v-model="jumpType"
            :options="jumpOption"
            label="多选器"
            type="radio"
            checker
          />

          <div v-show="(jumpType==='free'||jumpType==='select')&&(options.hidePath==='false'||options.hidePath===false)">
            <van-lc-radio
              v-model="destination"
              :label="pathLabel"
              :options="path"
              placeholder="请选择"
              clearable
              required
            />
            <van-lc-checkbox
              v-model="userCheck"
              :label="userLabel"
              :options="user"
              placeholder="请选择"
              store="array"
              clearable
              required
            />
          </div>
          <div
            v-for="(item,index) in commonPath"
            v-show="jumpType==='common'&&(options.hidePath==='false'||options.hidePath===false)"
            :key="item.nodeId+index"
          >
            <van-cell :value="item.name" title="路径" />
            <van-lc-checkbox
              v-model="commonUserCheck[item.nodeId]"
              :label="userLabel"
              :options="commonUser[item.nodeId]"
              placeholder="请选择"
              store="array"
              value-key="id"
              label-key="name"
            />
          </div>
        </van-cell-group>&ndash;&gt;
      </div>
      &lt;!&ndash;<lc-toolbar :actions="actions" />&ndash;&gt;
      <common-statment
        v-model="commonStatmentPopup"
        @confirm="handleCommonStatment"
      />
    </van-popup>-->
</template>

<script>
    import Vue from 'vue'
    import LcControl from '@/components/LcControl'

    Vue.use(LcControl)
    import {complete} from '@/api/platform/bpmn/action'
    import {operateRedirect} from '@/utils/redirect'
    import {toAgree} from '@/api/platform/bpmn/bpmn'
    /* import LcToolbar from '@/components/LcToolbar'
    import CommonStatment from '@/components/CommonStatment'*/

    export default {
        /* components: {
          LcToolbar,
          CommonStatment
        },*/
        inject: ['reload'],
        props: {
            value: Boolean,
            taskId: String,
            bpmnInstId: String,
            data: [Object, String],
            actionName: String,
            version: Number
        },
        data() {
            return {
                popup: false,
                opinionLabel: '',
                form: {
                    data: '',
                    taskId: this.taskId,
                    actionName: this.actionName,
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

                commonStatmentPopup: false
            }
        },
        computed: {
            actions() {
                if (!this.actionName) {
                    return []
                }
                return [{
                    'name': this.$t('common.button.' + this.actionName),
                    'buttonType': 'primary',
                    'callback': this.onSelect
                }]
            }
        },
        watch: {
            value() {
                this.popup = this.value
                if (this.popup) {
                    this.form.opinion = ''
                    this.loadData()
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
            onCommonStatment() {
                this.commonStatmentPopup = true
            },
            handleCommonStatment(data) {
                this.form.opinion = data
            },
            closePopup() {
                this.$emit('input', false)
            },
            onSave(data) {
                complete(data).then(response => {
                    this.$emit('after-script', this.actionName)
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
            },
            loadData() {
                this.form.taskId = this.taskId
                this.form.actionName = this.actionName
                this.onSelect()
                // this.initOpinionLabel()
                // toAgree({
                //   taskId: this.taskId,
                //   actionName: this.actionName
                // }).then(response => {
                //   this.options = response.data
                //   this.initData()
                //   // 自动提交
                //   this.onSelect()
                // }).catch(error => {
                //   console.error(error)
                // })
            },
            initOpinionLabel() {
                // 设置意见文本
                if (this.actionName === 'agree') {
                    this.opinionLabel = '审批意见'
                } else if (this.actionName === 'oppose') {
                    this.opinionLabel = '反对意见'
                } else if (this.actionName === 'abandon') {
                    this.opinionLabel = '弃权原因'
                } else if (this.actionName === 'agreeTrans') {
                    this.opinionLabel = '审批意见'
                } else if (this.actionName === 'opposeTrans') {
                    this.opinionLabel = '反对意见'
                }
            },
            initData() {
                const options = this.options

                // 设置默认常用语
                if (options.defaultCommonStatment) {
                    this.form.opinion = options.defaultCommonStatment.value
                }

                this.form.taskId = options.taskId
                this.form.actionName = options.actionName

                // 还原数组，避免重新打开无限增加现象
                this.jumpOption = []
                if (options.jumpType.indexOf('common') !== -1) {
                    this.jumpOption.push({'label': '正常跳转', 'value': 'common'})
                }
                if (options.jumpType.indexOf('select') !== -1) {
                    this.jumpOption.push({'label': '选择路径跳转', 'value': 'select'})
                }
                if (options.jumpType.indexOf('free') !== -1) {
                    this.jumpOption.push({'label': '自由跳转', 'value': 'free'})
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
                form.data = JSON.stringify(this.data)
                form.destination = this.destination
                form.version = this.version
                if (this.actionName === 'agree') {
                    form.nodeUsers = this.setNodeUsers()
                }
                this.onSave(this.form)
            },
            initPath(path) {
                this.path = []
                this.form.destination = ''
                for (var i = 0; i < path.length; i++) {
                    this.path.push({label: path[i].name, value: path[i].nodeId})
                }
            },
            initUser(users) {
                this.user = []
                this.userCheck = []
                if (this.$utils.isEmpty(this.destination)) return
                const temp = users[this.destination]
                for (var i = 0; i < temp.length; i++) {
                    this.user.push({label: temp[i].name, value: temp[i].id, 'type': temp[i].type})
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
                // const jumpType = this.jumpType ? this.jumpType : 'common'
                // let userArray = []
                const nodeUsers = []
                // let users = []
                // let nodes = []
                // let i = 0
                // let j = 0
                // if (jumpType === 'common') {
                //   users = this.options.pathOutgoingNodesUsersMap
                //   nodes = this.options.pathOutgoingNodes
                //   for (i = 0; i < nodes.length; i++) {
                //     userArray = []
                //     for (j = 0; j < users[nodes[i].nodeId].length; j++) {
                //       const user = users[nodes[i].nodeId][j]
                //       userArray.push({
                //         id: user.id,
                //         name: user.name,
                //         type: user.type,
                //         groupType: user.partyType || ''
                //       })
                //     }
                //     nodeUsers.push({
                //       jumpType: jumpType,
                //       nodeId: nodes[i].nodeId,
                //       executors: userArray
                //     })
                //   }
                // } else {
                //   if (jumpType === 'select') {
                //     users = this.options.outgoingNodesUsersMap
                //   } else if (jumpType === 'free') {
                //     users = this.options.allNodeDefUsersMap
                //   }
                //   userArray = []
                //   for (i = 0; i < users[this.destination].length; i++) {
                //     const user = users[this.destination][i]
                //     userArray.push({
                //       id: user.id,
                //       name: user.name,
                //       type: user.type,
                //       groupType: user.partyType || ''
                //     })
                //   }
                //   nodeUsers.push({
                //     jumpType: jumpType,
                //     nodeId: this.destination,
                //     executors: userArray
                //   })
                // }
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
  .fields {
    .van-cell__title {
      max-width: 125px;
    }
  }
</style>
