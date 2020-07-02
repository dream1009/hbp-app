/**
 * bem helper
 * bem() // 'button'
 * bem('text') // 'button__text'
 * bem({ disabled }) // 'button button--disabled'
 * bem('text', { disabled }) // 'button__text button__text--disabled'
 * bem(['disabled', 'primary']) // 'button button--disabled button--primary'
 */

const ELEMENT = '__'
const MODS = '--'

const join = (name, el, symbol) => el ? name + symbol + el : name

const prefix = (name, mods) => {
  if (typeof mods === 'string') {
    return join(name, mods, MODS)
  }

  if (Array.isArray(mods)) {
    return mods.map(item => prefix(name, item))
  }

  const ret = {}
  Object.keys(mods).forEach(key => {
    ret[name + MODS + key] = mods[key]
  })
  return ret
}

/**
 * 实现减号分隔
 * @param {*} str
 */
function kebabCase(str) {
  const remainingChars = str.slice(1)
  str = str.charAt(0).toLowerCase() + remainingChars
  return str.replace(/([A-Z])/g, '-$1').replace(/[-_\s]+/g, '-').toLowerCase()
}

export default {
  methods: {
    isNotEmpty(value) {
      return !this.isEmpty(value)
    },
    isEmpty(value) {
      return this.$utils.isEmpty(value)
    },
    bem(el, mods) {
      const { clzname, name } = this.$options
      let cName = clzname
      if (this.isEmpty(clzname)) { cName = kebabCase(name) }

      if (el && typeof el !== 'string') {
        mods = el
        el = ''
      }
      el = join(cName, el, ELEMENT)

      return mods ? [el, prefix(el, mods)] : el
    }
  }
}
