<template>
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
      <a
        class="hyperlink"
        href="javascript:;"
        @click="hyperlinkEvent(fieldOptions.hyperlink_type)"
      >
        {{ hyperlinkText }}
      </a>
    </div>
    <div
      v-if="desc"
      :class="bem('desc')"
      v-text="desc"
    />
  </cell>
</template>
<script>
import create from '../utils/create'
import { getScriptValue } from '@/api/platform/common'
export default create({
  name: 'lc-hyperlink',
  props: {
    value: [String, Array],
    fieldOptions: Object,
    label: String,
    desc: String,
    center: Boolean,
    labelAlign: String,
    error: Boolean,
    border: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      rtn: '',
      hyperlinkText: '链接'
    }
  },
  mounted() {
    if (this.fieldOptions.hyperlink_text_type === 'fixed') {
      this.hyperlinkText = this.hyperlink_text
    } else if (this.fieldOptions.hyperlink_text_type === 'dynamic') {
      const script = this.fieldOptions.hyperlink_text_script
      if (this.fieldOptions.hyperlink_text_script_type === 'javascript') {
        const fun = new Function(script)
        this.hyperlinkText = fun()
      } else if (this.fieldOptions.hyperlink_text_script_type === 'groovy') {
        getScriptValue({
          script: script
        }).then(response => {
          this.hyperlinkText = response.data
        }).catch(error => {
          console.log(error)
        })
      }
    }
  },
  methods: {
    hyperlinkEvent(type, vars) {
      const script = this.fieldOptions.hyperlink_script
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
              var message = eval('(' + data + ')')
              if (message.result === '1') { // result 0和1
                if (message.type === 'message') {
                  this.$dialog.alert({
                    title: '提示',
                    message: message.content
                  }).then(() => {
                    return
                  })
                } else if (type === 'javascript') {
                  var fun = new Function(message.content)
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

            this.$emit('hyperlink', this.rtn)
            resolve(data)
          }).catch(error => {
            reject(error)
          })
        })
      } else if (type === 'javascript') {
        var fun = new Function(script)
        this.rtn = fun()
      }
    }
  }
})
</script>
<style lang="scss">
.hyperlink{
  color:white;
  background-color: #38f;
  padding: 2px 10px;
  border-radius:4px;
}
</style>
