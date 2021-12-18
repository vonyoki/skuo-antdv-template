<template>
  <global-footer class="footer custom-render">
    <template v-slot:links>
      <a target="_blank">Copyright © 2021 SKUO 西谷数字</a>
    </template>
  </global-footer>
</template>

<script>
import { GlobalFooter } from '@ant-design-vue/pro-layout'

export default {
  name: 'ProGlobalFooter',
  components: {
    GlobalFooter
  }
}
</script>

<style lang="less" scoped>
.footer {
  margin: 0 0 24px;
}
</style>
