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
      return '/'
    } else {
      const user = useUserStore()
      if (user.roles.length === 0) {
        isRelogin.show = true
        /**
         * 必须返回此promise，不然此语句块默认返回undefined，造成异步路由未加载完成就放行了
         * No match found for location with path "/system/user"
         */
        return user
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
            return { ...to } // 页面刷新丢失
          })
          .catch(() => {
            return user.logout()
          })
          .catch(err => {
            ElMessage.error(err)
            return '/'
          })
      }
    }
  } else {
    // 没有token，并且不在白名单页面
    if (whiteList.indexOf(to.path) === -1) {
      return `/login?redirect=${to.fullPath}` // 全部重定向到登录页
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
