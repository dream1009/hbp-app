/**
 * Multiple Array traversal
 * @return 1 continue
 * @return 2 break
 */
export function traverse(data, childrenKeys = [], fn = () => {}) {
  if (!data) {
    return
  }
  if (typeof childrenKeys === 'function') {
    fn = childrenKeys
    childrenKeys = []
  }
  let level = 0 // current level
  let indexs = [] // index set of all levels
  const walk = curData => {
    for (let i = 0, len = curData.length; i < len; i++) {
      const isArray = Array.isArray(curData[i])
      const key = Array.isArray(childrenKeys) ? childrenKeys[level] : childrenKeys
      if (isArray || (curData[i] && curData[i][key])) {
        level++
        indexs.push(i)
        walk(isArray ? curData[i] : curData[i][key])
      } else if (level >= childrenKeys.length) {
        const res = fn(curData[i], level, [...indexs, i])
        if (res === 1) {
          continue
        } else if (res === 2) {
          break
        }
      } else {
        continue
      }
    }
    level = 0
    indexs = []
  }
  walk(data)
}

/**
 * Determine whether the two objects are equal or not shallowly
 * 判断2个对象是否相等
 */

export function compareObjects(object0, object1) {
  let ret = true

  if (!object0 || !object1) {
    ret = false
  } else if (typeof object0 !== 'object' || typeof object1 !== 'object') {
    ret = false
  } else if (JSON.stringify(object0) !== JSON.stringify(object1)) {
    ret = false
  }

  return ret
}
