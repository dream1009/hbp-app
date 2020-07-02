/**
 * 未保存离开提示
 */
export default {
  beforeRouteLeave(to, from, next) {
    if (!this.$store.getters.hasDataChange) {
      next()
      return
    }

    this.$dialog.confirm({
      title: '提示',
      message: '您有未保存的数据,您确定要离开该页面？'
    }).then(() => {
      next()
    }).catch(() => {
      next(false)
    })
  }
}
