import axios from 'axios'
import store from '@/store'
import storage from 'store'
import { getErrorMsg } from '@/utils/errorCode'
import { notification } from '@/utils/notification'
import { VueAxios } from './axios'
import { ACCESS_TOKEN } from '@/store/mutation-types'

// 创建 axios 实例
const requestDownload = axios.create({
  // API 请求的默认前缀
  responseType: 'blob',
  baseURL: process.env.VUE_APP_API_BASE_URL,
  timeout: 6000 // 请求超时时间
})

// 异常拦截处理器
const errorHandler = (error) => {
  if (error.response) {
    const data = error.response.data
    // 从 localstorage 获取 token
    const token = storage.get(ACCESS_TOKEN)
    if (error.response.status === 403) {
      notification.error({
        message: '权限不足',
        description: data.msg
      })
    }
    if (error.response.status === 401 && !(data.result && data.result.isLogin)) {
      if (token) {
        store.dispatch('Logout')
        notification.error({
          message: '登录过期',
          description: '请重新登录'
        })
      }
    }
  }
  return Promise.reject(error)
}

// request interceptor
requestDownload.interceptors.request.use(config => {
  const token = storage.get(ACCESS_TOKEN)
  // 如果 token 存在
  // 让每个请求携带自定义 token 请根据实际情况自行修改
  if (token) {
    config.headers['Authorization'] = token
  }
  return config
}, errorHandler)

// response interceptor
requestDownload.interceptors.response.use((response) => {
  const res = response.data
  if (res) {
    return res
  } else {
    notification.error({ message: '请求失败：' + res.code, description: getErrorMsg(res.code, 'CN', res.msg) })
    return Promise.reject(res)
  }
}, errorHandler)

const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, requestDownload)
  }
}

export default requestDownload

export {
  installer as VueAxios,
  requestDownload as axios
}
