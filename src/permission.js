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
    /* 有token */
    if (to.path === '/login') {
      return '/'
    } else {
      const user = useUserStore()
      if (user.roles.length === 0) {
        isRelogin.show = true
        /**
         * fix: No match found for location with path "/xxx/xxx"
         * 必须返回此promise，不然此语句块默认返回undefined，造成异步路由未加载完成就放行了，然后控制台出现多个上诉警告
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
            /**
             * fix: 404
             * 注释掉会导致刷新页面404
             */
            return { ...to }
          })
          .catch(err => {
            // 获取信息失败处理，不同任务的promise链
            return user.logout().then(() => {
              ElMessage.error(err.toString())
              return '/'
            })
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
