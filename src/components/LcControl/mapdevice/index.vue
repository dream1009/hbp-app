<template>
  <div class="lc-field-cell">
  <cell
    :title="label"
    :center="center"
    :border="border"
    :required="required"
    :class="bem({
      error,
      [`label-${labelAlign}`]: labelAlign
    })"
  >
    <slot slot="title" name="label" />
    <div :class="bem('label')">
      <!--<a
        v-if="readonly"
        class="map"
        href="javascript:;"
      >
        {{ mapText }}
      </a>-->
      <a
        v-if="!readonly || mapText !== '设备选取'"
        class="map"
        href="javascript:;"
        @click="mapEvent"
      >
        {{ mapText }}
      </a>
    </div>
    <div
      v-if="desc"
      :class="bem('desc')"
      v-text="desc"
    />
  </cell>
  </div>
</template>
<script>
import create from '../utils/create'
import { getScriptValue } from '@/api/platform/common'
export default create({
  name: 'lc-mapDevice',
  props: {
    value: [String, Array],
    fieldOptions: Object,
    label: String,
    desc: String,
    center: Boolean,
    labelAlign: String,
    error: Boolean,
    required: Boolean,
    readonly: {
      type: Boolean,
      default: false
    },
    border: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      rtn: '',
      mapText: '设备选取'
    }
  },
  watch: {
    value() {
      if (this.value !== '' && this.value !== []) {
        const devices = this.getDevice(this.value)
        this.mapText = this.getDeviceText(devices)
      }
    }
  },
  mounted() {
    if (this.value) {
      const devices = this.getDevice(this.value)
      this.mapText = this.getDeviceText(devices)
    }
    const that = this
    this.$bridge.registerHandler('mapDevice', function(data, responseCallback) {
      that.$emit('callback', data)
      responseCallback(data)
    })
    if (this.fieldOptions.map_text_type === 'fixed') {
      this.mapText = this.map_text
    } else if (this.fieldOptions.map_text_type === 'dynamic') {
      const script = this.fieldOptions.map_text_script
      if (this.fieldOptions.map_text_script_type === 'javascript') {
        const fun = new Function(script)
        this.mapText = fun()
      } else if (this.fieldOptions.map_text_script_type === 'groovy') {
        getScriptValue({
          script: script
        }).then(response => {
          this.mapText = response.data
        }).catch(error => {
          console.log(error)
        })
      }
    }
  },
  methods: {
    mapEvent() {
      let method = 'getMapDevice'
      let params = { 'alias': '选取设备', 'edit': true, 'unit': '', 'value': '' }
      if (this.fieldOptions['is_single']) {
        // 单选
        params.isSingle = true
      } else {
        params.isSingle = false
      }
      let value = JSON.stringify(params)
      // 查看设备
      if (this.fieldOptions['read_rights']) {
        method = 'getDeviceDetail'
        let formatValues = JSON.parse(this.value)
        for (var i = 0; i < formatValues.length; i++) {
          let geometry = formatValues[i].geometry
          formatValues[i].geometry = JSON.parse(geometry.replace("(","").replace(")",""))
        }
        value = formatValues
      }
      this.$bridge.callHandler(method, value, (callbackData) => {
      })
    },
    getDevice(devices) {
      let formatDevices = devices
      try { 
        formatDevices = JSON.parse(devices)
      } catch(e) {
        formatDevices = devices
      }
      return formatDevices
    },
    getDeviceText(devices) {
      /* const arr = []
      for (const key in devices) {
        arr.push(devices[key]['dname'])
      }
      return arr.join(',')*/
      return '已选设备' + '(' + devices.length + ')'
    }

  }
})
</script>
<style lang="scss">
.map{
  color:white;
  background-color: #38f;
  padding: 2px 10px;
  border-radius:4px;
}
</style>
