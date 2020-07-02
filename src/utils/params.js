const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 15

/**
 * 格式分页数据
 * @param {} params 查询的参数
 * @param {} page 分页
 * @param {} sorts 排序
 */
export function formatParams(params, page, sorts) {
  const results = {}
  if (params) {
    results.parameters = Object.keys(params).map((k) => {
      return {
        'key': k,
        'value': params[k]
      }
    })
  }
  if (page) {
    results.requestPage = {
      'pageNo': page.page || DEFAULT_PAGE,
      'limit': page.limit || DEFAULT_LIMIT
    }
  }
  if (sorts) {
    results.sorts = Object.keys(sorts).map((k) => {
      return {
        'field': k,
        'order': sorts[k]
      }
    })
  }

  return results
}

/**
 * 判断是否加载完成
 * @param {*} param
 */
export function loadFinished({ limit = 15, page = 1, totalCount, totalPages }) {
  return limit * page >= totalCount
}

export function getResultType(list, finished) {
  if (list && list.length > 0) {
    if (finished) return 'finished'
    return
  }
  return 'empty'
}
