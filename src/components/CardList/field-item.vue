/* eslint-disable vue/no-v-html */
<template>
  <div :style="style">
    <a v-if="dataFormat==='email'" :href="'mailto:' + data[labelKey]" @click="callEmpty">{{data[labelKey]}}</a>
    <div v-else-if="dataFormat==='telephone' || dataFormat==='phone' || dataFormat==='contact'" @click="callPhone"><a>{{data[labelKey]}} </a><van-icon name="phone" size="20px" style="color: #288ef0; margin-left: 10px"></van-icon></div>
    <div v-else-if="fieldType==='equipment'"  @click="callEmpty">
      <lc-mapDevice readonly class="lc-field-equipment_123456" :value="data[labelKey]" :field-options="templateFields[labelKey].field_options" />
    </div>
    <div v-else-if="fieldType==='map'"  @click="callExtend">
      <field-formatter class="lc-field-item" :label-key="labelKey" :data="data" :template-fields="templateFields" />
    </div>
    <field-formatter v-else class="lc-field-item" :label-key="labelKey" :data="data" :template-fields="templateFields" />
  </div>
</template>
<script>
import FieldFormatter from '@/components/DataTemplate/field-formatter';
import LcMapDevice from '@/components/LcControl/mapdevice';

export default {
  components: {
    FieldFormatter,
    LcMapDevice,
  },
  props: {
    source: {
      type: Object,
      default: () => {}
    },
  },
  data() {
    return { labelKey:'', fieldType:'', dataFormat: 'field', data: {}, style: {}, templateFields: {} };
  },
  mounted: function() {
    if (this.source) {
      const {key, data, style, field} = this.source || {};
      const {field_type, field_options: {data_format} = {}} = field || {};
      this.labelKey = key;
      this.style = style || {};
      this.data = data || {};
      this.fieldType = field_type;
      this.dataFormat = data_format;
      this.templateFields = {[key]: field || {}};
    }
  },
  methods: {
    callPhone(event) {
      const {key, data} = this.source || {};
      const evt = event || window.event;
      if (evt.stopPropagation) evt.stopPropagation(); else evt.cancelBubble = true;
      const paramsData = {taskId: data.bizTaskId, bizKey: data.bizKey, phoneNum: (data || {})[key], fieldName: this.labelKey }
      this.$dialog.confirm({ message: '呼叫号码：'+ (data || {})[key]}).then(() => {
          this.$bridge.callHandler('callPhone', JSON.stringify(paramsData), (callbackData) => { });
      })
    },
    callEmpty(event) {
      const evt = event || window.event;
      if (evt.stopPropagation) evt.stopPropagation(); else evt.cancelBubble = true;
    },
    callExtend(event) {
      const {data = {}} = this.source || {};
      const evt = event || window.event;
      if (evt.stopPropagation) evt.stopPropagation(); else evt.cancelBubble = true;
      this.$bridge.callHandler('getMapCoord',  JSON.stringify({ 'value': `${data.x},${data.y}`, 'edit': false }), (callbackData) => { });
    }
  }
}
</script>

<style scoped>
  .lc-field-item {
    white-space: pre-wrap !important;
    word-break: break-all !important;
  }
</style>

<style>
  .lc-field-equipment_123456 > div {
    padding: 0 !important;
  }
</style>
