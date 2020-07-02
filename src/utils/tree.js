
/**
 * 树形结构的处理
 * <pre>
 * 作者:hugh zhuang
 * 邮箱:3378340995@qq.com
 * 日期:2015-11-02-下午3:29:34
 * 版权:广州流辰信息技术有限公司
 * </pre>
 */

const _defaults = {
  idKey: 'id',
  parentIdKey: 'parentId',
  childrenKey: 'children',
  valueKey: 'value',
  labelKey: 'label'
}
/**
 * 转换成树形结构
 * @param {*} sNodes
 */
export function transformToTreeFormat(sNodes, options) {
  var i, l, idKey, parentIdKey, childrenKey
  if (!options) {
    options = {}
  }
  // 设置默认值
  idKey = options['idKey'] || _defaults['idKey']
  parentIdKey = options['parentIdKey'] || _defaults['parentIdKey']
  childrenKey = options['childrenKey'] || _defaults['childrenKey']

  if (!sNodes) { return [] }
  if (sNodes instanceof Array) {
    const r = []
    const tmpMap = []
    for (i = 0, l = sNodes.length; i < l; i++) {
      tmpMap[sNodes[i][idKey]] = sNodes[i]
    }
    for (i = 0, l = sNodes.length; i < l; i++) {
      if (tmpMap[sNodes[i][parentIdKey]] &&
        sNodes[i][idKey] !== sNodes[i][parentIdKey]) {
        if (!tmpMap[sNodes[i][parentIdKey]][childrenKey]) { tmpMap[sNodes[i][parentIdKey]][childrenKey] = [] }
        // tmpMap[sNodes[i][parentIdKey]][childrenKey].push(sNodes[i])
        let isExist = false
        tmpMap[sNodes[i][parentIdKey]][childrenKey].find(function(item) {
          if (item[idKey] === sNodes[i][idKey]) {
            isExist = true
          }
        })
        if (!isExist) {
          tmpMap[sNodes[i][parentIdKey]][childrenKey].push(sNodes[i])
        }
      } else {
        r.push(sNodes[i])
      }
    }
    return r
  } else {
    return [sNodes]
  }
}
/**
 * 转换key和value数据
 * @param {*} ary
 * @param {*} options
 */
export function transformToKeyValue(ary, options) {
  if (!ary || ary.length === 0) { return {} }
  if (!options) {
    options = {}
  }
  const valueKey = options['valueKey'] || _defaults['valueKey']
  const tmp = {}
  for (let i = 0; i < ary.length; i++) {
    const o = ary[i]
    if (o instanceof String) {
      tmp[o] = o
    } else {
      tmp[o[valueKey] ] = o
    }
  }
  return tmp
}
