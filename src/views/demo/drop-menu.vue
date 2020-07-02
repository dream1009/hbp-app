<template>
  <div class="lc-example-child lc-example-child-drop-menu lc-example-child-drop-menu-0">
    <van-button @click="getSelectedValue('dropMenu0',0)">
      获取选择的值
    </van-button>
    <lc-drop-menu
      ref="dropMenu0"
      :data="data"
      :default-value="defaultValue"
    />

    <div class="content">
      正文区域
    </div>
    <div class="content">
      正文区域
    </div>
    <div class="content">
      正文区域
    </div>
    <div class="content">
      正文区域
    </div>
  </div>
</template>

<script>
import DropMenu from '@/components/DropMenu'

export default {
  name: 'DropMenuDemo',
  components: {
    [DropMenu.name]: DropMenu
  },
  data() {
    return {
      isContentShow: false,
      defaultValue: ['12.8L', '自动挡'],
      data: [

        {
          text: '排量',
          options: [
            {
              text: '1.6L'
            },
            {
              text: '1.8L'
            },
            {
              text: '2.0L'
            },
            {
              text: '1.2T'
            },
            {
              text: '1.4T'
            },
            {
              text: '11.6T'
            },
            {
              text: '11.6L'
            },
            {
              text: '11.8L'
            },
            {
              text: '21.0L'
            },
            {
              text: '11.2T'
            },
            {
              text: '11.4T'
            },
            {
              text: '12.6T'
            }, {
              text: '12.6L'
            },
            {
              text: '12.8L'
            },
            {
              text: '22.0L'
            },
            {
              text: '12.2T'
            },
            {
              text: '12.4T'
            },
            {
              text: '13.6T'
            }
          ]
        },
        {
          text: '变速箱',
          disabled: true,
          options: [
            {
              text: '手动挡'
            },
            {
              text: '自动挡'
            },
            {
              text: '手自一体'
            }
          ]
        }
      ]
    }
  },
  mounted() {
    window.DropMenuTrigger = () => {
      this.getSelectedValue('dropMenu0', 0)
    }
  },
  methods: {
    getSelectedValue(selector, index) {
      const value = this.$refs[selector].getSelectedValue(index)
      this.$dialog.alert({
        message: `<pre>${JSON.stringify(value)}</pre>`
      })
    }
  }
}

</script>
