import { defineStore } from 'pinia'
import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

export const useUserStore = defineStore('user', {
  // 推荐使用 完整类型推断的箭头函数
  state: () => {
    return {
      // 所有这些属性都将自动推断其类型
      token: getToken(),
      name: '',
      avatar: '',
      roles: [],
      permissions: [],
    }
  },
  actions: {
    // 登录
    login(loginForm) {
      const { username, password, code, uuid } = loginForm
      return login(username, password, code, uuid).then(res => {
        setToken(res.token)
        this.token = res.token
      })
    },

    // 退出系统
    logout() {
      return logout().then(() => {
        this.token = null
        this.roles = []
        this.permissions = []
        removeToken()
      })
    },

    // 获取用户信息
    getInfo() {
      return getInfo()
    },
  },
})
