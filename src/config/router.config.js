// eslint-disable-next-line
import { UserLayout, BasicLayout, BlankLayout } from '@/layouts'

// const RouteView = {
//   name: 'RouteView',
//   render: h => h('router-view')
// }

export const asyncRouterMap = [
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/404',
    name: '404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/Exception/404')
  },
  {
    path: '/NoPermissions',
    name: 'NoPermissions',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/Exception/NoPermissions')
  }
]
