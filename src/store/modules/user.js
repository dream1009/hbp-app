import { login, logout, getCaptcha, wcLogin, apiToken4DingTalk } from '@/api/login'
import { getDingTalkCord, getDingTalkToken, getUserId } from '@/api/oauth2/dingding.js'
import { getUserDetail } from '@/api/platform/org/employee'
import { getUserInfo } from '@/api/platform/org/user'
import { getToken, setToken, removeToken, removeAppParams } from '@/utils/auth'
import storage from '@/utils/storage'
import Utils from '@/utils'

const user = {
  state: {
    token: getToken(),
    id: '', // id
    account: '', // 帐号
    fullname: '', // 用户名
    org: '', // 当前组织
    position: '', // 岗位
    avatar: '', // 头像
    status: ''
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
      setToken(token)
    },
    SET_USER_INFO: (state, data) => {
      state.account = data.account
      state.fullname = data.fullname
      state.id = data.id

      if (data.photo) {
        const photo = data.photo.split('=')[1]
        state.avatar = photo
        // 放入缓存
        storage.set('avatarImgPath', photo)
      }
      state.position = data.position
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },
  actions: {
    // 用户名登录
    loginByUsername({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login({
          account: username,
          pwd: userInfo.password
        }).then(response => {
          let data = response.data

          if (!(data instanceof Object)) {
            data = Utils.parseData(data)
          }
          commit('SET_TOKEN', data.token)

          commit('SET_USER_INFO', data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // token登录
    loginByToken({ commit }, token) {
      const user = {}
      return new Promise((resolve, reject) => {
        getUserDetail().then(response => {
          const data = response.data
          user.id = data.partyUser.id
          user.fullname = data.partyEmployee.name
          user.account = data.partyEmployee.account
          commit('SET_TOKEN', token)
          commit('SET_USER_INFO', user)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 微信登录
    loginByWechat({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        wcLogin({ 'code': userInfo.code }).then(response => {
          if (response.state === 200) {
            let data = response.data
            if (!(data instanceof Object)) {
              data = Utils.parseData(data)
            }
            commit('SET_TOKEN', data.token)
            commit('SET_USER_INFO', data)
            resolve()
          } else {
            throw new Error({ message: 'wclogin error', code: response.state })
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 微信登录
    loginByWechatForOfficialAccount({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        wcLogin({ 'code': userInfo.code }).then(response => {
          if (response.state === 200) {
            let data = response.data
            if (!(data instanceof Object)) {
              data = Utils.parseData(data)
            }
            commit('SET_TOKEN', data.token)
            commit('SET_USER_INFO', data)
            resolve()
          } else {
            throw new Error({ message: 'wclogin for official account error', code: response.state })
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 手机号验证码登录
    loginByPhone({ commit }, userInfo) {
      const phone = userInfo.phone.trim()
      return new Promise((resolve, reject) => {
        login(phone, userInfo.code).then(response => {
          let data = response.data
          if (!(data instanceof Object)) {
            data = Utils.parseData(data)
          }
          commit('SET_TOKEN', data.token)
          commit('SET_USER_INFO', data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取验证码
    getCaptcha({ commit }) {
      return new Promise((resolve, reject) => {
        getCaptcha().then(response => {
          resolve(response.data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取用户信息
    getUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfo().then(response => {
          if (response && response.data) {
            let data = response.data
            if (!(data instanceof Object)) {
              data = Utils.parseData(data)
            }
            // 设置用户信息
            commit('SET_USER_INFO', data)
            resolve(response)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    logOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          removeToken()
          removeAppParams()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    fedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_ROLES', '')
        removeToken()
        removeAppParams()
        resolve()
      })
    },

    // 钉钉登录
    dingdLogin({ commit, state }) {
      return new Promise((resolve, reject) => {
        // 1. 获取钉钉授权码，以及钉钉的 token
        Promise.all([getDingTalkCord(), getDingTalkToken()]).then(result => {
          const data = {
            token: result[1].data.access_token,
            code: result[0]
          }
          // 2.获取钉用户的 userid
          return getUserId(data)
        }).then(res1 => {
          const { userid } = res1.data
          const data = {
            userid
          }
          // 3.根据钉钉登录的用户 id 到 hbp 系统获取有效token。如果用户存在，返回有效 token
          return apiToken4DingTalk(data)
        }).then(res2 => {
          const { data } = res2
          if (data.token && data.token.length > 0) {
            commit('SET_TOKEN', data.token)
            // 4. 获取用户信息
            return getUserInfo()
          } else {
            reject()
          }
        }).then(res3 => {
          if (res3 && res3.data) {
            let data = res3.data
            if (!(data instanceof Object)) {
              data = Utils.parseData(data)
            }
            // 5. 设置用户信息
            commit('SET_USER_INFO', data)
            resolve(res3)
          }
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default user
