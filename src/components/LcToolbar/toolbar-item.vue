
<template>
  <li class="lc-toolbar-item van-hairline--right" :class="{'lc-toolbar-item-ellipsis':action.icon==='ellipsis'}">
    <van-button :type="action.buttonType" :plain="action.plain">
      <van-icon v-if="action.icon" :name="action.icon" />
      <van-checkbox
        v-if="action.type == 'checkbox'"
        v-model="action.checked"
        class="lc-toolbar-chb"
      >
        {{ action.name }}
      </van-checkbox>
      <span v-else>{{ action.name }}</span>
    </van-button>
  </li>
</template>

<script>
export default {
  name: 'LcToolbarItem',
  props: {
    action: {
      type: Object,
      default() {
        return {}
      }
    }
  }
}
</script>
