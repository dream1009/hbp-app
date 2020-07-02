import i18n from '@/utils/i18n'

const THEME_COLOR = window.config.THEME_COLOR
const TEXT_COLOR = window.config.TEXT_COLOR
const ICON_COLOR = window.config.ICON_COLOR

export default {
  methods: {
    generateTitle() {
      return this.genTitle(this.$route.name, this.$route.meta.title)
    },
    genTitle(name, title) {
      return i18n.generateTitle(name, title)
    },
    onBack() {
      if (window.history.length <= 1) {
        this.$router.push({ path: '/' })
      } else {
        this.$router.go(-1)
      }
    },
    getBackGroundStyle() {
      if (THEME_COLOR && TEXT_COLOR) {
        return 'background:' + THEME_COLOR + '; color:' + TEXT_COLOR
      }
      return 'background: #288ef0; color: white'
    },
    getSlotStyle() {
      if (ICON_COLOR) {
        return 'color:' + ICON_COLOR
      }
      return 'color: white'
    }
  }
}
export const getBackGroundStyle = () => {
  if (THEME_COLOR && TEXT_COLOR) {
    return 'background:' + THEME_COLOR + '; color:' + TEXT_COLOR
  }
  return 'background: #288ef0; color: white'
}
export const getSlotStyle = () => {
  if (ICON_COLOR) {
    return 'color:' + ICON_COLOR
  }
  return 'color: white'
}
export const getTextStyle = () => {
  if (TEXT_COLOR) {
    return 'color:' + TEXT_COLOR
  }
  return 'color: white'
}
