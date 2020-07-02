<template>
  <!-- 单行文本、 多行文本、 数字-->
  <van-lc-field
    v-if="item.field_type==='text'||item.field_type==='textarea'||item.field_type==='number'"
    v-validate="fieldValidate"
    :value="value"
    :label="label"
    :desc="item.desc"
    :placeholder="placeholder"
    :type="item.field_type"
    :height="fieldOptions.height"

    :name="item.name"
    :required="required"
    :readonly="readonly"
    :dataFormate="dataFormate"
    :error="errors.has(item.name)"
    :error-message="errors.first(item.name)"
    autosize
    clearable
    @click="fieldClick(item, value)"
    v-on="$listeners"
  />
  <!-- 单项选择 -->
  <van-lc-radio
    v-else-if="item.field_type==='radio'"
    v-validate="fieldValidate"
    :value="value"
    :label="item.label"
    :desc="item.desc"
    :placeholder="placeholder"
    :options="options"
    :other-option-value="otherOptionValue"
    :value-key="'val'"

    :name="item.name"
    :required="required"
    :readonly="readonly"

    :error="errors.has(item.name)"
    :error-message="errors.first(item.name)"
    v-on="$listeners"
    @change-other-option="changeOtherOption"
  />

  <!-- 多项选择 -->
  <van-lc-checkbox
    v-else-if="item.field_type==='checkbox'"
    v-validate="fieldValidate"
    :value="value"
    :label="item.label"
    :desc="item.desc"
    :placeholder="placeholder"
    :other-option-value="otherOptionValue"
    :options="options"
    :value-key="'val'"

    :name="item.name"
    :required="required"
    :readonly="readonly"
    :error="errors.has(item.name)"
    :error-message="errors.first(item.name)"
    v-on="$listeners"
    @change-other-option="changeOtherOption"
  />
  <!-- 下拉选择 -->
  <van-lc-picker
    v-else-if="item.field_type==='select'"
    v-validate="fieldValidate"
    :value="value"
    :label="item.label"
    :desc="item.desc"
    :placeholder="selectPlaceholder"
    :options="options"
    :value-key="'val'"

    :name="item.name"
    :required="required"
    :readonly="readonly"
    :error="errors.has(item.name)"
    :error-message="errors.first(item.name)"
    v-on="$listeners"
  />
  <!-- 日期/ 当前时间、当前日期 -->
  <van-lc-date-picker
    v-else-if="item.field_type==='datePicker'|| item.field_type==='currentDate'|| item.field_type==='currentTime'"
    v-validate="fieldValidate"
    :value="formatDate(value)"
    :label="item.label"
    :desc="item.desc"
    :placeholder="placeholder"
    :format="dateFormat"

    :name="item.name"
    :required="required"
    :readonly="readonly"
    :error="errors.has(item.name)"
    :error-message="errors.first(item.name)"
    type="custom"
    v-on="$listeners"
  />
  <!-- 富文本 -->
  <van-lc-editor
    v-else-if="item.field_type==='editor'"
    v-validate="fieldValidate"
    :value="value"
    :label="item.label"
    :desc="item.desc"
    :placeholder="placeholder"
    :height="height"

    :name="item.name"
    :required="required"
    :readonly="readonly"
    :error="errors.has(item.name)"
    :error-message="errors.first(item.name)"
    v-on="$listeners"
  />
  <!-- 数据字典 -->
  <van-lc-dictionary
    v-else-if="item.field_type==='dictionary'"
    v-validate="fieldValidate"
    :value="value"
    :label="item.label"
    :desc="item.desc"
    :placeholder="placeholder"
    :cat-type="fieldOptions.dictionary"
    :select-mode="fieldOptions.select_mode"
    :display-mode="fieldOptions.display_mode"
    :separator="fieldOptions.split"
    :params="params"

    :name="item.name"
    :required="required"
    :readonly="readonly"
    :error="errors.has(item.name)"
    :error-message="errors.first(item.name)"
    v-on="$listeners"
  />
  <!-- 自动编号 -->
  <van-lc-auto-number
    v-else-if="item.field_type==='autoNumber'"
    v-validate="fieldValidate"
    :value="value"
    :label="item.label"
    :desc="item.desc"
    :placeholder="placeholder"
    :identity="fieldOptions.identity"
    :init="$utils.toBoolean(fieldOptions.init)"

    :name="item.name"
    :required="required"
    :readonly="readonly"
    :error="errors.has(item.name)"
    :error-message="errors.first(item.name)"
    v-on="$listeners"
  />
  <!-- 上传附件 -->
  <van-lc-uploader
    v-else-if="item.field_type==='attachment'"
    v-validate="fieldValidate"
    :value="value"
    :label="item.label"
    :desc="item.desc"
    :placeholder="placeholder"
    :store="fieldOptions.store||'json'"
    :max-size="maxFileSize"
    :file-quantity="fileQuantity"
    :accept="accept"
    :file-formates="fileFormates"

    :name="item.name"
    :required="required"
    :readonly="readonly"
    :error="errors.has(item.name)"
    :error-message="errors.first(item.name)"
    :field-options="handleType(item.field_options)"
    v-on="$listeners"
  />

  <!-- 选择器 -->
  <van-lc-selector
    v-else-if="item.field_type==='selector' || item.field_type==='currentUser'|| item.field_type==='currentOrg'"
    v-validate="fieldValidate"
    :value="value"
    :label="item.label"
    :desc="item.desc"
    :placeholder="placeholder"
    :store="fieldOptions.store||'json'"
    :type="fieldOptions.selector_type||'user'"
    :multiple="!single"
    :bind-id="bindId"
    :field-options="fieldOptions"

    :name="item.name"
    :required="required"
    :readonly="readonly"
    :error="errors.has(item.name)"
    :error-message="errors.first(item.name)"
    @bind-callback="selectorBindCallback"
    v-on="$listeners"
  />
  <!-- 自定义对话框 -->
  <van-lc-custom-dialog
    v-else-if="item.field_type==='customDialog'"
    v-validate="fieldValidate"
    :value="value"
    :label="item.label"
    :desc="item.desc"
    :placeholder="placeholder"
    :multiple="!single"
    :template-key="fieldOptions.dialog"
    :store="fieldOptions.store"
    :field-options="fieldOptions"
    :dynamic-params="dynamicParams"

    :name="item.name"
    :required="required"
    :readonly="readonly"
    :error="errors.has(item.name)"
    :error-message="errors.first(item.name)"
    v-on="$listeners"
    @callback="dialogCallback"
    @attr-callback="dialogAttrCallback"
  />
  <!-- 关联数据 -->
  <van-lc-linkdata
    v-else-if="item.field_type==='linkdata'"
    v-validate="fieldValidate"
    :value="value"
    :label="item.label"
    :desc="item.desc"
    :placeholder="placeholder"
    :multiple="multiple"
    :template-key="fieldOptions.linkdata"
    :store="fieldOptions.store"
    :dynamic-params="dynamicParams"
    :field-options="fieldOptions"

    :name="item.name"
    :required="required"
    :readonly="readonly"
    :error="errors.has(item.name)"
    :error-message="errors.first(item.name)"
    v-on="$listeners"
    @callback="linkdataCallback"
    @attr-callback="linkdataAttrCallback"
  />

  <!-- 地址 -->
  <van-lc-address
    v-else-if="item.field_type==='address'"
    v-validate="fieldValidate"
    :value="value"
    :label="item.label"
    :desc="item.desc"
    :placeholder="placeholder"
    :top="fieldOptions.top"
    :top-val="getAddressTopVal()"
    :level="fieldOptions.level"
    :has-street="fieldOptions.is_street"

    :name="item.name"
    :required="required"
    :readonly="readonly"
    :error="errors.has(item.name)"
    :error-message="errors.first(item.name)"
    v-on="$listeners"
  />

  <!-- 签名 -->
  <van-lc-signature
    v-else-if="item.field_type==='signature'"
    v-validate="fieldValidate"
    :value="value"
    :label="item.label"
    :desc="item.desc"
    :placeholder="placeholder"
    :height="height"

    :name="item.name"
    :required="required"
    :readonly="readonly"
    :error="errors.has(item.name)"
    :error-message="errors.first(item.name)"
    v-on="$listeners"
  />

  <!-- 子表 -->
  <van-lc-table
    v-else-if="item.field_type==='table'"
    ref="formItem"
    :value="value"
    :label="item.label"
    :desc="item.desc"
    :item="item"
    :items="items"
    :permissions="params.permissions[item.name]"
    :response-formula="params.responseFormula"
    :form-data="formData"
    :required="required"
    :readonly="params.readonly"
    @change-form-data="changeFormData($event)"
    v-on="$listeners"
  />

  <!-- 隐藏域-->
  <input
    v-else-if="item.field_type==='hidden'"
    :value="value"
    type="hidden"
    v-on="$listeners"
  >

  <!-- 描述-->
  <van-lc-desc
    v-else-if="item.field_type==='desc'"
    :value="value"
    :label="item.label"
    :border="fieldOptions.split_line"
    :desc="item.desc"
    :border-style="fieldOptions.line_style"
    v-on="$listeners"
  />

  <!-- 文本-->
  <van-lc-label
    v-else-if="item.field_type==='label'"
    :value="value"
    :label="item.label"
    :class="$attrs.hidden"
    v-on="$listeners"
  />
  <!-- 链接 -->
  <van-lc-hyperlink
    v-else-if="item.field_type==='hyperlink'"
    :value="value"
    :label="item.label"
    :field-options="fieldOptions"
    :desc="item.desc"
    :error="true"
    :class="$attrs.hidden"
    v-on="$listeners"
  />
  <!-- 地图 -->
  <van-lc-map
    v-else-if="item.field_type==='map'"
    v-validate="fieldValidate"
    :value="value"
    :label="item.label"
    :field-options="fieldOptions"
    :coord="getCoord()"
    :name="item.name"
    :required="required"
    :readonly="readonly"
    :error="errors.has(item.name)"
    :error-message="errors.first(item.name)"
    :desc="item.desc"
    :class="$attrs.hidden"
    v-on="$listeners"
    @callback="mapCallback"
  />
  <!-- 主工单控件 -->
  <van-lc-mainWorkorder
    v-else-if="item.field_type==='mainWorkorder'"
    :value="value"
    :label="item.label"
    :field-options="fieldOptions"
    :name="item.name"
    :class="$attrs.hidden"
    v-on="$listeners"
  />
  <!-- 地图选设备 -->
  <van-lc-mapDevice
    v-else-if="item.field_type==='equipment'"
    v-validate="fieldValidate"
    :value="value"
    :label="item.label"
    :field-options="fieldOptions"
    :name="item.name"
    :required="required"
    :readonly="readonly"
    :error="errors.has(item.name)"
    :error-message="errors.first(item.name)"
    :desc="item.desc"
    :class="$attrs.hidden"
    v-on="$listeners"
    @callback="mapDeviceCallback"
  />
  <!-- 水表控件 -->
  <van-lc-waterMeter
    v-else-if="item.field_type==='meter'"
    v-validate="fieldValidate"
    :value="value"
    :label="item.label"
    :field-options="fieldOptions"
    :name="item.name"
    :required="required"
    :readonly="readonly"
    :error="errors.has(item.name)"
    :error-message="errors.first(item.name)"
    :desc="item.desc"
    :class="$attrs.hidden"
    v-on="$listeners"
    @callback="meterCallback"
  />
  <!-- 评分控件 -->
  <van-lc-rate
    v-else-if="item.field_type==='rate'"
    v-validate="fieldValidate"
    :value="value"
    :label="item.label"
    :name="item.name"
    :required="required"
    :readonly="readonly"
    :class="$attrs.hidden"
    v-on="$listeners"
    @callback="rateCallback"
  />
  <!-- 物料控件 -->
  <van-lc-materiel
    v-else-if="item.field_type==='materiel'"
    v-validate="fieldValidate"
    :value="value"
    :label="item.label"
    :field-options="fieldOptions"
    :name="item.name"
    :required="required"
    :readonly="readonly"
    :error="errors.has(item.name)"
    :error-message="errors.first(item.name)"
    :desc="item.desc"
    :class="$attrs.hidden"
    v-on="$listeners"
    @callback="materielCallback"
  />
  <!-- 流程实例-->
  <van-lc-bpm-inst-his
    v-else-if="item.field_type === 'bpmInstHis'"
    v-validate="fieldValidate"
    :value="value"
    :label="item.label"
    :desc="item.desc"
    :height="height"
    :params="bpmInstHisParams"

    :name="item.name"
    :required="required"
    :readonly="params.readonly"
    :error="errors.has(item.name)"
    :error-message="errors.first(item.name)"
    v-on="$listeners"
  />
  <!-- 流程关联 -->
  <van-lc-bpm-link
    v-else-if="item.field_type === 'bpmLink'"
    :label="item.label"
    :name="item.name"
    :params="params.attributes"
    :field-options="fieldOptions"
  />
  <!-- 审批历史-->
  <div
    v-else-if="item.field_type === 'approval_history'"
  >
    <van-lc-approval-history
      v-if="showApprovalHistory"
      :label="item.label"
      :task-id="params.taskId"
      :bpmn-inst-id="params.bpmnInstId"
    />
  </div>

  <!-- 流程图-->
  <div
    v-else-if="item.field_type === 'flow_diagram'"
  >
    <van-lc-flow-diagram
      v-if="showFlowDiagram"
      :label="item.label"
      :def-id="params.defId"
      :task-id="params.taskId"
      :bpmn-inst-id="params.bpmnInstId"
    />
  </div>
  <!-- 审批意见-->
  <van-lc-approval-opinion
    v-else-if="item.field_type==='approval_opinion'"
    v-validate="fieldValidate"
    :value="value"
    :label="label"
    :desc="item.desc"
    :placeholder="placeholder"
    :data="formOpinion"
    :layout="fieldOptions.arrangement"
    :options="fieldOptions.options"
    :has-common-statment="!!(fieldOptions.common_statment === true || fieldOptions.common_statment === 'true')"
    :height="fieldOptions.height"

    :name="item.name"
    :required="required"
    :readonly="readonly"

    :error="errors.has(item.name)"
    :error-message="errors.first(item.name)"
    autosize
    clearable
    @input="handleOpinion"
  />

  <!-- 选项卡-->
  <div
    v-else-if="item.field_type==='tab_break'"
    class="van-tabs__nav van-tabs__nav--card lc-tab-break"
  >
    <div
      class="van-tab van-tab--active van-ellipsis lc-tab-break--label"
    > {{ item.label }}
    </div>
  </div>

  <!-- office目前版本不支持-->
  <span v-else-if="item.field_type==='office'"/>

  <!-- 分页 -->
  <span v-else-if="item.field_type==='page_break'"/>
  <!-- 折叠卡 -->
  <span v-else-if="item.field_type==='fold_card'"/>

  <span v-else-if="item.field_type==='section_break'"/>
  <span v-else>未支持控件类型[{{ item.field_type }}]</span>
