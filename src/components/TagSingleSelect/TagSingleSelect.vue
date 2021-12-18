<template>
  <div>
    <a-checkable-tag v-for="p in list" :key="p.id" v-model="checkObj[p.id]" @change="onChange(p.id)">
      <span>{{ p.name }}</span>
    </a-checkable-tag>
  </div>
</template>

<script>
export default {
  name: 'TagSingleSelect',
  props: {
    value: { type: Number, default: 0 },
    list: { type: Array, default: () => [] }
  },
  data () {
    return {
      selId: this.value || 0
    }
  },
  computed: {
    checkObj () {
      const obj = {}
      obj[this.selId] = true
      return obj
    }
  },
  watch: {
    value (curVal) {
      this.onChange(curVal)
    }
  },
  methods: {
    onChange (id) {
      this.selId = id
      this.$emit('input', this.selId)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
