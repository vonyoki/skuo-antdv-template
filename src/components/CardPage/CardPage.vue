<template>
  <page-header-wrapper :title="false">
    <a-card class="common-card-view" :bordered="false">
      <slot></slot>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { PageHeaderWrapper } from '@ant-design-vue/pro-layout'

export default {
  name: 'CardPage',
  components: {
    PageHeaderWrapper
  }
}
</script>
