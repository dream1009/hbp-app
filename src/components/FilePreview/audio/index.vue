<template>
  <div>
    <aplayer
      v-show="flag"
      ref="player"
      :mini="mini"
      :audio="audio"
      :lrc-type="0"
      :loop="loop"
      autoplay
      :preload="preload"
      @timeupdate="onTimeupdate"
    />
    <van-loading v-show="!flag" type="spinner" />
  </div>
</template>
<script>
import Vue from 'vue'
import Aplayer from '@moefe/vue-aplayer'

Vue.use(Aplayer)

export default {
  name: 'Audio',
  props: {
    url: {
      type: String
    },
    title: {
      type: String
    }
  },
  data() {
    return {
      flag: false,
      audio: {
        name: this.title,
        artist: '',
        url: this.url,
        cover: '/static/images/file/mp3.png'
      },
      loop: 'none',
      mini: false,
      preload: 'metadata',
      duration: ''
    }
  },
  watch: {
    duration(newVal) {
      this.flag = true
      this.$refs.player.seek(0)
      this.$refs.player.pause()
    }
  },
  methods: {
    onTimeupdate(e) {
      if (e.target.duration !== Infinity) {
        this.duration = e.target.duration
      }
    }
  }
}
</script>
<style scoped>
.van-loading {
  width: 100%;
  top: 10px;
}
</style>
