<template>
  <van-popup v-model="showPopup" v-if="showPopup" class="lc-fullscreen-popup" >
    <van-nav-bar :title="title" left-text="关闭" left-arrow @click-left="onCancel" />
    <pdf-viewer v-if="fileType === 'pdf'" ref="viewer" />
    <div v-else-if="imgType === 'image'" class="lc-fixed-navbar">
      <image-viewer :src="imageFiles" :current-slide="slideIndex" @indexChage="onIndexChage" />
    </div>
    <audio-player v-else-if="fileType === 'audio'" ref="viewer" :title="title" :url="url" />

    <video-player v-else-if="fileType === 'video'" ref="viewer" :ext="fileExt" :url="url" />

    <div v-else class="lc-fixed-navbar">不支持预览的类型</div>
  </van-popup>
</template>
<script>
/**
 * 文件预览
 * 1、'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx'  类型支持
 * 2、图片支持缩放
 * 3、音频，语音支持
 * 下一版本支持
 * 1、pdf支持缩放
 * 2、音频，语音多格式支持
 *
 */
import pdfViewer from './pdf'
import imageViewer from './image/swipe'
import audioPlayer from './audio'
import videoPlayer from './video'
import { getToken } from '@/utils/auth'

const BASE_URL = window.config.BASE_URL
const OFFICE_TYPE = ['doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx']
const PDF_TYPE = ['pdf']
// const IMAGE_TYPE = ['jpg', 'jpeg', 'bmp', 'png']
const AUDIO_TYPE = ['mp3', 'wav', 'aac', 'amr']
const VIDEO_TYPE = ['mp4']
export default {
  components: {
    pdfViewer,
    imageViewer,
    audioPlayer,
    videoPlayer
  },
  props: {
    value: Boolean,
    file: {
      type: Object
    },
    imageFiles: {
      type: Array
    },
    imgType: {
      type: String
    },
    imgTitle: {
      type: Array
    },
    currentSlide: Number
  },
  data() {
    return {
      showPopup: false,
      title: '',
      fileId: '',
      fileExt: '',
      fileType: '',
      url: '',
      slideIndex: 0
    }
  },
  watch: {
    value() {
      this.showPopup = this.value
      if (this.value) {
        this.title = this.file.fileName
        this.fileId = this.file.id
        this.fileExt = this.file.ext
        this.loadViewer()
      }
    },
    imgTitle() {
      if (this.imgTitle.length > 0) {
        this.title = this.imgTitle[0]
      }
    },
    currentSlide() {
      this.slideIndex = this.currentSlide
    }
  },
  methods: {
    loadViewer() {
      const url =
        BASE_URL +
        '/webapi/attachmentService/getFile?id=' +
        this.fileId +
        '&ext=' +
        this.fileExt +
        '&access_token=' +
        getToken()
      if (
        PDF_TYPE.includes(this.fileExt) ||
        OFFICE_TYPE.includes(this.fileExt)
      ) {
        this.fileType = 'pdf'
        this.$nextTick(() => {
          this.$refs.viewer.load(url + '&type=' + this.fileType)
        })
      } else if (AUDIO_TYPE.includes(this.fileExt)) {
        this.fileType = 'audio'
        this.url = url + '&type=' + this.fileType
      } else if (VIDEO_TYPE.includes(this.fileExt)) {
        this.fileType = 'video'
        this.url = url + '&type=' + this.fileType
      }
    },
    // 图片的标题切换
    onIndexChage(val) {
      this.title = this.imgTitle[val]
    },
    onCancel() {
      this.fileType = ''
      this.$emit('input', false)
    }
  }
}
</script>
