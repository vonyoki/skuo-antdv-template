<template>
  <a-result status="403" title="无权限" sub-title="对不起，您无法访问该系统或租户已过期。">
    <template #extra>
      <a-button type="primary" @click="logout"> 退出登录 </a-button>
    </template>
  </a-result>
</template>

<script>
export default {
  name: 'NoPermissions',
  methods: {
    logout () {
      this.$store.dispatch('Logout', true)
    }
  }
}
</script>
