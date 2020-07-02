<template>
  <div class="lc-field-cell">
    <cell
      :title="label"
      :center="center"
      :border="border"
      :required="required"
      :class="bem({
        error
      })"
    >
      <slot slot="title" name="label" />
      <div :class="bem('body')">
        <a style="text-align: left"
          v-if="readonly"
          class="map"
          href="javascript:;"
          @click="navigation()"
        >
          {{ mapText }}
        </a>
        <a style="text-align: left"
          v-if="!readonly"
          class="map"
          href="javascript:;"
          @click="mapEvent(fieldOptions.map_type)"
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
  name: 'lc-map',
  props: {
    value: [String, Array],
    fieldOptions: Object,
    label: String,
    desc: String,
    center: Boolean,
    labelAlign: String,
    error: Boolean,
    required: Boolean,
    autosize: [Boolean, Object],
    readonly: {
      type: Boolean,
      default: false
    },
    border: {
      type: Boolean,
      default: true
    },
    name: String,
    coord: String
  },
  data() {
    return {
      rtn: '',
      mapText: '地图选取'
    }
  },
  watch: {
    value() {
      this.mapText = this.value
    }
  },
  mounted() {
    if (this.value) {
      this.mapText = this.value
    }
    var that = this
    this.$bridge.registerHandler('mapCoord', function(data, responseCallback) {
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
    navigation() {
      const params = { 'value': this.coord, 'edit': false }
      this.$bridge.callHandler('getMapCoord', JSON.stringify(params), (callbackData) => {
      })
    },
    mapEvent(type, vars) {
      const params = { 'value': this.coord }
      this.$bridge.callHandler('getMapCoord', JSON.stringify(params), (callbackData) => {
      })
      const script = this.fieldOptions.map_script
      if (type === 'groovy') {
        return new Promise((resolve, reject) => {
          getScriptValue({
            script: script,
            vars: vars || ''
          }).then(response => {
            const data = response.data
            this.rtn = data
            try {
              // eslint-disable-next-line no-eval
              const message = eval('(' + data + ')')
              if (message.result === '1') { // result 0和1
                if (message.type === 'message') {
                  this.$dialog.alert({
                    title: '提示',
                    message: message.content
                  }).then(() => {
                    return
                  })
                } else if (type === 'javascript') {
                  const fun = new Function(message.content)
                  this.rtn = fun()
                }
              } else {
                this.$dialog.alert({
                  title: '提示',
                  message: message.content
                }).then(() => {
                  return
                })
              }
            } catch (e) {
              this.$dialog.alert({
                title: '提示',
                message: e.message
              }).then(() => {
                return
              })
              console.log(e)
            }

            this.$emit('map', this.rtn)
            resolve(data)
          }).catch(error => {
            reject(error)
          })
        })
      } else if (type === 'javascript') {
        const fun = new Function(script)
        this.rtn = fun()
      }
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
