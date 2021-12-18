import _notification from 'ant-design-vue/es/notification'

export const notification = (data) => {
  _notification.open(data)
}

notification.success = (data) => {
  _notification.success({ ...data, class: 'notification-success' })
}

notification.info = (data) => {
  _notification.info(data)
}

notification.warning = (data) => {
  _notification.warning(data)
}

notification.error = (data) => {
  _notification.error({ ...data, class: 'notification-error' })
}
