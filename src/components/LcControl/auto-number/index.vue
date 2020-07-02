<template>
  <cell
    :title="label"
    :required="required"
    :center="center"
    :border="border"
    :class="bem({
      error,
      disabled: $attrs.disabled,
      [`label-${labelAlign}`]: labelAlign
    })"
  >
    <slot slot="title" name="label" />
    <div :class="bem('body')">
      <input
        ref="input"
        v-bind="$attrs"
        :placeholder="placeholder"
        :value="value"
        :class="bem('control', inputAlign)"
        readonly="true"
      >
      <icon
        slot="right-icon"
        name="orderedlist"
        class="van-cell__right-icon "
      />
    </div>
    <div
      v-if="errorMessage"
      :class="bem('error-message')"
      v-text="errorMessage"
    />
    <div
      v-if="desc"
      :class="bem('desc')"
      v-text="desc"
    />
  </cell>
</template>
<script>
import { getData } from '@/api/platform/identity'
import create from '../utils/create'
import i18n from '@/lang' // Internationalization 国际化

export default create({
  name: 'lc-auto-number',
  props: {
    value: [String, Number],
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
    labelAlign: String,
    placeholder: {
      type: String,
      default() {
        return this.init ? '' : i18n.t('components.autoNumber.placeholder')
      }
    },
    inputAlign: {
      type: String,
      default: 'left'
    },
    max: Number,
    errorMessage: String,
    border: {
      type: Boolean,
      default: true
    },
    identity: {// 流水号别名
      type: String,
      required: true
    },
    init: {// 是否初始化编号
      type: Boolean,
      default: true
    }
  },
  methods: {
    initData() {
      this.$nextTick(() => {
        getData({ alias: this.identity }).then(response => {
          this.$emit('input', response.data.id)
        }).catch(() => {
          // 异常
        })
      })
    }
  },
  mounted() {
    if (this.init && this.isEmpty(this.value)) { this.initData() }
  }
})
</script>
