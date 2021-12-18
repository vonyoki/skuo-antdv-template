import { BasicLayout, BlankLayout, PageView, RouteView } from '@/layouts'
import { } from '@/core/icons'

// 前端路由表
const constantRouterComponents = {
  // 基础页面 layout 必须引入
  BasicLayout: BasicLayout,
  BlankLayout: BlankLayout,
  RouteView: RouteView,
  PageView: PageView,
  '403': () => import(/* webpackChunkName: "error" */ '@/views/Exception/403'),
  '404': () => import(/* webpackChunkName: "error" */ '@/views/Exception/404'),
  '500': () => import(/* webpackChunkName: "error" */ '@/views/Exception/500')

  // 你需要动态引入的页面组件
}

// 菜单图标
const constantMenuIcons = {}

// 前端未找到页面路由（固定不用改）
const notFoundRouter = {
  path: '*',
  redirect: '/404',
  hidden: true
}

// 根级菜单
const rootRouter = {
  key: '',
  name: 'index',
  path: '',
  component: 'BasicLayout',
  redirect: '/',
  meta: {
    title: '首页'
  },
  children: []
}

/**
 * 动态生成菜单
 * @param token
 * @returns {Promise<Router>}
 */
export const generatorDynamicRouter = pages => {
  return new Promise((resolve, reject) => {
    try {
      const result = dealPages2Routes(pages.sort((a, b) => a.sort - b.sort))
      const menuNav = []
      const childrenNav = []
      listToTree(result, childrenNav, 0)
      dealRouterDedirect(childrenNav, childrenNav, '/')
      rootRouter.children = childrenNav
      rootRouter.redirect += childrenNav[0].name
      menuNav.push(rootRouter)
      const routers = generator(menuNav)
      routers.push(notFoundRouter)
      resolve(routers)
    } catch (e) {
      reject(e)
    }
  })
}

/**
 * 将用户pages转化为路由格式
 *
 * @param {*} list
 * @returns
 */
const dealPages2Routes = (list) => {
  const arr = []
  list.map(p => {
    const componentName = p.code.split('.').map(name => {
      return name.slice(0, 1).toUpperCase() + name.slice(1)
    }).join('')
    arr.push({
      name: componentName,
      parentId: p.parent_id || 0,
      id: p.id,
      meta: { show: p.display_in_menu, title: p.name, icon: constantMenuIcons[componentName] ? constantMenuIcons[componentName] : '' },
      component: constantRouterComponents[componentName] ? componentName : 'RouteView'
    })
  })
  return arr
}

/**
 * 递归处理父路由重定向到第一个子路由上
 * 如果子路由为page不显示在菜单上 则顺延
 * 如果没有可以显示的子路由 设置父路由hideChildren为true 且不再向下递归
 *
 * @param {*} list
 * @param {*} tree
 * @param {*} father
 */
const dealRouterDedirect = (list, tree, father) => {
  const arr = []
  list.map(item => {
    if (item.children && item.children.length > 0) {
      const index = item.children.findIndex(p => p.meta.show)
      if (index > -1) {
        item.redirect = father + item.name + '/' + item.children[index].name
        dealRouterDedirect(item.children, item.children, father + item.name + '/')
      } else {
        item.meta.hideChildren = true
      }
    }
    arr.push(item)
  })
  tree = arr
}

/**
 * 格式化树形结构数据 生成 vue-router 层级路由表
 *
 * @param routerMap
 * @param parent
 * @returns {*}
 */
export const generator = (routerMap, parent) => {
  return routerMap.map(item => {
    const { title, show, hideChildren, hiddenHeaderContent, target, icon } = item.meta || {}
    const currentRouter = {
      // 如果路由设置了 path，则作为默认 path，否则 路由地址 动态拼接生成如 /dashboard/workplace
      path: item.path || `${(parent && parent.path) || ''}/${item.key}`,
      // 路由名称，建议唯一
      name: item.name || item.key || '',
      // 该路由对应页面的 组件 :方案1
      // component: constantRouterComponents[item.component || item.key],
      // 该路由对应页面的 组件 :方案2 (动态加载)
      component: constantRouterComponents[item.component || item.key] || (() => import(`@/views/${item.component}`)),

      // meta: 页面标题, 菜单图标, 页面权限(供指令权限用，可去掉)
      meta: {
        title: title,
        icon: icon || undefined,
        hiddenHeaderContent: hiddenHeaderContent,
        target: target,
        permission: item.name
      }
    }
    // 是否设置了隐藏菜单
    if (show === false) {
      currentRouter.hidden = true
    }
    // 是否设置了隐藏子菜单
    if (hideChildren) {
      currentRouter.hideChildrenInMenu = true
    }
    // 为了防止出现后端返回结果不规范，处理有可能出现拼接出两个 反斜杠
    if (!currentRouter.path.startsWith('http')) {
      currentRouter.path = currentRouter.path.replace('//', '/')
    }
    // 重定向
    item.redirect && (currentRouter.redirect = item.redirect)
    // 是否有子菜单，并递归处理
    if (item.children && item.children.length > 0) {
      // Recursion
      currentRouter.children = generator(item.children, currentRouter)
    }
    return currentRouter
  })
}

/**
 * 数组转树形结构
 * @param list 源数组
 * @param tree 树
 * @param parentId 父ID
 */
const listToTree = (list, tree, parentId) => {
  list.forEach(item => {
    // 判断是否为父级菜单
    if (item.parentId === parentId) {
      const child = {
        ...item,
        key: item.key || item.name,
        children: []
      }
      // 迭代 list， 找到当前菜单相符合的所有子菜单
      listToTree(list, child.children, item.id)
      // 删掉不存在 children 值的属性
      if (child.children.length <= 0) {
        delete child.children
      }
      // 加入到树中
      tree.push(child)
    }
  })
}
