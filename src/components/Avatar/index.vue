<template>
  <div
    :class="bem({
      rounded,
      circle
    })"
    :style="style"
  >
    <!--图片-->
    <a v-if="image" :style="imageStyle" class="image">
      <div :class="bem('image-info')" class="van-info">{{ info }}</div>
      <img ref="img" :src="image" :alt="alt">
    </a>
    <!--图标-->
    <van-icon v-else-if="icon" :class-prefix="iconClassPrefix" :name="icon" :info="info" :style="iconStyle" />
    <!--字体-->
    <a v-else-if="text" :style="textStyle" class="text">
      <div :class="bem('text-info')" :style="textStyleCust" class="van-info">{{ info }}</div>
      {{ formatText(text)|format(textSubstr) }}
    </a>
  </div>
</template>
<script>
import { getImage } from '@/utils/image'
import bem from '@/mixins/bem'
export default {
  name: 'Avatar',
  filters: {
    format(value, length) {
      if (value === null || value === '') {
        return ''
      }
      if (value.length <= length) { return value }
      return value.substr(value.length - length, length)
    }
  },
  mixins: [bem],
  props: {
    color: String, // 文字的颜色
    bgColor: String, // 组件的背景色
    size: String, // 尺寸
    sizeUnit: { // 尺寸单位
      type: String,
      default: 'px'
    },
    image: String,
    defaultImage: String,
    thumb: String, // 头像
    thumbError: String, // 失败的头像
    alt: String, // 描述
    iconClassPrefix: String, // 图标
    icon: String, // 图标
    info: [String, Number],
    text: String,
    textSubstr: {
      type: Number,
      default: 2
    },
    rounded: Boolean, // 圆角
    circle: Boolean// 圆形
  },
  data() {
    return {
      imageSrc: this.thumb
    }
  },
  computed: {
    style() {
      return {
        'width': this.size + this.sizeUnit,
        'height': this.size + this.sizeUnit,
        'font-size': (this.size / 2) + this.sizeUnit,
        'background-color': this.imageSrc ? '' : this.getColor(this.bgColor),
        'border-color': this.imageSrc ? '' : this.getColor(this.bgColor),
        'color': this.getColor(this.color),
        'border-radius': '100%'
      }
    },
    imageStyle() {
      return {
        'width': this.size + this.sizeUnit,
        'height': this.size + this.sizeUnit
      }
    },
    iconStyle() {
      return {
        'font-size': (this.size / 1.4) + this.sizeUnit
      }
    },
    textStyle() {
      return {
        'font-size': (this.size / 3) + this.sizeUnit
      }
    },
    textStyleCust() {
      return {
        'font-size': 12 + this.sizeUnit
      }
    }
  },
  /* watch: {
    image() {
      this.loadImage()
    }
  },*/
  /* mounted() {
    if (this.$refs.img) {
      this.$refs.img.onerror = () => {
        this.imageSrc = this.thumbError ? this.thumbError : false
      }
    }
    this.loadImage()
  },*/
  methods: {
    formatText(text) {
      return text.replace(/[\|\!|\！|\,|\，|\。|\.\……|\?|\？|\-|\——|\"|\“|\”|\:|\：|\、|\+|\*|\/|\<|\>|\《|\》|\;|\；|\(|\)|\（|\）|\~|\@|\#|\$|\%|\^|\&|\{|\}|\【|\】]/g, '')
    },
    loadImage() {
      if (this.$utils.isNotEmpty(this.image)) {
        getImage(this.image).then(data => {
          if (this.$utils.isNotEmpty(data)) {
            this.imageSrc = data
          } else {
            this.imageSrc = this.$utils.isNotEmpty(this.defaultImage) ? this.defaultImage : null
          }
        })
      //  this.imageSrc = BASE_URL + '/webapi/attachmentService/getImage?id=' + this.image + '&access_token=' + this.$store.getters.token
      } else {
        if (this.$utils.isNotEmpty(this.thumb)) {
          this.imageSrc = this.thumb
        } else {
          this.imageSrc = this.$utils.isNotEmpty(this.defaultImage) ? this.defaultImage : null
        }
      }
    },
    getColor(color) {
      // TODO 后面做样式表
      return color
    }
  }
}
</script>
