export const ErrorCode = {
}

/**
 * 获取错误信息
 * @param {*} code 错误编码
 * @param {*} type 语言类型 EN/CN
 * @param {*} msg 错误信息
 */
export const getErrorMsg = (code, type, msg) => {
  return ErrorCode[code] ? ErrorCode[code][type] : msg
}

/**
 * 处理md中的数据为对象
 * @param {*} src 数据源
 */
export const dealErrorCodeMd2Obj = (src) => {
  const arr = src.split('|')
  const arr2 = []
  arr.map(p => { arr2.push(p.trim()) })
  const res = {}
  let temp = {}
  arr2.map((p, i) => {
    if (i % 4 === 0) {
      res[temp.ErrorCode] = temp
      temp = {}
    }
    if (i % 4 === 1) temp.ErrorCode = Number(p)
    if (i % 4 === 2) temp.EN = p
    if (i % 4 === 3) temp.CN = p
  })
  console.log(res)
}
