<template>
  <div class="lc-uploader-wrapper lc-cell-wrapper">
    <cell-group :border="border">
      <cell
        :title="label"
        :required="required"
        :center="center"
        :border="border"
        :class="bem({
          error,
          disabled: $attrs.disabled,
          [`label-${labelAlign}`]: labelAlign,
          'min-height':autosize
        })"
      >
        <slot slot="title" name="label" />
        <div :class="bem('body')" @click="onClick">
          <icon v-if="!readonly" slot="left-icon" name="add-o" class="van-cell__left-icon" />
          <div :class="bem('control', inputAlign)">
            <div :class="bem('placeholder')">{{ placeholder }}</div>
          </div>
        </div>
        <div v-if="errorMessage" :class="bem('error-message')" v-text="errorMessage" />
        <div v-if="desc" :class="bem('desc')" v-text="desc" />
      </cell>
      <!-- <cell
        v-if="!readonly"
        :class="bem({error})"
        @click="onClick">
        <div :class="bem('placeholder')">
          <van-icon name="add-o" size="20px"/>&nbsp;&nbsp;{{ placeholder }}
        </div>
      </cell>-->
      <div v-if="showClear">
        <van-swipe-cell
          v-for="(file,index) in selectedData"
          :key="file[valueKey]+index"
          :right-width="65"
        >
          <lc-file
            :file="file"
            :file-ext-key="fileExtKey"
            :file-size-key="fileSizeKey"
            :label-key="labelKey"
            @click="preview(file)"
          >
            <van-icon
              v-if="showClear"
              slot="rightIcon"
              :class="bem('clear')"
              size="16px"
              name="clear"
              class="van-lc-card__right-icon"
              @click.stop="removeFile(index)"
            />
          </lc-file>
          <span slot="right" @click.stop="removeFile(index)">{{ $t('delete') }}</span>
        </van-swipe-cell>
      </div>
      <!--只读-->
      <div v-for="(file,index) in selectedData" v-else :key="file[valueKey]+index">
        <lc-file
          :file="file"
          :file-ext-key="fileExtKey"
          :file-size-key="fileSizeKey"
          :label-key="labelKey"
          @click="preview(file)"
        />
      </div>
    </cell-group>
    <van-popup v-model="showPopup" class="lc-fullscreen-popup" position="bottom">
      <van-nav-bar :title="title" :left-text="leftText" left-arrow @click-left="onCancel">
        <span slot="right" class="van-nav-bar__text" @click="onConfirm">{{ rightShowText }}</span>
      </van-nav-bar>
      <div class="lc-fixed-navbar">
        <!--<van-tabs v-model="activeTab" @click="onTabClick">
        <van-tab :title="$t('components.uploader.uploadingTitle')">-->
        <div style>
          <!-- 根据pc端的配置显示 -->
          <van-cell v-if="fieldOptions.length>=1">
            <span v-for="(item,index) in fieldOptions" :key="index">
              <van-uploader
                v-if="index<2"
                :after-read="item.name==='video'||item.name==='photograph'?onAfterReadPG:onAfterRead"
                :before-read="onBeforeRead"
                :accept="item.accept"
                :max-size="maxSize"
                style="width: 50%;float:left;"
              >
                <van-icon
                  :name="item.name"
                  size="20px"
                  :style="{marginLeft: index===0?'30%':'34%'}"
                />
                <span>{{ item.alias }}</span>
              </van-uploader>
            </span>
          </van-cell>
          <van-cell v-if="fieldOptions.length>=3">
            <span v-for="(item,index) in fieldOptions" :key="index">
              <van-uploader
                v-if="index>1&&index<4"
                :after-read="item.name==='video'||item.name==='photograph'?onAfterReadPG:onAfterRead"
                :before-read="onBeforeRead"
                :accept="item.accept"
                :max-size="maxSize"
                style="width: 50%;float:left;"
              >
                <van-icon
                  :name="item.name"
                  size="20px"
                  :style="{marginLeft: index===2?'30%':'34%'}"
                />
                <span>{{ item.alias }}</span>
              </van-uploader>
            </span>
          </van-cell>
          <van-cell v-if="fieldOptions.length>=5">
            <span v-for="(item,index) in fieldOptions" :key="index">
              <van-uploader
                v-if="index>=4"
                :after-read="item.name==='video'||item.name==='photograph'?onAfterReadPG:onAfterRead"
                :before-read="onBeforeRead"
                :accept="item.accept"
                :max-size="maxSize"
                style="width: 50%;float:left;"
              >
                <van-icon
                  :name="item.name"
                  size="20px"
                  :style="{marginLeft: index===4?'30%':'34%'}"
                />
                <span>{{ item.alias }}</span>
              </van-uploader>
            </span>
          </van-cell>
          <!-- pc端没有配置时，默认显示相册和拍照 -->
          <van-cell v-if="fieldOptions.length===0">
            <van-uploader
              :after-read="onAfterRead"
              :before-read="onBeforeRead"
              accept="image/*"
              :max-size="maxSize"
              style="width: 50%;float:left;"
            >
              <van-icon name="photo" size="20px" style="margin-left: 30%" />
              <span>相册</span>
            </van-uploader>
            <van-uploader
              :after-read="onAfterReadPG"
              :before-read="onBeforeRead"
              accept="image/*, video/*"
              :max-size="maxSize"
              style="width: 50%;float:left;"
            >
              <van-icon name="photograph" size="20px" style="margin-left: 34%" />
              <span>拍照</span>
            </van-uploader>
          </van-cell>

          <!-- <van-cell>
            <van-uploader
              :after-read="onAfterRead"
              :before-read="onBeforeRead"
              accept="audio/*"
              :max-size="maxSize"
              style="width: 50%;float:left;"
            >
              <van-icon name="chat" size="20px" style="margin-left: 30%" />
              <span>录音</span>
            </van-uploader>
            <van-uploader
              :after-read="onAfterReadPG"
              :before-read="onBeforeRead"
              accept="audio/*, video/*"
              :max-size="maxSize"
              style="width: 50%;float:left;"
            >
              <van-icon name="video" size="20px" style="margin-left: 34%" />
              <span>视频</span>
            </van-uploader>
          </van-cell>

          <van-cell>
            <van-uploader
              :after-read="onAfterRead"
              :before-read="onBeforeRead"
              accept="*"
              multiple
              :max-size="maxSize"
              style="width: 50%;float:left;"
            >
              <van-icon name="folder" size="20px" style="margin-left: 30%" />
              <span>文件</span>
            </van-uploader>
          </van-cell>-->
        </div>
        <van-checkbox-group v-model="checkboxFiles">
          <van-cell-group>
            <van-cell
              v-for="(file,index) in uploadingFiles"
              :key="file[valueKey]+index"
              clickable
              @click="toggleUploading(index)"
            >
              <van-checkbox
                slot="icon"
                ref="uploadingCheckboxes"
                :name="file[valueKey]"
                style=" margin-top: 15px;"
                @click.native.stop="(e)=>clickUploadingCheckbox(e,index)"
              />
              <template slot="title" :class="bem('label')">
                <lc-file
                  :file="file"
                  :file-ext-key="fileExtKey"
                  :file-size-key="fileSizeKey"
                  :label-key="labelKey"
                />
              </template>
            </van-cell>
          </van-cell-group>
        </van-checkbox-group>
        <!--</van-tab>
          <van-tab :title="$t('components.uploader.uploadedTitle')">
            <van-checkbox-group
              v-model="checkboxFiles"
              @change="changeUploaded"
            >
              <van-cell-group>
                <van-cell
                  v-for="type in fileTypeList"
                  :key="type.id"
                  :title="type.name"
                  icon="folder-fill"
                  clickable
                >
                  <van-icon slot="right-icon" name="ellipsis" class="van-cell__right-icon" />
                </van-cell>
                <van-cell
                  v-for="(file,index) in uploadedFiles"
                  :key="file[valueKey]+index"
                  clickable
                  @click="toggleUploaded(index,file)"
                >
                  <van-checkbox
                    slot="icon"
                    ref="uploadedCheckboxes"
                    :name="file[valueKey]"
                    style="margin-top: 15px;"
                    @click.native.stop="(e)=>clickUploadedCheckbox(e,file,index)"
                  />
                  <template slot="title" :class="bem('label')">
                    <lc-file
                      :file="file"
                      :file-ext-key="fileExtKey"
                      :file-size-key="fileSizeKey"
                      :label-key="labelKey"
                    />
                  </template>
                </van-cell>
                <van-pagination
                  v-show="totalCount/pageSize>1"
                  v-model="page"
                  :total-items="totalCount"
                  :items-per-page="pageSize"
                  @change="loadUploadedFiles()"
                />
              </van-cell-group>
            </van-checkbox-group>
          </van-tab>
        </van-tabs>-->
      </div>
    </van-popup>

    <file-preview v-model="showPreviewPopup" :file="previewFile" :image-files="previewImages" :img-type="imgType" :img-title="imgTitle" :current-slide="currentSlide" />
  </div>
