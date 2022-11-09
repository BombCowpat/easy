import axios from 'axios'
import errorCode from '@/utils/errorCode'
import { getToken } from '@/utils/auth'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import { useUserStore } from '@/stores/user.js'

// const user = useUserStore() // 注意：不能在一开始就调用useUserStore()，因为导入此模块时，main.js 中的pinia可能还没完成初始化和安装，在实际需要时调用即可

// 是否显示重新登录
export let isRelogin = { show: false }
axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'

// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: import.meta.env.VITE_BASE_URL,
  // 超时
  timeout: 10000,
})

// request拦截器
service.interceptors.request.use(
  config => {
    // 是否需要设置 token
    const isToken = (config.headers || {}).isToken === false
    // 是否需要防止数据重复提交
    // const isRepeatSubmit = (config.headers || {}).repeatSubmit === false
    if (getToken() && !isToken) {
      config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config
  },
  error => {
    console.log(error)
    Promise.reject(error)
  },
)

// 响应拦截器
service.interceptors.response.use(
  res => {
    // 未设置状态码则默认成功状态
    const code = res.data.code || 200
    // 获取错误信息
    const msg = errorCode[code] || res.data.msg || errorCode['default']

    // 二进制数据则直接返回
    if (res.request.responseType === 'blob' || res.request.responseType === 'arraybuffer') {
      return res.data
    }

    if (code === 401) {
      if (!isRelogin.show) {
        isRelogin.show = true
        ElMessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            isRelogin.show = false
            return useUserStore().logout()
          })
          .then(() => {
            location.href = '/index'
          })
          .catch(() => {
            isRelogin.show = false
          })
      }
      return Promise.reject('无效的会话，或者会话已过期，请重新登录。')
    } else if (code === 500) {
      ElMessage({
        message: msg,
        type: 'error',
      })
      return Promise.reject(new Error(msg))
    } else if (code === 601) {
      ElMessage({
        message: msg,
        type: 'warning',
      })
      return Promise.reject('error')
    } else if (code !== 200) {
      ElNotification.error({
        title: msg,
      })
      return Promise.reject('error')
    } else {
      return res.data
    }
  },
  error => {
    console.log('err' + error)
    return Promise.reject(error)
  },
)

export default service
