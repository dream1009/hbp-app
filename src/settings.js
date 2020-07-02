
const pkg = require('../package.json')

module.exports = {
  title: 'HBP平台',

  /**
   * 版本号
   */
  version: pkg.version,
  /**
     * @type {string | array} 'production' | ['production', 'development']
     * @description Need show err logs component.
     * The default is only used in the production env
     * If you want to also use it in dev, you can pass ['production', 'development']
     */
  errorLog: 'production'
}