</template>
<script>
/**
 * 需要完善的功能
 * 数据存储格式 string 还是数组，现在默认的是数组
 *
 */
import { Pagination } from 'vant'
import LcFile from './file'
import { formatParams } from '@/utils/params'
import { getInfo, uploadFile, listJson } from '@/api/platform/attachment'
import { getTypeList } from '@/api/platform/cat/type'

import FilePreview from '@/components/FilePreview'

import create from '../utils/create'
import i18n from '@/lang' // Internationalization 国际化
import { getToken } from '@/utils/auth'

const BASE_URL = window.config.BASE_URL

export default create({
  name: 'lc-uploader',
  components: {
    LcFile,
    Pagination,
    FilePreview
  },
  props: {
    value: [String, Array],
    icon: String,
    label: String,
    desc: String,
    error: Boolean,
    center: Boolean,
    leftIcon: String,
    readonly: Boolean,
    required: Boolean,
    clearable: {
      type: Boolean,
      default: true
    },
    labelAlign: String,
    placeholder: String,
    inputAlign: {
      type: String,
      default: 'left'
    },
    autosize: [Boolean, Object],
    errorMessage: String,
    border: {
      type: Boolean,
      default: false
    },
    valueKey: {
      type: String,
      default: 'id'
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
    },
    pathKey: {
      type: String,
      default: 'filePath'
    },
    fileKey: {
      type: String,
      default: 'fileKey'
    },
    leftText: {
      type: String,
      default: i18n.t('cancel')
    },
    title: {
      type: String,
      default: i18n.t('components.uploader.title')
    },
    rightText: {
      type: String,
      default: i18n.t('confirm')
    },
    accept: {
      type: String,
      default: '*'
    },
    multiple: {
      type: Boolean,
      default: true
    },
    store: {// 返回值类型  array: 数组。string 字符串类型
      type: String,
      default: 'json',
      validator: function(value) {
        // value:只存value,all:存value和label
        // return ['all', 'value'].indexOf(value) !== -1
        // json ->是存储json字符串 [ {id:xxxx,fileName:xxxx}]
        // id -> xxxxxxxxx,xxx
        // path -> file\xxx\xxxxx
        return ['json', 'id', 'path'].indexOf(value) !== -1
      }
    },
    storeSeparator: {// 返回值分割符，对于设置字符串类型的分隔符
      type: String,
      default: ','
    },
    maxSize: {// 文件大小限制，单位为 byte
      type: Number
    },
    fileQuantity: {
      type: Number
    },
    fileFormates: {// 文件后缀
      type: Array
    },
    fieldOptions: {
      type: Array
    }
  },
  data() {
    return {
      showPopup: false,
      activeTab: 0,
      curFileType: '',
      fileTypeList: [],
      cacheFiles: {},
      checkboxFiles: [], // 选中的附件id
      uploadingFiles: [], // 正在上传的附件
      uploadingFileKeys: [],
      uploadedFiles: [], // 已上传的附件
      page: 1,
      pageSize: 15,
      totalCount: 0,
      showPreviewPopup: false,
      previewFile: {},
      selectedData: [], // 选中的附件
      previewImages: [], // 图片预览
      imgType: '',
      imgTitle: [], // 图片名称,
      currentSlide: 0 // 点击图片索引
    }
  },

  computed: {
    showClear() {
      return this.clearable && this.isNotEmpty(this.value) && this.isDef(this.value) && !this.readonly
    },
    rightShowText() {
      if (!this.checkboxFiles) return ''
      const length = this.checkboxFiles.length
      return length > 0 ? (this.rightText + `(${length})`) : ''
    }
  },
  watch: {
    value() {
      this.selectedData = []
      this.checkboxFiles = []
      this.initCacheFiles()
    }
  },
  created() {
    this.initCacheFiles()
  },
  methods: {
    initCacheFiles() {
      if (this.isEmpty(this.value)) { return }
      const arrayValue = this.getArrayValue(this.value)
      if (this.store === 'json') {
        arrayValue.forEach(v => {
          const key = v[this.valueKey]
          this.checkboxFiles.push(key)
          if (this.cacheFiles[key]) {
            this.selectedData.push(this.cacheFiles[key])
          } else {
            this.loadFileInfo(key)
          }
        })
      } else {
        arrayValue.forEach(v => {
          this.checkboxFiles.push(v)
          if (this.cacheFiles[v]) {
            this.selectedData.push(this.cacheFiles[v])
          } else {
            this.loadFileInfo(v)
          }
        })
      }
    },
    /**
     * 加载文件
     */
    loadFileInfo(key) {
      if (key) {
        getInfo({ id: key, type: this.store }).then(response => {
          const data = response.data
          this.cacheFiles[key] = data
          this.selectedData.push(data)
        }).catch((e) => {
          console.error(e)
        })
      }
    },
    getArrayValue(value) {
      if (this.$utils.isEmpty(value)) { return [] }
      if (this.store === 'json') { // json
        try {
          return this.$utils.parseData(value)
        } catch (error) {
          console.warn(error)
          return []
        }
      } else if (this.store === 'id' || this.store === 'path') { // id或path
        try {
          return value.split(this.storeSeparator)
        } catch (error) {
          console.warn(error)
          return []
        }
      } else {
        return value
      }
    },
    /**
     * 获取返回的值
     */
    getStoreValue(value) {
      const files = []
      let res = []
      if (this.$utils.isEmpty(value)) {
        return ''
      }
      value.forEach(v => {
        files.push(this.cacheFiles[v])
      })

      if (this.store === 'json') { // json
        const value = this.value ? JSON.parse(this.value) : []
        files.forEach(v => {
          if (value.length > 0) {
            const _this = this
            res = value
            const isExt = value.some(function(item) {
              return item.id === v[_this.valueKey]
            })
            if (isExt) {
              return false
            }
          }
          const o = {
            [this.valueKey]: v[this.valueKey],
            [this.labelKey]: v[this.labelKey]
          }
          res.push(o)
        })

        return JSON.stringify(res)
      } else if (this.store === 'id') {
        files.forEach(v => {
          res.push(v[this.valueKey])
        })

        return res.join(this.storeSeparator)
      } else if (this.store === 'path') {
        files.forEach(v => {
          res.push(v[this.pathKey])
        })
        return res.join(this.storeSeparator)
      } else {
        files.forEach(v => {
          res.push(v[this.valueKey])
        })
        return res || []
      }
    },

    onClick() {
      if (this.readonly) { return }
      this.showPopup = true
      // 还原原来的数据
      this.activeTab = 0
      this.uploadingFiles = [] // 正在上传的文件
      this.uploadedFiles = []// 已上传的文件
    },
    onCancel() {
      this.checkboxFiles = []
      this.showPopup = false
    },
    onConfirm() {
      this.showPopup = false
      if (this.$utils.isEmpty(this.checkboxFiles)) {
        this.$toast('请上传文件或选择已上传的文件！')
        return
      }
      this.$emit('input', this.getStoreValue(this.checkboxFiles))
    },
    onBeforeRead(file) {
      const size = file.size
      const ext = this.getExtName(file.name)
      if (this.checkboxFiles.length === this.fileQuantity) {
        this.$toast('文件上传数量的超出限制！')
        return false
      }
      // 上传大小
      if (this.$utils.isNotEmpty(this.maxSize) &&
        size > this.maxSize) {
        this.$toast('[' + file.name + ']文件大小的超出上传限制！')
        return false
      }
      // 上传格式
      if (this.$utils.isNotEmpty(this.fileFormates) &&
        (!ext || !this.fileFormates.includes('.' + ext))) {
        const fileType = this.fileFormates.join(',')
        this.$toast('请上传指定类型' + '[' + fileType + ']')
        return false
      }
      this.$emit('before-read', file)
      return true
    },

    onAfterRead(file) {
      if (file.length > 0) {
        for (let i = 0; i < file.length; i++) {
          const fileKey = file[i].file.name
          file[i].fileKey = fileKey
          if (this.uploadingFileKeys.indexOf(fileKey) < 0) {
            this.addFile(file[i])
          }
        }
      } else {
        const fileKey = file.file.name
        file.fileKey = fileKey
        if (this.uploadingFileKeys.indexOf(fileKey) < 0) {
          this.addFile(file)
        }
      }
      this.$emit('afte-read', file)
    },
    onAfterReadPG(file) {
      if (file.length > 0) {
        file = file[file.length - 1]
      }
      this.onAfterRead(file)
    },
    addFile(file) {
      // 上传文件用file
      const fileData = file.file
      const fileName = fileData.name
      const fileSize = fileData.size
      // 上传文件
      uploadFile(fileData).then(response => {
        const data = response.data
        const fileId = data.id
        const res = {
          [this.valueKey]: fileId,
          [this.labelKey]: this.gerFileName(fileName),
          [this.fileSizeKey]: fileSize,
          [this.fileExtKey]: this.getExtName(fileName),
          [this.pathKey]: data[this.pathKey]
        }
        this.uploadingFiles.push(res)
        this.uploadingFileKeys.push(file.fileKey)
        this.checkboxFiles.push(fileId)
        this.checkUploadedQuantity()
        // 缓存的文件
        this.cacheFiles[fileId] = res
      }).catch((e) => {
        console.error(e)
      })
    },
    clickUploadingCheckbox(event, index) {
      let flag = true
      const target = event.target
      if (target && target.className.indexOf('van-checkbox__label') > -1) {
        flag = false
      } else if (target && target.parentNode.className.indexOf('van-checkbox__icon') > -1) {
        flag = false
      }
      if (flag) {
        this.toggleUploading(index)
      }
    },
    toggleUploading(index) {
      this.$refs.uploadingCheckboxes[index].toggle()
    },

    // /-===================已上传===============
    clickUploadedCheckbox(event, index, file) {
      let flag = true
      const target = event.target
      if (target && target.className.indexOf('van-checkbox__label') > -1) {
        flag = false
      } else if (target && target.parentNode.className.indexOf('van-checkbox__icon') > -1) {
        flag = false
      }
      if (flag) {
        this.toggleUploaded(index, file)
      }
    },
    toggleUploaded(index, file) {
      const size = file[this.fileSizeKey]
      const ext = file[this.fileExtKey]
      // 上传大小
      if (this.$utils.isNotEmpty(this.maxSize) &&
        size > this.maxSize) {
        this.$toast('[' + file.fileName + ']文件大小的超出上传限制！')
        return false
      }
      // 上传格式
      if (this.$utils.isNotEmpty(this.fileFormates) &&
        (!ext || !this.fileFormates.includes('.' + ext))) {
        this.$toast('[' + file.fileName + ']文件格式不允许！')
        return false
      }
      this.$refs.uploadedCheckboxes[index].toggle()
    },
    changeUploaded(file) {
      if (this.isEmpty(this.fileQuantity) || this.fileQuantity < 0) {
        return
      }
      // 只能指定个数  删除第一个
      if (file.length > this.fileQuantity) {
        this.checkboxFiles.splice(0, 1)
      }
    },
    checkUploadedQuantity() {
      if (this.isEmpty(this.fileQuantity) || this.fileQuantity < 0) {
        return
      }
      if (this.checkboxFiles.length > this.fileQuantity) {
        this.checkboxFiles.splice(0, this.checkboxFiles.length - this.fileQuantity)
      }
    },
    removeFile(index) {
      this.$dialog.confirm({
        title: '提示',
        message: '确定删除吗？'
      }).then(() => {
        this.checkboxFiles.splice(index, 1)
        this.selectedData.splice(index, 1)
        this.$emit('input', this.getStoreValue(this.checkboxFiles))
      })
    },
    onTabClick(index) {
      // 加载已上传的附件
      if (this.activeTab === 1) {
        // 没有加载文件类型
        // this.loadFileType()
        this.loadUploadedFiles()
      }
    },
    loadFileType() {
      getTypeList({
        categoryKey: 'FILE_TYPE',
        typeKey: this.fileType
      }).then(response => {
        this.fileTypeList = response.data
      }).catch((e) => {
        console.error(e)
      })
    },
    loadUploadedFiles() {
      const params = formatParams({ 'Q^TYPE_ID_^SL': this.fileType || '' }, { 'page': this.page })
      listJson(params).then(response => {
        this.uploadedFiles = response.data
        this.setCacheFiles(this.uploadedFiles) // 缓存文件
        const pageResult = response.variables.pageResult
        this.page = pageResult.page
        this.totalCount = pageResult.totalCount
      }).catch((e) => {
        console.error(e)
      })
    },
    setCacheFiles(files) {
      if (this.isEmpty(files)) { return }
      files.forEach((file) => {
        this.cacheFiles[file[this.valueKey]] = file
      })
    },
    // 获取扩展名
    getExtName(name) {
      return name ? name.substring(name.lastIndexOf('.') + 1, name.length) : ''
    },
    // 获取文件名
    gerFileName(name) {
      return name /* ? name.substring(0, name.lastIndexOf('.')) : ''*/
    },
    /**
     * 预览文件
     */
    preview(item) {
      const FILE_TYPE = ['pdf', 'mp3', 'wav', 'aac', 'amr', 'mp4', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx']
      const IMAGE_TYPE = ['jpg', 'jpeg', 'bmp', 'png']
      // 支持预览类型
      if (FILE_TYPE.includes(item.ext)) {
        this.showPreviewPopup = true
        this.previewFile = item
        this.imgType = ''
      }
      // 点击预览的是图片时，获取所有的图片
      if (IMAGE_TYPE.includes(item.ext)) {
        if (this.selectedData && this.selectedData.length > 0) {
          this.previewImages = []
          this.showPreviewPopup = true
          this.previewFile = {}
          this.selectedData.forEach((val, index) => {
            if (IMAGE_TYPE.includes(val.ext)) {
              const url = BASE_URL + '/webapi/attachmentService/getFile?id=' + val.id + '&ext=' + val.ext + '&access_token=' + getToken() + '&type=image'
              this.previewImages.push(url)
              this.imgType = 'image'
              this.imgTitle.push(val.fileName)
              if (val.id === item.id) {
                this.currentSlide = index
              }
            }
          })
        }
      }
    }
  }
})
</script>

<style lang="scss">
.lc-uploader-wrapper {
  .van-swipe-cell__left,
  .van-swipe-cell__right {
    color: #ffffff;
    font-size: 15px;
    width: 65px;
    height: 52px;
    display: inline-block;
    text-align: center;
    line-height: 52px;
    background-color: #f44;
  }
}
</style>
