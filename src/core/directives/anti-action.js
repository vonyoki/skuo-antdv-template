import Vue from 'vue'
import store from '@/store'

const antiAction = Vue.directive('anti-action', {
  inserted: function (el, binding, vnode) {
    const actionName = binding.value
    const actions = store.getters.actions
    if (actions.findIndex(p => p.code === actionName) > -1) {
      el.parentNode && el.parentNode.removeChild(el) || (el.style.display = 'none')
    }
  }
})

export default antiAction
