<template>
  <div class="van-fr lc-fixed-toolbar">
    <!-- fr-header  表头-->
    <slot
      v-if="formDef.name"
      name="fr-header"
    >
      <div class="van-block__title van-ellipsis">
        {{ formDef.name }}
      </div>
      <div v-if="formDef.desc" class="van-block__desc">
        {{ formDef.desc }}
      </div>
    </slot>
    <!-- fr-header  表单内容-->
    <div :style="bodyStyle" class="van-fr-body">
      <dynamic-form
        v-if="show"
        ref="formRender"
        v-model="formData"
        :form-def="formDefData"
        :permissions="permissions"
        :attributes="attributes"
        :readonly="readonly"
        :def-id="defId"
        :task-id="taskId"
        :bpmn-inst-id="bpmnInstId"
        :has-script="hasMobileScript"
        :form-opinion-data="formOpinionData"
        @load-script="loadScript"
      />
    </div>
    <!-- fr-toolbar  表单操作按钮-->
    <slot name="fr-toolbar">
      <lc-toolbar
        v-if="actions && actions.length >0"
        ref="frToolbar"
        :actions="actions"
        :more-actions="moreActions"
      />
    </slot>
    <slot ref="frExt" name="fr-ext" />
  </div>
</template>

<script>
import create from 'vant/lib/utils/create'
import '@/components/DynamicForm' // 动态表单
import LcToolbar from '@/components/LcToolbar'// 工具栏
import JForm from '@/components/utils/JForm'// 自定义脚本

export default create({
  inject: ['reload'],
  name: 'formrender',
  components: {
    LcToolbar
  },
  props: {
    formDef: Object,
    permissions: Object,
    data: Object,
    buttons: Array,
    attributes: Object,
    readonly: Boolean,
    // 流程参数
    defId: String,
    taskId: String,
    bpmnInstId: String,
    formOpinionData: Object
  },
  data() {
    return {
      show: false,
      formData: {},
      actions: [],
      moreActions: []
    }
  },
  mounted() {
    JForm._init(this)
  },
  watch: {
    data() {
      this.formData = JSON.parse(JSON.stringify(this.data))
      this.show = true
    },
    /**
     * 功能按钮
     */
    buttons() {
      this.actions = []
      this.moreActions = []
      if (this.$utils.isEmpty(this.buttons)) {
        this.moreActions = null
        return null
      }
      this.buttons.forEach((btn, i) => {
        const button = {
          name: btn.getLabel(),
          icon: btn.getIcon(),
          buttonType: btn.getStyle(),
          plain: btn.getPlain(),
          callback: () => {
            if (i >= 2) {
              this.closeMoreAction()
            }
            // 前置事件
            if (this.hasMobileScript) {
              const beforSubmitResult = JForm._beforeSubmit(this, btn.getAlias(), this.formData)
              if (typeof (beforSubmitResult) !== 'undefined' && !beforSubmitResult) {
                return
              }
            }
            return btn.action.apply(this, [btn])
          }
        }
        if (i >= 2) {
          this.moreActions.push(button)
        } else {
          this.actions.push(button)
        }
      })
      if (this.buttons.length <= 2) {
        this.moreActions = null
      }
    }
  },
  computed: {
    bodyStyle() {
      if (this.$isServer) {
        return
      }
      // header高度82px, fr actions高度50px，如果改动了样式自己传下bodyOffsetTop调整下
      const maxHeight = window.innerHeight - this.bodyOffsetTop
      return {
        maxHeight: maxHeight + 'px'
      }
    },
    formDefData() {
      return JSON.parse(JSON.stringify(this.formDef))
    },
    hasMobileScript() {
      const formDef = this.formDefData
      return !!((formDef && formDef.attrs && formDef.attrs.mobile_script))
    }
  },
  methods: {
    getFormRender() {
      return this.$refs.formRender
    },
    getFormValidator() {
      return this.$refs.formRender.getFormValidator()
    },
    getFormErrors() {
      return this.$refs.formRender.getFormErrors()
    },
    hasScript() {
      return this.hasMobileScript
    },

    /**
     * 表单错误提示
     */
    formErrorToast() {
      const errors = this.getFormErrors()
      if (this.$utils.isNotEmpty(errors)) {
        const name = document.getElementsByName(errors[0].field)
        if (name) {
          name[0].focus()
        }
      }
      this.$toast(this.$t('common.formError'))
    },
    getFormSubmitVerify() {
      return this.$refs.formRender.getFormSubmitVerify()
    },
    getFormData() {
      return this.formData
    },
    hasFormOpinion() {
      return this.$refs.formRender.hasFormOpinion()
    },
    getFormOpinionData() {
      return this.$refs.formRender.getFormOpinionData()
    },
    emitFrExt(action) {
      this.$emit('fr-ext', action)
    },
    closeMoreAction() {
      this.$refs.frToolbar.closeMoreAction()
    },
    loadScript() {
      JForm._onLoad(this)
    },
    confirm(message) {
      this.$dialog.alert({
        message: message
      })
    }
  }
})
</script>
<style lang="scss">
  .van-fr{
    .van-fr-actions {
        left: 0;
        bottom: 0;
        position: fixed;
    }

  }
</style>

