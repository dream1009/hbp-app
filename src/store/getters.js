const getters = {
  // 应用
  language: state => state.app.language, // 当前语言
  theme: state => state.app.theme, // 当前主题
  title: state => state.app.title, // 当前标题
  hasDataChange: state => state.app.hasDataChange, // 当前数据是否修改
  navBarHide: state => state.app.navBarHide, //是否隐藏标题栏

  // === 菜单相关
  activeTabbar: state => state.app.activeNavMenu, // 当前选中导航菜单

  visitedViews: state => state.app.visitedViews, // 当前访问视图
  cachedViews: state => state.app.cachedViews, // 缓存视图

  // === 用户 信息相关
  token: state => state.user.token, // 用户token
  id: state => state.user.id, // 用户id
  fullname: state => state.user.fullname, // 用户名称
  account: state => state.user.account, // 用户帐号
  org: state => state.user.org, // 用户岗位
  position: state => state.user.position, // 用户岗位
  avatar: state => state.user.avatar, // 用户头像
  status: state => state.user.status, // 用户状态

  errorLogs: state => state.errorLog.logs
}
export default getters
