<template>
  <div class="lc-fixed-top">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view class="router-view" />
      </keep-alive>
    </transition>
  </div>
</template>
<script>
export default {
  name: 'AppMain',
  computed: {
    cachedViews() {
      return this.$store.state.app.cachedViews
    }
  }
}
</script>

