import storage from 'store'
import { auth, getPermissions, logout } from '@/api/basic'
import { ACCESS_TOKEN, USER_NICKNAME, USER_AVATAR } from '@/store/mutation-types'
import { welcome, timeFix } from '@/utils/util'
import notification from 'ant-design-vue/es/notification'

const user = {
  state: {
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    actions: [],
    pages: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ACTIONS: (state, actions) => {
      state.actions = actions
    },
    SET_PAGES: (state, pages) => {
      state.pages = pages
    }
  },

  actions: {
    // 用ST换取业务Token，用户信息
    Auth ({ commit }, st) {
      return new Promise((resolve, reject) => {
        auth({ st: st })
          .then(response => {
            const result = response.data
            storage.set(ACCESS_TOKEN, result.auth_token)
            storage.set(USER_NICKNAME, result.profile.nickname || result.profile.username)
            storage.set(USER_AVATAR, result.profile.avatar || '')
            commit('SET_TOKEN', result.auth_token)
            resolve()
          }).catch(error => {
            reject(error)
          })
      })
    },
    // 获取菜单操作权限
    GetPermissions ({ commit }) {
      return new Promise((resolve, reject) => {
        getPermissions().then(response => {
          const result = response.data
          commit('SET_NAME', { name: storage.get(USER_NICKNAME), welcome: welcome() })
          commit('SET_AVATAR', storage.get(USER_AVATAR))
          commit('SET_ACTIONS', result.actions)
          commit('SET_PAGES', result.pages)
          notification.success({ message: '欢迎', description: `${timeFix()}，欢迎回来` })
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 登出 flag=true 用户主动退出
    Logout ({ dispatch, commit }, flag) {
      return new Promise(async (resolve) => {
        if (flag) {
          await logout()
        }
        commit('SET_TOKEN', '')
        storage.remove(ACCESS_TOKEN)
        dispatch('OpenSSO', flag)
        resolve()
      })
    },
    // 跳转单点登陆系统 origin:使用根路径作为跳转地址 避免切换账号后不存在对应路由而出现的404页面
    OpenSSO ({ commit }, origin) {
      const loginURL = process.env.VUE_APP_SSO_BASE_URL
      const redirectURL = origin ? window.location.origin : window.location.href
      const URL = loginURL + '?redirectURL=' + encodeURIComponent(redirectURL) + '&serviceCode=' + process.env.VUE_APP_SERVEICE_CODE
      window.location.href = URL
    }
  }
}

export default user