</template>
<script>
    import fecha from '@/utils/fecha'
    import FormOptions from './constants/formoptions'
    import {fileTypes as FILE_TYPES, accept as ACCEPT} from '@/constants/file'
    import {selectYHXXBySShuiBiaoBH, arrearsInformation} from '@/api/platform/revenue/revenue'

    export default {
        props: {
            item: {
                type: Object,
                required: true
            },
            items: Array,
            value: {
                type: [String, Number, Boolean, Array, Object, Date]
            },
            readonly: {
                type: Boolean,
                default: false
            },
            required: {
                type: Boolean,
                default: false
            },
            data: {
                type: Object
            },
            params: {
                type: Object
            },
            formOpinion: Array
        },
        data() {
            return {
                ajaxOptions: []
            }
        },
        computed: {
            formData() {
                return this.data
            },
            // 表单验证
            fieldValidate() {
                const v = {}
                // 必填验证
                if (this.required) {
                    v.required = true
                }
                // 整型验证
                if (this.fieldOptions['integer']) {
                    v.integer = true
                }
                // 最大、最小字符串长度验证
                if (this.fieldOptions['min_length']) {
                    v.min = this.fieldOptions['min_length']
                }
                if (this.fieldOptions['max_length']) {
                    v.max = this.fieldOptions['max_length']
                }
                // 最大、最小值验证
                if (this.fieldOptions['min']) {
                    v.min_value = this.fieldOptions['min']
                }
                if (this.fieldOptions['max']) {
                    v.max_value = this.fieldOptions['max']
                }
                // 小数验证
                if (this.fieldOptions['decimal']) {
                    v.decimal = this.fieldOptions['decimal']
                }
                // 日期格式验证
                if (this.fieldOptions['datefmt']) {
                    v.date_format = this.fieldOptions['datefmt'] || 'yyyy-MM-dd hh:mm:ss'
                }
                // 日期范围
                if (this.fieldOptions['start_date_type'] || this.fieldOptions['end_date_type']) {
                    v.start_end_date = this.fieldOptions
                }
                // 多少项验证 （主要是多选用）
                if (this.fieldOptions['min_mum']) {
                    v.min_mum = this.fieldOptions['min_mum']
                }
                if (this.fieldOptions['max_mum']) {
                    v.max_mum = this.fieldOptions['max_mum']
                }
                // 正则表达式
                if (this.fieldOptions['data_format']) {
                    v.regexp = [
                        this.fieldOptions['data_format'],
                        this.fieldOptions['data_format_value'],
                        this.fieldOptions['data_format_msg']
                    ]
                }
                return v
            },
            fieldOptions() {
                return this.item.field_options || {}
            },
            label() {
                if (this.$utils.isNotEmpty(this.fieldOptions.units)) {
                    return this.item.label + '(' + this.fieldOptions.units + ')'
                }
                return this.item.label
            },
            // 日期格式
            dateFormat() {
                if (this.item.field_type === 'currentDate') {
                    return FormOptions.t.DATE_FORMATS['date']
                } else if (this.item.field_type === 'currentTime') {
                    return FormOptions.t.DATE_FORMATS['datetime']
                } else {
                    if (this.fieldOptions['datefmt_type'] && this.fieldOptions['datefmt_type'] !== 'custom') {
                        return FormOptions.t.DATE_FORMATS[this.fieldOptions['datefmt_type']] || FormOptions.t.DATE_FORMATS['date']
                    } else {
                        return this.fieldOptions['datefmt'] || FormOptions.t.DATE_FORMATS['date']
                    }
                }
            },
            /**
             * 单选、多选、下拉等选项
             */
            options() {
                return this.fieldOptions['options'] || []
            },
            /**
             * 其他选项的值
             */
            otherOptionValue() {
                const otherId = this.fieldOptions['option_other_id']
                if (this.$utils.isEmpty(otherId)) return
                return this.formData[otherId] || ''
            },
            /**
             *  占位符
             */
            placeholder() {
                return this.readonly ? '' : (!this.fieldOptions['read_rights']) ? this.fieldOptions['placeholder'] : ''
            },
            /**
             * 下拉占位符
             */
            selectPlaceholder() {
                return !this.$attrs.readonly ? (this.fieldOptions['include_blank_value'] || this.fieldOptions['placeholder']) : ''
            },
            /**
             * 最大文件上传
             */
            maxFileSize() {
                if (this.$utils.isNotEmpty(this.fieldOptions.max_file_size)) {
                    return this.fieldOptions.max_file_size * 1024 * 1024
                }
                return 100 * 1024 * 1024 // 最大100M
            },
            /**
             * 最大文件个数
             */
            fileQuantity() {
                const fileQuantity = this.fieldOptions.max_file_quantity
                if (this.$utils.isNotEmpty(fileQuantity) && (fileQuantity !== '-1' || fileQuantity !== -1)) {
                    return parseInt(fileQuantity, 10)
                }
                return null
            },
            /**
             * 文件允许类型
             */
            accept() {
                const mediaType = this.fieldOptions.media_type
                if (this.$utils.isEmpty(mediaType)) {
                    return '*'
                }
                return ACCEPT[mediaType] || '*'
            },
            /**
             * 文件格式
             */
            fileFormates() {
                const mediaType = this.fieldOptions.media_type
                if (this.$utils.isEmpty(mediaType)) {
                    return []
                }
                const x = FILE_TYPES[mediaType]
                if ((x)) {
                    return x.map((v) => {
                        return '.' + v
                    })
                } else {
                    return (this.fieldOptions.media || '').split(',')
                }
            },
            /**
             * 绑定ID
             */
            bindId() {
                const bindId = this.fieldOptions['bind_id']
                if (this.$utils.isEmpty(bindId)) {
                    return ''
                }
                return this.formData[bindId] || ''
            },
            /**
             * 是否单选
             */
            single() {
                return this.$utils.toBoolean(this.fieldOptions['is_single'])
            },
            /**
             * 是否多选
             */
            multiple() {
                return this.$utils.toBoolean(this.fieldOptions['multiple'] === 'Y')
            },
            /**
             * 高度
             */
            height() {
                return this.fieldOptions.height ? parseInt(this.fieldOptions.height, 10) : null
            },
            /**
             * 数据格式
             */
            dataFormate() {
                return this.fieldOptions.data_format ? this.fieldOptions.data_format : null
            },

            /**
             * 动态参数、固定值
             */
            dynamicParams() {
                const paramsObj = this.fieldOptions['params'] || []
                const link_condition = this.fieldOptions['link_condition'] || []
                const rtn = {}
                paramsObj.forEach(param => {
                    let value = ''
                    let bindTbName = '' // 绑定的表名
                    let bindColumn = '' // 绑定的字段
                    if (param.value) {
                        const strValue = param.value.split('.')// 兼容旧版本
                        bindTbName = strValue.length > 1 ? strValue[0] : ''
                        bindColumn = strValue.length > 1 ? strValue[1] : strValue[0]
                    }
                    if (param.mode && param.mode === 'bind') { // 绑定字段
                        if (this.isSubTable) { // TODO 子表 暂时未处理
                            const subtbName = ''// 子表表名
                            // ① 取相同子表值 同一列的值
                            // ② 取主表的值
                            console.info(subtbName)
                            console.info(bindTbName)
                        } else {
                            value = this.data[bindColumn]
                        }
                    } else { // 固定值
                        value = bindColumn
                    }
                    if (this.$utils.isNotEmpty(value)) {
                        rtn[param.fieldName] = value
                    }
                })

                if (link_condition && link_condition != null && link_condition.length > 0) {
                    if (link_condition[0].mode && link_condition[0].mode === 'bind') {
                        let bindCol = link_condition[0].value
                        if (bindCol.indexOf('.') > 0) {
                            bindCol = bindCol.substring(bindCol.lastIndexOf('.') + 1, bindCol.length)
                        }
                        const value = this.data[bindCol]
                        const fieldName = link_condition[0].fieldName
                        if (value && value != null && value !== undefined) {
                            rtn[fieldName] = value
                        }
                    }
                }
                return rtn
            },
            // 是否显示审批历史
            showApprovalHistory() {
                if (this.params.defId && this.params.bpmnInstId) {
                    return false
                }
                return !!(this.params.taskId || this.params.bpmnInstId)
            },
            // 是否显示流程图
            showFlowDiagram() {
                return !!(this.params.defId || this.params.taskId || this.params.bpmnInstId)
            },
            bpmInstHisParams() {
                const filter = this.fieldOptions.filter || {}
                return {
                    bpmDefScope: filter.bpmDefScope || 'all',
                    bpmDefKey: filter.bpmDefKey,
                    script: filter.script,
                    starterScope: filter.starterScope || 'current',
                    starter: filter.starter
                }
            }
        },
        methods: {
            handleType(option) {
                // 处理pc端附件的配置
                const {ath_app_support_type_dict, ath_app_support_type_file, ath_app_support_type_video, ath_app_support_type_sound, ath_app_support_type_photo} = option
                const data = [
                    {isShow: ath_app_support_type_dict, name: 'photo', alias: '相册', accept: 'image/*'},
                    {isShow: ath_app_support_type_file, name: 'folder', alias: '文件', accept: '*'},
                    {isShow: ath_app_support_type_video, name: 'video', alias: '录像', accept: 'audio/*, video/*'},
                    {isShow: ath_app_support_type_sound, name: 'chat', alias: '录音', accept: 'audio/*'},
                    {isShow: ath_app_support_type_photo, name: 'photograph', alias: '拍照', accept: 'image/*, video/*'}
                ]
                // 过滤附件需要显示的配置
                let data_filter = []
                data_filter = data.filter(item => {
                    return item.isShow
                })
                return data_filter
            },
            fieldClick(item, value) {
                const option = item.field_options
                const isEdit = window.location.href.indexOf('/bpmn/form?defId=') > 0
                const isTel = (/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/.test(value))
                const format = (option.data_format === 'phone' || option.data_format === 'telephone' || option.data_format === 'contact')
                if (value && !isEdit && isTel && option && option.data_format && format) {
                    const paramsData = {
                        taskId: this.params.taskId,
                        bizKey: this.formData['id'],
                        phoneNum: value,
                        fieldName: item.name
                    }
                    this.$dialog.confirm({ message: '呼叫号码：' +value }).then(() => {
                        this.$bridge.callHandler('callPhone', JSON.stringify(paramsData), (callbackData) => {
                        })
                    })
                }
            },
            formatDate(value) {
                if (this.$utils.isEmpty(value)) return ''
                if (value instanceof Date) {
                    return fecha.format(value, this.dateFormat)
                } else {
                    try {
                        return fecha.format(this.parseFormatDate(value, this.dateFormat), this.dateFormat)
                    } catch (error) {
                        return value
                    }
                }
            },
            /**
             * 处理格式错误的bug
             */
            parseFormatDate(time, cFormat) {
                let d = fecha.parse(time, cFormat || 'yyyy-MM-dd')
                if (d) return d
                const dateFormat = ['yyyy-MM-dd HH:mm:ss', 'yyyy-MM-dd', 'HH:mm:ss', 'HH:mm']
                for (let i = 0; i < dateFormat.length; i++) {
                    d = fecha.parse(time, dateFormat[i])
                    if (d) return d
                }
                return time
            },
            changeOtherOption(value) {
                const otherId = this.fieldOptions['option_other_id']
                if (this.$utils.isEmpty(otherId)) return
                const formData = this.$utils.newData(this.formData)
                formData[otherId] = value
                this.changeFormData(formData)
            },
            getAddressTopVal() {
                const top = this.fieldOptions.top
                const topval = this.fieldOptions.topval
                if (this.$utils.isEmpty(topval)) {
                    if (top === 'country') {
                        return '0'
                    }
                    return '' // 异常配置
                }
                if (top === 'country') {
                    return '0'
                } else if (top === 'province') {
                    return topval['country'] + ''
                } else if (top === 'city') {
                    return topval['province'] + ''
                } else if (top === 'district') {
                    return topval['city'] + ''
                }
                return ''
            },
            /**
             * 对话框回调
             */
            dialogCallback(data, params) {
                const bind = this.getBind()
                if (this.$utils.isEmpty(bind)) {
                    return
                }
                // 设置联动数据
                const formData = this.$utils.newData(this.formData)
                bind.forEach(obj => {
                    const name = obj.name
                    const field = obj.fieldName
                    if (this.$utils.isEmpty(name) || this.$utils.isEmpty(field)) {
                        return true
                    }
                    // TODO  目前只支持主表  数据处理没做
                    const value = data.map((d) => {
                        return d[field]
                    }).join(',')
                    formData[name] = value
                })
                this.changeFormData(formData)
            },
            /**
             * 对话框回调
             */
            // TODO pc 端做这个功能再做
            dialogAttrCallback(data, params) {

            },
            /**
             * 关联数据回调
             */
            linkdataCallback(data, params) {
                const linkLinkage = this.getLinkLinkage()
                const linkAttr = this.getLinkAttr()
                if (this.$utils.isEmpty(linkLinkage) && this.$utils.isEmpty(linkAttr)) {
                    const {name} = this.item
                    const getNull = (val) => typeof val === 'string' ? '' : null
                    const eq = (m) => m.mode === 'bind' && m.value === name
                    const eqs = (arrs) => (arrs || []).some(eq)
                    const objs = this.items.filter(x => eqs(x.field_options && x.field_options.link_condition))
                    const datas = this.$utils.newData(this.formData)
                    objs.forEach(obj => {
                        datas[obj.name] = getNull(datas[obj.name])
                    })
                    this.changeFormData(this.$utils.newData(datas))
                    return
                }

                // 设置联动数据
                const formData = this.$utils.newData(this.formData)
                linkLinkage.forEach(obj => {
                    const name = obj.name
                    const field = obj.field
                    if (this.$utils.isEmpty(name) || this.$utils.isEmpty(field)) {
                        return true
                    }
                    // TODO  目前只支持主表  数据处理没做
                    const value = data.map((d) => {
                        return d[field]
                    }).join(',')
                    formData[name] = value
                })

                this.linkageChangeFormData(linkAttr, formData, data, params)
            },
            /**
             * 关联数据---关联属性
             */
            linkdataAttrCallback(data, params) {
                const linkAttr = this.getLinkAttr()
                if (this.$utils.isEmpty(linkAttr)) {
                    return
                }
                const formData = this.$utils.newData(this.formData)
                this.linkageChangeFormData(linkAttr, formData, data, params)
            },
            /**
             * 关联数据----联动改变表单数据
             */
            linkageChangeFormData(linkAttr, formData, data, params) {
                if (this.$utils.isNotEmpty(linkAttr)) {
                    // 关联属性
                    linkAttr.forEach(obj => {
                        const name = obj.name
                        const field = obj.field
                        if (this.$utils.isEmpty(name) || this.$utils.isEmpty(field)) {
                            return true
                        }
                        // TODO  目前只支持主表  数据处理没做
                        const value = data.map((d) => {
                            return d[field]
                        }).join(',')
                        formData[name] = value
                    })
                }
                this.changeFormData(formData)
            },
            getLinkLinkage() {
                return this.fieldOptions['link_linkage'] || []
            },
            getLinkAttr: function () {
                return this.fieldOptions['link_attr'] || []
            },
            getBind: function () {
                return this.fieldOptions['bind'] || []
            },
            getBindId: function () {
                return this.fieldOptions['bind_id'] || ''
            },
            selectorBindCallback(data) {
                const bindId = this.getBindId()
                if (this.$utils.isNotEmpty(bindId)) {
                    const formData = this.$utils.newData(this.formData)
                    formData[bindId] = data
                    this.changeFormData(formData)
                } else {
                    this.$toast('[' + this.label + ']字段未绑Id')
                }
            },
            getEl() {
                return this.$refs.formItem.getEl()
            },
            /**
             * 改变表单的数据
             */
            changeFormData(data) {
                this.$emit('change-form-data', data)
            },
            // 处理表单意见
            handleOpinion(val) {
                const option = {
                    [this.item.name]: val
                }
                this.$emit('change-form-opinion', option)
            },
            getCoord() {
                const data = this.data
                const x = data.x
                const y = data.y
                if (x !== undefined && y !== undefined) {
                    return x + ',' + y
                } else {
                    return ''
                }
            },
            mapCallback(data, params) {
                const datas = this.$utils.newData(this.formData)
                datas.x = data.split(',')[0]
                datas.y = data.split(',')[1]
                datas[this.item.name] = data.split(',')[2]
                this.changeFormData(this.$utils.newData(datas))
            },
            mapDeviceCallback(data, params) {
                let datas = this.$utils.newData(this.formData)
                try {
                    let formatDatas = JSON.parse(data)
                    for (var i = 0; i < formatDatas.length; i++) {
                        let geometry = '(' + JSON.stringify(formatDatas[i].geometry) + ')'
                        formatDatas[i].geometry = geometry
                    }
                    datas[this.item.name] = JSON.stringify(formatDatas)
                    this.changeFormData(this.$utils.newData(datas))
                } catch (e) {
                    this.$dialog.alert({message: e})
                }
            },
            meterCallback(data) {
                const _this = this
                if (_this.fieldOptions['meter_arrears_enable'] && data.length > 0) {
                    data.forEach(item5 => {
                        querys.push(arrearsInformation({
                            'waterMeterNo': item2['S_ShuiBiaoBH'],
                            'houseNo': item2['S_ONLY']
                        }))
                    })
                    Promise.all(querys)
                        .then((res) => {
                            for (let i = 0; i < res.length; i++) {
                                let qf = 0
                                res[i].forEach(item6 => {
                                    qf += Number(item6['QF'])
                                })
                                data[i] = Object.assign(data[i], {'QF': qf})
                            }
                            _this.meterDataHandle(data)
                        })
                        .catch((err) => {
                            _this.$dialog.alert({message: '欠费信息查询失败'})
                        })
                } else {
                    _this.meterDataHandle(data)
                }
            },
            meterDataHandle(data) {
                const _this = this
                const _arrearsBind = _this.fieldOptions['meter_arrears_field']
                let item2 = data[0]
                if (!item2) {
                    item2 = {}
                }
                let datas = null
                datas = _this.$utils.newData(_this.formData)
                // if (_this.item.isSub) {
                //   datas = _this.$parent.$utils.newData(_this.$parent.formData)
                // } else {
                //   datas = _this.$utils.newData(_this.formData)
                // }
                if (_this.fieldOptions.bind) {
                    _this.fieldOptions.bind.forEach(item => {
                        datas[item['name']] = item2[item['fieldName']]
                    })
                    if (_this.fieldOptions['meter_arrears_enable']) {
                        _arrearsBind.forEach(item5 => {
                            if (item5['fieldName'] && item5['name']) {
                                datas[item5['name']] = item2[item5['fieldName']]
                            }
                        })
                    }
                }
                if (_this.fieldOptions['meter_bind_field']) {
                    datas[_this.item.name] = item2[_this.fieldOptions['meter_bind_field']]
                }
                if (_this.fieldOptions['meter_type_enable']) {
                    const bind = _this.fieldOptions['meter_type_field']
                    const table = _this.fieldOptions['meter_type_table']
                    if (!datas[table]) {
                        datas[table] = []
                    }
                    data.forEach(item => {
                        const isExists = datas[table].find(function (item4) {
                            return item4[_this.fieldOptions['meter_type_id_field']] === item[_this.fieldOptions['meter_type_id_field_mapping']]
                        })
                        if (!isExists) {
                            const item3 = {}
                            bind.forEach(item5 => {
                                if (item5['fieldName'] && item5['name']) {
                                    item3[item5['fieldName']] = item[item5['name']]
                                }
                            })

                            if (_this.fieldOptions['meter_arrears_enable']) {
                                _arrearsBind.forEach(item5 => {
                                    if (item5['fieldName'] && item5['name']) {
                                        item3[item5['name']] = item[item5['fieldName']]
                                    }
                                })
                            }
                            datas[table].push(item3)
                        }
                    })
                }
                _this.changeFormData(_this.$utils.newData(datas))
                // if (_this.item.isSub) {
                //   _this.$parent.$parent.changeFormData(_this.$parent.$utils.newData(datas))
                // } else {
                //   _this.changeFormData(_this.$utils.newData(datas))
                // }
                if (_this.fieldOptions['meter_resident_enable'] && item2['S_ShuiBiaoBH']) {
                    const _bind = _this.fieldOptions['meter_resident_field']
                    const _table = _this.fieldOptions['meter_resident_table']
                    if (_table) {
                        datas[_table] = []
                        selectYHXXBySShuiBiaoBH({'no': item2['S_ShuiBiaoBH']}).then(response => {
                            let ids = null
                            if (response.data.length > 0 && response.data[0]['S_CertificatesText']) {
                                ids = response.data[0]['S_CertificatesText'].split(',')
                            }
                            if (ids) {
                                for (const id in ids) {
                                    const item = {}
                                    item[_bind] = id
                                    datas[_table].push(item)
                                }
                            }
                            if (_this.item.isSub) {
                                _this.changeFormData(_this.$utils.newData(datas))
                            } else {
                                _this.$parent.$parent.changeFormData(_this.$parent.$utils.newData(datas))
                            }
                        })
                    } else {
                        selectYHXXBySShuiBiaoBH({'no': item2['S_ShuiBiaoBH']}).then(response => {
                            let ids = null
                            if (response.data.length > 0 && response.data[0]['S_CertificatesText']) {
                                ids = response.data[0]['S_CertificatesText'].split(',')
                            }
                            if (ids && ids.length > 0) {
                                datas[_bind] = ids[0]
                            }
                            if (_this.item.isSub) {
                                _this.$parent.$parent.changeFormData(_this.$parent.$utils.newData(datas))
                            } else {
                                _this.changeFormData(_this.$utils.newData(datas))
                            }
                        })
                    }
                }
            },
            materielCallback(data) {
                const mapping = {
                    'id': 'gid',
                    'typeName': 'typename',
                    'count': 'num',
                    'type': 'parentid',
                    'wlCode': 'wlcode',
                    'ncCode': 'nccode'
                }
                const _this = this
                const bind = _this.fieldOptions['bind']
                bind.forEach(item => {
                    item['fieldName'] = mapping[item['fieldName']] ? mapping[item['fieldName']] : item['fieldName']
                })
                let bind_field = _this.fieldOptions['bind_field']
                bind_field = mapping[bind_field] ? mapping[bind_field] : bind_field
                if (_this.item.isSub && data.length > 0) {
                    const datas = _this.$parent.$utils.newData(_this.$parent.formData)
                    datas[_this.item.code][_this.item.row][_this.item.name] = data[0][bind_field]
                    bind.forEach(item => {
                        datas[_this.item.code][_this.item.row][item['name']] = data[0][item['fieldName']]
                    })
                    if (data.length > 1) {
                        for (let j = 1; j < data.length; j++) {
                            const row = {}
                            row[_this.item.name] = data[j][bind_field]
                            bind.forEach(item => {
                                row[item['name']] = data[j][item['fieldName']]
                            })
                            datas[_this.item.code].push(row)
                        }
                    }
                    _this.$parent.$parent.changeFormData(_this.$parent.$utils.newData(datas))
                } else {
                    const datas = _this.$utils.newData(_this.formData)
                    let item2 = data[0]
                    if (!item2) {
                        item2 = {}
                    }
                    datas[_this.item.name] = item2[bind_field]
                    bind.forEach(item => {
                        datas[item['name']] = item2[item['fieldName']]
                    })
                    _this.changeFormData(_this.$utils.newData(datas))
                }
            },
            rateCallback(data) {
                const datas = this.$utils.newData(this.formData)
                data[this.item.name] = data
                this.changeFormData(this.$utils.newData(datas))
            }
        }
    }
</script>
