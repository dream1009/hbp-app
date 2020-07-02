<template>
  <div class="lc-cell-wrapper">
    <cell-group :border="border">
      <cell
        :title="label"
        :center="center"
        :border="border"
        :class="bem({
          error,
          [`label-${labelAlign}`]: labelAlign
        })"
      >
        <slot slot="title" name="label" />
        <div :class="bem('body')">
          <van-button v-if="hasCommonStatment && !readonly" size="mini" plain type="primary" @click="onCommonStatment">常用语</van-button>
        </div>
      </cell>

      <cell v-if="!readonly">
        <div :class="bem('body')">
          <van-field
            v-model="opinion"
            type="textarea"
            placeholder="请输入审批意见"
            autocapitalize="off"
            autocorrect="off"
            @input="onInput"
          />
        </div>
      </cell>
      <cell v-if="data && data.length >0">
        <div :class="bem('body')">
          <div class="table-responsive">
            <table v-if="layout==='horizontal'" class="table">
              <tbody>
                <tr v-for="(item,i) in data" :key="item.id+i">
                  <template v-for="(option,j) in options">
                    <td v-if="option.checked" :key="j">
                      {{ option.label }}:{{ item[option.value] }}
                    </td>
                  </template>
                </tr>
              </tbody>
            </table>
            <template v-else>
              <table v-for="(item,i) in data" :key="item.id+i" class="table" style="border-bottom: 1px solid #eee;">
                <tr v-for="(option,j) in options" :key="j">
                  <td v-if="option.checked">
                    {{ option.label }}:{{ item[option.value] }}
                  </td>
                </tr>
              </table>
            </template>
          </div>
        </div>
      </cell>
    </cell-group>
    <common-statment
      v-model="commonStatmentPopup"
      @confirm="onInput"
    />
  </div>
</template>
<script>
import create from '../utils/create'
import CommonStatment from '@/components/CommonStatment'
// import { isObj } from 'vant/lib/utils'

export default create({
  name: 'lc-approval-opinion',
  components: {
    CommonStatment
  },
  props: {
    value: [String, Number],
    icon: String,
    label: String,
    desc: String,
    error: Boolean,
    height: [String, Number],
    center: Boolean,
    isLink: Boolean,
    leftIcon: String,
    readonly: Boolean,
    required: Boolean,
    clearable: Boolean,
    labelAlign: String,
    inputAlign: String,
    onIconClick: Function,
    autosize: [Boolean, Object],
    errorMessage: String,
    type: {
      type: String,
      default: 'text'
    },
    border: {
      type: Boolean,
      default: true
    },
    data: {
      type: Array
    },
    hasCommonStatment: {
      type: Boolean,
      default: true
    },
    layout: {
      type: String,
      default: 'horizontal'
    },
    options: {
      type: Array,
      default: () => {
        return [{
          checked: true,
          value: 'auditorName',
          label: '审批人'
        }, {
          checked: true,
          value: 'completeTime',
          label: '审批时间'
        }, {
          checked: true,
          value: 'statusName',
          label: '审批状态'
        }, {
          checked: true,
          value: 'opinion',
          label: '审批意见'
        }]
      }
    }

  },

  data() {
    return {
      commonStatmentPopup: false,
      opinion: ''
    }
  },
  methods: {
    onCommonStatment() {
      this.commonStatmentPopup = true
    },
    onInput(data) {
      this.opinion = data
      this.$emit('input', data)
    }
  }
})
</script>

