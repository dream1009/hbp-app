<!--
******************
采用vue-signature v2.3.2 https://github.com/WangShayne/vue-signature
hugh zhuang 修改功能
1、加入监听事件  v-on="listeners
 -->
<template>
  <div :style="{width:width,height:height}">
    <canvas :id="uid" :data-uid="uid" class="canvas" v-on="listeners" />
  </div>
</template>

<script>
import SignaturePad from 'signature_pad'
export default {
  name: 'VueSignature',
  props: {
    sigOption: {
      type: Object,
      default: () => {
        return {
          backgroundColor: 'rgb(255,255,255)',
          penColor: 'rgb(0, 0, 0)'
        }
      }
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100%'
    },
    clearOnResize: {
      type: Boolean,
      default: false
    },
    waterMark: {
      type: Object,
      default: () => {
        return {}
      }
    },
    format: String
  },
  data() {
    return {
      sig: () => { },
      option: {
        backgroundColor: 'rgb(255,255,255)',
        penColor: 'rgb(0, 0, 0)'
      },
      uid: ''
    }
  },
  computed: {
    listeners() {
      return {
        ...this.$listeners,
        touchend: this.onChange,
        mouseover: this.onChange
      }
    }
  },
  created() {
    var _this = this
    this.uid = 'canvas' + _this._uid
    var sigOptions = Object.keys(_this.sigOption)
    for (var item of sigOptions) {
      _this.option[item] = _this.sigOption[item]
    }
  },
  mounted() {
    var _this = this
    this.$nextTick(() => {
      _this.draw()
    })
  },
  methods: {
    onChange() {
      this.$emit('change', this.getData())
    },
    getData() {
      return this.sig.toDataURL(this.format)
    },
    draw() {
      var _this = this
      var canvas = document.getElementById(_this.uid)
      _this.sig = new SignaturePad(canvas, _this.option)
      function resizeCanvas() {
        var url
        if (!_this.isEmpty()) {
          url = _this.save()
        }
        var ratio = Math.max(window.devicePixelRatio || 1, 1)
        canvas.width = canvas.offsetWidth * ratio
        canvas.height = canvas.offsetHeight * ratio
        canvas.getContext('2d').scale(ratio, ratio)
        _this.clear()
        !_this.clearOnResize && url !== undefined && _this.fromDataURL(url)
        _this.addWaterMark(_this.waterMark)
      }
      window.addEventListener('resize', resizeCanvas)
      resizeCanvas()
    },
    clear() {
      this.sig.clear()
    },
    save(format) {
      return format ? this.sig.toDataURL(format) : this.sig.toDataURL()
      // signaturePad.toDataURL(); // save image as PNG
      // signaturePad.toDataURL("image/jpeg"); // save image as JPEG
      // signaturePad.toDataURL("image/svg+xml"); // save image as SVG
    },
    fromDataURL(url) {
      var _this = this
      _this.sig.fromDataURL(url)
    },
    isEmpty() {
      var _this = this
      return _this.sig.isEmpty()
    },
    undo() {
      var _this = this
      var data = _this.sig.toData()
      if (data) {
        data.pop()
        _this.sig.fromData(data)
      }
    },
    addWaterMark(data) {
      var _this = this
      if (!(Object.prototype.toString.call(data) === '[object Object]')) {
        throw new Error('Expected Object, got ' + typeof data + '.')
      } else {
        var vCanvas = document.getElementById(_this.uid)
        var textData = {
          text: data.text || '',
          x: data.x || 20,
          y: data.y || 20,
          sx: data.sx || 40,
          sy: data.sy || 40
        }

        var ctx = vCanvas.getContext('2d')
        ctx.font = data.font || '20px sans-serif'
        ctx.fillStyle = data.fillStyle || '#333'
        ctx.strokeStyle = data.strokeStyle || '#333'
        if (data.style === 'all') {
          ctx.fillText(textData.text, textData.x, textData.y)
          ctx.strokeText(textData.text, textData.sx, textData.sx)
        } else if (data.style === 'stroke') {
          ctx.strokeText(textData.text, textData.sx, textData.sx)
        } else {
          ctx.fillText(textData.text, textData.x, textData.y)
        }
        _this.sig._isEmpty = false
      }
    }
  }
}
</script>

<style>
canvas {
  width: 100%;
  height: 100%;
}
</style>
