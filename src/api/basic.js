import request from '@/utils/request'

// -------------------用户-------------------
export function auth (data) {
  return request({
    url: `/api/user/auth`,
    method: 'post',
    data
  })
}

export function getPermissions (params) {
  return request({
    url: `/api/user/permissions`,
    method: 'get',
    params
  })
}

export function logout (data) {
  return request({
    url: `/api/user/logout`,
    method: 'post',
    data
  })
}

// -------------------通用接口-------------------
export function getStsOSS (data) {
  return request({
    url: `/api/aliyun-sts/assume-oss-role`,
    method: 'post',
    data
  })
}
