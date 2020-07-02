import { getByKey, getById } from '@/api/platform/data/dataTemplate'
import Utils from '@/utils'
import { Dialog } from 'vant'

var TemplateUtils = {
  getById(id, params, resolve, reject) {
    getById({
      id: id
    }).then(response => {
      const dataTemplate = Utils.parseData(response.data)
      this.buildData({
        dataTemplate: dataTemplate,
        fields: this.datasets2Fields(dataTemplate.datasets)
      }, resolve, reject)
    }).catch((e) => {
      // TODO 异常
      console.error(e)
      reject(e)
    })
  },
  getByKey(key, params, resolve, reject) {
    getByKey({
      key: key
    }).then(response => {
      const dataTemplate = Utils.parseData(response.data)
      this.buildData({
        dataTemplate: dataTemplate,
        fields: this.datasets2Fields(dataTemplate.datasets)
      }, resolve, reject)
    }).catch((e) => {
      // TODO 异常
      console.error(e)
      reject(e)
    })
  },
  /**
 * 数据源数据，转字段数据
 * @param {*} datasets
 */
  datasets2Fields(datasets) {
    if (Utils.isEmpty(datasets)) { return [] }
    const fields = []
    let dataset = {}
    for (var _i = 0, _len = datasets.length; _i < _len; _i++) {
      dataset = datasets[_i]
      if (dataset.attrType === 'column') {
        fields.push(dataset)
      }
    }
    return fields
  },
  buildData({ dataTemplate, fields }, resolve, reject) {
    if (dataTemplate.templates) {
      let template = {}
      if (dataTemplate.showType === 'compose') { // 如果是组合
        var tpl = {}
        if (dataTemplate.composeType === 'treeList') {
          tpl = dataTemplate.templates[1]
        } else if (dataTemplate.composeType === 'listTree') {
          tpl = dataTemplate.templates[0]
        }
        if (!tpl) {
          Dialog.alert('未设置模版！')
          return
        }

        if (tpl.dataTemplate['bind_template'] === 'Y') {
          this.getByKey(tpl.attrs['bind_template_key'])
        } else {
          template = tpl
        }
      } else { // 不是组合
        template = dataTemplate.templates[0]
        this.buildTemplateData(
          {
            dataTemplate: dataTemplate,
            key: dataTemplate.type + '_' + dataTemplate.showType,
            template: template,
            fields: fields
          }, resolve
        )

        // conditions = template.filter_conditions

        // this.buildKey(dataTemplate, template)

        // var dynamicParams = this.buildDynamicParams(conditions)

        // var data = {
        //   dynamicParams: dynamicParams
        // }
        // this.params = params
      }
    }
  },
  buildTemplateData({
    dataTemplate,
    key,
    template,
    fields
  }, resolve) {
    const conditions = template.filter_conditions

    var dynamicParams = this.buildDynamicParams(conditions)
    const data = { ...dataTemplate }
    data['templates'] = null

    data.dynamicParams = dynamicParams
    data[key] = template
    data['fields'] = fields
    resolve(data)
  },
  buildDynamicParams(conditions) {
    var dynamicParams = {}
    if (Utils.isNotEmpty(conditions)) { return dynamicParams }
    var filterConditions = Utils.isNotEmpty(conditions) ? conditions[0] : {}
    var	 filter = filterConditions.filter
    if (filter) { this._createDynamicParams(dynamicParams, filter) }
    return dynamicParams
  },
  _createDynamicParams(dynamicParams, filter) {

  }
}

/**
 * 通过模版key 获取数据模版
 *
 */
export function loadDataTemplateByKey(key, params) {
  return new Promise((resolve, reject) => {
    TemplateUtils.getByKey(key, params, resolve, reject)
  })
}

export function loadDataTemplateById(id, params) {
  return new Promise((resolve, reject) => {
    TemplateUtils.getById(id, params, resolve, reject)
  })
}

export function getDataTemplateListTemplate(dataTemplate) {
  if (dataTemplate.showType === 'compose') { // 如果是组合
  } else { //
    var type = dataTemplate.type
    var showType = dataTemplate.showType
    return dataTemplate[type + '_' + showType]
  }
}

/**
 * 构建数据模版字段
 */
export function buildDataTemplateFields(fields, key = 'name') {
  if (Utils.isEmpty(fields)) {
    return {}
  }
  const res = {}
  fields.forEach(field => {
    res[field[key]] = field
  })
  return res
}

