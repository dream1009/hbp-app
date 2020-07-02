<template>
  <div class="flow-diagram">
    <div
      v-if="statusColorList.length >0"
      class="legend">
      <van-collapse v-model="activeNames">
        <van-collapse-item name="1">
          <div slot="title" >流程图图示(<span class="red" >双击节点查看节点的审批历史</span>)</div>
          <van-row gutter="5">
            <van-col v-for="(status,index) in statusColorList" :key="status.value+index" span="8" class="van-ellipsis" style="padding-top:5px;">
              <van-icon :style="{'color':status.color}" name="border" /> {{ status.value }}
            </van-col>
          </van-row>
        </van-collapse-item>
      </van-collapse>
    </div>
    <div :id="id" class="canvas" style="height:100%;padding-top:20px;" />
    <!--工具栏-->
    <div v-if="toolbar" class="io-zoom-controls">
      <ul class="io-zoom-reset io-control io-control-list">
        <li>
          <button title="reset zoom" @click="zoomReset">
            <span class="van-icon van-icon-drag " />
          </button>
        </li>
      </ul>
      <ul class="io-zoom io-control io-control-list">
        <li>
          <button title="zoom in" jsaction="click:bio.zoomIn" @click="zoomIn">
            <span class="van-icon van-icon-plus" />
          </button>
        </li>
        <li>
          <hr>
        </li>
        <li>
          <button href title="zoom out" jsaction="click:bio.zoomOut" @click="zoomOut">
            <span class="van-icon van-icon-minus" />
          </button>
        </li>
      </ul>
    </div>
    <!--审批历史-->
    <van-popup v-model="popup" class="lc-fullscreen-popup">
      <van-nav-bar
        :title="nodeApproval.title"
        :left-text="$t('close')"
        @click-left="closePopup"
      />
      <div class="lc-fixed-navbar">
        <template v-if="nodeApproval.hasApproval">
          <van-cell-group v-for="(approval,index) in nodeApproval.data" :key="index">

            <van-cell v-if="approval.auditor" title="执行人" >
              <van-tag
                plain
                type="success">
                {{ approval.auditorName }}
              </van-tag>
            </van-cell>
            <van-cell v-else title="候选人" >
              <!-- :value="getCandidate(approval.qualifiedExecutor,nodeApproval.bpmNodeUserShowCount)" -->
              <van-tag
                v-for="(qualifiedExecutor,j) in approval.qualifiedExecutor"
                :key="j"
                plain
                type="primary">
                {{ qualifiedExecutor.executor }}
              </van-tag>
            </van-cell>
            <van-cell
              :value="approval.createTime|formatDate('yyyy-MM-dd HH:mm:ss')"
              title="开始时间" />
            <van-cell
              v-if="approval.completeTime"
              :value="approval.completeTime|formatDate('yyyy-MM-dd HH:mm:ss')"
              title="结束时间" />
            <van-cell
              v-if="approval.completeTime"
              :value="approval.durMs|timeDuration"
              title="审批用时" />
            <van-cell
              :value="approval.statusName"
              title="审批状态" />
            <van-cell
              v-if="approval.completeTime"
              :value="approval.opinion"
              title="审批意见" />
            <div style="height:20px;background: #f8f8f8;"/>
          </van-cell-group>

        </template>
        <template v-else>
          <van-cell title="暂定候选人" >
            <template v-if="nodeApproval.data && nodeApproval.data.length >0">
              <van-tag
                v-for="(d,j) in nodeApproval.data"
                :key="j"
                plain
                type="primary">
                {{ d.name }}
              </van-tag>
            </template>
            <template v-else>
              暂无审批人
            </template>
          </van-cell>
        </template>
      </div>

    </van-popup>
  </div>
</template>
<script>
import { getFlowDiagram, getNodeApproval } from '@/api/platform/bpmn/bpmn'
import 'bpmn-js/dist/assets/diagram-js.css'
import BpmnViewer from 'bpmn-js'
// import Diagram from 'diagram-js'

