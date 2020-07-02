<template>
  <div class="lc-cell-wrapper">
    <cell-group :border="border">
      <cell
        :title="label"
        :required="required"
        :center="center"
        :border="border"
        :class="bem({
          error,
          disabled: $attrs.disabled,
          [`label-${labelAlign}`]: labelAlign,
          'min-height':autosize
        })"
      >
        <slot slot="title" name="label" />
        <div :class="bem('body')">
          <div
            :class="bem('control', inputAlign)"
            @click="onClick"
          >
            <div
              v-if="!showClear"
              :class="bem('placeholder')"
              @click="onClick"
            >
              {{ placeholder }}
            </div>
          </div>
          <icon
            v-if="showClear"
            :class="bem('clear')"
            name="clear"
            @click="onClear"
          />
        </div>
        <div
          v-if="errorMessage"
          :class="bem('error-message')"
          v-text="errorMessage"
        />
      </cell>
      <cell>
        <div
          :style="{width:width,height:((height?height:150)+'px')}"
          @click="onClick"
        >
          <img :src="getShowValue(value)" style="width:100%;height:100%;">
        </div>
      </cell>
      <div
        v-if="desc"
        :class="bem('desc')"
        v-text="desc"
      />
    </cell-group>
    <van-popup
      v-model="showPopup"
      :style="{width:'100%','min-height':calHeight,'overflow':'hidden'}"
      position="bottom"
    >
      <div :class="bem('body')">
        <vue-signature
          ref="signature"
          :sig-option="option"
          :width="width"
          :height="(height?height:150)+'px'"
        />
      </div>
      <div class="van-hairline--top-bottom van-picker__toolbar lc-toolbar ">
        <div class="van-picker__cancel" @click="onCancel">
          {{ cancelButtonText || $t('cancel') }}
        </div>
        <div v-if="title" class="van-picker__title">
          {{ title }}
        </div>
        <div class="van-picker__action">
          <span v-if="undoable" :class="bem('confirm')" @click="onUndo">{{ undoButtonText || $t('common.button.undo') }}</span>
          <span :class="bem('confirm')" @click="onConfirm">{{ confirmButtonText || $t('confirm') }}</span>
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script>
import VueSignature from './vue-signature'
import create from '../utils/create'
// 透明图片
var BLANK = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
// 黑色图片
// const BLANK = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='
export default create({
  name: 'lc-signature',
  components: {
    VueSignature
  },
  props: {
    value: [String],
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
    undoable: Boolean,
    labelAlign: String,
    inputAlign: {
      type: String,
      default: 'left'
    },
    autosize: [Boolean, Object],
    errorMessage: String,
    placeholder: String,
    border: {
      type: Boolean,
      default: true
    },
    option: Object,
    width: String,
    height: {
      type: Number,
      default: 150
    },
    title: String,
    confirmButtonText: String,
    cancelButtonText: String,
    undoButtonText: String,
    format: String
  },
  data() {
    return {
      showPopup: false
    }
  },
  computed: {
    showClear() {
      return this.clearable && this.isNotEmpty(this.value) && this.isDef(this.value) && !this.readonly
    },
    showUndo() {
      return this.undoable && this.isNotEmpty(this.value) && this.isDef(this.value)
    },
    calHeight() {
      if (!this.height) { return '190px' }
      if ((this.height + 60) > document.documentElement.clientHeight) {
        return document.documentElement.clientHeight + 'px'
      } else {
        return (this.height + 60) + 'px'
      }
    }
  },
  methods: {
    onClick() {
      if (this.readonly) { return }
      this.showPopup = true
      setTimeout(() => {
        if (this.value) { this.$refs.signature.fromDataURL(this.getData(this.value, true)) }
      }, 10)
    },
    onClear() {
      this.$emit('input', '')
      this.$refs.signature.clear()
    },
    onUndo() {
      this.$refs.signature.undo()
    },
    onConfirm(value, index) {
      this.showPopup = false
      this.$emit('input', this.getData(this.$refs.signature.getData(), false))
    },
    onCancel() {
      this.showPopup = false
    },
    /**
     * value:值
     * hasData 是否必须有 data：
     */
    getData(value, hasData) {
      if (this.$utils.isEmpty(value)) { return '' }
      if (hasData) {
        if (value.indexOf('data:') > -1) {
          return value
        } else {
          return 'data:' + value
        }
      } else {
        if (value.indexOf('data:') > -1) {
          return value.substring(5)
        } else {
          return value
        }
      }
    },
    getShowValue(value) {
      if (this.$utils.isNotEmpty(value)) {
        return this.getData(value, true)
      }
      return BLANK
    }
  }
})
</script>

