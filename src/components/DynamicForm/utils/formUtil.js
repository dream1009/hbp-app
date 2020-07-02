
import Utils from '@/utils'
import FormulaUtil from '@/utils/formula'
import fecha from '@/utils/fecha'
import { getScriptValue } from '@/api/platform/common'
import { getUserDetail } from '@/api/platform/org/employee'
import { queryDataJson } from '@/api/platform/data/dataTemplate'
import { getDatas } from '@/api/platform/dictionary'
import { formatParams } from '@/utils/params'
import store from '@/store'
import groupBy from 'lodash/groupBy' // store

window.FormulaUtil = FormulaUtil
const FormUtil = {
  TABLE_SEPARATOR: '.', // 表分隔符
  EVAL_FORMULA: '',
  NOT_NEED_FIELD: '#not_need_field#', // 不需要通过字段计算的字段
  CACHE_DYNAMIC_VALUE: {},
  CACHE_CURRENT_USER_DATA: {}, // 缓存的用户数据值，包含组织、岗位部门，以后缓存到store 或者缓存
  setResponseFormula(responseFormula, model) {
    if (model.field_type === 'table') { //  判断是否是主表，子表他自己处理
      model.field_options.columns.forEach((item) => {
        item.code = model.name
        this.setChangeFormulaData(responseFormula, item)
      })
    } else { // 主表
      this.setChangeFormulaData(responseFormula, model)
    }
  },

  setChangeFormulaData(responseFormula, model) {
    const fieldOptions = model.field_options || {}
    if (fieldOptions.default_value_type !== 'formula') { return {} }
    const changename = model.code + this.TABLE_SEPARATOR + model.name
    const formula = fieldOptions.default_value
    const d = formula.split(/(\$[0-9a-zA-Z\._]+#[0-9A-Fa-f]*)/g)
    const z = this.NOT_NEED_FIELD
    const changFormula = {
      changename: changename,
      formula: formula
    }
    let isHasField = false

    d.forEach(n => {
      if (/^\$(_widget_)/.test(n)) { // 对字段进行处理
        const f = n.replace('$_widget_', '').split('#')
        const g = f[0]
        const h = f[1]
        if (Utils.isEmpty(h)) {
          if (!responseFormula[g]) { responseFormula[g] = [] }
          const isExt = responseFormula[g].find((v) => {
            return (v.changename === changFormula.changename) && (v.formula === changFormula.formula)
          })
          if (!isExt) {
            responseFormula[g].push(changFormula)
          }
        }
        isHasField = true
      }
    })
    // 未有要计算改变字段

    if (!isHasField) {
      if (!responseFormula[z]) { responseFormula[z] = [] }
      responseFormula[z].push(changFormula)
    }
  },

  runCalFormula(responseFormulas, data, field, row) {
    if (Utils.isEmpty(responseFormulas)) { return }

    responseFormulas.forEach((responseFormula) => {
      const changename = responseFormula.changename // 修改字段
      const changeObj = changename ? changename.split(this.TABLE_SEPARATOR) : []// 改变的对象
      const changeCode = changeObj[0]// 修改的表
      const changeField = changeObj[1]
      const isMainTable = !!Utils.isEmpty(row)// 是否主表
      const curCode = field.code
      const isSameTable = changeObj[0] === curCode // 是否相同的表
      // 获取公式计算的值
      const v = this.getCalFormulaValue(responseFormula, data, field, row)

      //优化逻辑：应该判断修改的字段是否是主表做对应的改变，而不是此处的field
      let changeTableIsMain
      if (changeCode === curCode) {
        changeTableIsMain = true
      } else {
        changeTableIsMain = false
      }

      // 回填值
      if (isMainTable) { // 主表
        if (changeTableIsMain) {
          data[changeField] = v
        } else {
          if (data[changeCode] && data[changeCode].length > 0) {
            data[changeCode].forEach(item => {
                item[changeField] = v
              }
            )
          }
        }
      } else {
        if (isSameTable && row > -1) { // 是否相同子表
          const code = field.table.name// 子表的表名
          data[code][row][changeField] = v
        } else if (!isSameTable) { // 不同子表
          if (field.table.code === changeCode) { // 修改的是否是主表
            data[changeField] = v
          } else {
            data[changeCode].forEach((rowData) => {
              rowData[changeField] = v
            })
          }
        }
      }
    })
  },
  /**
   * 通过计算的值
   */
  getCalFormulaValue(responseFormula, data, field, row) {
    const formula = responseFormula.formula
    const changename = responseFormula.changename// 修改字段
    const changeObj = changename ? changename.split(this.TABLE_SEPARATOR) : [] // 改变的对象
    const isMainTable = !!Utils.isEmpty(row)// 是否主表
    const isSameTable = changeObj[0] === field.code // 是否相同的表
    const d = formula.split(/(\$[0-9a-zA-Z\._]+#[0-9A-Fa-f]*)/g)
    const e = []
    let v = ''
    d.forEach((n, index) => {
      if (/^\$(_widget_)/.test(n)) {
        const f = n.replace('$_widget_', '').split('#')
        const g = f[0]
        const h = f[1]
        if (Utils.isEmpty(h)) {
          // 获取公式的值 数字
          const t = g.split(this.TABLE_SEPARATOR)
          let val = '""'
          const calCode = t[0] // 当前计算的code
          const key = t[1]
          if (isMainTable) { // 主表
            val = this.getValueByKey(field, data, key)
            if (val === undefined) {
              val = this.getColumnValue(data, calCode, key/*, this.checkIsArray2Value(index, d)*/)
            }
          } else { // 子表
            if (isSameTable) { // 相同的表
              val =	this.getValueByKey(field ,data, key, calCode, row)
            } else { // 如果改变的是主表,则取一列的值
              val = this.getColumnValue(data, calCode, key/*, this.checkIsArray2Value(index, d)*/)
            }
          }
          if ((!isNaN(val) && val.length > 16) || (isNaN(val) && !isNaN(Date.parse(val)))) {
            e.push('\'' + val + '\'')
          } else {
            e.push(val)
          }
          // e.push(val)
        } else {
          e.push('\'' + n + '\'')
        }
      } else {
        e.push(n)
      }
    })
    try {
      v = this.evalFormula(e.join(''))
    } catch (e) {
      v = ''
    }
    return v
  },
  getValueByKey(field, data, key, code, row) {
    let val
    if (row === -1) {
      return ''
    }
    if (Utils.isNotEmpty(code)) {
      if (data[code] && data[code][row] && data[code][row][key]) {
        val = this.getRealValue(data[code][row][key])
        // return this.getRealValue(data[code][row][key])
      }
    } else {
      val = this.getRealValue(data[key])
      // return this.getRealValue(data[key])
    }
    if (field['field_type'] === 'number') {
      val = val || 0
    }
    if (!code && !row && Utils.isEmpty(val) && field.fields && field.fields.length > 0) {
      const fieldItem = field.fields.filter(item => {
        return item.name === key
      })
      if (fieldItem[0]['field_type'] === 'number') {
        val = 0
      }
    }
    return val
  },
  // TODO 需要传递类型，判断类型不同进行进行计算
  getRealValue(val) {
    if (!val) return ''
    var zeroReg = /^0\d*$/
    if (zeroReg.test(val)) {
      return val
    }
    var regPos = /^\d+(\.\d+)?$/ // 非负浮点数
    var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/ // 负浮点数
    if (String(val).length < 17 && (regPos.test(val) || regNeg.test(val))) {
      return Number(val)
    } else {
      // return '\'' + val + '\''
      return val
    }
  },
  checkIsArray2Value(index, d) {
    if (d[index+1] && (d[index+1].startsWith('[') || d[index+1].endsWith(']'))) {
      return false
    }
    return true
  },
  getColumnValue(data, code, key/*, needArray2Value*/) {
    const tableData = data[code]
    if (Utils.isEmpty(tableData)) {
      return '""'
    }
    const v = tableData.map((d) => {
      return this.getRealValue(d[key])
    })
    // if (v.length == 1 && isNaN(v[0]) && needArray2Value) {
    //   return v[0]
    // }
    return JSON.stringify(v) + ''
  },
  getEvalFormula: function() {
    if (Utils.isEmpty(this.EVAL_FORMULA)) {
      // 做缓存避免运算
      const b = []
      Object.keys(FormulaUtil).forEach(n => {
        b.push('var ' + n + '=FormulaUtil.' + n)
      })

      this.EVAL_FORMULA = b.join(';') + ';'
    }
    return this.EVAL_FORMULA
  },
  evalFormula: function(a) {
    let c = null
    let env = null
    try {
      env = this.getEvalFormula()
      // c = new Function(env + 'return \'' + a+ '\';')()
      c = new Function(env + 'return ' + a+ ';')()
      if (c == undefined || c == 'undefined') {
        c = ''
      }
    } catch (e) {
      c = null
    }
    return c
  },
  /**
   * 表单提交校验
   * @param {*} formula 计算的公式
   * @param {*} data 数据
   * @param {*} mainCode  主表code
   */
  runFormSubmitVerify(formula, data, field) {
    const d = formula.split(/(\$[0-9a-zA-Z\._]+#[0-9A-Fa-f]*)/g)
    const e = []
    let v = true

    d.forEach((n,index) => {
      if (/^\$(_widget_)/.test(n)) {
        const f = n.replace('$_widget_', '').split('#')
        const g = f[0]
        const h = f[1]
        if (Utils.isEmpty(h)) {
          // 获取公式的值 数字
          const t = g.split(this.TABLE_SEPARATOR)
          let val = '""'
          const calCode = t[0] // 当前计算的code
          const key = t[1]
          const isMainTable = calCode === field.code// 是否主表
          if (isMainTable) { // 主表
            val = this.getValueByKey(field, data, key)
          } else { // 子表  是主表,则取一列的值
            val = this.getColumnValue(data, calCode, key/*, this.checkIsArray2Value(index, d)*/)
          }
          if ((!isNaN(val) && val.length > 16) || (isNaN(val) && !isNaN(Date.parse(val)))) {
            e.push('\'' + val + '\'')
          } else {
            e.push(val)
          }
        } else {
          e.push('"' + n + '"')
        }
      } else {
        e.push(n)
      }
    })

    try {
      v = this.evalFormula(e.join(''))
    } catch (e) {
      console.warn(e)
      v = true
    }

    return v
  },
  getSelectorValue(store, val) {
    if (Utils.isEmpty(val)) return ''
    if (store === 'json') {
      return JSON.stringify(val)
    } else if (store === 'id') {
      return val.map((d) => { return d.id }).join(',')
    } else if (store === 'bind') {
      return val.map((d) => { return d.name }).join(',')
    }
  },
  getSelectorDefaultValue({ data, name, field_options }, callback) {
    if (Utils.isEmpty(data) || Utils.isEmpty(data.value)) { return '' }
    const store = field_options.store
    if (data.type === 'dynamic') { // 动态值 当前用户当前xx
      return this.getCurrentDataValue({
        selectorType: field_options.selector_type || 'user',
        bindId: field_options.bind_id,
        name: name,
        storeType: store
      }, callback)
    } else { // 固定值
      const selectors = []
      selectors.push(data.value)
      // 绑定值回调
      this.bindIdCallback(store, field_options.bind_id, selectors, callback)
      return this.getSelectorValue(store, selectors)
    }
  },
  getCurrentDataValue({ selectorType, bindId, name, storeType }, callback) {
    // TODO 这个有bug 如果修改了岗位等信息，还是读取缓存的值
    const cacheValue = this.CACHE_CURRENT_USER_DATA[selectorType]
    if (Utils.isNotEmpty(cacheValue)) {
      // 绑定值回调
      this.bindIdCallback(storeType, bindId, cacheValue, callback)
      return this.getSelectorValue(storeType, cacheValue)
    } else {
      if (selectorType === 'user') { // 缓存用户
        const selectors = [{
          id: store.getters.id,
          name: store.getters.fullname
        }]
        this.CACHE_CURRENT_USER_DATA[selectorType] = selectors
        // 绑定值回调
        this.bindIdCallback(storeType, bindId, selectors, callback)
        return this.getSelectorValue(storeType, selectors)
      }
      // 缓存用户的值
      getUserDetail().then(data => {
        const v = data.data
        // 当前组织
        if (Utils.isNotEmpty(v.partyOrg.id)) {
          const selectors = [{
            'id': v.partyOrg.id,
            'name': v.partyOrg.name
          }]
          this.CACHE_CURRENT_USER_DATA['org'] = selectors
        }
        // 岗位
        if (Utils.isNotEmpty(v.partyPosition)) {
          const selectors = v.partyPosition.map((pos) => {
            return {
              'id': pos.id,
              'name': pos.name
            }
          })
          this.CACHE_CURRENT_USER_DATA['position'] = selectors
        }
        // TODO 角色 后台未处理
        if (Utils.isNotEmpty(v.partyRole)) {
          const selectors = v.partyRole.map((role) => {
            return {
              'id': role.id,
              'name': role.name
            }
          })
          this.CACHE_CURRENT_USER_DATA['role'] = selectors
        }
        // 绑定值回调
        this.bindIdCallback(storeType, bindId, this.CACHE_CURRENT_USER_DATA[selectorType], callback)
        // 回调数据
        callback(name, this.getSelectorValue(storeType, this.CACHE_CURRENT_USER_DATA[selectorType]))
      })
    }
    return ''
  },
  /**
   * 绑定值回调
   * @param {*} store
   * @param {*} bindId
   * @param {*} value
   * @param {*} callback
   */
  bindIdCallback(store, bindId, value, callback) {
    if (store === 'bind') {
      callback(bindId, this.getSelectorValue('id', value))
    }
  },

  /**
   * 获取字段默认值
   */
  getFieldDefaultValue({ name, field_options = {}, field_type }, callback) {
    const type = field_options.default_value_type || 'fixed'
    const value = field_options.default_value
    // ================= 固定值   =================
    if (type === 'fixed') {
      if (field_type === 'radio' || field_type === 'checkbox' || field_type === 'select') { // 单选，复选，下拉
        const checkedValue = []
        field_options.options.forEach(option => {
          if (option['checked']) {
            checkedValue.push(option['val'])
          }
        })
        return checkedValue.join(',')
      } else if (field_type === 'currentDate' || field_type === 'currentTime') { // 当前时间，当前日期
        return fecha.format(new Date(), field_type === 'currentDate' ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss')
      } else if (field_type === 'currentUser' || field_type === 'currentOrg') { // 当前用户、组织
        return this.getCurrentDataValue({
          selectorType: field_type === 'currentUser' ? 'user' : 'org',
          bindId: field_options.bind_id,
          name: name,
          storeType: field_options.store
        }, callback)
      } else if (field_type === 'selector') { // 选择器默认值
        return this.getSelectorDefaultValue({
          data: value,
          name: name,
          field_options: field_options
        }, callback)
      } else if (field_type === 'address') { // 地址 固定值
        if (field_options.street && field_options.street !== '') {
          value.street = field_options.street
        }
        return value ? JSON.stringify(value) : ''
      } else { // 默认值
        return value || ''
      }
      // ================= 动态值   =================
    } else if (type === 'dynamic') {
      if (Utils.isEmpty(value)) { return }
      if (this.CACHE_DYNAMIC_VALUE[value]) { // TODO 考虑动态参数
        return this.CACHE_DYNAMIC_VALUE[value]
      }
      // 缓存之前的值
      this.getDynamicValue(value).then(data => {
        // 回调数据
        callback(name, data)
      })
    } else if (type === 'today') {
      // 当前时间
      const datefmt = field_options['datefmt'] || 'yyyy-MM-dd HH:mm:ss'
      return fecha.format(new Date(), datefmt)
    } else {
      return ''
    }
  },
  // 获得动态值
  getDynamicValue(value, vars) {
    return new Promise((resolve, reject) => {
      getScriptValue({
        script: value,
        vars: vars || ''
      }).then(response => {
        const data = response.data
        this.CACHE_DYNAMIC_VALUE[value] = data
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getDictionaries(taskId, array) {
    return new Promise((resolve, reject) => {
      let object = []
      getDatas({ type: array.join(',') }).then(({ data }) => {
        object = groupBy(data, 'typeKey')
        resolve(object)
      })
    })
  },
  setResponseLinkages: function(responseLinkages, model) {
    if (model.field_type === 'table') { //  判断是否是主表，子表他自己处理
      model.field_options.columns.forEach((item) => {
        item.code = model.name
        this.setChangeLinkagesData(responseLinkages, item)
      })
    } else { // 主表
      this.setChangeLinkagesData(responseLinkages, model)
    }
  },
  setChangeLinkagesData: function(responseLinkages, model) {
    const fieldOptions = model.field_options || {}
    const type = fieldOptions.default_value_type || 'fixed'
    const linkage = fieldOptions.default_value
    if (type !== 'linkage' || Utils.isEmpty(linkage)) { return }
    const changename = model.code + this.TABLE_SEPARATOR + model.name
    const changFormula = {
      changename: changename,
      linkage: linkage
    }
    const key = model.code + this.TABLE_SEPARATOR + linkage.field
    if (!responseLinkages[key]) { responseLinkages[key] = [] }
    responseLinkages[key].push(changFormula)
  },
  // TODO
  // 1、主表数据联动 （完成）
  // 2、 子表的数据联动（完成）
  // 3、不同控件间的数据联动
  // 4、支持不同控件进行联动
  // 5、实现多级联动
  runLinkage: function(responseLinkages, data, field, row) {
    if (!responseLinkages) { return }

    const curCode = field.code
    const key = field.name
    for (let i = 0; i < responseLinkages.length; i++) {
      const responseLinkage = responseLinkages[i]
      const linkage = responseLinkage.linkage
      const	changename = responseLinkage.changename// 修改字段
      const changeObj = changename ? changename.split(this.TABLE_SEPARATOR) : []// 改变的对象

      const params = {
        key: linkage.dataSource,
        [`Q^${linkage.relyData}^S`]: this.getFieldDataValue(Utils.isEmpty(row), changeObj[0] === curCode, data, key, curCode, row)
      }

      // 加载数据
      queryDataJson(formatParams(params, this.page)).then(response => {
        const dataResult = response.data.dataResult
        if (Utils.isNotEmpty(dataResult)) {
          var d = dataResult[0]
          var resultVal = d[linkage.dataField]
          data[changeObj[1]] = resultVal
        }
      }).catch((e) => {
        console.info(e)
      })
    }
  },
  getFieldDataValue: function(isMainTable, isSameTable, data, key, code, row) {
    var val = ''
    if (isMainTable) { // 主表
      val = data[key]
    } else { // 子表
      if (isSameTable) { // 相同的表
        val =	data[code][row][key]
      } else { // 如果改变的是主表,则取一列的值
        const tableData = data[code]
        if (Utils.isEmpty(tableData)) {
          return ''
        }
        const v = tableData.map((d) => {
          return d[key]
        })
        val = JSON.stringify(v) + ''
      }
    }

    return val
  }
}
export default FormUtil