import SelectionModule from 'diagram-js/lib/features/selection' // select elements
import TouchModule from 'diagram-js/lib/navigation/touch' // touch
import ZoomScrollModule from 'diagram-js/lib/navigation/zoomscroll' // zoom canvas
import MoveCanvasModule from 'diagram-js/lib/navigation/movecanvas' // scroll canvas
import ModelingModule from 'diagram-js/lib/features/modeling' // basic modeling (create/move/remove shapes/connections)
// import MoveModule from 'diagram-js/lib/features/move' // move shapes
import OutlineModule from 'diagram-js/lib/features/outline' // show element outlines
// import LassoToolModule from 'diagram-js/lib/features/lasso-tool' // lasso tool for element selection
import PaletteModule from 'diagram-js/lib/features/palette' // palette
// import CreateModule from 'diagram-js/lib/features/create' // create elements
import ContextPadModule from 'diagram-js/lib/features/context-pad' // context pad for elements,
import ConnectModule from 'diagram-js/lib/features/connect' // connect elements
// import RulesModule from 'diagram-js/lib/features/rules' // rules
export default {
  name: 'FlowDiagram',
  props: {
    defId: String,
    taskId: String,
    bpmnInstId: String,
    toolbar: {
      type: Boolean,
      default: true
    },
    height: Number,
    width: Number,
    autoHeight: Boolean
  },
  data() {
    return {
      activeNames: [],
      id: 'ibps-flow-diagram' + this.$utils.guid(), // 随机个id避免一个页面多个流程图
      statusColorList: [],
      viewer: null,
      popup: false,
      nodeApproval: {},
      cacheNodeApproval: {}
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      // 当前窗口高度
      const height = this.autoHeight ? '100%' : window.innerHeight
      this.viewer = new BpmnViewer({
        container: document.getElementById(this.id),
        height: height,
        additionalModules: [
          SelectionModule,
          ZoomScrollModule,
          MoveCanvasModule,
          ModelingModule,
          // MoveModule,
          OutlineModule,
          // LassoToolModule,
          PaletteModule,
          // CreateModule,
          ContextPadModule,
          ConnectModule,
          // RulesModule,
          TouchModule
        ]
      })
      getFlowDiagram({
        defId: this.defId,
        taskId: this.taskId,
        bpmnInstId: this.bpmnInstId
      }).then(response => {
        const data = response.data
        const styleMap = data.styleMap
        this.statusColorList = this.$utils.isEmpty(styleMap) ? [] : data.statusColorList
        this.viewer.importXML(data.xml, (err) => {
          if (!err) {
            this.viewer.get('canvas').zoom('fit-viewport')

            this.handleColor(styleMap)
            if (this.$utils.isEmpty(this.defId)) { this.handleEventBus() }
          } else {
            console.log('[flow-diagram] something went wrong:', err)
          }
        })
      })
    },
    /**
     * 染色
     */
    handleColor(styleMap) {
      if (this.$utils.isEmpty(styleMap) || this.$utils.isEmpty(this.statusColorList)) {
        return
      }
      const canvas = this.viewer.get('canvas')
      const elementRegistry = this.viewer.get('elementRegistry')
      for (const key in styleMap) {
        if (styleMap.hasOwnProperty(key)) {
          const style = styleMap[key]
          const shape = elementRegistry.get(key)// 存在的节点才上色
          if (shape) {
            canvas.addMarker(key, style.status)
          }
        }
      }
    },
    handleEventBus() {
      const eventBus = this.viewer.get('eventBus')
      // you may hook into any of the following events
      const events = [
        'element.click',
        'element.dblclick'
      ]
      events.forEach((event) => {
        eventBus.on(event, (e) => {
          // e.element = the model element
          // e.gfx = the graphical element
          // e.preventDefault()
          // e.stopPropagation()
          if (e.element.type !== 'bpmn:UserTask') {
            return
          }
          const id = e.element.id

          if (this.cacheNodeApproval[id]) {
            this.popup = true
            this.nodeApproval = this.cacheNodeApproval[id]
            return
          }

          getNodeApproval({
            taskId: this.taskId,
            bpmnInstId: this.bpmnInstId,
            nodeId: id
          }).then(response => {
            var data = response.data
            if (!data.hasApproval && !data.data) {
              this.$toast('暂无审批历史')
              return
            }
            this.popup = true
            this.nodeApproval = { ...response.data, title: e.element.businessObject.name }
            this.cacheNodeApproval[id] = this.nodeApproval
          })
        })
      })
    },
    closePopup() {
      this.popup = false
    },
    zoomReset() {
      this.viewer.get('zoomScroll').reset()
    },
    zoomOut() {
      this.viewer.get('zoomScroll').stepZoom(-1)
    },
    zoomIn() {
      this.viewer.get('zoomScroll').stepZoom(1)
    }
  }
}
</script>
<style>
.bjs-powered-by {
  display: none;
}
.pending:not(.djs-connection) .djs-visual > :nth-child(1) {
  stroke: #f55353 !important;
}
.submit:not(.djs-connection) .djs-visual > :nth-child(1) {
  stroke: #f89801 !important;
}
.resubmit:not(.djs-connection) .djs-visual > :nth-child(1) {
  stroke: #e8d367 !important;
}
.agree:not(.djs-connection) .djs-visual > :nth-child(1) {
  stroke: #58bc5b !important;
}

