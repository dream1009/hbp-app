<template>
  <div>
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
        <div :class="bem('body')" @click="onClick">
          <a
            v-if="text"
            class="map"
            href="javascript:;"
          >
            {{ text }}
          </a>
        </div>
        <icon
          v-if="value&&!readonly"
          slot="right-icon"
          :name="'clear'"
          :class="bem('clear')"
          class="van-cell__right-icon "
          @click="onRightIconClick"
        />
      </cell>
      <van-popup
        v-model="showMeter"
        closeable
        close-icon="close"
        position="bottom"
        :style="{width: '100%', height: '100%' }"
      >
        <WaterMeter :value="value" :show-meter="showMeter" :readonly="readonly" :field-options="fieldOptions" @changeShowMeter="changeShowMeter" @callback="meterCallback" />
      </van-popup>
    </div>
  </div>
</template>
<script>
import create from '../utils/create'
import WaterMeter from './water-meter'
export default create({
  name: 'lc-waterMeter',
  components: {
    WaterMeter
  },
  props: {
    value: String,
    label: String,
    desc: String,
    icon: String,
    center: Boolean,
    leftIcon: String,
    labelAlign: String,
    error: Boolean,
    errorMessage: String,
    required: Boolean,
    placeholder: String,
    border: {
      type: Boolean,
      default: true
    },
    readonly: {
      type: Boolean,
      default: false
    },
    fieldOptions: Object
  },
  data() {
    return {
      showMeter: false,
      rtn: '',
      text: '水表选取'
    }
  },
  watch: {
    value() {
      if (this.value) {
        this.text = this.value
      } else {
        this.text = '水表选取'
      }
    }
  },
  mounted() {
    if (this.value) {
      this.text = this.value
    }
    if (this.readonly && !this.value) {
      this.text = ''
    }
  },
  methods: {
    onRightIconClick() {
      const data = []
      this.fieldOptions.bind.forEach(item => {
        data[item['fieldName']] = ''
      })
      this.meterCallback(data)
    },
    onClick() {
      this.showMeter = true
    },
    changeShowMeter(params) {
      this.showMeter = params
    },
    meterCallback(data) {
      this.$emit('callback', data)
    }
  }
})
</script>
<style>
</style>

