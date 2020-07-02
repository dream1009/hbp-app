<template lang="html">
  <div class="">
    <van-nav-bar
      :title="generateTitle()"
      :left-text="$t('back')"
      left-arrow
      fixed
      @click-left="onBack"
    />
    <van-cell-group>
      <van-field
        v-model="form.title"
        v-validate="{ required: true}"
        :error="errors.has('text')"
        :error-message="errors.first('text')"
        label="标题"
        placeholder="请输入"
        clearable
        required
        name="text"
      />
      <van-lc-radio
        v-model="form.publicItem"
        :options="publishOption"
        label="发布类型"
        placeholder="请选择"
        clearable
      />
      <van-lc-type
        v-model="form.typeId"
        category-key="NOTICE_TYPE"
        label="类型"
        clearable
        @clear-data="clearData"
      />
      <van-lc-selector
        v-model="userSelect"
        label="发布人"
        type="user"
        store="array"
        clearable
      />
      <van-lc-switch
        v-model="form.isPublic"
        label="是否公共"
        active-value="yes"
        inactive-value="no"
      />
      <van-lc-selector
        v-show="form.isPublic==='no'"
        v-model="orgSelect"
        label="发布范围"
        type="org"
        store="array"
        clearable
      />
      <van-field
        v-model="form.author"
        label="作者"
        placeholder="请输入"
        clearable
        name="text"
      />
      <van-field
        v-model="form.key"
        label="关键字"
        placeholder="请输入"
        clearable
        name="text"
      />
      <van-lc-date-picker
        v-model="form.publicDate"
        label="发布时间"
        placeholder="请选择"
        format="yyyy-MM-dd"
        clearable
      />
      <van-lc-date-picker
        v-model="form.loseDate"
        label="过期时间"
        placeholder="请选择"
        format="yyyy-MM-dd"
        clearable
      />
      <van-lc-uploader
        v-model="form.fileAttach"
        store="json"
        multiple
        label="附件"
        placeholder="请上传附件"
        clearable
      />
      <van-lc-editor
        v-model="form.content"
        label="内容"
      />
    </van-cell-group>
    <lc-toolbar
      :actions="actions"
    />
  </div>
</template>

<script>
import { getTypes } from '@/api/platform/cat/type'
import { saveNotice, getNotice } from '@/api/platform/notice/notice'
import Vue from 'vue'
import LcControl from '@/components/LcControl'
Vue.use(LcControl)
import navbar from '@/mixins/navbar'
import fecha from '@/utils/fecha'
import LcToolbar from '@/components/LcToolbar'
export default {
  components: {
    LcToolbar
  },
  mixins: [navbar],
  data() {
    return {
      form: {
        id: '',
        picture: '',
        status: '',
        publicItem: '',
        typeId: '',
        type: '',
        title: '',
        userId: '',
        userName: '',
        isPublic: 'yes',
        depId: '',
        depName: '',
        author: '',
        key: '',
        publicDate: '',
        loseDate: '',
        fileAttach: '',
        content: '',
        editorValue: ''

      },
      userSelect: [],
      orgSelect: '',
      options: [],
      publishOption: [{
        value: 'notices',
        label: '发布公告'
      }, {
        value: 'important',
        label: '重要公告'
      }],
      actions: [
        {
          'name': this.$t('common.button.ts'),
          'buttonType': 'default',
          'callback': this.saveDraft
        },
        {
          'name': this.$t('common.button.save'),
          'buttonType': 'primary',
          'callback': this.saveData
        }]
    }
  },
  watch: {
    // 'form.typeId': function() {
    //   this.options.forEach(opt => {
    //     if (opt.id === this.form.typeId) {
    //       this.form.type = opt.name
    //     }
    //   })
    // },
    userSelect() {
      if (this.userSelect[0]) {
        this.form.userId = this.userSelect[0].id
        this.form.userName = this.userSelect[0].name
      }
    },
    orgSelect() {
      if (this.orgSelect[0]) {
        this.form.depId = this.orgSelect[0].id
        this.form.depName = this.orgSelect[0].name
      }
    }
  },
  created() {
    getTypes({ catKey: 'NOTICE_TYPE' }).then(response => {
      this.options = response.data
    })
    // 草稿跳转进来的
    if (this.$route.query && this.$route.query.id) {
      getNotice({
        id: this.$route.query.id
      }).then(response => {
        this.form = response.data

        if (this.$utils.isNotEmpty(this.form.userId) && this.$utils.isNotEmpty(this.form.userName)) {
          this.userSelect = [{ 'id': this.form.userId, 'name': this.form.userName }]
        }
        if (this.$utils.isNotEmpty(this.form.depId) && this.$utils.isNotEmpty(this.form.depName)) {
          this.orgSelect = [{ 'id': this.form.depId, 'name': this.form.depName }]
        }
      }).catch(error => {
        console.error(error)
      })
    } else {
      this.form.publicDate = fecha.format(new Date(), 'yyyy-MM-dd')
      this.userSelect = [{ 'id': this.$store.getters.id, 'name': this.$store.getters.account }]
    }
  },
  methods: {
    onBack() {
      this.$router.push({ name: 'notice' })
    },
    onSave() {
      saveNotice({
        newsJson: JSON.stringify(this.form)
      }).then(response => {
        this.$toast.success('保存公告成功！')
        this.$router.push({ name: 'notice' })
      }).catch(error => {
        console.error(error)
      })
    },
    saveDraft() {
      this.$validator.validateAll().then((result) => {
        if (!result) {
          const name = document.getElementsByName(this.errors.items[0].field)
          if (name) {
            name[0].focus()
          }
          this.$toast('表单未正确填写！')
          return
        }
        this.form.status = 'drafts'
        this.onSave()
      })
    },
    saveData() {
      this.$validator.validateAll().then((result) => {
        if (!result) {
          const name = document.getElementsByName(this.errors.items[0].field)
          if (name) {
            name[0].focus()
          }
          this.$toast('表单未正确填写！')
          return
        }
        this.form.status = 'publish'
        this.onSave()
      })
    },
    clearData() {
      this.form.typeId = ''
    }
  }

}
</script>