.oppose:not(.djs-connection) .djs-visual > :nth-child(1) {
  stroke: #2886c6 !important;
}
.reject:not(.djs-connection) .djs-visual > :nth-child(1) {
  stroke: #700101 !important;
}
.rejectToStart:not(.djs-connection) .djs-visual > :nth-child(1) {
  stroke: #a54e4e !important;
}
.recover:not(.djs-connection) .djs-visual > :nth-child(1) {
  stroke: #569296 !important;
}

.recoverToStart:not(.djs-connection) .djs-visual > :nth-child(1) {
  stroke: #58a7cb !important;
}

.sign_pass:not(.djs-connection) .djs-visual > :nth-child(1) {
  stroke: #6fa547 !important;
}
.sign_no_pass:not(.djs-connection) .djs-visual > :nth-child(1) {
  stroke: #afab3d !important;
}
.abandon:not(.djs-connection) .djs-visual > :nth-child(1) {
  stroke: #026670 !important;
}
.manual_end:not(.djs-connection) .djs-visual > :nth-child(1) {
  stroke: #bc79b8 !important;
}

.complete:not(.djs-connection) .djs-visual > :nth-child(1) {
  stroke: #5b6956 !important;
}
.suspend:not(.djs-connection) .djs-visual > :nth-child(1) {
  stroke: #c33a1f !important;
}

.skip:not(.djs-connection) .djs-visual > :nth-child(1) {
  stroke: #6fa547 !important;
}
</style>

<style lang="scss" scoped>
.flow-diagram {
  .van-hairline--top-bottom::after {
    border-width: 0;
  }

  .io-control {
    background: #fff;
    border-radius: 2px;
    border: solid 1px #e0e0e0;
    padding: 5px;
  }
  .io-zoom-controls {
    width: auto;
    position: fixed;
    right: 15px;
    bottom: 90px;
  }
  .io-zoom-reset {
    margin-bottom: 10px;
  }

  .io-control-list {
    list-style: none;
    padding: 5px;
    margin: 0;
  }

  .io-control-list a,
  .io-control-list a:visited,
  .io-control-list button {
    padding: 0;
    outline: none;
    cursor: pointer;
    font-size: 22px;
    line-height: 26px;
    color: #555555;
    background: none;
    border: none;
  }

  .io-control-list a:hover,
  .io-control-list a:visited:hover,
  .io-control-list button:hover {
    color: #333333;
  }

  .io-control-list a.inactive,
  .io-control-list a:visited.inactive,
  .io-control-list button.inactive {
    color: #e0e0e0;
    cursor: default;
  }

  .io-control-list.io-horizontal,
  .io-control-list.io-horizontal li {
    display: inline-block;
  }

  .io-control-list.io-horizontal a {
    padding: 2px;
    margin: 0 5px;
  }

  .io-control-list.io-horizontal button {
    margin: 0 5px;
  }

  .io-control hr {
    border: none;
    border-top: solid 1px #eee;
  }
}
</style>

