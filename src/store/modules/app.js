
import storage from '@/utils/storage'

// 首页
const DASHBOARD_NAME = 'dashboard'
const DASHBOARD_VIEW = {
  title: '首页',
  path: '/dashboard',
  name: DASHBOARD_NAME
}

const app = {
  state: {
    language: storage.get('language', 'zh-CN'), // 国际化
    theme: storage.get('theme', '#409EFF'), // 主题

    isLoading: false,

    // 显示打开的页面的列表
    visitedViews: [DASHBOARD_VIEW],
    cachedViews: [],

    // 菜单相关
    activeTabbar: storage.get('activeTabbar') || '',
    // 标题
    title: '',

    messageCount: 0, // 消息数
    hasDataChange: false, // 是否有数据改变
    navBarHide: storage.get('navBarHide') ? storage.get('navBarHide') : false
  },
  mutations: {
    UPDATE_LOADING_STATUS: (state, payload) => {
      state.isLoading = payload.isLoading
    },
    // =================其他====================================
    // 设置语言
    SET_LANGUAGE: (state, language) => {
      state.language = language
      storage.set('language', language)
    },
    // 设置主题
    SET_THEME: (state, theme) => {
      state.theme = theme
      storage.set('theme', theme)
    },
    // 设置标题
    SET_TITLE: (state, title) => {
      state.title = title
    },
    SET_DATA_CHANGE: (state, v) => {
      state.hasDataChange = v
    },
    // 设置标题栏隐藏标识
    SET_NAVBAR_HIDE: (state, v) => {
      state.navBarHide = v
      storage.set('navBarHide', v)
    }
  },
  actions: {

    // ==============其他============
    // 设置语言
    setLanguage({ commit }, language) {
      commit('SET_LANGUAGE', language)
    },
    // 设置标题
    setTitle: ({ commit }, title) => {
      commit('SET_TITLE', title)
    },
    // 设置
    setDataChange: ({ commit }, v) => {
      commit('SET_DATA_CHANGE', v)
    },
    // 设置
    setNavBarHide: ({ commit }, v) => {
      commit('SET_NAVBAR_HIDE', v)
    }
  }
}

export default app
