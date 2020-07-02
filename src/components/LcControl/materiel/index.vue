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
        <a
          v-if="readonly"
          class="materiel"
          href="javascript:;"
        >
          {{ text }}
        </a>
        <a
          v-if="!readonly"
          class="materiel"
          href="javascript:;"
          @click="materielEvent(fieldOptions.materiel_type)"
        >
          {{ text }}
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
export default create({
  name: 'lc-materiel',
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
      text: '物料选择'
    }
  },
  watch: {
    value() {
      this.text = this.value
    }
  },
  mounted() {
    if (this.value) {
      this.text = this.value
    }
  },
  methods: {
    materielEvent(type, vars) {
      var that = this
      if (that.fieldOptions['materiel_nc_enable']) {
        that.$dialog.alert({
          message: 'app不支持领料，无法选择NC物料'
        })
        return
      }
      const parameter = {
        'busids': ''
      }
      if (that.fieldOptions['materiel_bind_business']) {
        parameter['busids'] = that.fieldOptions['materiel_bind_business']
      }
      this.$bridge.callHandler('getMaterial', parameter, (callbackData) => {
      })
      this.$bridge.registerHandler('material', function(data, responseCallback) {
        that.$emit('callback', JSON.parse(data))
        responseCallback(data)
      })
    }
  }
})
</script>
<style lang="scss">
.materiel{
  color:white;
  background-color: #38f;
  padding: 2px 10px;
  border-radius:4px;
}
</style>
