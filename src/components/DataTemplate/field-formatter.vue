/* eslint-disable vue/no-v-html */
<template>
  <span class="lc-data-template-data" v-html="label" />
</template>
<script>
import Utils from '@/utils'
import fecha from '@/utils/fecha'
import { getData as getAreaData } from '@/api/platform/address'
import { getData as getDictionaryData } from '@/api/platform/dictionary'
import { getUserById } from '@/api/platform/org/employee'
import { getOrgById } from '@/api/platform/org/org'
import { getPositionById } from '@/api/platform/org/position'
import { getRoleById } from '@/api/platform/org/role'
import { getInfo as getAttachmentById } from '@/api/platform/attachment'
import { getDataById, getLinkDataByKey } from '@/api/platform/data/dataTemplate'
import areaData from '@/utils/json/areaData.json'

var WorldDistricts = null
var DICTIONARY_CACHE = {}
var ATTACHMENT_CACHE = {}
var SELECTOR_CACHE = {}

// var DATA_KEY = {
//   ID: '#id#',
//   TITLE: '#title#'
// }

export default {
  props: {
    labelKey: {// 展示的字段
      type: String
    },
    data: {
      type: Object,
      default: () => {}
    },
    templateFields: {// 跟vee冲突
      type: Object,
      default: () => {}
    },
    defaultValue: {
      type: String,
      default: '&nbsp;'
    },
    dialogName: {
      // 对话框选择的项目名称
      type: String,
      default: 'name'
    }
  },
  data() {
    return {
      label: ''
    }
  },
  watch: {
    data() {
      this.initData()
    },
    labelKey() {
      this.initData()
    }
  },
  mounted: function() {
    this.initData()
  },
  methods: {
    initData() {
      if (!this.labelKey) return
      const value = this.data[this.labelKey]
      if (this.$utils.isEmpty(value)) {
        this.label = this.defaultValue
        return
      }
      var field = this.templateFields[this.labelKey]
      if (!field) {
        this.label = value
        return
      }
      const fieldType = field.field_type
      const fieldOptions = field.field_options
      if (Utils.isEmpty(value) || Utils.isEmpty(fieldType) || Utils.isEmpty(fieldOptions)) {
        this.label = value
        return
      }

      // 数据格式
      this.dataFormatter(value, fieldType, fieldOptions)
    },
    dataFormatter(value, fieldType, fieldOptions) {
      switch (fieldType) {
        case 'hidden':
        case 'text':
        case 'textarea':
        case 'editor':
        case 'autoNumber':
          this.label = value
          break
        case 'number':// 数字，格式化千分位等
          this.label = this.formatterNumber(value, fieldOptions)
          break
        case 'datePicker':// 日期格式
        case 'currentDate':
        case 'currentTime':
          this.formatterDate(value, fieldOptions)
          break
        case 'select': // 下拉，单选，多选
        case 'radio':
        case 'checkbox':
          this.label = this.formatterOptions(value, fieldOptions['options'], 'val')
          break
        case 'dictionary':// 数据字典
          this.formatterDictionary(value, fieldOptions)
          break
        case 'customDialog':// TODO 自定义对话框
          this.formatterCustomDialog(value, fieldOptions)
          break
        case 'linkdata':// TODO 关联数据
          this.formatterLinkdata(value, fieldOptions)
          break
        case 'selector':// 选择器
          this.formatterSelector(value, fieldOptions)

          break
        case 'attachment':// 附件
          this.formatterAttachment(value, fieldOptions)
          break
        case 'address':// 地址
          this.formatterAddress(value, fieldOptions)
          break
        default:
          this.label = value
          break
      }
    },
    /**
     * 格式化数字
     */
    formatterNumber(value, fieldOptions) {
      return value
    },
    /**
     * 格式化日期
     */
    formatterDate(value, fieldOptions) {
      const format = fieldOptions['datefmt'] || 'yyyy-MM-dd HH:mm:ss'
      this.label = fecha.format(fecha.parse(value, format), format)
    },
    /**
     * 格式化数据字典
     */
    formatterDictionary(value, fieldOptions) {
      const key = fieldOptions['dictionary']
      if (DICTIONARY_CACHE[key]) {
        this.label = this.formatterOptions(value, DICTIONARY_CACHE[key], 'key', 'name')
      } else {
        getDictionaryData({
          type: key
        }).then(response => {
          const data = response.data
          DICTIONARY_CACHE[key] = data
          this.label = this.formatterOptions(value, data, 'key', 'name')
        }).catch((e) => {
          DICTIONARY_CACHE[key] = []
          // 异常
          console.error(e)
        })
      }
    },
    /**
     * 格式化选择器
     */
    formatterSelector(value, fieldOptions) {
      const store = fieldOptions['store'] || 'json'
      if (store === 'json') {
        this.label = this.formatterJson(value, 'name')
      } else if (store === 'id') {
        this.formatterSelectorData(value, fieldOptions['selector_type'] || 'user')
      } else {
        this.label = value
      }
    },
    /**
     * 格式化选择器的数据
     */
    formatterSelectorData(id, type) {
      var key = type + ':' + id
      var nameKey = 'name'
      if (SELECTOR_CACHE[key]) {
        this.label = SELECTOR_CACHE[key]
      } else {
        if (type === 'user') {
          getUserById({ id: id }).then(response => {
            const data = response.data
            data[nameKey] = data['fullname']
            if (data) {
              SELECTOR_CACHE[key] = data[nameKey]
              this.label = data[nameKey]
            }
          }).catch((e) => {
            console.error(e)
          })
        } else if (type === 'org') {
          getOrgById({ id: id }).then(response => {
            const data = response.data
            if (data) {
              this.label = data[nameKey]
              SELECTOR_CACHE[key] = data[nameKey]
            }
          }).catch((e) => {
            console.error(e)
          })
        } else if (type === 'position') {
          getPositionById({ id: id }).then(response => {
            const data = response.data
            if (data) {
              this.label = data[nameKey]
              SELECTOR_CACHE[key] = data[nameKey]
            }
          }).catch((e) => {
            console.error(e)
          })
        } else if (type === 'role') {
          getRoleById({ id: id }).then(response => {
            const data = response.data
            if (data) {
              this.label = data[nameKey]
              SELECTOR_CACHE[key] = data[nameKey]
            }
          }).catch((e) => {
            console.error(e)
          })
        }
      }
    },

    /**
     * 格式化附件
     */
    formatterAttachment(value, fieldOptions) {
      const store = fieldOptions['store'] || 'json'
      if (store === 'json') {
        this.label = this.formatterJson(value, 'fileName')
      } else if (store === 'id' || store === 'path') {
        this.formatterAttachmentData(value, store)
      }
    },
    /**
     * 附件数据处理
     */
    formatterAttachmentData(id, type = 'id') {
      if (ATTACHMENT_CACHE[id]) {
        this.label = ATTACHMENT_CACHE[id]
      } else {
        if (id) {
          getAttachmentById({ id: id, type: type }).then(response => {
            const data = response.data
            this.label = data['fileName']
            ATTACHMENT_CACHE[id] = data['fileName']
          }).catch((e) => {
            console.error(e)
          })
        }
      }
    },
    /**
     * 格式化自定义对话框
     */
    formatterCustomDialog(value, fieldOptions) {
      const dialog = fieldOptions['dialog']
      const store = fieldOptions['store'] || 'id'

      if (store === 'json') {
        this.label = this.formatterJson(value, this.dialogName)
      } else if (store === 'id') { // id需要查询数据库。返回名称
        this.formatterDataTemplateValue(value, dialog)
      }
    },
    // 处理对话框id值
    formatterDataTemplateValue: function(value, key) {
      value.split(',').forEach(id => {
        getDataById({ id: id, key: key }).then(response => {
          const data = response.data
          const variables = response.variables
          if (this.$utils.isNotEmpty(data)) {
            // TODO 多个字段组合处理
            const val = data[variables['title']] || ''
            this.label += this.$utils.isNotEmpty(val) ? val + ',' : ''
          }
        }).catch((e) => {
          console.error(e)
        })
      })
    },
    formatterLinkdata(value, fieldOptions) {
      const linkConfig = fieldOptions['link_config'] || {}
      const __key = fieldOptions['linkdata']
      const __linkKey = linkConfig.id || 'id_'
      const __linkText = linkConfig.text || 'name_'
      this.label = this.getLinkdataValue(__key, __linkKey, __linkText, value)
    },
    getLinkdataValue(key, __linkKey, __linkText, value) {
      if (this.$utils.isEmpty(key)) {
        return value
      }
      // TODO 有问题
      getLinkDataByKey({
        key: key
      }).then(response => {
        const data = response.data
        if (this.$utils.isNotEmpty(data)) {
          const arrayValue = value.split(',')
          const rtn = []
          for (var d = 0; d < data.length; d++) {
            const	item = data[d]
            const v = arrayValue.find(val => {
              return val === item[__linkKey]
            })
            if (v) {
              rtn.push(item[__linkText])
            }
          }
          this.label += rtn.join(',')
        }
      }).catch((e) => {
        console.error(e)
      })
    },
    /**
     * 格式化地址
     */
    formatterAddress(value, fieldOptions) {
      const store = fieldOptions['store'] || 'stringKey'
      if (store === 'stringKey') {
        let jsonValue = {}
        try {
          jsonValue = JSON.parse(value)
        } catch (e) {
          this.label = value
          return
        }
        if (Utils.isEmpty(jsonValue)) {
          this.label = value
          return
        }
        this.label = this.getAddressData(fieldOptions, jsonValue, 'country') +
              this.getAddressData(fieldOptions, jsonValue, 'province') +
              this.getAddressData(fieldOptions, jsonValue, 'city') +
              this.getAddressData(fieldOptions, jsonValue, 'district') +
                  (jsonValue.street ? jsonValue.street : '')
      }
    },
    // ====================地址展示处理================
    getTextValue: function(data, value) {
      if (Utils.isEmpty(value) || Utils.isEmpty(data)) { return value || '' }
      if (data[value]) {
        return data[value]
      }
      return value || ''
    },
    getTop: function(fieldOptions) {
      return 	fieldOptions['top'] ? fieldOptions['top'] : 'country'
    },
    getLevel: function(fieldOptions) {
      return fieldOptions['level'] ? fieldOptions['level'] : 'district'
    },
    getTopval: function(fieldOptions) {
      var top = this.getTop(fieldOptions)
      var rtnVal = '0'
      var topval = fieldOptions['topval']
      if (Utils.isEmpty(topval)) { return rtnVal }
      if (top === 'province') {
        rtnVal = topval['country']
      } else if (top === 'city') {
        rtnVal = topval['province']
      } else if (top === 'district') {
        rtnVal = topval['city']
      }
      return rtnVal
    },
    getAddressData(fieldOptions, v, type) {
      if (!WorldDistricts) {
        // getAreaData().then((response) => {
        //   WorldDistricts = response.data
        // })
          WorldDistricts = areaData
      }
      if (Utils.isEmpty(v)) { return '' }
      var top = this.getTop(fieldOptions)
      var topval = this.getTopval(fieldOptions)
      var topval1
      if (type === 'country' && v.country) {
        topval = (top === 'country') ? topval : 0
        if (Utils.isEmpty(topval)) { return '' }
        return this.getTextValue(WorldDistricts[topval],
          v.country)
      } else if (type === 'province' && v.province) {
        topval1 = Utils.isNotEmpty(v.country) ? v.country : null
        if (Utils.isEmpty(topval1) && top === 'province') { topval1 = topval }
        if (Utils.isEmpty(topval1)) { return '' }
        return this.getTextValue(WorldDistricts[topval1],
          v.province)
      } else if (type === 'city' && v.city) {
        topval1 = Utils.isNotEmpty(v.province) ? v.province : null
        if (Utils.isEmpty(topval1) && top === 'city') { topval1 = topval }
        if (Utils.isEmpty(topval1)) { return '' }
        return WorldDistricts[topval1] ? (WorldDistricts[topval1][v.city] || '')
          : ''
      } else if (type === 'district' && v.district) {
        topval1 = Utils.isNotEmpty(v.city) ? v.city : null
        if (Utils.isEmpty(topval1) && top === 'district') { topval1 = topval }
        if (Utils.isEmpty(topval1)) { return '' }
        return WorldDistricts[topval1] ? (WorldDistricts[topval1][v.district] || '') : ''
      } else {
        return ''
      }
    },
    // ====================地址展示处理END================
    /**
     * 格式化选项
     */
    formatterOptions(value, options, valueKey = 'value', labelKey = 'label') {
      const optionObj = {}
      options.map(option => {
        optionObj[option[valueKey]] = option[labelKey]
      })
      const aryValue = value.split(',')
      const res = aryValue.map(v => {
        return optionObj[v] || v
      })
      return res.join(',')
    },
    /**
     * 格式json 数据
     */
    formatterJson(value, key) {
      let aryValue = []
      try {
        aryValue = JSON.parse(value)
      } catch (e) {
        return value
      }
      if (Utils.isEmpty(aryValue)) { return '' }
      if (typeof aryValue !== 'object') {
        return aryValue
      }
      const res = aryValue.map(val => {
        return val[key] || ''
      })
      return res.join(',')
    }

  }
}
</script>
<style scoped>
.lc-data-template-data {
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  vertical-align: middle;
}
</style>
