<template>
  <div>
  <van-nav-bar
    :title="title"
  />
  <van-cell-group>
    <van-field
      label="工单编号:"
      :value="workorderNo"
      disable=true
      :readonly=true
    />
    <van-field
      label="服务类型:"
      :value="bpmName"
      disable=true
      :readonly=true
    />
    <van-cell>
      <span>服务态度:</span>
    <van-rate
      class="rate"
      v-model="attitude"
      allow-half
      void-icon="star"
      void-color="#eee"
      :readonly="readonly"
    />
    </van-cell>
    <van-cell>
      <span>上门速度:</span>
      <van-rate
        class="rate"
        v-model="speed"
        allow-half
        void-icon="star"
        void-color="#eee"
        :readonly="readonly"
      />
    </van-cell>
    <van-cell>
      <span class="spanTitle">留言:</span>
      <textarea class="textarea" v-model="remark" :readonly="readonly"></textarea>
    </van-cell>
    <van-cell>
    <van-uploader :after-read="afterRead" :disabled="readonly">
      <van-button icon="photo" type="primary" size="small">上传图片</van-button>
    </van-uploader>
    </van-cell>
      <van-cell>
      <div class="img-div">
        <viewer :images="images">
          <img class="img"
            :src="image.src"
            :key="image.num" v-for="image in images">
          <template slot-scope="" v-if="images.length > 0 && !readonly">
            <span class="icon-remove" @click.stop="remove()">&times;</span>
          </template>
        </viewer>
      </div>
      </van-cell>
    <van-cell>
      <van-button class="commit" type="primary" round @click="commit" :disabled="readonly">提交</van-button>
    </van-cell>
  </van-cell-group>
  </div>
</template>
<script>
import { getWorkOrderById, updateRateDataById, uploadFile, getImage } from '@/api/platform/rate/index'
import Vue from 'vue';
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
Vue.use(Viewer)
Viewer.setDefaults({
    Options: { 'remove': true,'inline': true, 'button': true, 'navbar': true, 'title': true, 'toolbar': true, 'tooltip': true, 'movable': true, 'zoomable': true, 'rotatable': true, 'scalable': true, 'transition': true, 'fullscreen': true, 'keyboard': true, 'url': 'data-source' }
})
export default {
  data() {
    return {
      title: '评分',
      form: [],
      workorderId: '',
      workorderNo: '',
      bpmName: '',
      attitude: 0,
      speed: 0,
      remark: '',
      images: [],
      imageCount: 0,
      uploadingFiles: [],
      readonly: false
    }
  },
  mounted() {
    const id = this.getQueryString('workorderId')
    getWorkOrderById({ workOrderId: id }).then(response => {
      if (response.data) {
        const data = response.data
        const imageCache = []
        this.workorderId = data.workorder_id
        this.workorderNo = data.workorder_no
        this.bpmName = data.bpm_name
        this.attitude = data.user_appraise_attitude ? parseInt(data.user_appraise_attitude) : 5
        this.speed = data.user_appraise_speed ? parseInt(data.user_appraise_speed) : 5
        this.remark = data.user_appraise_remark ? data.user_appraise_remark : ''
        if (data.user_appraise_image) {
          const arr = JSON.parse(data.user_appraise_image)
          this.imageCount = arr.length
          let count = 0
          for (const key in arr) {
            getImage({ id: arr[key].id }).then(response => {
              const base64 = 'data:image/png;base64,' + btoa(new Uint8Array(response.data)
                .reduce((data, byte) => data + String.fromCharCode(byte), ''))
              const img = {
                num: key,
                src: base64
              }
              imageCache.push(img)
              if (count === arr.length - 1) {
                this.images = imageCache.sort((a, b) => {
                  return (a['num'] < b['num']) ? -1 : (a['num'] > b['num']) ? 1 : 0
                })

              }
              count++
            })
          }
        }
        if (data.user_appraise_attitude) {
          this.readonly = true
        }
      }
    }).catch((e) => {
      console.error(e)
    })
  },
  methods: {
     remove() {
         this.$dialog.confirm({ message: '确认删除吗？' }).then(() => {
             this.uploadingFiles.splice(this.uploadingFiles.length - 1, 1)
             this.images.splice(this.images.length - 1, 1)
         })
      },
    commit() {
      const params = { 'workOrderId': this.workorderId, 'attitude': this.attitude, 'speed': this.speed, 'remark': this.remark, images: JSON.stringify(this.uploadingFiles) }
      updateRateDataById(params).then(response => {
        if (response.state === 200) {
          this.$dialog.alert({ message: response.message })
          this.readonly = true
        }
      })
    },
    afterRead(file) {
      if (file.length > 0) {
        if (file.length + this.images.length > 3) {
          this.$dialog.confirm({ message: '上传图片不能超过3张' })
          return
        }
        for (let i = 0; i < file.length; i++) {
          this.addFile(file[i])
        }
      } else {
        if (this.images.length >= 3) {
          this.$dialog.confirm({ message: '上传图片不能超过3张' })
          return
        }
        this.addFile(file)
      }
      const img = {
        num: this.imageCount,
        src: file.content
      }
      this.images.push(img)
      this.imageCount++
    },
    addFile(file) {
      // 上传文件用file
      const fileData = file.file
      // 上传文件
      uploadFile(fileData).then(response => {
        const data = response.data
        const res = {
          id: data.id,
          fileName: data.fileName + '.' + data.ext
        }
        this.uploadingFiles.push(res)
      }).catch((e) => {
        console.error(e)
      })
    },
    getQueryString(name) {
      const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
      const r = window.location.search.substr(1).match(reg)
      if (r != null) {
        return unescape(r[2])
      }
      return null
    }
  }
}
</script>
<style lang="scss">
  .spanTitle{
    display: inline-block;vertical-align:top
  }
  .textarea{
    margin-left: 10%; width: 75%; height: 100px;
  }
  .icon{
    margin-left: 200%;
  }
  .rate{
    margin-left: 22%; margin-top: -20px;
  }
  .img-div{
    line-height:60px; float:left; display:inline;
  }
  .img{
    float:left; display:inline; width:25%; line-height:50px; margin: 10px;
  }
  .commit{
    width: 90%;position: fixed;bottom: 20px;
  }
</style>
