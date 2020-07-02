/* eslint-disable vue/no-v-html */
<template>
  <div class="lc-editor-wrapper lc-cell-wrapper">
    <cell
      v-if="label"
      :title="label"
      :required="required"
      :center="center"
      :border="border"
      :class="bem({
        error,
        disable:$attrs.disable,
        readonly: readonly,
        [`label-${labelAlign}`]: labelAlign
      })"
    />

    <div
      v-if="readonly"
      class="editor-content"
      v-html="content"
    />
    <vue-html5-editor
      v-else
      ref="content"
      :content="content"
      :height="height||150"
      :z-index="zIndex"
      :auto-height="autoHeight"
      :show-module-name="showModuleName"
      @change="changeData"
    />
    <div
      v-if="errorMessage"
      :class="bem('error-message')"
      style="margin-left:10px;"
      v-text="errorMessage"
    />
    <div
      v-if="desc"
      :class="bem('desc')"
      v-text="desc"
    />
  </div>
</template>
<script>
import Vue from 'vue'
import create from '../utils/create'
import VueHtml5Editor from 'vue-html5-editor'
import options from './options'

export default create({
  name: 'lc-editor',
  props: {
    value: String,
    label: String,
    desc: String,
    icon: String,
    error: Boolean,
    center: Boolean,
    leftIcon: String,
    required: Boolean,
    clearable: {
      type: Boolean,
      default: true
    },
    undoable: Boolean,
    labelAlign: String,
    errorMessage: String,
    placeholder: String,
    border: {
      type: Boolean,
      default: true
    },
    readonly: {
      type: Boolean,
      default: false
    },
    options: Object,
    height: {
      type: Number,
      default: 150,
      validator(val) {
        return val >= 100
      }
    },
    zIndex: {
      type: Number,
      default: 99
    },
    autoHeight: {
      type: Boolean,
      default: true
    },
    showModuleName: {}
  },
  data() {
    return {
      content: ''
    }
  },
  created() {
    Vue.use(VueHtml5Editor, options)
  },
  watch: {
    value() {
      this.content = this.value
    }
  },
  methods: {
    changeData(data) {
      this.$emit('input', data)
      this.$emit('change-data', data)
    }
  },
  mounted() {
    this.content = this.value
  }
})
</script>
<style scoped>
  .editor-content{
    background-color: #fff;
    padding:5px 15px 15px 15px;
  }
</style>

