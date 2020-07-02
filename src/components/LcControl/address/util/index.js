const util = {
  CN_CODE: 'CN', // 中国编码
  levelArr: ['country', 'province', 'city', 'district'], // 等级
  dataTypeArr: ['all', 'code', 'name'],
  oneOf: (item, ary) => {
    return ary.some(i => {
      return i === item
    })
  },
  /**
   * name在list 所在的索引
   */
  getIndex: (list, name) => {
    for (const i in list) {
      if (list[i] === name) { return i }
    }
  },
  /**
   * 获取索引
   */
  getLevelIndex: (level) => {
    return parseInt(util.getIndex(util.levelArr, level), 10)
  },
  /**
   * 通过索引获取等级key
   */
  getLevelKey: (i) => {
    return util.levelArr[i]
  },

  /**
   * 检查level是否在符合
   * @param {*} level
   */
  checkLevel: level => {
    return util.oneOf(level, util.levelArr)
  }
}

export default util
