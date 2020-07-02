<template>
  <li class="lc-indexsection">
    <p class="lc-indexsection-index">
      {{ index }}
    </p>
    <div style="padding-right: 20px;">
      <slot />
    </div>
  </li>
</template>
<script>
export default {
  name: 'LcIndexSection',
  props: {
    index: {
      type: String,
      required: true
    }
  },
  mounted() {
    this.$parent.sections.push(this)
  },
  beforeDestroy() {
    const index = this.$parent.sections.indexOf(this)
    if (index > -1) {
      this.$parent.sections.splice(index, 1)
    }
  }
}
</script>

<style lang="scss">
.lc-indexsection {
  padding: 0;
  margin: 0;

  .lc-indexsection-index {
    margin: 0;
    padding: 10px;
    background-color: #fafafa;
    & + div {
      padding: 0;
    }
  }
}
</style>
