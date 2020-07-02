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
  <van-rate
    v-model="rateValue"
    allow-half
    void-icon="star"
    void-color="#eee"
  />
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
  name: 'lc-rate',
  props: {
    value: [String, Array, Number],
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
  watch: {
    rateValue() {
      this.$emit('input', this.rateValue + '')
    }
  },
  data() {
    return {
      rateValue: {
        type: Number,
        default: 0
      }
    }
  },
  created() {
    if (this.value) {
      this.rateValue = parseInt(this.value)
    } else {
      this.rateValue = 0
    }
  }
})
</script>
