/* eslint-disable vue/no-v-html */
<template>
  <div
    :class="[b({
      center: centered,
      clickable: isLink || clickable,
    }), {
      'van-hairline': border
    }]"
    @click="onClick"
  >
    <div v-show="checkMode" class="van-checkbox">
      <div
        :class="{
          'van-checkbox__icon': checkMode,
          'van-checkbox__icon--round': checkMode,
          'van-checkbox__icon--checked': checked}"
      >
        <i class="van-icon van-icon-success" />
      </div>
    </div>

    <avatar
      v-if="avatar"
      v-show="!checkMode"
      :icon="icon"
      :bg-color="bgColor"
      :color="color"
      :text="title"
      :thumb="thumb"
      :image="image"
      :circle="circle"
      :size="size"
      :rounded="rounded"
    />
    <div :class="b('content')">
      <slot name="code">
        <div v-if="showValue(field0) || showValue(field1)" :class="b('row_between')">
          <field-item :source="field0" />
          <field-item :source="field1" />
        </div>
      </slot>
      <slot name="date">
        <div v-if="showValue(field2) || showValue(field3)" :class="b('row_between')">
          <field-item :source="field2" />
          <field-item :source="field3" />
        </div>
      </slot>
      <slot name="title">
        <div v-if="showValue(field4) || showValue(field5)" :class="b('row_between')">
          <field-item :source="field4" />
          <field-item :source="field5" />
        </div>
      </slot>
      <slot name="type">
        <div v-if="showValue(field6) || showValue(field7)" :class="b('row_between')">
          <field-item :source="field6" />
          <field-item :source="field7" />
        </div>
      </slot>
      <slot name="title1">
        <div v-if="showValue(field8) || showValue(field9)" :class="b('row_between')">
          <field-item :source="field8" />
          <field-item :source="field9" />
        </div>
      </slot>
      <slot name="">
        <div v-if="showValue(field10) || showValue(field11)" :class="b('row_between')">
          <field-item :source="field10" />
          <field-item :source="field11" />
        </div>
      </slot>
      <!-- 导致数据重复 -->
      <!-- <slot name="address">
        <div  v-if="field10 || isDef(field10)"  :class="b('row_between')">
          <a v-if="field10" :class="b('address')">
            {{ field10.value }}
          </a>
        </div>
      </slot>-->
    </div>
    <slot name="right-icon" @click="onClickRightIcon">
      <icon v-if="isLink" :class="b('right-icon', arrowDirection)" name="arrow" />
    </slot>
  </div>
</template>

<script>
import Avatar from '@/components/Avatar'
import fieldItem from './field-item'
import RouterLink from 'vant/lib/mixins/router-link'
import create from 'vant/lib/utils/create'
export default create({
  name: 'card-list',
  mixins: [RouterLink],
  components: {
    Avatar,
    fieldItem,
  },
  props: {
    avatar: {
      type: Boolean,
      default: true
    },
    icon: String,
    bgColor: {
      type: String
    },
    color: {
      type: String
    },
    image: String,
    thumb: String,
    title: String,
    field0: Object,
    field1: Object,
    field2: Object,
    field3: Object,
    field4: Object,
    field5: Object,
    field6: Object,
    field7: Object,
    field8: Object,
    field9: Object,
    field10: Object,
    field11: Object,
    circle: Boolean,
    rounded: Boolean,
    size: {
      type: String,
      default: '50'
    },
    desc: String,
    centered: {
      type: Boolean,
      default: true
    },
    date: [Number, String, Date],
    tag: [Number, String],
    tagType: {
      type: String,
      default: 'primary'
    },
    tagPlain: {
      type: Boolean,
      default: true
    },
    tagMark: Boolean,
    isLink: Boolean,
    clickable: Boolean,
    arrowDirection: String,
    border: {
      type: Boolean,
      default: true
    },
    checkMode: {
      type: Boolean,
      default: false
    },
    checked: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    showValue(field) {
      if(field) {
        const {key, data} = field;
        if(data) {
          const value = data[key];
          return value != undefined && value != '' ;
        }
      } return false;
    },
    onClick() {
      this.$emit('click')
      this.routerLink()
    },
    onClickRightIcon() {
      this.$emit('click-right-icon')
    },
    checkTel(tel) {
      if (/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/.test(tel)) {
        return '1'
      } else {
        return '0'
      }
    },
    onTel(tel) {
      this.$bridge.callHandler('callPhone', tel, (callbackData) => {
      })
      return false
    }

  }
})
</script>
