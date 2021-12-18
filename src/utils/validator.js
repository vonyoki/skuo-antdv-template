export const validateCarNumber = (rule, value, callback) => {
  if (!value) callback()
  const regex = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-HJ-NP-Z][A-HJ-NP-Z0-9]{4,5}[A-HJ-NP-Z0-9挂学警港澳]$/
  if (regex.test(value)) callback()
  callback(new Error('车牌号格式错误'))
}

export const validateIPv4 = (rule, value, callback) => {
  if (!value) callback()
  const regex = /^((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])$/
  if (regex.test(value)) callback()
  callback(new Error('IP格式错误'))
}

export const validateInteger = (rule, value, callback) => {
  if (!value) callback()
  const regex = /^[1-9]\d*$/
  if (regex.test(value)) callback()
  callback(new Error('请输入正整数'))
}

export const validateIntegerWith0 = (rule, value, callback) => {
  if (!value) callback()
  const regex = /^[0-9]\d*$/
  if (regex.test(value)) callback()
  callback(new Error('请输入整数'))
}

export const validateWebUrl = (rule, value, callback) => {
  if (!value) callback()
  const regex = /http[s]{0,1}:\/\/([\w.]+\/?)\S*/
  if (regex.test(value)) callback()
  callback(new Error('请输入正确网页地址'))
}
