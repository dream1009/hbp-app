<template>
  <div class="lc-indexlist">
    <ul
      ref="content"
      :style="{ 'height': currentHeight + 'px'}"
      class="lc-indexlist-content"
    >
      <slot />
    </ul>
    <div
      ref="nav"
      class="lc-indexlist-nav"
      @touchstart="handleTouchStart"
    >
      <ul class="lc-indexlist-navlist">
        <li
          v-for="section in sections"
          :key="section.index "
          class="lc-indexlist-navitem"
        >
          {{ section.index }}
        </li>
      </ul>
    </div>

    <div
      v-if="showIndicator"
      v-show="moving"
      class="lc-indexlist-indicator"
    >
      {{ currentIndicator }}
    </div>
  </div>
</template>
<script>
export default {
  name: 'LcIndexList',
  props: {
    height: Number,
    showIndicator: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      sections: [],
      navWidth: 0,
      indicatorTime: null,
      moving: false,
      firstSection: null,
      currentIndicator: '',
      currentHeight: this.height,
      navOffsetX: 0
    }
  },
  watch: {
    sections() {
      this.init()
    },
    height(val) {
      if (val) {
        this.currentHeight = val
      }
    }
  },
  mounted() {
    if (!this.currentHeight) {
      window.scrollTo(0, 0)
      requestAnimationFrame(() => {
        this.currentHeight = document.documentElement.clientHeight - this.$refs.content.getBoundingClientRect().top
      })
    }
    this.init()
  },
  methods: {
    init() {
      this.$nextTick(() => {
        this.navWidth = this.$refs.nav.clientWidth - 10
      })
      const listItems = this.$refs.content.getElementsByTagName('li')
      if (listItems.length > 0) {
        this.firstSection = listItems[0]
      }
    },
    handleTouchStart(e) {
      if (e.target.tagName !== 'LI') {
        return
      }
      this.navOffsetX = e.changedTouches[0].clientX
      this.scrollList(e.changedTouches[0].clientY)
      if (this.indicatorTime) {
        clearTimeout(this.indicatorTime)
      }
      this.moving = true
      window.addEventListener('touchmove', this.handleTouchMove)
      window.addEventListener('touchend', this.handleTouchEnd)
    },
    handleTouchMove(e) {
      e.preventDefault()
      this.scrollList(e.changedTouches[0].clientY)
    },
    handleTouchEnd() {
      this.indicatorTime = setTimeout(() => {
        this.moving = false
        this.currentIndicator = ''
      }, 500)
      window.removeEventListener('touchmove', this.handleTouchMove)
      window.removeEventListener('touchend', this.handleTouchEnd)
    },
    scrollList(y) {
      const currentItem = document.elementFromPoint(this.navOffsetX, y)
      if (!currentItem || !currentItem.classList.contains('lc-indexlist-navitem')) {
        return
      }
      this.currentIndicator = currentItem.innerText
      const targets = this.sections.filter(section => section.index === currentItem.innerText)
      let targetDOM
      if (targets.length > 0) {
        targetDOM = targets[0].$el
        this.$refs.content.scrollTop = targetDOM.getBoundingClientRect().top - this.firstSection.getBoundingClientRect().top
      }
    }
  }
}
</script>

<style lang="scss">
.lc-indexlist {
  width: 100%;
  position: relative;
  overflow: hidden;
  background: #fff;

  .lc-indexlist-content {
    margin: 0;
    padding: 0;
    overflow: auto;
  }

  .lc-indexlist-nav {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    margin: 0;
    // background-color: #fff;
    // border-left: solid 1px #ddd;
    text-align: center;
    max-height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .lc-indexlist-navlist {
    padding: 0;
    margin: 0;
    list-style: none;
    max-height: 100%;
    display: flex;
    flex-direction: column;
    overflow: auto;
  }

  .lc-indexlist-navitem {
    padding: 2px 6px;
    font-size: 12px;
    user-select: none;
    -webkit-touch-callout: none;
  }

  .lc-indexlist-indicator {
    position: absolute;
    size: 60px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    line-height: 50px;
    background-color: rgba(0, 0, 0, 0.7);
    border-radius: 8px;
    color: #fff;
    font-size: 22px;
  }
}
</style>
