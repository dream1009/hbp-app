<template>
  <cell-group class="lc-desc">
    <cell
      :title="label"
      :center="center"
      :border="border"
      :class="bem({
        error,
        [`hairline-${borderStyle}`]:borderStyle,
        [`label-${labelAlign}`]: labelAlign
      })"
    >
      <slot slot="title" name="label" />
    </cell>
    <cell v-if="desc" :label="desc" title="" />
  </cell-group>
</template>
<script>
import create from '../utils/create'
export default create({
  name: 'lc-desc',
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
    placeholder: String,
    border: {
      type: Boolean,
      default: true
    },
    borderStyle: {
      type: String,
      default: 'dashed'
    }
  }
})
</script>

