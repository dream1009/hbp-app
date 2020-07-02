<template>
  <!--没有意见的表单  启动或者草稿-->
  <div class="lc-fixed-top">
    <van-nav-bar
      :title="generateTitle(title)"
      :left-text="$t('back')"
      left-arrow
      fixed
      @click-left="onClickLeft"
      @click-right="onClickRight"
    >
      <van-icon slot="right" name="home" />
    </van-nav-bar>
    <formrender
      ref="formrender"
      :form-def="formDef"
      :permissions="permissions"
      :data="formData"
      :buttons="buttons"
      :attributes="attributes"
      :readonly="readonly"
      @fr-ext="handleFrExt"
    />
  </div>
</template>
<script>
import { getFormData } from '@/api/platform/data/dataTemplate'
import i18n from '@/utils/i18n'
import Formrender from '@/components/Formrender'
import TemplateButton from './templateButton.js'
import routeLeave from '@/mixins/routeLeave'// 表单未保存提示

export default {
  name: 'TemplateForm',
  components: {
    Formrender
  },
  mixins: [routeLeave],
  data() {
    return {
      formDef: {}, // 表单信息
      permissions: {}, // 表单权限
      formData: {}, // 表单数据
      buttons: [], // 操作按钮
      attributes: {}, // 表单属性，用于部分控件设置
      isEdit: false,
      version: 0, // 版本号
      pk: '',
      boCode: '',
      hasButton: false,
      title: ''
    }
  },
  computed: {
    readonly() {
      return !this.isEdit
    }
  },
  created() {
    const query = this.$route.query
    const params = this.$route.params
    this.pk = query.pk || '' // 表单的主键
    this.templateKey = query.templateKey // 模版key
    this.templateId = query.templateId // 模版Id
    this.formKey = query.formKey
    this.isEdit = query.isEdit

    this.hasButton = this.$utils.isNotEmpty(params.buttons)

    this.loadData()
  },
  methods: {
    loadData() {
      // 加载数据
      getFormData({
        formKey: this.formKey,
        templateKey: this.templateKey,
        hasButton: this.hasButton,
        pk: this.pk

      }).then(response => {
        const data = response.data
        // 判断是否设置表单
        if (this.$utils.isEmpty(data)) {
          this.$dialog.alert({
            message: `<div class="lc-error-messsage">未设置表单,请流程定义中设置表单</div>`
          }).then(() => {
            this.$router.go(-1)
          })
          return
        }

        // 表单定义
        this.formDef = this.$utils.parseData(data.formDef) || {}
        const key = this.isEdit ? (this.$utils.isNotEmpty(this.pk) ? '[编辑]' : '[新增]') : '[明细]'
        this.title = key + this.formDef.name
        i18n.setTitle(this.title)
        this.boCode = this.formDef.code
        // 表单数据
        this.formData = this.$utils.parseData(data.formData) || {}
        // 表单权限
        this.permissions = this.$utils.parseData(data.permissions) || {}
        // 属性
        this.attributes = data.attributes || {}

        if (this.isEdit) {
          if (!this.hasButton) {
            var b = this.$utils.parseData(data.buttons) || {}
            // 操作按钮
            this.buttons = this.getButtons(b)
          } else {
            const params = this.$route.params
            this.buttons = this.getButtons(params.buttons, params)
          }
        }
        this.$store.dispatch('setDataChange', false)
      }).catch((e) => {
        // TODO 异常
        console.error(e)
        this.$store.dispatch('setDataChange', false)
      })
    },
    getButtons(buttons, params) {
      params = this.getParams()
      if (this.$utils.isEmpty(buttons)) { return null }
      var btn = 	new TemplateButton({
        buttons: buttons,
        params: params
      })
      return btn.response_buttons
    },
    getParams() {
      return {
        pk: this.pk,
        formKey: this.formKey,
        boCode: this.boCode,
        version: this.version,
        templateKey: this.templateKey,
        templateId: this.templateId
      }
    },
    handleFrExt() {

    },
    generateTitle(name, title) { // generateTitle by vue-i18n
      return i18n.generateTitle(name, title)
    },
    onClickLeft() {
      this.$router.go(-1)
    },
    onClickRight() {
      this.$router.push({ path: '/dashboard' })
    },
    hasChange() {
      return this.$utils.looseEqual(this.formData, this.$refs.formrender.getFormData())
    }
  }

}
</script>

