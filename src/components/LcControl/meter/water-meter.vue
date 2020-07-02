<template>
  <div class="meter">
    <van-nav-bar
      v-if="!readonly"
      :title="'户下表'"
      :left-text="leftText"
      :right-text="rightText"
      left-arrow
      @click-left="onCancel"
      @click-right="onConfirm"
    />
    <van-nav-bar
      v-if="readonly"
      :title="'户下表'"
      :left-text="leftText"
      :right-text="rightText"
      left-arrow
      @click-left="onCancel"
    />
    <div class="lc-table-wrapper lc-cell-wrapper">
      <van-cell-group>
        <van-lc-field v-model="hh" label="户号" placeholder="请输入户号" :readonly="readonly" clearable />
        <van-lc-field v-model="gyh" label="钢印号" placeholder="请输入钢印号" :readonly="readonly" clearable />
        <van-lc-field v-model="sbbh" label="水表编号" placeholder="请输入水表编号" :readonly="readonly" clearable />
        <van-lc-field v-model="cb" label="册本号" placeholder="请输入册本号" :readonly="readonly" clearable />
        <van-lc-field v-model="dz" label="地址" placeholder="请输入地址" :readonly="readonly" clearable> <van-button slot="button" size="small" type="primary" :disabled="readonly" @click="query()">查询</van-button></van-lc-field>
      </van-cell-group>
    </div>
    <div v-for="(item, index) in meters" :key="'meter'+index" class="lc-table-wrapper lc-cell-wrapper">
      <van-checkbox-group v-if="multiple" v-model="checkbox" :disabled="readonly">
        <van-cell-group>
          <van-cell style="font-weight: bolder;" :title="'水表:'+item.S_ShuiBiaoBH">
            <van-checkbox ref="checkboxes" slot="right-icon" :name="item.index" @click.native.stop="(e)=>clickCheckbox(e,item,index)" />
          </van-cell>
          <template v-for="(item1, index2) in disFields">
            <van-field v-if="index2<12" :key="index2" :label="item1.key" :value="item[item1.name]" disabled />
          </template>
        </van-cell-group>
      </van-checkbox-group>
      <van-radio-group v-else v-model="redio" :disabled="readonly">
        <van-cell-group>
          <van-cell style="font-weight: bolder;" :title="'水表:'+item.S_ShuiBiaoBH" clickable @click="toggle(item,index)">
            <van-radio slot="right-icon" :name="item.index" />
          </van-cell>
          <template v-for="(item1, index2) in disFields">
            <van-field v-if="index2<12" :key="index2" :label="item1.key" :value="item[item1.name]" disabled />
          </template>
        </van-cell-group>
      </van-radio-group>
    </div>
  </div>
</template>
<script>
import create from '../utils/create'
import i18n from '@/lang' // Internationalization 国际化
import request from '@/utils/request'
import { getData } from '@/api/platform/dictionary'
export default create({
  name: 'lc-waterMeter',
  props: {
    value: String,
    showMeter: Boolean,
    readonly: Boolean,
    fieldOptions: Object
  },
  data() {
    return {
      multiple: false,
      meters: [],
      checkbox: [],
      redio: '',
      type: '1',
      hh: '',
      gyh: '',
      sbbh: '',
      cb: '',
      dz: '',
      data: [],
      leftText: i18n.t('cancel'),
      rightText: i18n.t('confirm'),
      showCommunity: false,
      keywords: '',
      disFields: []
    }
  },
  watch: {
    type() {
      this.hh = ''
      this.gyh = ''
      this.sbbh = ''
      this.cb = ''
      this.dz = ''
      this.meters = []
    }
  },
  mounted() {
    if (this.fieldOptions['meter_type_enable']) {
      this.multiple = true
    }
    this.hh = this.value
    if (this.hh && this.readonly) {
      // this.radio = this.value
      request({
        url: '/revenue/selectShuiBiaoList',
        method: 'post',
        mask: true,
        params: {
          hh: this.hh
        }
      }).then(response => {
        if (response.data && response.data.length > 0) {
          this.meters = response.data
          this.meters = this.meters.slice(0, 10)
        } else {
          this.$dialog.alert({ message: '未查询到水表信息!' })
          this.$emit('changeShowMeter', false)
        }
      })
    }
    getData({ type: 'meter_fields' }).then(({ data }) => {
      this.disFields = data
    })
  },
  methods: {
    // toggle(data, index) {
    //   debugger
    //   const isExists = this.data.findIndex(function(item) {
    //     return item['index'] == index
    //   })
    //   if (isExists > -1) {
    //     this.data.splice(isExists, 1)
    //   } else {
    //     this.data.push(data)
    //   }
    // },
    clickCheckbox(event, data, index) {
      // debugger
      // let flag = true
      // const target = event.target
      // if (target && target.className.indexOf('van-checkbox__label') > -1) {
      //   flag = false
      // } else if (target && target.parentNode.className.indexOf('van-checkbox__icon') > -1) {
      //   flag = false
      // }
      // if (flag) {
      //   this.toggle(data, index)
      //   this.data.push(data)
      // }
    },
    toggle(data, index) {
      if (this.multiple) { // 多选
        this.toggleCheckbox(data, index)
      } else {
        this.toggleRadio(data, index)
      }
    },
    // 单选
    toggleRadio(data, index) {
      this.radio = data['index']
    },
    toggleCheckbox(data, index) {
      this.$refs.checkboxes[index].toggle()
    },
    onCancel() {
      this.$emit('changeShowMeter', false)
    },
    onConfirm() {
      if (this.multiple) { // 多选
        this.data = this.meters.filter(item => this.checkbox.find(element => item.index === element))
      } else {
        this.data = this.meters.filter(element => this.redio === element.index)
      }
      if (this.data.length === 0) {
        this.$dialog.alert({
          message: '请选择一个水表'
        })
        return
      }
      this.$emit('changeShowMeter', false)
      this.$emit('callback', this.data)
    },
    query() {
      if (!this.hh && !this.gyh && !this.sbbh && !this.cb && !this.dz) {
        this.$dialog.alert({ message: '至少输入一项信息!' })
        return
      }
      if (this.hh && this.hh.length < 6) {
        this.$dialog.alert({ message: '请正确输入户号!' })
        return
      }
      if (this.gyh && this.gyh.length < 6) {
        this.$dialog.alert({ message: '请正确输入钢映号!' })
        return
      }
      if (this.sbbh && this.sbbh.length < 6) {
        this.$dialog.alert({ message: '请正确输入水表编号!' })
        return
      }
      if (this.cb && this.cb.length < 2) {
        this.$dialog.alert({ message: '请正确输入册本号!' })
        return
      }
      if (this.dz && this.dz.length < 3) {
        this.$dialog.alert({ message: '请正确输入地址!' })
        return
      }
      request({
        url: '/revenue/selectShuiBiaoList',
        method: 'post',
        mask: true,
        params: { hh: this.hh,
          gyh: this.gyh,
          sbbh: this.sbbh,
          cb: this.cb,
          dz: this.dz }
      }).then(response => {
        if (response.data && response.data.length > 0) {
          this.meters = response.data
          this.meters = this.meters.slice(0, 10)
        } else {
          this.$dialog.alert({ message: '未查询到数据，请核实信息!' })
          this.meters = []
        }
      })
    }
  }
})

export function selectParamsByIParentID() {
  return request({
    url: '/revenue/selectParamsByIParentID',
    method: 'get',
    mask: true,
    params: { id: 46 }
  })
}
</script>
<style>
  .meter{
    width: 100%;
    height: 100%;
  }
</style>
