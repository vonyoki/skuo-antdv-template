import router from './router'
import store from './store'
import storage from 'store'
import NProgress from 'nprogress' // progress bar
import '@/components/NProgress/nprogress.less' // progress bar custom style
import { setDocumentTitle, domTitle } from '@/utils/domUtil'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { i18nRender } from '@/locales'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const allowList = ['404'] // no redirect allowList

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  to.meta && typeof to.meta.title !== 'undefined' && setDocumentTitle(`${i18nRender(to.meta.title)} - ${domTitle}`)
  // 有token 正常进入
  if (storage.get(ACCESS_TOKEN)) {
    // 权限为空 获取权限
    if (to.name === 'NoPermissions') {
      next()
    } else if (store.getters.pages.length === 0) {
      store
        .dispatch('GetPermissions')
        .then(res => {
          const pages = res.data && res.data.pages
          if (pages.length === 0) {
            // 获取菜单为空 进入无权限页面
            next({ path: '/NoPermissions' })
          } else {
            // generate dynamic router
            store.dispatch('GenerateRoutes', { pages }).then(() => {
              // 根据roles权限生成可访问的路由表
              // 动态添加可访问路由表
              // VueRouter@3.5.0+ New API
              store.getters.addRouters.forEach(r => {
                router.addRoute(r)
              })
              // 请求带有 redirect 重定向时，登录自动重定向到该地址
              const redirect = decodeURIComponent(from.query.redirect || to.path)
              if (to.path === redirect) {
                // set the replace: true so the navigation will not leave a history record
                next({ ...to, replace: true })
              } else {
                // 跳转到目的路由
                next({ path: redirect })
              }
            })
          }
        })
        .catch(() => {
          // 获取菜单失败 进入无权限页面
          next({ path: '/NoPermissions' })
        })
    } else {
      next()
    }
  } else if (to.query.st) {
    // 有st 用st换取token
    store
      .dispatch('Auth', to.query.st)
      .finally(() => {
        // 换取st不管成功失败 去掉路由中的st参数后再次跳转
        const path = { ...to }
        delete path.query.st
        next({ ...path })
      })
  } else {
    // 没有token 也没有st
    if (allowList.includes(to.name)) {
      // 在免登录名单，直接进入
      next()
    } else {
      // 未登录 进入单点登陆系统
      next()
      store.dispatch('OpenSSO')
    }
  }
})

router.afterEach(() => {
  window.scrollTo(0, 0)
  NProgress.done() // finish progress bar
})
