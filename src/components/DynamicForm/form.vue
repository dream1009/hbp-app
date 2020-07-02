<template>
  <van-cell-group :border="border">
    <dynamic-form-item
      v-for="field in formDef.fields"
      ref="formItem"
      :key="field.name"
      v-model="formData[field.name]"
      :field="field"
      :form-field="formDef.fields"
      :data="formData"
      :form-opinion="formOpinion[field.name]"

      :rights="rights[field.name]"
      :params="params"

      @cinput="handleInput($event)"
      @change-form-opinion="handleFormOpinion"
    />
  </van-cell-group>
</template>

<script>
import FormOptions from './constants/formoptions'
import FormUtil from './utils/formUtil'
import deepClone from 'vant/es/utils/deep-clone'

export default {
  props: {
    formDef: {
      type: Object,
      required: true
    },
    value: {
      type: Object
    },
    formField: Array,
    readonly: {
      type: Boolean,
      default: false
    },
    permissions: {
      type: Object
    },
    columnMinWidth: {
      type: String
    },
    attributes: {
      type: Object
    },
    validateImmediately: {// 是否初始验证
      type: Boolean,
      default: true
    },
    hasScript: Boolean,
    // 流程参数
    defId: String,
    taskId: String,
    bpmnInstId: String,
    nodeId: String,
    formOpinionData: Object// 表单意见数据
  },
  data() {
    return {
      rights: {},
      responseFormula: {},
      responseLinkages: {},
      responseVerifys: [], // 表单提交校验
      border: false,
      isInitialization: false,
      oldFormData: {},
      formOpinion: {}, // 表单意见展示的数据
      opinionData: '', // 表单意见保存的意见
      responseOpinionFields: [],
      dictionaries: [], // 表单字典项
      dictData: []
    }
  },
  computed: {
    formData() {
      return this.value
    },
    params() { // 扩展参数
      return {
        code: this.formDef.code,
        responseFormula: this.responseFormula,
        responseLinkages: this.responseLinkages,
        readonly: this.readonly,
        permissions: this.rights,
        defId: this.defId,
        taskId: this.taskId,
        bpmnInstId: this.bpmnInstId,
        attributes: this.attributes,
        dictData: this.dictData
      }
    }
  },
  watch: {
    formDef() {
      this.border = true
      this.initResponseFields()
    },
    value(val, oldVal) {
      // 延迟验证
      this.$nextTick(() => {
        this.getFormValidator()
        let hasChangeData = false
        if (!this.readonly) {
          hasChangeData = !this.$utils.looseEqual(this.formData, this.oldFormData)
        }
        this.$store.dispatch('setDataChange', hasChangeData)
      })
    }
  },
  mounted() {
    if (this.validateImmediately) { this.getFormValidator() }
    // 初始化脚本
    if (this.isInitialization && this.hasScript) {
      this.$emit('load-script')
    }
    // 数据是否修改
    this.$nextTick(() => {
      this.oldFormData = JSON.parse(JSON.stringify(this.formData))
      this.$store.dispatch('setDataChange', false)
    })
  },
  created() {
    this.initResponseFields()
    if (!this.isInitialization) {
      this.initJForm()
      this.isInitialization = true
    }
    this.setDictData()
  },
  methods: {
    /**
     * 初始化表单字典项
     */
    setDictData() {
      if (this.dictionaries.length > 0) {
        // 初始化表单字典项（获取字典项数据优化新增）
        FormUtil.getDictionaries(this.taskId, this.dictionaries).then(data => {
          this.dictData = data
        })
      }
    },
    getLabelWidth() {
      if (this.formDef.attrs.labelWidth !== null && this.formDef.attrs.labelWidthUnit !== '') {
        return this.formDef.attrs.labelWidth + this.formDef.attrs.labelWidthUnit
      }
    },
    /**
     * 初始化字段
     */
    initResponseFields() {
      const fields = this.formDef.fields
      if (!fields) { return }
      const data = { ...this.value }

      const permissions = { ...this.permissions }
      fields.forEach(item => {
        item.code = this.formDef.code
        // 设置默认值
        this.setExistingValue(data, item)
        // 设置权限
        this.rights[item.name] = this.getPermissions(permissions, item) || this.getDefaultRigths(item)
        // 初始化需要进行公式计算的字段
        this.initResponseFormula(item)
        // 初始化需要进行联动数据的字段
        this.initResponseLinkages(item)
        //  初始化审批意见控件字段
        if (item.field_type === 'approval_opinion') {
          this.responseOpinionFields.push(item.name)
        }
        if (item.field_type === 'dictionary') {
            if (item.field_options.dictionary) {
                this.dictionaries.push(item.field_options.dictionary)
            }
        }
      })
      // 初始化运行公式计算
      this.initRunCalFormula()
      // 设置默认值
      this.setDefaultValue()
      // 表单意见数据
      this.initResponseOpinionData()
      // 初始化表单规则
      this.initRules();
    },
    /**
     * 初始化表单字典项数据
     */
    setDictvalue(dicts, id) {
      if (dicts && dicts.length > 0) {
        FormUtil.getDictionaries(this.dictData, id, dicts).then(data => {

        })
      }
    },
    /**
     * 初始化表单意见数据
     */
    initResponseOpinionData() {
      this.formOpinion = {}
      const opinionData = this.formOpinionData
      if (this.$utils.isEmpty(opinionData) || this.responseOpinionFields.length <= 0) {
        return
      }
      if (opinionData.hasNode) { // 1、有流程节点绑定的流程意见
        this.formOpinion = opinionData.formOpinionData
        const formOpinionConfig = opinionData.formOpinionConfig // 表单意见配置
        this.responseOpinionFields.forEach(field => {
          if (!formOpinionConfig[field]) {
            this.formOpinion[field] = opinionData.opinionList
          }
        })
      } else { // 2、没有流程节点绑定的流程意见
        this.responseOpinionFields.forEach(field => {
          this.formOpinion[field] = opinionData.opinionList
        })
      }
    },

     // 初始化表单规则
     initRules() {
         const rules = this.formDef.attrs ? this.formDef.attrs.rules : []
         let rule_fields = this.getRuleFields(rules) || {}
         let _r, conditions
         // 初始化时候需要计算规则
         rule_fields.forEach((value, key, map) => {
             rules.forEach(rule => {
                 let type = rule.type, conditions = rule.conditions
                 let isPass = this.checkIsPass(conditions, key)
                 if (isPass) {
                     switch (type) {
                         case 'hide':
                           const field = this.formDef.fields.find(field => field['name'] === key)
                            field['field_type'] = 'hidden'
                             break;
                     }
                 } else {
                     switch (type) {
                         case 'show':
                             const field = this.formDef.fields.find(field => field['name'] === key)
                             field['field_type'] = 'hidden'
                     }
                 }

                 /*if (this.formDef.fields[rule.field]) {

                 }*/
                 }

             )

         })
         // _.each(rule_fields, (function (_this) {
         //     return function (rule) {
         //         _.each(rule.rules, function (rules) {
         //             _.each(rules.conditions.rules, function (rule) {
         //                 var rf = _this.response_models[rule.field];
         //                 if (rf) return _this.runRules(rf);
         //             });
         //         });
         //     };
         // })(this));

         return this.allRules;
     },
      checkIsPass(conditions) {
        const rules = conditions.rules
        const valid = conditions.valid
        const _this = this
        let isValid = true
        for(let index in rules){
          let rule = rules[index]
            const formValue = _this.formData[rule['field']]
            const field = _this.formDef.fields.find(field => field.name === rule['field'])
            const fieldType = field['field_type']
            let condValue = rule['value']
            const operator = rule['operator']
            if (fieldType === 'selector') {
                condValue = rule['value'][0]['id']
            }
            isValid = condValue === formValue
            if (!(isValid && valid)) {
                return false
            }
        }
          return true
      },
      getRuleFields(_ref) {
          const map = new Map()
          if (_ref)
          _ref.forEach(ref =>{
              const r = deepClone(ref)
              delete r.fields
              _.each(ref.fields, function (f) {
                  if (!map.get(f)) {
                      map.delete(f)
                  }
                  map.set(f, r)
              })
          })
          return map
      },
    /**
     * 处理表单意见
     */
    handleFormOpinion(opinionData) {
      let data = ''
      // 如果有多个，取最后一个
      if (this.$utils.isNotEmpty(opinionData)) {
        for (const o in opinionData) {
          data = opinionData[o] || ''
        }
      }
      this.opinionData = data
    },
    /**
     * 是否有表单意见
     */
    hasFormOpinion() {
      return this.$utils.isNotEmpty(this.formOpinion)
    },
    /**
     * 获取表单意见的数据
     */
    getFormOpinionData() {
      return this.opinionData
    },
    // 设置值
    setDefaultValue() {
      this.handleInput({ ...this.formData })
    },
    handleInput(data) {
      // 这里没有上报event，直接就是value了
      this.$emit('input', data)
    },
    // 设置已经存在的值
    setExistingValue(data, item) {
      const { name } = item
      if (data[name] !== undefined && data[name] !== '') { return }
      this.formData[name] = data[name] || FormUtil.getFieldDefaultValue(item, (n, d) => {
        this.formData[n] = d
        // 延迟验证
        this.$nextTick(() => {
          this.getFormValidator()
        })
      })
    },

    // 获取权限
    getPermissions(permissions, { name, field_type }) {
      if (this.$utils.isEmpty(permissions)) { return }
      const fieldType = field_type
      let rightsValue = null
      const isNonInputField = FormOptions.t.NON_INPUT_FIELD_TYPES.findIndex((n) => { return n === fieldType }) > -1
      let isSpecial = false
      if (isNonInputField && permissions.fields) { // 非输入字段
        rightsValue = permissions.fields[name] ? permissions.fields[name] : null
      } else if (fieldType === 'approval_opinion' && permissions.opinions) { // 意见 特殊处理
        rightsValue = permissions.opinions[name] ? permissions.opinions[name] : null
      } else if (fieldType === 'table' && permissions.tables) { // 子表
        isSpecial = true
        rightsValue = permissions.tables[name] ? permissions.tables[name] : null
      } else { // 字段
        rightsValue = permissions.fields[name] ? permissions.fields[name] : null
      }
      if (this.readonly && !isNonInputField && !isSpecial) { // 只读权限
        rightsValue = rightsValue !== FormOptions.t.PERMISSIONS.HIDE ? FormOptions.t.PERMISSIONS.READ : rightsValue
      }

      return rightsValue
    },
    /**
     * 默认权限
     */
    getDefaultRigths(item) {
      const hideRights = item.field_options.hide_rights
      if (this.$utils.isNotEmpty(hideRights) && hideRights) {
        return FormOptions.t.PERMISSIONS.HIDE
      }
      const readRights = item.field_options.read_rights
      if (this.$utils.isNotEmpty(readRights) && readRights) {
        return FormOptions.t.PERMISSIONS.READ
      }
      return
    },

    // 初始化设置需要进行公式计算的字段
    initResponseFormula(item) {
      FormUtil.setResponseFormula(this.responseFormula, item)
    },
    // 初始化运行公式计算
    initRunCalFormula() {
      // 不需要字段的进行公式计算 比如获取但其当前时间
        if (this.responseFormula[FormUtil.NOT_NEED_FIELD]) {
            FormUtil.runCalFormula(this.responseFormula[FormUtil.NOT_NEED_FIELD], this.formData || {}, this.formDef)
        }
      const fields = this.formDef.fields
      fields.forEach(field => {
        const key = field.code + '.' + field.name
        const formula = this.params.responseFormula[key]
        if (formula) {
          FormUtil.runCalFormula(formula, this.formData, field)
        }
      })
    },
    /**
     * 初始化设置联动数据
     */
    initResponseLinkages(item) {
      FormUtil.setResponseLinkages(this.responseLinkages, item)
    },
    getFormSubmitVerify() {
        const verifys = this.formDef.attrs ? this.formDef.attrs.verifys : []
        let errors = {}
        if (this.$utils.isEmpty(verifys)) {
            return errors
        }
        /*verifys.forEach((verify) => {
          if (!FormUtil.runFormSubmitVerify(verify.formula, this.formData, this.formDef)) {
            errors = {
              result: false,
              msg: verify.msg
            }
            return false
          }
        })*/
        for (let index in verifys) {
            const verify = verifys[index]
            if (!FormUtil.runFormSubmitVerify(verify.formula, this.formData, this.formDef)) {
                errors = {
                    result: false,
                    msg: verify.msg
                }
                return errors
            }
        }
        return errors
    },
    /**
     * 初始化脚本
     */
    initJForm() {
      const id = 'JForm'
      const formScript = document.getElementById(id)
      if (formScript) {
        formScript.parentNode.removeChild(formScript)
      }
      if (this.formDef.attrs && this.formDef.attrs.mobile_script) {
        const code = this.formDef.attrs.mobile_script
        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.id = id
        // document.body.appendChild(script)
        try {
          script.appendChild(document.createTextNode(code))
        } catch (ex) {
          script.text = code
        }
        document.body.appendChild(script)
      }
    },
    /**
     * 表单验证
     */
    getFormValidator() {
      if (!this.$refs.formItem) { return }
      const $validate = []
      this.$refs.formItem.forEach(el => {
        if (el.field.field_type === 'table') {
          const tableEls = el.getEl()
          if (!tableEls) return true
          tableEls.forEach(tableEl => {
            const v = new Promise((resolve, reject) => {
              tableEl.getFormValidator().validate().then((result) => {
                resolve(result)
              })
            })
            $validate.push(v)
          })
        } else {
          const v = new Promise((resolve, reject) => {
            el.getFormValidator().validate().then((result) => {
              resolve(result)
            })
          })

          $validate.push(v)
        }
      })

      return Promise.all($validate)
    },
    /**
     * 表单验证错误信息
     */
    getFormErrors() {
      if (!this.$refs.formItem) { return }
      let $errors = []
      this.$refs.formItem.forEach(el => {
        if (el.field.field_type === 'table') {
          const tableEls = el.getEl()
          if (!tableEls) return true
          tableEls.forEach(tableEl => {
            const errorItems = tableEl.getFormErrors().items
            $errors = [...$errors, ...errorItems]
          })
        } else {
          const errorItems = el.getFormErrors().items
          $errors = [...errorItems]
        }
      })

      return $errors
    }

  }
}
</script>
