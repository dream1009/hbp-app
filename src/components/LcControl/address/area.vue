<template>
  <picker
    ref="picker"
    :class="b()"
    :title="title"
    :loading="loading"
    :columns="displayColumns"
    :item-height="itemHeight"
    :visible-item-count="visibleItemCount"
    show-toolbar
    value-key="name"
    @change="onChange"
    @confirm="$emit('confirm', $event)"
    @cancel="$emit('cancel', $event)"
  />
</template>

<script>
/**
 * 改造Vant原来版本，area控件 v1.1.16版本
 * 1、支持国家，
 * 2、支持等级
 * 3、支持最大区域和最新区域
 * 4、数据方式改变，为数组，不是code
 */
import create from 'vant/lib/utils/create'
import Picker from 'vant/lib/picker'
import util from './util'
// 等级 数组
const levelArr = util.levelArr

export default create({
  name: 'lc-area',
  components: {
    Picker
  },
  props: {
    value: Array,
    title: String,
    loading: Boolean,
    itemHeight: Number,
    visibleItemCount: Number,
    areaData: {
      type: Object,
      default: () => ({})
    },
    top: { // 最大区域，可选： country、province、city、district
      type: String,
      default: 'country',
      validator: val => {
        return util.oneOf(val, levelArr)
      }
    },
    topVal: { // 最大区域的值，如top='province'  topVal='CN'
      type: [String, Number],
      default: '0'
    },
    level: {// 最小区域，可选： country、province、city、district
      type: String,
      default: 'district',
      validator: val => {
        return util.oneOf(val, levelArr)
      }
    }
  },
  data() {
    return {
      columns: [{ values: [] }, { values: [] }, { values: [] }, { values: [] }]
    }
  },
  computed: {
    columnsNum() {
      return util.getLevelIndex(this.level) - util.getLevelIndex(this.top) + 1
    },
    displayColumns() {
      return this.columns.slice(0, +this.columnsNum)
    }
  },
  watch: {
    value() {
      this.setValues()
    },
    areaData: {
      deep: true,
      handler() {
        this.setValues()
      }
    }
  },

  mounted() {
    this.setValues()
  },

  methods: {
    // get list by type
    getList(type) {
      let result = []
      const list = this.areaData[type]
      if (!list) { return result }

      result = Object.keys(list).map(code => ({
        code,
        name: list[code]
      }))

      return result
    },

    // get index by code
    getIndex(list, code) {
      if (!code) { return 0 }
      for (let i = 0; i < list.length; i++) {
        if (list[i].code === (code + '')) {
          return i
        }
      }

      return 0
    },

    onChange(picker, values, index) {
      this.setValues(values, index)
      this.$emit('change', picker, values, index)
    },

    setValues(values, index) {
      const { picker } = this.$refs
      if (!picker) { return }
      if (!values) {
        values = this.value
        index = this.columnsNum - 1
      }
      let curList = [] // 当前列表
      let supCode = this.topVal// 上一级的code
      const indexs = []
      for (let i = 0; i < this.columnsNum; i++) {
        if (values[i - 1] && (i - 1 <= index)) {
          supCode = values[i - 1] ? values[i - 1].code : supCode
        }

        curList = this.getList(supCode)
        picker.setColumnValues(i, curList)
        supCode = curList.length > 0 ? curList[0].code : ''

        indexs[i] = values[i] ? (this.getIndex(curList, values[i].code) || 0) : 0
      }

      picker.setIndexes(indexs)
    },
    // 获取选择的值
    getValues() {
      return this.$refs.picker ? this.$refs.picker.getValues() : []
    },
    //	重置所有选项到第一项
    reset() {
      this.setValues()
    }
  }
})
</script>
