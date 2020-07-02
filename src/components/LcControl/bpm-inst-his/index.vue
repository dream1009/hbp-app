<template>
  <div class="lc-bpm-inst-his-wrapper lc-cell-wrapper">
    <cell-group :border="border">
      <cell
        :title="label"
        :required="required"
        :center="center"
        :border="border"
        :class="bem({
          error,
          disabled: $attrs.disabled,
          [`label-${labelAlign}`]: labelAlign
        })"
      >
        <slot slot="title" name="label" />
        <div v-if="!readonly" :class="bem('body')" @click="onClick">
          <icon
            v-if="!readonly"
            slot="left-icon"
            name="add-o"
            class="van-cell__left-icon"
          />
          <div :class="bem('control', inputAlign)">
            <div
              :class="bem('placeholder')"
            >
              {{ placeholder }}
            </div>
          </div>
        </div>
        <div
          v-if="errorMessage"
          :class="bem('error-message')"
          v-text="errorMessage"
        />
      </cell>
      <div v-if="instList.length >0">
        <div v-for="(item,index) in instList" :key="item.id+index">
          <van-cell>
            <h4>
              <span>{{ item['procDefName'] }}</span>
              <span class="task-name">【{{ item.procDefKey }}】</span>
              <span v-if="!readonly" style="float:right;">
                <i
                  class="van-icon van-icon-close"
                  style="color: #f44;"
                  @click="onRemove(index)"
                /></span>
            </h4>
            <p class="alink" @click="showBpmnForm(item)">
              {{ item['subject'] }}
            </p>
            <p class="time">
              发起时间: {{ item.createTime|formatDate('yyyy-MM-dd HH:mm:ss') }}
              <br>
              结束时间: {{ item.endTime|formatDate('yyyy-MM-dd HH:mm:ss') }}
            </p>
          </van-cell>
        </div>
      </div>
      <div v-else>
        <h4 v-if="readonly" style="text-align: center;color: gray; padding: 5px 0px;">
          暂无数据
        </h4>
      </div>
      <!-- <div class="table-responsive">
        <table class="table table-bordered">
          <thead>
            <tr>
              <th v-if="!readonly" style="width:50px;">操作</th>
              <th style="width:200px;">实例标题</th>
              <th style="width:100px;">流程名称</th>
              <th style="width:80px;">流程Key</th>
              <th>发起人</th>
              <th>发起时间</th>
              <th>结束时间</th>
            </tr>
          </thead>
          <tbody v-if="instList.length >0">
            <tr v-for="(inst,i) in instList" :key="inst.id">
              <td v-if="!readonly">
                <i
                  class="van-icon van-icon-close"
                  style="color: #f44;"
                  @click="onRemove(i)"/>
              </td>
              <td @click="showBpmnForm(inst)"><a href="javascript:void(0)">{{ inst.subject }}</a></td>
              <td>{{ inst.procDefName }}</td>
              <td>{{ inst.procDefKey }}</td>
              <td>{{ inst.creator }}</td>
              <td>{{ inst.createTime }}</td>
              <td>{{ inst.endTime }}</td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr><td colspan="7">暂无数据</td></tr>
          </tbody>

        </table>
      </div> -->

      <div
        v-if="desc"
        :class="bem('desc')"
        v-text="desc"
      />
    </cell-group>
    <instance-dialog
      v-model="instList"
      :visible="showPopup"
      :params="params"
      @confirm="handleConfirm"
      @close="popup => showPopup= popup"
    />
  </div>
</template>
<script>
import create from '../utils/create'
import InstanceDialog from './dialog'

export default create({
  components: {
    InstanceDialog
  },
  name: 'lc-bpm-inst-his',
  props: {
    value: String,
    icon: String,
    label: String,
    desc: String,
    error: Boolean,
    center: Boolean,
    leftIcon: String,
    readonly: Boolean,
    required: Boolean,
    clearable: {
      type: Boolean,
      default: true
    },
    labelAlign: String,
    placeholder: {
      type: String,
      default: '请选择流程实例'
    },
    inputAlign: {
      type: String,
      default: 'left'
    },
    errorMessage: String,
    border: {
      type: Boolean,
      default: true
    },
    params: {
      type: Object
    }
  },
  watch: {
    value: {
      handler: function(val, oldVal) {
        this.instList = this.$utils.isNotEmpty(val) ? this.$utils.parseData(val) : []
      },
      immediate: true
    }
  },
  data() {
    return {
      showPopup: false,
      instList: []
    }
  },
  methods: {
    onClick() {
      if (this.readonly) { return }
      this.showPopup = true
    },
    handleConfirm(data) {
      this.handleEmitInput(data)
    },
    handleEmitInput(data) {
      this.$emit('input', this.$utils.isNotEmpty(data) ? JSON.stringify(data) : '')
    },
    showBpmnForm(item) {
      this.$router.push({
        name: 'bpmnFormInstance',
        query: {
          instanceId: item.id
        },
        params: {
          title: item.procDefName
        }})
    },
    onRemove(i) {
      this.instList.splice(i, 1)
      this.handleEmitInput(this.instList)
    }
  }
})
</script>

<style lang="scss" scoped>
.lc-bpm-inst-his-wrapper {
  .time {
    color: #999999;
    font-size: 12px;
  }
  .alink {
    color: #c98eec;
    white-space: nowrap;
  }
}
</style>

