<template>
  <demo-section>
    <demo-block :title="$t('basicUsage')">
      <van-cell-group>
        <van-cell>
          <div slot="title" class="userInfo_img">头像</div>
          <avatar
            slot="right-icon"
            :icon="icon"
            :alt="alt"
            :size="size"
            circle
          />

        </van-cell>
      </van-cell-group>
    </demo-block>
  </demo-section>
</template>

<script>
// import Avatar from '../index'
export default {
  components: {
    // Avatar
  },
  data() {
    return {
      icon: 'logo',
      image: 'https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=2664901302,1339053714&fm=173&app=49&f=JPEG?w=640&h=359&s=FEB82CC71E510ED06935B96C03005059',
      ii: 'https://img.yzcdn.cn/public_files/2017/10/13/c547715be149dd3faa817e4a948b40c4.png',
      alt: '头像描述',
      size: 50
    }
  }
}
</script>
