import 'nprogress/nprogress.css'
import NProgress from 'nprogress'
import router from '@/router'
import { ElMessage } from 'element-plus'
import { getToken } from '@/utils/auth'
import { isHttp } from '@/utils/validate'
import { isRelogin } from '@/utils/request'
import { useUserStore } from './stores/user'
import { useSettingsStore } from './stores/settings.js'
import { usePermissionStore } from './stores/permission.js'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login', '/auth-redirect', '/bind', '/register']

router.beforeEach(to => {
  NProgress.start()
  if (getToken()) {
    to.meta.title && (useSettingsStore().title = to.meta.title)
    /* has token*/
    if (to.path === '/login') {
      NProgress.done()
      return '/'
    } else {
      const user = useUserStore()
      if (user.roles.length === 0) {
        isRelogin.show = true
        // 判断当前用户是否已拉取完user_info信息
        user
          .getInfo()
          .then(() => {
            isRelogin.show = false
            return usePermissionStore().generateRoutes()
          })
          .then(accessRoutes => {
            // 根据roles权限生成可访问的路由表
            accessRoutes.forEach(route => {
              if (!isHttp(route.path)) {
                router.addRoute(route) // 动态添加可访问路由表
              }
            })
            return { ...to, replace: true } // hack方法 确保addRoutes已完成
          })
          .catch(() => {
            return user.logout()
          })
          .catch(err => {
            ElMessage.error(err)
            return '/'
          })
      } else {
        return true
      }
    }
  } else {
    // 没有token
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      return true
    } else {
      NProgress.done()
      return `/login?redirect=${to.fullPath}` // 否则全部重定向到登录页
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
