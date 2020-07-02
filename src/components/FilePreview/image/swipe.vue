<template>
  <div class="swipe">
    <swiper ref="swiperTop" :options="swiperOptionTop" class="gallery-top" @transitionEnd="onTransitionEnd">
      <swiper-slide
        v-for="(item,index) in src"
        :key="index"
      ><img :src="item" class="image-preview"></swiper-slide>
    </swiper>
    <!-- swiper2 Thumbs -->
    <swiper ref="swiperThumbs" :options="swiperOptionThumbs" class="gallery-thumbs" @transitionEnd="onTransitionEnd">
      <swiper-slide
        v-for="(item,index) in src"
        :key="index"
      ><img :src="item" class="image-preview"></swiper-slide>
    </swiper>

  </div>
</template>
<script>
import Vue from 'vue'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'
Vue.use(VueAwesomeSwiper)

export default {
  components: {
    Swiper,
    SwiperSlide
  },
  props: {
    src: {
      type: Array
    },
    currentSlide: Number
  },
  data() {
    return {
      swiperOptionTop: {
        spaceBetween: 10,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        },
        initialSlide: this.currentSlide // 初始化时slide的索引
      },
      swiperOptionThumbs: {
        spaceBetween: 10,
        centeredSlides: true,
        slidesPerView: 'auto',
        touchRatio: 0.2,
        slideToClickedSlide: true,
        initialSlide: this.currentSlide // 初始化时slide的索引
      }
    }
  },
  watch: {
    currentSlide() { // 监听点击的图片索引，设置轮播的图片索引
      this.$refs.swiperTop.$swiper.activeIndex = this.currentSlide
      this.$refs.swiperThumbs.$swiper.activeIndex = this.currentSlide
    }
  },
  mounted() {
    // 缩略图与上面的图片相对应
    this.$nextTick(() => {
      const swiperTop = this.$refs.swiperTop.$swiper
      const swiperThumbs = this.$refs.swiperThumbs.$swiper
      swiperTop.controller.control = swiperThumbs
      swiperThumbs.controller.control = swiperTop
    })
  },
  methods: {
    // 过渡结束时触发
    onTransitionEnd() {
      this.$emit('indexChage', this.$refs.swiperTop.$swiper.activeIndex)
    }
  }
}

</script>
<style lang="scss" scoped>
.swipe{
  height: 100%;
}
.image-preview{
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
}
  .swiper-container {
    background-color: #fff;
  }
  .swiper-slide {
    background-size: cover;
    background-position: center;

  }
  .gallery-top {
    height: 80%!important;
    width: 100%;
  }
  .gallery-thumbs {
    height: 20%!important;
    box-sizing: border-box;
    padding: 10px 0;
  }
  .gallery-thumbs .swiper-slide {
    width: 25%;
    height: 100%;
    opacity: 0.4;
  }
  .gallery-thumbs .swiper-slide-active {
    opacity: 1;
  }
</style>
