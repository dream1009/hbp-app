<template>
  <div
    :class="[b({
      center: centered,
      clickable: isLink || clickable,
    }),{
      'van-hairline': border
    }]"
    :style="{'height':autoSize,'background':background}"
    @click="onClick"
  >
    <slot name="leftIcon">
      <icon v-if="leftIcon" :class="b('left-icon')" :name="leftIcon" />
    </slot>
    <div :class="b('avatar')">
      <slot name="avatar">
        <avatar
          :thumb="thumb"
          :image="image"
          :default-image="defaultImage"
          :icon="icon"
          :text="text"
          :bg-color="bgColor"
          :color="color"
          :size="size"
          :info="info"
          :rounded="rounded"
          :circle="circle"
        />
      </slot>
    </div>
    <div :class="b('content')" :style="{'margin-left':size+'px'}">
      <!-- 标题-->
      <slot name="title">
        <div v-if="title || isDef(subTitle)" :class="b('row')">
          <div v-if="title" :class="b('title')">
            {{ title }}
          </div>
          <div v-if="isDef(subTitle)" :class="b('sub-title')">
            {{ subTitle }}
          </div>
        </div>
      </slot>

      <slot name="desc">
        <div v-if="desc || isDef(subDesc)" :class="b('row')">
          <div v-if="desc" :class="b('desc')">
            {{ desc }}
          </div>
          <div v-if="isDef(subDesc)" :class="b('sub-desc')">
            {{ subDesc }}
          </div>
        </div>
      </slot>
      <slot name="tags" />
    </div>
    <slot name="rightIcon">
      <icon v-if="isLink" :class="b('right-icon', arrowDirection)" name="arrow" />
    </slot>
    <div v-if="$slots.footer" :class="b('footer')">
      <slot name="footer" />
    </div>
  </div>
</template>

<script>
import Avatar from '@/components/Avatar'
import RouterLink from 'vant/lib/mixins/router-link'
import create from 'vant/lib/utils/create'

export default create({
  name: 'lc-card',
  mixins: [RouterLink],
  components: {
    Avatar
  },
  props: {
    leftIcon: String,
    color: String,
    bgColor: String, // 组件的背景色
    background: String,
    size: String, // 尺寸
    sizeUnit: String,
    thumb: String,
    image: String,
    defaultImage: String,
    alt: String,
    icon: String,
    info: [String, Number],
    text: String,
    textSubstr: Number,
    rounded: Boolean, // 圆角
    circle: Boolean, // 圆形
    title: [String, Number],
    subTitle: [String, Number],
    desc: [String, Number],
    subDesc: [String, Number],
    centered: Boolean,
    isLink: Boolean,
    clickable: {
      type: Boolean,
      default: true
    },
    arrowDirection: String,
    border: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    autoSize() {
      if (!this.size) { return '50px' }
      return this.size * 1.3 + 'px'
    }
  },
  methods: {
    onClick() {
      this.$emit('click')
      this.routerLink()
    }
  }

})
</script>
<style lang="scss">
 @import '@/assets/styles/lc-card.scss'
</style>
