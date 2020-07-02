<template>
  <demo-section>
    <demo-block :title="$t('basicUsage')">
      <van-cell-group>
        <van-cell>
          <div slot="title" class="userInfo_img">选择</div>

        </van-cell>
        <van-cell>
          <checker>

            <!--  -->
          </checker>
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
      alt: '头像描述',
      size: 50
    }
  }
}
</script>
