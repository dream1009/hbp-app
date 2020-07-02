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
      {{ value }}
    </div>
  </cell>
</template>
<script>
import create from '../utils/create'
export default create({
  name: 'lc-label',
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
    }
  }
})
</script>

