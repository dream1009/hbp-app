<template>
  <lc-card
    :thumb="getFileImage(file[fileExtKey])"
    :image="getFileImage(file[fileExtKey])"
    :title="getFileName()"
    :desc="file[fileSizeKey]|formatFileSize"
    rounded
    size="40"
    @click="onClick"
  >
    <slot slot="rightIcon" name="rightIcon" />
  </lc-card>
</template>

<script>
import { allFileTypes } from '@/constants/file'
import LcCard from '@/components/LcCard'
import { getToken } from '@/utils/auth'

const BASE_URL = window.config.BASE_URL
const IMAGE_TYPE = ['jpg', 'jpeg', 'bmp', 'png']

export default {
  components: {
    LcCard
  },
  props: {
    file: {
      type: Object
    },
    labelKey: {
      type: String,
      default: 'fileName'
    },
    fileExtKey: {
      type: String,
      default: 'ext'
    },
    fileSizeKey: {
      type: String,
      default: 'totalBytes'
    }
  },
  methods: {
    getFileName() {
        if (!(this.file[this.labelKey]).endsWith('.' + this.file[this.fileExtKey])) {
            return this.file[this.labelKey] + '.' + this.file[this.fileExtKey]
        } else {
            return this.file[this.labelKey]
        }
    },
    // 获取展示图片
    getFileImage(ext) {
      if (allFileTypes.indexOf(ext) === -1) {
        ext = 'attachment'
      }
      // 如果是图片显示图片缩略图
      if (IMAGE_TYPE.indexOf(ext) !== -1) {
        const url = BASE_URL + '/webapi/attachmentService/getFile?id=' + this.file.id + '&ext=' + this.file.ext + '&access_token=' + getToken() + '&type=image'
        return url
      } else {
        return `./static/images/file/${ext}.png`
      }
    },
    // 获取展示图片
    getFileIcon(ext) {
      if (allFileTypes.indexOf(ext) === -1) {
        return 'file-unknown'
      }
      return `file-${ext}`
    },
    onClick() {
      this.$emit('click')
    }
  }

}
</script>
