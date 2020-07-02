<template>
  <img
    ref="image"
    :src="src"
    :style="imageStyle"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
    @touchcancel="onTouchEnd"
  >
</template>
<script>
import Touch from 'vant/lib/mixins/touch'
import { range } from 'vant/lib/utils'

const MAX_ZOOM = 3
const MIN_ZOOM = 1 / 10
export default {
  mixins: [Touch],
  props: {
    src: String
  },
  data() {
    return {
      scale: 1,
      moveX: 0,
      moveY: 0,
      moving: false,
      zooming: false
    }
  },
  computed: {
    count() {
      return this.images.length
    },

    imageStyle() {
      const { scale } = this
      const style = {
        width: 'auto',
        height: 'auto',
        maxWidth: '100%',
        // maxHeight: '100%',
        transition: this.zooming || this.moving ? '' : '.3s all'
      }

      if (scale !== 1) {
        style.transform = `scale3d(${scale}, ${scale}, 1) translate(${this
          .moveX / scale}px, ${this.moveY / scale}px)`
      }
      return style
    }
  },

  methods: {
    getDistance(touches) {
      return Math.sqrt(
        Math.abs(
          (touches[0].clientX - touches[1].clientX) *
            (touches[0].clientY - touches[1].clientY)
        )
      )
    },

    startMove(event) {
      const image = event.currentTarget
      const rect = image.getBoundingClientRect()
      const winWidth = window.innerWidth
      const winHeight = window.innerHeight

      this.touchStart(event)
      this.moving = true
      this.startMoveX = this.moveX
      this.startMoveY = this.moveY
      this.maxMoveX = Math.max(0, (rect.width - winWidth) / 2)
      this.maxMoveY = Math.max(0, (rect.height - winHeight) / 2)
    },

    startZoom(event) {
      this.moving = false
      this.zooming = true
      this.startScale = this.scale
      this.startDistance = this.getDistance(event.touches)
    },

    onTouchStart(event) {
      const { touches } = event
      const { offsetX } = this.$refs.image
      if (touches.length === 1 && this.scale !== 1) {
        this.startMove(event)
      } else if (touches.length === 2 && !offsetX) {
        this.startZoom(event)
      }
    },

    onTouchMove(event) {
      const { touches } = event
      if (this.moving || this.zooming) {
        event.preventDefault()
        event.stopPropagation()
      }

      if (this.moving) {
        this.touchMove(event)
        const moveX = this.deltaX + this.startMoveX
        const moveY = this.deltaY + this.startMoveY
        this.moveX = range(moveX, -this.maxMoveX, this.maxMoveX)
        this.moveY = range(moveY, -this.maxMoveY, this.maxMoveY)
      }

      if (this.zooming && touches.length === 2) {
        const distance = this.getDistance(touches)
        const scale = (this.startScale * distance) / this.startDistance
        this.scale = range(scale, MIN_ZOOM, MAX_ZOOM)
      }
    },

    onTouchEnd(event) {
      if (this.moving || this.zooming) {
        let stopPropagation = true

        if (
          this.moving &&
          this.startMoveX === this.moveX &&
          this.startMoveY === this.moveY
        ) {
          stopPropagation = false
        }

        if (!event.touches.length) {
          this.moving = false
          this.zooming = false
          this.startMoveX = 0
          this.startMoveY = 0
          this.startScale = 1

          if (this.scale < 1) {
            this.resetScale()
          }
        }

        if (stopPropagation) {
          event.preventDefault()
          event.stopPropagation()
        }
      }
    },

    resetScale() {
      this.scale = 1
      this.moveX = 0
      this.moveY = 0
    }
  }
}
</script>
