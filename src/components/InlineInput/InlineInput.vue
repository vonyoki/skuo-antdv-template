<template>
  <a-form :form="form" layout="inline">
    <a-form-item v-for="(p, i) in src" :key="i" :label="p.name" :colon="false">
      <a-input
        :placeholder="p.placeholder"
        :style="p.width ? 'width: ' + p.width + 'px' : null"
        :suffix="p.unit"
        v-decorator="[
          p.key,
          {
            rules: [{ required: p.required, message: '请输入' }, { validator: p.validator ? p.validator : null }],
          },
        ]"
        @change="onChange"
      >
      </a-input>
    </a-form-item>
  </a-form>
</template>

<script>
export default {
  name: 'InlineInput',
  props: {
    src: { type: Array, default: () => [] },
    value: { type: Object, default: () => { } }
  },
  data () {
    return {
      form: this.$form.createForm(this)
    }
  },
  watch: {
    value (curVal) {
      this.form.setFieldsValue(curVal)
    }
  },
  methods: {
    onChange () {
      this.$nextTick(() => {
        this.form.validateFields((err, value) => {
          if (!err) {
            this.$emit('change', value)
          }
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
